import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart3, 
  Newspaper, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Waves,
  FlaskConical,
  Play,
  LineChart
} from 'lucide-react';

const navItems = [
  { id: 'flow', icon: Activity, label: 'Options Flow' },
  { id: 'catalysts', icon: FlaskConical, label: 'Catalysts' },
  { id: 'backtest', icon: Play, label: 'Backtest' },
  { id: 'analytics', icon: LineChart, label: 'Analytics' },
  { id: 'news', icon: Newspaper, label: 'News' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
];

export default function Sidebar({ activeTab, setActiveTab, isPro, onLogout }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 200 : 72 }}
      className="h-full bg-surface border-r border-white/5 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Waves className="w-6 h-6 text-accent" />
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="font-bold text-white">DarkPool</span>
              <span className="text-accent font-bold">Pro</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${isActive 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && !isExpanded && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-accent rounded-r"
                />
              )}
            </motion.button>
          );
        })}
      </nav>
      
      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* Pro Badge */}
        {isPro && (
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 
            ${isExpanded ? '' : 'justify-center'}
          `}>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {isExpanded && (
              <span className="text-xs font-bold text-accent">PRO ACTIVE</span>
            )}
          </div>
        )}
        
        {/* Settings */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Settings</span>}
        </button>
        
        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-bearish/10 hover:text-bearish transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Logout</span>}
        </button>
        
        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
