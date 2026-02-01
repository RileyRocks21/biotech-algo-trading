import pandas as pd
import json
import difflib
from datetime import datetime, timedelta
import os
import time
import requests
import io

# --- Configuration ---
# You can mess with these to change sensitivity
CONFIG = {
    'volume_threshold': 500,
    'premium_threshold': 10000,
    'holding_period_days': 5,
    'initial_capital': 10000,
    'trade_size_percent': 0.1,
    'fuzzy_match_threshold': 85,
    'lookback_days_for_catalyst': 30,
    'lookforward_days_for_catalyst': 30
}

# --- SEC & News Hacking ---
SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
SEC_MAP_FILE = "sec_tickers_with_cik.json"
# Need a proper user agent or SEC blocks the request immediately
USER_AGENT = {'User-Agent': 'RileyResearchBot/1.0 (riley.student@mit.edu)'} 

def get_sec_ticker_map_with_cik():
    """
    Returns dict: Ticker -> {'title': str, 'cik': str}
    """
    if os.path.exists(SEC_MAP_FILE):
        try:
            with open(SEC_MAP_FILE, 'r') as f:
                return json.load(f)
        except:
            pass

    print("Fetching ticker map from SEC.gov...")
    try:
        response = requests.get(SEC_TICKERS_URL, headers=USER_AGENT)
        data = response.json()
        
        ticker_map = {}
        for key in data:
            entry = data[key]
            # Zero-pad CIK to 10 digits for EDGAR API
            cik_str = str(entry['cik_str']).zfill(10)
            ticker_map[entry['ticker']] = {
                'title': entry['title'],
                'cik': cik_str
            }
            
        with open(SEC_MAP_FILE, 'w') as f:
            json.dump(ticker_map, f)
            
        return ticker_map
    except Exception as e:
        print(f"Error fetching SEC data: {e}")
        return {}

def check_sec_filings(cik, target_date, window_hours=24):
    """
    Checks if there were any 8-K filings (Material News) within the window.
    Returns: Boolean (True if news found), List of news items
    """
    if not cik:
        return False, []
        
    url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    
    # Simple caching to avoid spamming SEC
    cache_file = f"cache_cik_{cik}.json"
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as f:
            data = json.load(f)
    else:
        # Rate limit compliance (SEC limit is 10 req/sec, we'll go slower just in case)
        time.sleep(0.15)
        try:
            r = requests.get(url, headers=USER_AGENT)
            if r.status_code != 200:
                return False, []
            data = r.json()
            # Save cache
            # with open(cache_file, 'w') as f: # Cache disabled for now to save disk space
            #     json.dump(data, f)
        except:
            return False, []

    filings = data.get('filings', {}).get('recent', {})
    if not filings:
        return False, []

    # Parse filings
    found_news = []
    
    # Filings arrays are all parallel arrays (accession, date, form type)
    accession_nums = filings.get('accessionNumber', [])
    filing_dates = filings.get('filingDate', [])
    forms = filings.get('form', [])
    
    target_dt = pd.to_datetime(target_date)
    start_window = target_dt - timedelta(hours=window_hours)
    end_window = target_dt + timedelta(hours=window_hours)
    
    for i, date_str in enumerate(filing_dates):
        # We only really care about 8-K (Current Report) or similar material news (10-Q, S-1)
        # 10-Q/10-K are slightly predictable but still catalysts
        # For now, treat ANY filing as "News Activity" to be safe.
        
        f_date = pd.to_datetime(date_str)
        
        # Check if date is within window (SEC dates are YYYY-MM-DD, no time, so we broaden slightly)
        # Logic:
        # Check if date is within window (SEC dates are YYYY-MM-DD, no time, so we broaden slightly)
        # If filing date is the SAME day as target, or day before/after.
        if start_window.date() <= f_date.date() <= end_window.date():
            found_news.append({
                'date': date_str,
                'form': forms[i],
                'desc': f"SEC Filing {forms[i]}"
            })
            
    return (len(found_news) > 0), found_news

# --- Helper Functions (From backtester.py) ---
def clean_company_name(name):
    if not name: return ""
    name = name.lower()
    noise_words = [' inc.', ' inc', ' corp.', ' corp', ' ltd.', ' ltd', ' plc', ' s.a.', ' l.p.', ' llc', ' n.v.', ' company', ' companies', ' group', ' holdings', ' holding', ' international', ' technologies', ' technology', ' pharmaceuticals', ' pharmaceutical', ' therapeutics', ' therapeutic', ' biosciences', ' bioscience', ' biopharma', ' biotech', ' pharma', ' solutions', ' systems', ' laboratories', ' labs']
    for word in noise_words: name = name.replace(word, '')
    name = name.replace(',', '').replace('.', '').replace('-', ' ').replace('&', ' ')
    return ' '.join(name.split())

def is_similar(a, b, threshold=0.8):
    if not a or not b: return False
    if a == b: return True
    if len(a) > 3 and len(b) > 3 and (a in b or b in a): return True
    return difflib.SequenceMatcher(None, a, b).ratio() >= threshold

def get_price_data(ticker, start_date, end_date):
    stooq_ticker = f"{ticker}.US"
    url = f"https://stooq.com/q/d/l/?s={stooq_ticker}&i=d"
    try:
        response = requests.get(url)
        if response.status_code != 200: return None
        csv_content = response.content.decode('utf-8')
        if "No data" in csv_content: return None
        df = pd.read_csv(io.StringIO(csv_content))
        if df.empty or 'Date' not in df.columns: return None
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index('Date').sort_index()
        mask = (df.index >= start_date) & (df.index <= end_date)
        return df.loc[mask]
    except:
        return None

# --- Main Logic ---

def run_strategy():
    print("Initializing Strategy: 'Unusual Options with NO News'...")
    
    # 1. Load Data
    print("  Loading Options & Studies...")
    try:
        options_df = pd.read_csv('Trady Flow - Best Options Trade Ideas.csv')
        studies_df = pd.read_csv('ctg-studies.csv')
    except Exception as e:
        print(f"Error loading files: {e}")
        return

    # Preprocess
    options_df['Time'] = pd.to_datetime(options_df['Time'])
    
    def parse_value(x):
        if isinstance(x, str):
            x = x.replace(',', '')
            if 'K' in x: return float(x.replace('K', '')) * 1000
            if 'M' in x: return float(x.replace('M', '')) * 1000000
        return float(x)

    options_df['Vol_Num'] = options_df['Vol'].apply(parse_value)
    
    # Filter for High Volume (Unusual Activity)
    unusual_options = options_df[options_df['Vol_Num'] >= CONFIG['volume_threshold']]
    print(f"  Found {len(unusual_options)} unusual options trades.")
    
    # 2. Map Tickers to Sponsors (Build Universe)
    ticker_map_full = get_sec_ticker_map_with_cik()
    
    # Create a simplified set of "Biotech Company Names" from studies for fast lookup
    # Because there are thousands of rows, matching every option trade against every study row is O(N*M)
    # Optimization: Only check options for tickers that "match" a study sponsor.
    
    # Simplified approach for demo: Iterate Options, Check if Ticker is in Biotech Universe (Studies)
    # We do this by checking if the Ticker's Company Name roughly matches ANY sponsor in studies
    
    # To save time, let's just create a cache of Ticker -> IsBiotech
    # TODO: This is an expensive operation. Ideally we pre-compute it and save to a JSON.
    
    print("  Matching Options to Biotech Universe (this might take a sec)...")
    
    valid_studies = studies_df.dropna(subset=['Sponsor'])
    unique_sponsors = valid_studies['Sponsor'].apply(clean_company_name).unique()
    
    results = []
    
    # Limit number of trades for the demo execution to avoid timeout
    # We prioritize the most recent ones or highest volume
    # UPDATE: bumped to 200 to get better signals
    trades_to_process = unusual_options.sort_values('Vol_Num', ascending=False).head(200) 
    
    print(f"  Processing top {len(trades_to_process)} highest volume trades...")
    
    for index, row in trades_to_process.iterrows():
        ticker = row['Sym']
        trade_date = row['Time']
        
        # Look up CIK
        if ticker not in ticker_map_full:
            continue
            
        company_info = ticker_map_full[ticker]
        clean_name = clean_company_name(company_info['title'])
        cik = company_info['cik']
        
        # Check if Biotech (exists in studies)
        is_biotech = False
        
        # Optimization: Pre-check if matched before (using a simple cache in memory would be better, but this is fine for 200)
        # Fast fuzzy check against unique sponsors
        matches = difflib.get_close_matches(clean_name, unique_sponsors, n=1, cutoff=0.8) 
        if matches:
            is_biotech = True
            
        if not is_biotech:
            # print(f"  [Skip] {ticker} ({clean_name}) - Not a biotech sponsor") # Reduce verbosity
            continue
            
        print(f"  [Check] {ticker} is a Biotech. Checking News/SEC for {trade_date}...")
        
        # CHECK NEWS (The Core Logic)
        has_news, news_items = check_sec_filings(cik, trade_date, window_hours=24)
        
        if has_news:
            print(f"    -> News Found! (Ignoring Trade). {news_items[0]['desc']} on {news_items[0]['date']}")
            continue
        else:
            print(f"    -> NO NEWS Found! (Unusual Activity in Silence -> SIGNAL)")
            
            # Execute Backtest Logic
            hist_start = trade_date
            hist_end = trade_date + timedelta(days=CONFIG['holding_period_days'] + 10)
            hist = get_price_data(ticker, hist_start, hist_end)
            
            if hist is not None and not hist.empty:
                entry_price = hist.iloc[0]['Close']
                exit_price = hist.iloc[min(len(hist)-1, CONFIG['holding_period_days'])]['Close']
                
                pnl_pct = (exit_price - entry_price) / entry_price
                if row['C/P'] == 'Put':
                    pnl_pct = -pnl_pct
                    
                # Trade Simulated
                # We format this to look like the React App Expects
                # Fields: ticker, price, size, type, sentiment, conviction, timestamp(str)
                
                # Derive Sentiment
                sentiment = "Bullish" if row['C/P'] == 'Call' else "Bearish"
                
                # Derive Conviction (Fake it based on PnL for demo purposes, or Volume)
                # If PnL > 10%, conviction is high.
                conviction = min(99, int(abs(pnl_pct * 100) * 2 + 50)) 
                
                results.append({
                    'id': f"sig-{index}-{int(time.time())}", # Unique ID for React Key
                    'ticker': ticker,
                    'price': f"{entry_price:.2f}",
                    'size': int(row['Vol_Num']), 
                    'type': "Unusual Sweep", # Hardcode this as the strategy type
                    'sentiment': sentiment,
                    'conviction': conviction,
                    'timestamp': trade_date.strftime("%H:%M:%S"),
                    'pnl_pct': pnl_pct * 100 # Keep for reference
                })
            else:
                 print("    -> No price data.")

    # Save
    if results:
        # Save CSV
        res_df = pd.DataFrame(results)
        res_df.to_csv('strategy_no_news_results.csv', index=False)
        print("\nStrategy Complete. Saved to 'strategy_no_news_results.csv'")
        
        # Save JSON for Frontend
        # We need to save it into the React Source folder so it can be imported
        frontend_path = os.path.join(os.getcwd(), 'darkpool-pro', 'src', 'assets', 'signals.json')
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(frontend_path), exist_ok=True)
        
        with open(frontend_path, 'w') as f:
            json.dump(results, f, indent=2)
            
        print(f"Frontend Data injected to: {frontend_path}")
        print(res_df[['ticker', 'sentiment', 'pnl_pct']])
    else:
        print("\nNo valid trades found meeting criteria.")

if __name__ == "__main__":
    run_strategy()
