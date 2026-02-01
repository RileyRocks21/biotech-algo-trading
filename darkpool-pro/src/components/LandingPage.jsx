import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  ArrowRight,
  Waves,
  Check
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-Time Dark Pool Data',
    description: 'Track institutional order flow as it happens with sub-second latency.'
  },
  {
    icon: TrendingUp,
    title: 'AI-Powered Signals',
    description: 'Our algorithms analyze patterns to identify high-conviction trades.'
  },
  {
    icon: Shield,
    title: 'Institutional Grade',
    description: 'Access the same data that hedge funds and institutions use.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep dive into volume analysis, sentiment tracking, and more.'
  }
];

const pricingFeatures = [
  'Unlimited dark pool alerts',
  'Real-time data streaming',
  'AI conviction scores',
  'Options flow tracking',
  'News sentiment analysis',
  'Priority support'
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Waves className="w-6 h-6 text-accent" />
            </div>
            <span className="font-bold text-xl text-white">DarkPool<span className="text-accent">Pro</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 bg-accent text-background font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Dashboard
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Now tracking $2.3B+ daily dark pool volume</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              See What <span className="text-accent">Smart Money</span> Is Doing
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Track institutional dark pool activity in real-time. Get AI-powered signals 
              before the market moves.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-4 bg-accent text-background font-bold rounded-xl 
                         hover:bg-accent/90 transition-all duration-200 flex items-center justify-center gap-2
                         shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white font-semibold rounded-xl 
                         hover:bg-white/5 transition-colors"
              >
                View Live Demo
              </button>
            </div>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="bg-surface rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Mock Dashboard Preview */}
              <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-bearish" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-bullish" />
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {['NVDA', 'TSLA', 'AAPL', 'SPY'].map((ticker) => (
                    <div key={ticker} className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Dark Pool</div>
                      <div className="text-xl font-bold text-white">{ticker}</div>
                      <div className="text-bullish text-sm">+2.4M shares</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Trade Smarter
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional-grade tools that give you an edge in the market.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface border border-white/5 rounded-xl p-6 hover:border-accent/30 transition-colors"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">Start free, upgrade when you're ready.</p>
          </motion.div>

          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-accent/30 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-accent text-background text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-white">$49</span>
                <span className="text-gray-400">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-bullish/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-bullish" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/auth')}
                className="w-full py-4 bg-accent text-background font-bold rounded-xl hover:bg-accent/90 transition-colors"
              >
                Start 7-Day Free Trial
              </motion.button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                No credit card required
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to See the Full Picture?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of traders who use DarkPool Pro to gain an edge.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-accent text-background font-bold rounded-xl 
                       hover:bg-accent/90 transition-all duration-200
                       shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Waves className="w-6 h-6 text-accent" />
            <span className="font-bold text-white">DarkPool<span className="text-accent">Pro</span></span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 DarkPool Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
