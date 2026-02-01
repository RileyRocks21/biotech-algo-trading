import { Lock, Zap, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlurWall({ onUnlock }) {
  return (
    <div className="absolute inset-x-0 bottom-0 h-1/2 z-20">
      {/* Gradient Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-t from-background via-background/95 to-transparent" />
      
      {/* CTA Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          {/* Lock Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          
          {/* Headline */}
          <h3 className="text-2xl font-bold text-white mb-3">
            Unlock Pro Dark Pool Data
          </h3>
          <p className="text-gray-400 mb-6">
            Get real-time access to institutional order flow, high-conviction signals, and advanced analytics.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-bullish/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-bullish" />
              </div>
              <span className="text-xs text-gray-400">Real-time</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs text-gray-400">AI Signals</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-gray-400">Exclusive</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUnlock}
            className="w-full py-4 px-8 bg-accent text-background font-bold rounded-xl 
                       hover:bg-accent/90 transition-all duration-200
                       shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]"
          >
            Start Free Trial — Unlock Now
          </motion.button>
          
          <p className="mt-4 text-xs text-gray-500">
            No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
