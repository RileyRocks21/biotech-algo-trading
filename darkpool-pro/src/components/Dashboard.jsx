import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Sidebar from './Sidebar';
import AlertTable from './AlertTable';
import NewsWidget from './NewsWidget';
import OptionsFlowTable from './OptionsFlowTable';
import ClinicalTrialsTable from './ClinicalTrialsTable';
import BacktestPanel from './BacktestPanel';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState('flow');
  const [loading, setLoading] = useState(true);

  // Check if this is a demo session
  const isDemo = location.state?.isDemo;

  useEffect(() => {
    // If demo mode, skip auth check
    if (isDemo) {
      setIsPro(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Not logged in, redirect to auth
        navigate('/auth');
        return;
      }

      setUser(currentUser);
      
      // Check for Pro status in Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setIsPro(userDoc.data().isPro || false);
        } else {
          setIsPro(true); // Default to pro for demo
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
        setIsPro(true); // Default to pro if error
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, isDemo]);

  const handleLogout = async () => {
    try {
      if (!isDemo) {
        await auth.signOut();
      }
      navigate('/');
    } catch (error) {
      console.log('Error signing out:', error);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isPro={isPro}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative overflow-hidden bg-surface/30">
            {/* Tab Content */}
            {activeTab === 'flow' && <OptionsFlowTable isPro={isPro} />}
            {activeTab === 'catalysts' && <ClinicalTrialsTable isPro={isPro} />}
            {activeTab === 'backtest' && <BacktestPanel isPro={isPro} />}
            {activeTab === 'analytics' && <AnalyticsDashboard isPro={isPro} />}
            {activeTab === 'news' && <AlertTable isPro={isPro} />}
            {activeTab === 'billing' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-2">Billing & Subscription</h2>
                  <p className="text-gray-400">Manage your DarkPool Pro subscription</p>
                  <div className="mt-6 p-6 bg-surface border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 justify-center mb-4">
                      <div className="w-3 h-3 rounded-full bg-bullish animate-pulse" />
                      <span className="text-bullish font-medium">Pro Active</span>
                    </div>
                    <p className="text-gray-400 text-sm">Your subscription is active</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* News Widget - Right Sidebar (show only on certain tabs) */}
          {(activeTab === 'flow' || activeTab === 'catalysts') && <NewsWidget />}
        </div>
      </main>
    </div>
  );
}
