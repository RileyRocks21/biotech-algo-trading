import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react';

// Mock news data
const mockNewsItems = [
  {
    id: 1,
    headline: "NVDA reports record data center revenue, beats expectations",
    ticker: "NVDA",
    sentiment: "bullish",
    time: "2m ago",
    source: "Bloomberg"
  },
  {
    id: 2,
    headline: "Fed signals potential rate cuts in Q1 2025",
    ticker: "SPY",
    sentiment: "bullish",
    time: "8m ago",
    source: "Reuters"
  },
  {
    id: 3,
    headline: "Tesla faces increased competition in China EV market",
    ticker: "TSLA",
    sentiment: "bearish",
    time: "15m ago",
    source: "WSJ"
  },
  {
    id: 4,
    headline: "Apple announces new AI features for iPhone lineup",
    ticker: "AAPL",
    sentiment: "bullish",
    time: "23m ago",
    source: "TechCrunch"
  },
  {
    id: 5,
    headline: "Unusual options activity detected in AMD calls",
    ticker: "AMD",
    sentiment: "bullish",
    time: "31m ago",
    source: "Benzinga"
  },
  {
    id: 6,
    headline: "Microsoft Azure growth slows amid cloud competition",
    ticker: "MSFT",
    sentiment: "bearish",
    time: "42m ago",
    source: "CNBC"
  },
  {
    id: 7,
    headline: "Crypto markets surge as Bitcoin breaks resistance",
    ticker: "COIN",
    sentiment: "bullish",
    time: "55m ago",
    source: "CoinDesk"
  },
  {
    id: 8,
    headline: "Meta unveils next-gen VR headset at developer conference",
    ticker: "META",
    sentiment: "bullish",
    time: "1h ago",
    source: "The Verge"
  },
  {
    id: 9,
    headline: "Amazon Prime Day sales exceed analyst expectations",
    ticker: "AMZN",
    sentiment: "bullish",
    time: "1h ago",
    source: "MarketWatch"
  },
  {
    id: 10,
    headline: "Google faces antitrust ruling, potential breakup discussed",
    ticker: "GOOGL",
    sentiment: "bearish",
    time: "2h ago",
    source: "NYT"
  }
];

export default function NewsWidget() {
  const [news, setNews] = useState(mockNewsItems);
  const [hoveredId, setHoveredId] = useState(null);

  // Simulate new news coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeadlines = [
        "Breaking: Large block trade detected in {TICKER}",
        "Analyst upgrades {TICKER} to strong buy",
        "Insider trading reported at {TICKER}",
        "Options sweep detected: {TICKER} calls",
        "{TICKER} announces strategic partnership"
      ];
      const tickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'META', 'AMD'];
      const sources = ['Bloomberg', 'Reuters', 'CNBC', 'WSJ', 'Benzinga'];
      
      const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
      const randomHeadline = newHeadlines[Math.floor(Math.random() * newHeadlines.length)]
        .replace('{TICKER}', randomTicker);
      
      const newItem = {
        id: Date.now(),
        headline: randomHeadline,
        ticker: randomTicker,
        sentiment: Math.random() > 0.3 ? 'bullish' : 'bearish',
        time: 'Just now',
        source: sources[Math.floor(Math.random() * sources.length)]
      };
      
      setNews(prev => [newItem, ...prev.slice(0, 14)]);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80 bg-surface/50 border-l border-white/5 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-white">Market News</h3>
      </div>
      
      {/* News Feed */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {news.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="border-b border-white/5 last:border-0"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                {/* Ticker & Sentiment */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded text-xs font-bold text-white">
                      ${item.ticker}
                    </span>
                    {item.sentiment === 'bullish' ? (
                      <TrendingUp className="w-3.5 h-3.5 text-bullish" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-bearish" />
                    )}
                  </div>
                  <ExternalLink 
                    className={`w-3.5 h-3.5 text-gray-500 transition-opacity ${
                      hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                    }`} 
                  />
                </div>
                
                {/* Headline */}
                <p className="text-sm text-gray-200 leading-snug mb-2 group-hover:text-white transition-colors">
                  {item.headline}
                </p>
                
                {/* Meta */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                  <span>•</span>
                  <span>{item.source}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
