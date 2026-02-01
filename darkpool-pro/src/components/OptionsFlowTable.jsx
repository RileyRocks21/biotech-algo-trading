import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Filter, Search, Download } from 'lucide-react';

// We'll load real data from the CSV files via the API or local import
// For now, let's simulate with realistic options flow data structure

const formatSize = (size) => {
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
  if (size >= 1000) return `${(size / 1000).toFixed(0)}K`;
  return size;
};

const formatPremium = (premium) => {
  if (premium >= 1000000) return `$${(premium / 1000000).toFixed(2)}M`;
  if (premium >= 1000) return `$${(premium / 1000).toFixed(0)}K`;
  return `$${premium.toFixed(0)}`;
};

// Sample data based on the CSV structure
const sampleOptionsData = [
  { id: 1, time: '2022-06-17 15:07', ticker: 'ISEE', type: 'Call', exp: '10/21/2022', strike: 10, spot: 9.54, premium: 183600, volume: 360, oi: 4070, diff: 4.71, itm: false },
  { id: 2, time: '2022-06-17 15:05', ticker: 'CVNA', type: 'Call', exp: '1/19/2024', strike: 60, spot: 23.52, premium: 310660, volume: 634, oi: 130, diff: 155.05, itm: false },
  { id: 3, time: '2022-06-17 14:51', ticker: 'PTLO', type: 'Put', exp: '2/17/2023', strike: 15, spot: 15.19, premium: 281000, volume: 800, oi: 0, diff: 1.39, itm: false },
  { id: 4, time: '2022-06-17 14:39', ticker: 'TWLO', type: 'Call', exp: '6/24/2022', strike: 86, spot: 84.51, premium: 198800, volume: 722, oi: 436, diff: 2.48, itm: false },
  { id: 5, time: '2022-06-17 14:30', ticker: 'NVDA', type: 'Call', exp: '7/15/2022', strike: 180, spot: 165.20, premium: 520000, volume: 1200, oi: 2500, diff: 8.95, itm: false },
  { id: 6, time: '2022-06-17 14:22', ticker: 'TSLA', type: 'Put', exp: '6/24/2022', strike: 700, spot: 650.28, premium: 890000, volume: 2100, oi: 5600, diff: 7.65, itm: false },
  { id: 7, time: '2022-06-17 14:15', ticker: 'AAPL', type: 'Call', exp: '7/15/2022', strike: 150, spot: 135.43, premium: 450000, volume: 1800, oi: 12000, diff: 10.76, itm: false },
  { id: 8, time: '2022-06-17 14:08', ticker: 'SPY', type: 'Put', exp: '6/24/2022', strike: 380, spot: 373.87, premium: 1250000, volume: 5000, oi: 25000, diff: 1.64, itm: false },
  { id: 9, time: '2022-06-17 14:01', ticker: 'AMD', type: 'Call', exp: '7/15/2022', strike: 100, spot: 91.22, premium: 380000, volume: 950, oi: 8500, diff: 9.63, itm: false },
  { id: 10, time: '2022-06-17 13:55', ticker: 'META', type: 'Call', exp: '8/19/2022', strike: 200, spot: 167.96, premium: 620000, volume: 1400, oi: 3200, diff: 19.07, itm: false },
];

export default function OptionsFlowTable({ isPro = false }) {
  const [signals, setSignals] = useState(sampleOptionsData);
  const [filter, setFilter] = useState('all'); // all, calls, puts
  const [searchTicker, setSearchTicker] = useState('');
  const [minPremium, setMinPremium] = useState(100000);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSignals = signals.filter(signal => {
    if (filter === 'calls' && signal.type !== 'Call') return false;
    if (filter === 'puts' && signal.type !== 'Put') return false;
    if (searchTicker && !signal.ticker.toLowerCase().includes(searchTicker.toLowerCase())) return false;
    if (signal.premium < minPremium) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Unusual Options Flow</h2>
            <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
              {filteredSignals.length} alerts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-accent/20 text-accent' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search ticker..."
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50"
                  />
                </div>
                
                {/* Type Filter */}
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                  {['all', 'calls', 'puts'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        filter === f ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Min Premium */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Min Premium:</span>
                  <select
                    value={minPremium}
                    onChange={(e) => setMinPremium(Number(e.target.value))}
                    className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none"
                  >
                    <option value={0}>Any</option>
                    <option value={50000}>$50K+</option>
                    <option value={100000}>$100K+</option>
                    <option value={250000}>$250K+</option>
                    <option value={500000}>$500K+</option>
                    <option value={1000000}>$1M+</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Table Container */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-surface border-b border-white/10">
            <tr className="text-left text-gray-400">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium">C/P</th>
              <th className="px-4 py-3 font-medium">Exp</th>
              <th className="px-4 py-3 font-medium text-right">Strike</th>
              <th className="px-4 py-3 font-medium text-right">Spot</th>
              <th className="px-4 py-3 font-medium text-right">Premium</th>
              <th className="px-4 py-3 font-medium text-right">Volume</th>
              <th className="px-4 py-3 font-medium text-right">OI</th>
              <th className="px-4 py-3 font-medium text-right">Vol/OI %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {filteredSignals.map((signal, index) => {
                const isHighPremium = signal.premium >= 500000;
                const isCall = signal.type === 'Call';
                const volOiRatio = signal.oi > 0 ? ((signal.volume / signal.oi) * 100).toFixed(0) : '∞';
                const isUnusual = signal.diff > 50 || (signal.oi > 0 && signal.volume / signal.oi > 1);
                
                return (
                  <motion.tr
                    key={signal.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`
                      hover:bg-white/5 transition-colors cursor-pointer
                      ${isUnusual ? 'ring-1 ring-accent/30 bg-accent/5' : ''}
                    `}
                  >
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {signal.time}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">{signal.ticker}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        isCall ? 'bg-bullish/20 text-bullish' : 'bg-bearish/20 text-bearish'
                      }`}>
                        {signal.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {signal.exp}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-white">
                      ${signal.strike}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-300">
                      ${signal.spot.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-accent font-medium">
                      {formatPremium(signal.premium)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-300">
                      {formatSize(signal.volume)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-400">
                      {formatSize(signal.oi)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                        Number(volOiRatio) > 100 ? 'bg-accent/20 text-accent' : 
                        Number(volOiRatio) > 50 ? 'bg-bullish/20 text-bullish' : 
                        'text-gray-400'
                      }`}>
                        {volOiRatio}%
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
