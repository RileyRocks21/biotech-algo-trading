import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Settings, TrendingUp, TrendingDown, DollarSign, 
  BarChart3, Calendar, Clock, AlertTriangle, CheckCircle2, 
  XCircle, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';

// Sample backtest results based on our Python backtester output
const sampleBacktestResults = [
  {
    id: 1,
    ticker: 'MDLZ',
    companyName: 'Mondelez International',
    optionType: 'Call',
    strike: 65,
    exp: '7/15/2022',
    premium: 245000,
    volume: 890,
    trialId: 'NCT04123456',
    trialTitle: 'Study of Cocoa Polyphenols in Metabolic Syndrome',
    sponsor: 'Mondelez',
    entryDate: '2022-06-17',
    entryPrice: 62.45,
    exitDate: '2022-06-22',
    exitPrice: 64.78,
    pnl: 373.60,
    pnlPercent: 3.73,
    holdingDays: 3,
    matchScore: 92
  },
  {
    id: 2,
    ticker: 'BGNE',
    companyName: 'BeiGene Ltd',
    optionType: 'Call',
    strike: 180,
    exp: '8/19/2022',
    premium: 520000,
    volume: 1200,
    trialId: 'NCT05186233',
    trialTitle: 'ALPINE: Zanubrutinib vs Ibrutinib in CLL',
    sponsor: 'BeiGene',
    entryDate: '2022-06-15',
    entryPrice: 165.20,
    exitDate: '2022-06-20',
    exitPrice: 178.90,
    pnl: 829.09,
    pnlPercent: 8.29,
    holdingDays: 3,
    matchScore: 95
  },
  {
    id: 3,
    ticker: 'MRTX',
    companyName: 'Mirati Therapeutics',
    optionType: 'Call',
    strike: 75,
    exp: '7/15/2022',
    premium: 380000,
    volume: 950,
    trialId: 'NCT04483505',
    trialTitle: 'KRYSTAL-1: Adagrasib in KRASG12C Tumors',
    sponsor: 'Mirati Therapeutics',
    entryDate: '2022-06-10',
    entryPrice: 68.50,
    exitDate: '2022-06-15',
    exitPrice: 72.30,
    pnl: 554.74,
    pnlPercent: 5.55,
    holdingDays: 3,
    matchScore: 98
  },
  {
    id: 4,
    ticker: 'RDUS',
    companyName: 'Radius Health',
    optionType: 'Put',
    strike: 25,
    exp: '7/15/2022',
    premium: 185000,
    volume: 650,
    trialId: 'NCT04136535',
    trialTitle: 'EMERALD: Elacestrant in ER+/HER2- Breast Cancer',
    sponsor: 'Radius Health',
    entryDate: '2022-06-08',
    entryPrice: 22.80,
    exitDate: '2022-06-13',
    exitPrice: 21.15,
    pnl: 362.28,
    pnlPercent: 7.24,
    holdingDays: 3,
    matchScore: 96
  },
  {
    id: 5,
    ticker: 'ISEE',
    companyName: 'IVERIC bio',
    optionType: 'Call',
    strike: 10,
    exp: '10/21/2022',
    premium: 183600,
    volume: 360,
    trialId: 'NCT04654123',
    trialTitle: 'GATHER2: Avacincaptad Pegol in Geographic Atrophy',
    sponsor: 'IVERIC bio',
    entryDate: '2022-06-17',
    entryPrice: 9.54,
    exitDate: '2022-06-22',
    exitPrice: 11.20,
    pnl: 869.81,
    pnlPercent: 17.40,
    holdingDays: 3,
    matchScore: 91
  },
];

// Default config matching our Python backtester
const defaultConfig = {
  holding_period_days: 3,
  volume_threshold: 500,
  premium_threshold: 100000,
  fuzzy_match_threshold: 85,
  lookback_days: 5,
  lookforward_days: 5,
  initial_capital: 10000,
  trade_size_percent: 0.05
};

export default function BacktestPanel({ isPro = false }) {
  const [config, setConfig] = useState(defaultConfig);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(sampleBacktestResults);
  const [showConfig, setShowConfig] = useState(false);
  const [expandedTrade, setExpandedTrade] = useState(null);

  // Summary stats
  const totalTrades = results.length;
  const winningTrades = results.filter(r => r.pnl > 0).length;
  const losingTrades = results.filter(r => r.pnl < 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;
  const totalPnl = results.reduce((sum, r) => sum + r.pnl, 0);
  const avgPnl = totalTrades > 0 ? (totalPnl / totalTrades).toFixed(2) : 0;
  const totalReturn = ((totalPnl / config.initial_capital) * 100).toFixed(2);

  const runBacktest = async () => {
    setIsRunning(true);
    // Simulate backtest running
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRunning(false);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Strategy Backtester</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                showConfig ? 'bg-accent/20 text-accent' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Config</span>
            </button>
            <button
              onClick={runBacktest}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 bg-accent text-background rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Running...' : 'Run Backtest'}
            </button>
          </div>
        </div>
        
        {/* Config Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Holding Period (Days)</label>
                  <input
                    type="number"
                    value={config.holding_period_days}
                    onChange={(e) => setConfig({...config, holding_period_days: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min Volume</label>
                  <input
                    type="number"
                    value={config.volume_threshold}
                    onChange={(e) => setConfig({...config, volume_threshold: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Min Premium ($)</label>
                  <input
                    type="number"
                    value={config.premium_threshold}
                    onChange={(e) => setConfig({...config, premium_threshold: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Match Threshold (%)</label>
                  <input
                    type="number"
                    value={config.fuzzy_match_threshold}
                    onChange={(e) => setConfig({...config, fuzzy_match_threshold: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Initial Capital ($)</label>
                  <input
                    type="number"
                    value={config.initial_capital}
                    onChange={(e) => setConfig({...config, initial_capital: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Trade Size (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.trade_size_percent}
                    onChange={(e) => setConfig({...config, trade_size_percent: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Lookback Days</label>
                  <input
                    type="number"
                    value={config.lookback_days}
                    onChange={(e) => setConfig({...config, lookback_days: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Lookforward Days</label>
                  <input
                    type="number"
                    value={config.lookforward_days}
                    onChange={(e) => setConfig({...config, lookforward_days: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent/50"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Stats Summary */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Total Trades</div>
            <div className="text-xl font-bold text-white">{totalTrades}</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Win Rate</div>
            <div className="text-xl font-bold text-bullish">{winRate}%</div>
            <div className="text-xs text-gray-500">{winningTrades}W / {losingTrades}L</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Total P&L</div>
            <div className={`text-xl font-bold ${totalPnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Avg P&L/Trade</div>
            <div className={`text-xl font-bold ${avgPnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {avgPnl >= 0 ? '+' : ''}${avgPnl}
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="text-xs text-gray-400 mb-1">Total Return</div>
            <div className={`text-xl font-bold ${totalReturn >= 0 ? 'text-bullish' : 'text-bearish'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Table */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-3">
          <AnimatePresence initial={false}>
            {results.map((trade) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-surface/50 border border-white/5 rounded-xl overflow-hidden"
              >
                {/* Trade Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{trade.ticker}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          trade.optionType === 'Call' ? 'bg-bullish/20 text-bullish' : 'bg-bearish/20 text-bearish'
                        }`}>
                          {trade.optionType}
                        </span>
                        <span className="px-2 py-0.5 bg-accent/20 text-accent rounded text-xs">
                          {trade.matchScore}% match
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">{trade.companyName}</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-gray-400">P&L</div>
                        <div className={`font-bold ${trade.pnl >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          <span className="text-xs ml-1">({trade.pnlPercent}%)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Entry → Exit</div>
                        <div className="text-white font-mono text-sm">
                          ${trade.entryPrice} → ${trade.exitPrice}
                        </div>
                      </div>
                      {expandedTrade === trade.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedTrade === trade.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-white/5">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Option Details */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-2">Option Flow Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Strike</span>
                                <span className="text-white">${trade.strike}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Expiration</span>
                                <span className="text-white">{trade.exp}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Premium</span>
                                <span className="text-accent">${(trade.premium / 1000).toFixed(0)}K</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Volume</span>
                                <span className="text-white">{trade.volume}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Trial Details */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-2">Catalyst Trial</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Trial ID</span>
                                <span className="text-accent">{trade.trialId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Sponsor</span>
                                <span className="text-white">{trade.sponsor}</span>
                              </div>
                              <div className="text-gray-300 text-xs mt-2">{trade.trialTitle}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Trade Timeline */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <h4 className="text-xs font-medium text-gray-400 mb-2">Trade Timeline</h4>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">Entry:</span>
                              <span className="text-sm text-white">{trade.entryDate}</span>
                            </div>
                            <div className="flex-1 h-px bg-white/10" />
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">{trade.holdingDays} days</span>
                            </div>
                            <div className="flex-1 h-px bg-white/10" />
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Exit:</span>
                              <span className="text-sm text-white">{trade.exitDate}</span>
                              {trade.pnl >= 0 ? (
                                <CheckCircle2 className="w-4 h-4 text-bullish" />
                              ) : (
                                <XCircle className="w-4 h-4 text-bearish" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
