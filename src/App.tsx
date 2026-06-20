import { useState, useEffect } from "react";
import { CarbonActivity } from "./types";
import { INITIAL_ACTIVITIES } from "./data";
import { Leaf, Trash2, BookmarkCheck, ArrowUpDown } from "lucide-react";
import MetricCard from "./components/MetricCard";
import ImpactForest from "./components/ImpactForest";
import EmissionLogger from "./components/EmissionLogger";
import ActionChecklist from "./components/ActionChecklist";
import AIAdvisorPlan from "./components/AIAdvisorPlan";
import AnalyticsChart from "./components/AnalyticsChart";
import LifestyleQuiz from "./components/LifestyleQuiz";
import EquivalentsCard from "./components/EquivalentsCard";
import DailyChallenge from "./components/DailyChallenge";

export default function App() {
  const [activities, setActivities] = useState<CarbonActivity[]>(() => {
    try {
      const stored = localStorage.getItem("carbon_activities");
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [targetEmission, setTargetEmission] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("carbon_target_emission");
      return stored ? parseInt(stored, 10) : 250;
    } catch {
      return 250;
    }
  });

  const [totalSavedCo2, setTotalSavedCo2] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("carbon_saved_co2");
      return stored ? parseFloat(stored) : 4.5;
    } catch {
      return 4.5;
    }
  });

  const [searchQuery] = useState("");
  const [selectedCategory] = useState("all");
  const [sortBy] = useState("date-desc");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("carbon_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("carbon_target_emission", targetEmission.toString());
  }, [targetEmission]);

  useEffect(() => {
    localStorage.setItem("carbon_saved_co2", totalSavedCo2.toString());
  }, [totalSavedCo2]);

  const handleAddActivity = (newAct: Omit<CarbonActivity, "id">) => {
    const actWithId: CarbonActivity = { ...newAct, id: `act-${Date.now()}` };
    setActivities((prev) => [actWithId, ...prev]);
    showToast(`Successfully logged: "${newAct.description}"`);
  };

  const handlePrepopulateLogs = (newActivities: CarbonActivity[]) => {
    setActivities((prev) => [...newActivities, ...prev]);
    showToast(`Prepopulated ${newActivities.length} logs.`);
  };

  const handleDeleteActivity = (id: string, description: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast(`Removed log: "${description}"`);
  };

  const handleAddSavedCarbon = (co2Amount: number, actionTitle: string) => {
    setTotalSavedCo2((prev) => prev + co2Amount);
    showToast(`Saved ${co2Amount.toFixed(2)} kg CO2e!`);
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <div className="min-h-screen bg-[#050a08] text-slate-300 antialiased font-sans">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1411] border border-emerald-900/60 text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-xl flex items-center gap-3">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#070e0c]/90 backdrop-blur-md border-b border-emerald-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-black text-[#eefdf6] tracking-tight">Eco footprint</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carbon Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="bg-[#0b1411] rounded-2xl border border-emerald-950/70 p-6 shadow-sm flex-1 flex flex-col justify-center text-left">
              <h2 className="text-lg font-extrabold text-[#eefdf6] tracking-tight">Track Emissions</h2>
              <div className="mt-5 p-4 bg-[#101b17] border border-emerald-950/40 rounded-xl sm:flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Goal</span>
                  <span className="text-lg font-extrabold text-[#eefdf6]">Under {targetEmission} kg</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Savings</span>
                  <span className="text-lg font-black text-emerald-400">-{totalSavedCo2.toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <LifestyleQuiz onPrepopulateLogs={handlePrepopulateLogs} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AnalyticsChart activities={activities} targetEmission={targetEmission} setTargetEmission={setTargetEmission} />
          </div>
          <div className="lg:col-span-4">
            <ImpactForest totalSavedCo2={totalSavedCo2} />
          </div>
        </div>

        <MetricCard activities={activities} />

        {(() => {
          const energyCO2 = activities.filter((a) => a.category === "energy").reduce((sum, a) => sum + a.co2e, 0);
          const transportCO2 = activities.filter((a) => a.category === "transport").reduce((sum, a) => sum + a.co2e, 0);
          return <EquivalentsCard energyCO2={energyCO2} transportCO2={transportCO2} />;
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <EmissionLogger onAddActivity={handleAddActivity} />
          </div>
          <div className="lg:col-span-5">
            <DailyChallenge onAddSavedCarbon={handleAddSavedCarbon} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <AIAdvisorPlan activities={activities} />
          </div>
          <div className="lg:col-span-6">
            <ActionChecklist onAddSavedCarbon={handleAddSavedCarbon} />
          </div>
        </div>

        <section className="bg-[#0b1411] rounded-2xl border border-emerald-950/70 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-emerald-950/60 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#eefdf6] flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-emerald-500" /> Log History
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-emerald-950/60 text-slate-400 font-bold uppercase bg-[#101b17]/40">
                    <th className="p-3">Activity</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Emissions</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/40">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-[#101b17]/30">
                      <td className="p-3 font-semibold text-slate-200">{act.description}</td>
                      <td className="p-3"><span className="capitalize">{act.category}</span></td>
                      <td className="p-3 font-bold text-red-400">{act.co2e} kg</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteActivity(act.id, act.description)} className="p-1.5 text-slate-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-950/60 bg-[#040807] py-6 mt-12 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Eco Footprint Tracker.</p>
      </footer>
    </div>
  );
}
