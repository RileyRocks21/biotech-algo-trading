import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, DollarSign, 
  BarChart2, PieChart, Calendar, Target, Award
} from 'lucide-react';

// Sample analytics data
const performanceData = {
  totalPnl: 2989.52,
  totalReturn: 29.89,
  totalTrades: 5,
  winRate: 100,
  avgWin: 597.90,
  avgLoss: 0,
  bestTrade: { ticker: 'ISEE', pnl: 869.81, pnlPercent: 17.40 },
  worstTrade: { ticker: 'MDLZ', pnl: 373.60, pnlPercent: 3.73 },
  sharpeRatio: 2.45,
  maxDrawdown: 0,
  avgHoldingDays: 3,
};

const monthlyReturns = [
  { month: 'Jan', pnl: 450, trades: 3 },
  { month: 'Feb', pnl: -120, trades: 2 },
  { month: 'Mar', pnl: 680, trades: 4 },
  { month: 'Apr', pnl: 320, trades: 2 },
  { month: 'May', pnl: 890, trades: 5 },
  { month: 'Jun', pnl: 769.52, trades: 5 },
];

const sectorBreakdown = [
  { sector: 'Biotechnology', trades: 12, pnl: 2450, winRate: 75 },
  { sector: 'Pharmaceuticals', trades: 8, pnl: 1280, winRate: 62 },
  { sector: 'Technology', trades: 5, pnl: -340, winRate: 40 },
  { sector: 'Consumer', trades: 3, pnl: 599, winRate: 100 },
];

const topPerformers = [
  { ticker: 'ISEE', trades: 3, totalPnl: 1420.50, avgReturn: 12.3 },
  { ticker: 'MRTX', trades: 2, totalPnl: 890.20, avgReturn: 8.1 },
  { ticker: 'BGNE', trades: 2, totalPnl: 829.09, avgReturn: 8.3 },
  { ticker: 'RDUS', trades: 1, totalPnl: 362.28, avgReturn: 7.2 },
  { ticker: 'MDLZ', trades: 1, totalPnl: 373.60, avgReturn: 3.7 },
];

export default function AnalyticsDashboard({ isPro = false }) {
  const [timeframe, setTimeframe] = useState('all');

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">Strategy Analytics</h2>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {['7d', '30d', '90d', 'ytd', 'all'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeframe === tf ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs">Total P&L</span>
          </div>
          <div className="text-2xl font-bold text-bullish">+${performanceData.totalPnl.toFixed(2)}</div>
          <div className="text-xs text-gray-500">+{performanceData.totalReturn}% return</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{performanceData.winRate}%</div>
          <div className="text-xs text-gray-500">{performanceData.totalTrades} total trades</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Avg Win</span>
          </div>
          <div className="text-2xl font-bold text-bullish">+${performanceData.avgWin.toFixed(2)}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs">Avg Loss</span>
          </div>
          <div className="text-2xl font-bold text-bearish">${performanceData.avgLoss.toFixed(2)}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-accent">{performanceData.sharpeRatio}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Avg Hold</span>
          </div>
          <div className="text-2xl font-bold text-white">{performanceData.avgHoldingDays}d</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Returns Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <h3 className="text-sm font-medium text-white mb-4">Monthly Returns</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {monthlyReturns.map((month, i) => {
              const maxPnl = Math.max(...monthlyReturns.map(m => Math.abs(m.pnl)));
              const height = (Math.abs(month.pnl) / maxPnl) * 100;
              const isPositive = month.pnl >= 0;
              
              return (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <div className="text-xs text-gray-400 mb-1">
                      {isPositive ? '+' : ''}${month.pnl}
                    </div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                      className={`w-full rounded-t-lg ${isPositive ? 'bg-bullish/60' : 'bg-bearish/60'}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{month.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Best/Worst Trades */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <h3 className="text-sm font-medium text-white mb-4">Trade Highlights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-bullish/10 border border-bullish/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-bullish" />
                <span className="text-xs text-bullish font-medium">Best Trade</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{performanceData.bestTrade.ticker}</span>
                <div className="text-right">
                  <div className="text-bullish font-bold">+${performanceData.bestTrade.pnl}</div>
                  <div className="text-xs text-bullish/70">+{performanceData.bestTrade.pnlPercent}%</div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Smallest Win</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{performanceData.worstTrade.ticker}</span>
                <div className="text-right">
                  <div className="text-bullish font-bold">+${performanceData.worstTrade.pnl}</div>
                  <div className="text-xs text-bullish/70">+{performanceData.worstTrade.pnlPercent}%</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sector Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <h3 className="text-sm font-medium text-white mb-4">Sector Performance</h3>
          <div className="space-y-3">
            {sectorBreakdown.map((sector) => (
              <div key={sector.sector} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{sector.sector}</span>
                    <span className={`text-sm font-medium ${sector.pnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                      {sector.pnl >= 0 ? '+' : ''}${sector.pnl}
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.winRate}%` }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className={`h-full rounded-full ${sector.pnl >= 0 ? 'bg-bullish/60' : 'bg-bearish/60'}`}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400 w-16 text-right">
                  {sector.trades} trades
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-4 bg-surface border border-white/5 rounded-xl"
        >
          <h3 className="text-sm font-medium text-white mb-4">Top Performers</h3>
          <div className="space-y-2">
            {topPerformers.map((ticker, i) => (
              <div 
                key={ticker.ticker}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-white font-medium">{ticker.ticker}</div>
                    <div className="text-xs text-gray-500">{ticker.trades} trades</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-bullish font-medium">+${ticker.totalPnl.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Avg: +{ticker.avgReturn}%</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
