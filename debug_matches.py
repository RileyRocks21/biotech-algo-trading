import pandas as pd
import json
import difflib
from datetime import datetime, timedelta
import os

# Load Configuration
def load_config(config_path='config.json'):
    with open(config_path, 'r') as f:
        return json.load(f)

# Fuzzy Match Function
def is_similar(a, b, threshold=0.8):
    if not a or not b:
        return False
    return difflib.SequenceMatcher(None, a, b).ratio() >= threshold

def clean_company_name(name):
    if not name:
        return ""
    name = name.lower()
    # Remove common legal entities and noise words
    noise_words = [
        ' inc.', ' inc', ' corp.', ' corp', ' ltd.', ' ltd', ' plc', ' s.a.', ' l.p.', ' llc', ' n.v.',
        ' company', ' companies', ' group', ' holdings', ' holding', ' international', ' technologies',
        ' pharmaceuticals', ' therapeutics', ' biosciences', ' biopharma', ' pharma', ' solutions', ' systems',
        ' laboratories', ' resources', ' energy', ' financial', ' capital', ' management', ' partners'
    ]
    for word in noise_words:
        name = name.replace(word, '')
    
    # Remove punctuation
    name = name.replace(',', '').replace('.', '').replace('-', ' ')
    return name.strip()

# --- SEC Ticker Mapping ---
SEC_MAP_FILE = "sec_tickers.json"

def get_sec_ticker_map():
    if os.path.exists(SEC_MAP_FILE):
        with open(SEC_MAP_FILE, 'r') as f:
            return json.load(f)
    return {}

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

def debug_matches():
    config = load_config()
    options_df, studies_df = load_data()
    ticker_map = get_sec_ticker_map()
    
    if options_df is None or studies_df is None:
        return

    print("Starting Debug...")
    
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
    
    # Check first 500 trades
    for index, row in filtered_options.head(500).iterrows():
        processed_count += 1
        ticker = row['Sym']
        trade_date = row['Time']
        
        company_name = ticker_map.get(ticker)
        if not company_name:
            continue
            
        clean_ticker_name = clean_company_name(company_name)
        
        # Check for Catalyst
        start_date = trade_date - timedelta(days=config['lookback_days_for_catalyst'])
        end_date = trade_date + timedelta(days=config['lookforward_days_for_catalyst'])
        
        date_mask = (valid_studies['Primary Completion Date'] >= start_date) & (valid_studies['Primary Completion Date'] <= end_date)
        potential_catalysts = valid_studies[date_mask]
        
        if potential_catalysts.empty:
            continue
            
        for _, study in potential_catalysts.iterrows():
            clean_sponsor_name = clean_company_name(study['Sponsor'])
            
            # Calculate ratio
            ratio = difflib.SequenceMatcher(None, clean_ticker_name, clean_sponsor_name).ratio()
            
            # Print if ratio is decent but maybe below threshold, or if it's a match
            if ratio > 0.5:
                print(f"[{ratio:.2f}] Ticker: {ticker} ('{clean_ticker_name}') vs Sponsor: '{clean_sponsor_name}' (Orig: '{study['Sponsor']}')")

if __name__ == "__main__":
    debug_matches()
