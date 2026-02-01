Dark Pool / Biotech Catalysts Project

Quick guide to running this thing:

1. Config
   - Check 'config.json' if you want to tweak risk parameters (holding period, volume thresholds, etc).
   - The defaults are pretty conservative.

2. Data
   - We're processing 'Trady Flow' options data against 'ctg-studies' (Clinical Trials).
   - Make sure those CSVs are in the root folder or nothing works.

3. Running
   - Classic backtester: `python backtester.py`
   - New "Quiet Options" strategy: `python news_strategy.py`
     (This one checks for SEC filings to confirm silence)

4. Output
   - Results dump to 'backtest_results.csv' or 'strategy_no_news_results.csv'.

Notes:
- The fuzzy matching is decent but sometimes matches weird stuff (like "Focus" -> "Ford"). Just double check the logs.
