import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Mock dark pool data
const generateMockSignal = (id) => {
  const tickers = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'SPY', 'QQQ', 'AMD', 'PLTR', 'COIN', 'GME', 'SOFI', 'RIVN'];
  const types = ['Block Trade', 'Sweep', 'Dark Pool', 'VWAP Cross', 'Midpoint'];
  const sentiments = ['Bullish', 'Bearish', 'Neutral'];
  
  const ticker = tickers[Math.floor(Math.random() * tickers.length)];
  const price = (Math.random() * 500 + 50).toFixed(2);
  const size = Math.floor(Math.random() * 500000 + 10000);
  const type = types[Math.floor(Math.random() * types.length)];
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const conviction = Math.floor(Math.random() * 100);
  const timestamp = new Date().toLocaleTimeString();
  
  return { id, ticker, price, size, type, sentiment, conviction, timestamp };
};

// Generate initial mock data
const generateInitialData = () => {
  return Array.from({ length: 25 }, (_, i) => generateMockSignal(i));
};

const formatSize = (size) => {
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
  if (size >= 1000) return `${(size / 1000).toFixed(0)}K`;
  return size;
};

const formatDollarValue = (price, size) => {
  const value = price * size;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

export default function AlertTable({ isPro = false }) {
  const [signals, setSignals] = useState(generateInitialData);
  
  useEffect(() => {
    // Simulate real-time data coming in
    const interval = setInterval(() => {
      setSignals(prev => {
        const newSignal = generateMockSignal(Date.now());
        return [newSignal, ...prev.slice(0, 49)];
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // In a real app, you'd use Firestore listener:
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, 'signals'), (snapshot) => {
  //     const newSignals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setSignals(newSignals);
  //   });
  //   return () => unsubscribe();
  // }, []);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">Live Dark Pool Feed</h2>
          <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full animate-pulse">
            LIVE
          </span>
        </div>
      </div>
      
      {/* Table Container */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-surface border-b border-white/10">
            <tr className="text-left text-gray-400">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Size</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Sentiment</th>
              <th className="px-4 py-3 font-medium text-center">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {signals.map((signal, index) => {
                const isHighConviction = signal.conviction > 90;
                const isBullish = signal.sentiment === 'Bullish';
                const isBearish = signal.sentiment === 'Bearish';
                
                return (
                  <motion.tr
                    key={signal.id}
                    initial={{ opacity: 0, y: -20, backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      backgroundColor: 'transparent',
                      transition: { duration: 0.3 }
                    }}
                    exit={{ opacity: 0 }}
                    className={`
                      hover:bg-white/5 transition-colors
                      ${isHighConviction ? 'ring-1 ring-accent/50 bg-accent/5 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : ''}
                    `}
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {signal.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">{signal.ticker}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white">
                      ${signal.price}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-300">
                      {formatSize(signal.size)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-accent">
                      {formatDollarValue(signal.price, signal.size)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                        {signal.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {isBullish && <TrendingUp className="w-3.5 h-3.5 text-bullish" />}
                        {isBearish && <TrendingDown className="w-3.5 h-3.5 text-bearish" />}
                        <span className={`text-xs font-medium ${
                          isBullish ? 'text-bullish' : isBearish ? 'text-bearish' : 'text-gray-400'
                        }`}>
                          {signal.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`
                        px-2 py-1 rounded text-xs font-bold
                        ${signal.conviction > 90 ? 'bg-accent/20 text-accent' : 
                          signal.conviction > 70 ? 'bg-bullish/20 text-bullish' : 
                          'bg-white/10 text-gray-400'}
                      `}>
                        {signal.conviction}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
