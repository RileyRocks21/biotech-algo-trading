import pandas as pd
import json
import difflib
from datetime import datetime, timedelta
import os
import time
import requests
import io

# Just load the config file
def load_config(config_path='config.json'):
    with open(config_path, 'r') as f:
        return json.load(f)

# Fuzzy Match Attempt
# This is kinda hacky but works for most big companies.
# Threshold 0.8 seems to be the sweet spot.
def is_similar(a, b, threshold=0.8):
    if not a or not b:
        return False
    
    # Exact match or substring match (if length is sufficient to avoid noise)
    if a == b:
        return True
    if len(a) > 3 and len(b) > 3:
        if a in b or b in a:
            return True
            
    return difflib.SequenceMatcher(None, a, b).ratio() >= threshold

def clean_company_name(name):
    if not name:
        return ""
    name = name.lower()
    # Remove common legal entities and noise words
    # Order matters: remove longer phrases first if they contain shorter ones
    noise_words = [
        ' inc.', ' inc', ' corp.', ' corp', ' ltd.', ' ltd', ' plc', ' s.a.', ' l.p.', ' llc', ' n.v.',
        ' company', ' companies', ' group', ' holdings', ' holding', ' international', ' technologies', ' technology',
        ' pharmaceuticals', ' pharmaceutical', ' therapeutics', ' therapeutic', ' biosciences', ' bioscience',
        ' biopharma', ' biotech', ' pharma', ' solutions', ' systems', ' laboratories', ' labs', ' lab',
        ' resources', ' energy', ' financial', ' capital', ' management', ' partners', ' industries', ' industry',
        ' associates', ' global', ' bio', ' health', ' healthcare', ' medical', ' products', ' development', ' research'
    ]
    for word in noise_words:
        name = name.replace(word, '')
    
    # Remove punctuation
    name = name.replace(',', '').replace('.', '').replace('-', ' ').replace('&', ' ')
    return ' '.join(name.split()) # Remove extra whitespace

# --- SEC Ticker Mapping ---
SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
SEC_MAP_FILE = "sec_tickers.json"

def get_sec_ticker_map():
    """
    Grabs the ticker map from SEC.gov because mapping names manually is a nightmare.
    Caches it locally so we don't get IP banned.
    """
    if os.path.exists(SEC_MAP_FILE):
        try:
            with open(SEC_MAP_FILE, 'r') as f:
                print("Loading ticker map from local cache...")
                return json.load(f)
        except Exception as e:
            print(f"Error loading local ticker map: {e}")

    print("Fetching ticker map from SEC.gov...")
    headers = {'User-Agent': 'Mozilla/5.0 (Company; mail@example.com)'} # SEC requires a User-Agent
    try:
        response = requests.get(SEC_TICKERS_URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Convert SEC format {"0": {...}, "1": {...}} to {"AAPL": "Apple Inc.", ...}
        ticker_map = {}
        for key in data:
            entry = data[key]
            ticker_map[entry['ticker']] = entry['title']
            
        # Save to cache
        with open(SEC_MAP_FILE, 'w') as f:
            json.dump(ticker_map, f)
            
        return ticker_map
    except Exception as e:
        print(f"Error fetching SEC data: {e}")
        return {}

# --- Stooq Price Data ---
def get_price_data(ticker, start_date, end_date):
    """
    Fetches daily price data from Stooq.
    Stooq URL format: https://stooq.com/q/d/l/?s={ticker}.us&i=d
    """
    # Stooq provides the full history in the CSV usually, we can filter later
    # We append .US for US stocks
    stooq_ticker = f"{ticker}.US"
    url = f"https://stooq.com/q/d/l/?s={stooq_ticker}&i=d"
    
    try:
        # Read CSV directly from URL
        # Stooq returns a CSV with headers: Date,Open,High,Low,Close,Volume
        # We use requests to get content, then io.StringIO
        response = requests.get(url)
        if response.status_code != 200:
            return None
            
        csv_content = response.content.decode('utf-8')
        
        # Check for "No data" response (Stooq sometimes returns a small file with just "No data")
        if "No data" in csv_content or len(csv_content) < 50:
             # Try without .US suffix just in case
            url2 = f"https://stooq.com/q/d/l/?s={ticker}&i=d"
            response2 = requests.get(url2)
            if response2.status_code == 200:
                csv_content = response2.content.decode('utf-8')
        
        df = pd.read_csv(io.StringIO(csv_content))
        
        if df.empty:
            return None
            
        # Check if we got a valid CSV or an error message disguised as CSV
        if 'Date' not in df.columns:
            return None
            
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index('Date').sort_index()
        
        # Filter for the requested date range (plus some buffer)
        # We need to ensure we cover the start_date and end_date
        mask = (df.index >= start_date) & (df.index <= end_date)
        filtered_df = df.loc[mask]
        
        if filtered_df.empty:
            return None
            
        return filtered_df
        
    except Exception as e:
        # print(f"Error fetching price for {ticker}: {e}")
        return None

def load_data():
    print("Loading data...")
    try:
        options_df = pd.read_csv('Trady Flow - Best Options Trade Ideas.csv')
        studies_df = pd.read_csv('ctg-studies.csv')
    except Exception as e:
        print(f"Error loading CSV files: {e}")
        return None, None
    
    # Preprocess Options Data
    options_df['Time'] = pd.to_datetime(options_df['Time'])
    
    # Preprocess Studies Data
    studies_df['Primary Completion Date'] = pd.to_datetime(studies_df['Primary Completion Date'], errors='coerce')
    
    return options_df, studies_df

def run_backtest():
    config = load_config()
    options_df, studies_df = load_data()
    ticker_map = get_sec_ticker_map()
    
    if options_df is None or studies_df is None:
        return

    print("Starting Backtest...")
    
    results = []
    
    def parse_value(x):
        if isinstance(x, str):
            x = x.replace(',', '')
            if 'K' in x:
                return float(x.replace('K', '')) * 1000
            if 'M' in x:
                return float(x.replace('M', '')) * 1000000
        return float(x)

    options_df['Vol_Num'] = options_df['Vol'].apply(parse_value)
    options_df['Prems_Num'] = options_df['Prems'].apply(parse_value)

    filtered_options = options_df[
        (options_df['Vol_Num'] >= config['volume_threshold']) & 
        (options_df['Prems_Num'] >= config['premium_threshold'])
    ]
    
    print(f"Processing {len(filtered_options)} potential option trades...")
    
    valid_studies = studies_df.dropna(subset=['Primary Completion Date', 'Sponsor'])
    
    processed_count = 0
    
    for index, row in filtered_options.iterrows():
        processed_count += 1
        if processed_count % 100 == 0:
            print(f"Processed {processed_count} trades...")

        ticker = row['Sym']
        trade_date = row['Time']
        
        # 1. Get Company Name from SEC Map
        company_name = ticker_map.get(ticker)
        
        # If not in map, we can't easily match name, skip
        if not company_name:
            continue
            
        # Clean company name for better matching
        clean_ticker_name = clean_company_name(company_name)
            
        # 2. Check for Catalyst
        start_date = trade_date - timedelta(days=config['lookback_days_for_catalyst'])
        end_date = trade_date + timedelta(days=config['lookforward_days_for_catalyst'])
        
        date_mask = (valid_studies['Primary Completion Date'] >= start_date) & (valid_studies['Primary Completion Date'] <= end_date)
        potential_catalysts = valid_studies[date_mask]
        
        if potential_catalysts.empty:
            continue
            
        match_found = False
        matched_study = None
        
        for _, study in potential_catalysts.iterrows():
            clean_sponsor_name = clean_company_name(study['Sponsor'])
            if is_similar(clean_ticker_name, clean_sponsor_name, config['fuzzy_match_threshold'] / 100.0):
                match_found = True
                matched_study = study
                break
        
        if match_found:
            print(f"Match found! Ticker: {ticker} ({clean_ticker_name}) - Study: {matched_study['NCT Number']} ({clean_company_name(matched_study['Sponsor'])}) on {matched_study['Primary Completion Date'].date()}")
            
            # 3. Simulate Trade with Stooq Data
            try:
                # We need data from trade_date to trade_date + holding + buffer
                hist_start = trade_date
                hist_end = trade_date + timedelta(days=config['holding_period_days'] + 10)
                
                # Using Stooq because it's free/no-key.
                # Sometimes it returns 404s for delisted stuff though.
                hist = get_price_data(ticker, hist_start, hist_end)
                
                if hist is not None and not hist.empty:
                    entry_row = hist.iloc[0]
                    entry_price = entry_row['Close']
                    
                    if len(hist) > config['holding_period_days']:
                        exit_row = hist.iloc[config['holding_period_days']]
                        exit_price = exit_row['Close']
                    else:
                        exit_row = hist.iloc[-1]
                        exit_price = exit_row['Close']
                    
                    pnl_pct = (exit_price - entry_price) / entry_price
                    
                    if row['C/P'] == 'Put':
                        pnl_pct = -pnl_pct 
                    
                    trade_pnl = config['initial_capital'] * config['trade_size_percent'] * pnl_pct
                    
                    results.append({
                        'Ticker': ticker,
                        'Date': trade_date,
                        'Type': row['C/P'],
                        'Entry': entry_price,
                        'Exit': exit_price,
                        'PnL': trade_pnl,
                        'PnL%': pnl_pct * 100,
                        'Catalyst': matched_study['NCT Number'],
                        'Study Title': matched_study['Study Title']
                    })
                    
                    print(f"  -> Trade Result: {pnl_pct*100:.2f}%")
                else:
                    print(f"  -> No price data found for {ticker}")
                    
            except Exception as e:
                print(f"  -> Error simulating trade: {e}")

    # Output Results
    if results:
        results_df = pd.DataFrame(results)
        print("\n--- Backtest Results ---")
        print(results_df[['Ticker', 'Date', 'Type', 'PnL', 'PnL%']])
        results_df.to_csv('backtest_results.csv', index=False)
        print("Results saved to backtest_results.csv")
        
        total_pnl = results_df['PnL'].sum()
        print(f"\nTotal PnL: ${total_pnl:.2f}")
    else:
        print("\nNo trades executed.")

if __name__ == "__main__":
    run_backtest()
