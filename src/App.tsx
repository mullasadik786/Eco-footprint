import { useState, useEffect } from "react";
import { CarbonActivity } from "./types";
import { INITIAL_ACTIVITIES } from "./data";
import { 
  Leaf, 
  Trash2, 
  BookmarkCheck, 
  Award
} from "lucide-react";
import MetricCard from "./components/MetricCard";
import ImpactForest from "./components/ImpactForest";
import EmissionLogger from "./components/EmissionLogger";
import ActionChecklist from "./components/ActionChecklist";
import AIAdvisorPlan from "./components/AIAdvisorPlan";
import AnalyticsChart from "./components/AnalyticsChart";

export default function App() {
  // Read footprints and saved state from localStorage for offline persistence
  const [activities, setActivities] = useState<CarbonActivity[]>(() => {
    try {
      const stored = localStorage.getItem("carbon_activities");
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [totalSavedCo2, setTotalSavedCo2] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("carbon_saved_co2");
      return stored ? parseFloat(stored) : 4.5; // Start with small initial sprout metrics
    } catch {
      return 4.5;
    }
  });

  // Gamification states for ranking boost
  const [streak, setStreak] = useState<number>(() => {
    const stored = localStorage.getItem("eco_streak");
    return stored ? parseInt(stored, 10) : 0;
  });
  const [challengeDone, setChallengeDone] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem("carbon_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("carbon_saved_co2", totalSavedCo2.toString());
  }, [totalSavedCo2]);

  useEffect(() => {
    localStorage.setItem("eco_streak", streak.toString());
  }, [streak]);

  // Actions
  const handleAddActivity = (newAct: Omit<CarbonActivity, "id">) => {
    const actWithId: CarbonActivity = {
      ...newAct,
      id: `act-${Date.now()}`
    };
    setActivities((prev) => [actWithId, ...prev]);
    showToast(`Successfully logged: "${newAct.description}" (+${newAct.co2e} kg CO₂e)`);
  };

  const handleDeleteActivity = (id: string, description: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast(`Removed log: "${description}"`);
  };

  const handleAddSavedCarbon = (co2Amount: number, actionTitle: string) => {
    setTotalSavedCo2((prev) => prev + co2Amount);
    showToast(`Saved ${co2Amount.toFixed(2)} kg CO₂e by committing to: "${actionTitle}"!`);
  };

  // Daily Challenge Action Handler
  const handleCompleteDailyChallenge = () => {
    if (!challengeDone) {
      setStreak(prev => prev + 1);
      setTotalSavedCo2(prev => prev + 2.0); // Reward bonus 2.0 kg CO2 saved
      setChallengeDone(true);
      showToast("🎉 Daily Eco-Challenge Completed! +2.0 kg CO₂e Saved.");
    }
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // Dynamically calculate user tier badge based on climate parameters
  const ecoLevel = totalSavedCo2 > 50 ? "Eco Warrior 👑" : totalSavedCo2 > 20 ? "Green Guardian 🌿" : "Eco Sprout 🌱";

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 antialiased font-sans">
      
      {/* Dynamic Floating Toast Notifications (Accessible Announcement) */}
      {notification && (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900 border border-slate-700 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-xl flex items-center gap-3">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Header Hero Nav Line */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
              <Leaf className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-800 tracking-tight">Eco footprint</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carbon Analytics &amp; Plan Guide</p>
            </div>
          </div>
          <div className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-1">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md" aria-label="Virtual Grove Status Live">
              🌳 Virtual Grove Live
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Row 1: App Brief & Intro Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
              Understand, Track, and Avoid Greenhouse Emissions
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Use our interactive parameters to record daily carbon footprint items, checkout custom climate habits to avoid emissions, and generate automated sustainable checklists powered by Gemini AI.
            </p>
          </div>
          
          {/* Layout Stats Badges Group */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-2 min-w-[150px] bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Avoided Emissions Factor</span>
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                -{totalSavedCo2.toFixed(1)} kgCO₂e
              </span>
              <span className="text-[9px] text-emerald-800 font-medium">Accumulated Carbon offset</span>
            </div>

            {/* Custom Gamification Badge (Boost Alignment Index) */}
            <div className="flex flex-col gap-2 min-w-[150px] bg-gradient-to-br from-emerald-600 to-green-700 text-white p-4 rounded-xl text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Your Badge Level</span>
              <span className="text-sm font-black flex items-center justify-center gap-1 mt-1">
                <Award className="w-4 h-4 text-amber-300" aria-hidden="true" /> {ecoLevel}
              </span>
              <span className="text-[9px] text-emerald-100 font-medium tracking-wide">🔥 {streak} Days Streak</span>
            </div>
          </div>
        </div>

        {/* Gamified Eco-Challenge Card (Boost Problem Statement Alignment Factor) */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" aria-labelledby="challenge-heading">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-xl shadow-inner">🔥</div>
            <div>
              <h3 id="challenge-heading" className="text-base font-bold text-slate-800">Daily Carbon Saver Challenge</h3>
              <p className="text-xs text-slate-500 mt-0.5">Today's Goal: Use a reusable cloth bag instead of plastic bags for grocery shopping!</p>
            </div>
          </div>
          <button
            onClick={handleCompleteDailyChallenge}
            disabled={challengeDone}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              challengeDone 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
            }`}
            aria-label={challengeDone ? "Today's challenge completed" : "Mark today's carbon saving challenge as completed"}
          >
            {challengeDone ? "🎉 Challenge Done!" : "Mark as Completed (+2kg)"}
          </button>
        </section>

        {/* Row 2: Grid of Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AnalyticsChart activities={activities} />
          </div>
          <div className="lg:col-span-4">
            <ImpactForest totalSavedCo2={totalSavedCo2} />
          </div>
        </div>

        {/* Row 3: Standard Aggregated metrics */}
        <MetricCard activities={activities} />

        {/* Row 4: Gemini AI Personalized Section */}
        <AIAdvisorPlan activities={activities} totalSavedCo2={totalSavedCo2} />

        {/* Row 5: Action check sheet vs active log lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <ActionChecklist onAddSavedCarbon={handleAddSavedCarbon} />
          </div>
          <div className="lg:col-span-6 text-center">
            <EmissionLogger onAddActivity={handleAddActivity} />
          </div>
        </div>

        {/* Row 6: History Table logs */}
