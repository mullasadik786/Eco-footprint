import { useState, useEffect } from "react";
import { CarbonActivity } from "./types";
import { INITIAL_ACTIVITIES } from "./data";
import { 
  Leaf, 
  Trash2, 
  Sparkles, 
  BookmarkCheck, 
  CloudLightning,
  TreeDeciduous,
  Waves,
  Search,
  ArrowUpDown,
  Sun,
  Moon
} from "lucide-react";
import MetricCard from "./components/MetricCard";
import ImpactForest from "./components/ImpactForest";
import EmissionLogger from "./components/EmissionLogger";
import ActionChecklist from "./components/ActionChecklist";
import AIAdvisorPlan from "./components/AIAdvisorPlan";
import AnalyticsChart from "./components/AnalyticsChart";
import LifestyleQuiz from "./components/LifestyleQuiz";
import EquivalentsCard from "./components/EquivalentsCard";
import DailyChallenge from "./components/DailyChallenge";
import EmissionsAlertBeacon from "./components/EmissionsAlertBeacon";
import GreenPlantingHub from "./components/GreenPlantingHub";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("app_theme");
      return (stored as "light" | "dark") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  // Read footprints and saved state from localStorage for offline persistence
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

  // Search, Filter and Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const [notification, setNotification] = useState<string | null>(null);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem("carbon_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("carbon_target_emission", targetEmission.toString());
  }, [targetEmission]);

  useEffect(() => {
    localStorage.setItem("carbon_saved_co2", totalSavedCo2.toString());
  }, [totalSavedCo2]);

  // Actions
  const handleAddActivity = (newAct: Omit<CarbonActivity, "id">) => {
    const actWithId: CarbonActivity = {
      ...newAct,
      id: `act-${Date.now()}`
    };
    setActivities((prev) => [actWithId, ...prev]);
    showToast(`Successfully logged: "${newAct.description}" (+${newAct.co2e} kg CO₂e)`);
  };

  const handlePrepopulateLogs = (newActivities: CarbonActivity[]) => {
    setActivities((prev) => [...newActivities, ...prev]);
    showToast(`Perfect! Prepopulated ${newActivities.length} custom lifestyle baseline logs.`);
  };

  const handleDeleteActivity = (id: string, description: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast(`Removed log: "${description}"`);
  };

  const handleAddSavedCarbon = (co2Amount: number, actionTitle: string) => {
    setTotalSavedCo2((prev) => prev + co2Amount);
    showToast(`Saved ${co2Amount.toFixed(2)} kg CO₂e by committing to: "${actionTitle}"!`);
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // Calculate aggregated footprint elements for real-time alerts
  const energyCO2 = activities
    .filter((a) => a.category === "energy")
    .reduce((sum, a) => sum + a.co2e, 0);
  const transportCO2 = activities
    .filter((a) => a.category === "transport")
    .reduce((sum, a) => sum + a.co2e, 0);
  const foodWasteCO2 = activities
    .filter((a) => a.category === "food_waste")
    .reduce((sum, a) => sum + a.co2e, 0);
  const totalCO2 = energyCO2 + transportCO2 + foodWasteCO2;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-600 antialiased font-sans flex flex-col justify-between">
      
      {/* Dynamic Floating Toast Notifications */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-slate-900/95 border border-slate-800 text-white font-semibold text-xs py-3.5 px-5 rounded-xl shadow-2xl flex items-center gap-3">
          <BookmarkCheck className="w-4.5 h-4.5 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Primary Header Hero Nav Line */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold text-slate-800 tracking-tight font-display leading-tight">Eco footprint</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Carbon Analytics &amp; Plan Guide</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Mode Selector Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
              <button
                onClick={() => {
                  setTheme("light");
                  showToast("Switched to clean minimalist Light Mode! ☀️");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  theme === "light"
                    ? "bg-white text-slate-800 text-amber-600 shadow-md border border-amber-200/20"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="Activate Clean Light Theme"
                id="light-theme-toggle-btn"
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  showToast("Switched to elegant obsidian Dark Theme! 🌙");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-900 text-emerald-400 shadow-md border border-slate-800"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
                title="Activate Deep Dark Theme"
                id="dark-theme-toggle-btn"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>

            <div className="hidden sm:block cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>Virtual Grove Live</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Dynamic Traffic-Light Emissions Safety Alert Beacon */}
        <EmissionsAlertBeacon 
          totalCO2={totalCO2} 
          targetEmission={targetEmission} 
          onCommitEcoAction={handleAddSavedCarbon}
        />

        {/* Row 1: App Brief & Intro Banner + Assessment Habit Quiz */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-center text-left">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight font-display mb-2">
                Understand, Track, and Avoid Greenhouse Emissions
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                Use our interactive parameters to record daily carbon footprint items, checkout custom climate habits to avoid emissions, and generate automated sustainable checklists powered by Gemini AI.
              </p>
              
              <div className="mt-5 p-4 bg-slate-50/85 border border-slate-150 rounded-xl sm:flex items-center justify-between gap-4 shadow-inner">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Total Carbon Budget Goal</span>
                  <span className="text-base font-bold font-display text-slate-800">Under {targetEmission} kg / month</span>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0 border-t sm:border-t-0 border-slate-200/60 pt-2.5 sm:pt-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Accumulated Offset Savings</span>
                  <span className="text-base font-bold font-display text-emerald-600">-{totalSavedCo2.toFixed(1)} kg CO₂e</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 lg:col-span-5">
            <LifestyleQuiz onPrepopulateLogs={handlePrepopulateLogs} />
          </div>
        </div>

        {/* Row 2: Grid of Widgets (Forest Sprouter vs aggregated stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AnalyticsChart 
              activities={activities} 
              targetEmission={targetEmission} 
              setTargetEmission={setTargetEmission} 
            />
          </div>
          <div className="lg:col-span-4">
            <ImpactForest totalSavedCo2={totalSavedCo2} />
          </div>
        </div>

        {/* Row 3: Standard Aggregated metrics */}
        <MetricCard activities={activities} />

        {/* Row 3.5: Carbon Equivalents Translator (Tangible stats) */}
        <EquivalentsCard totalCO2={totalCO2} totalSavedCO2={totalSavedCo2} />

        {/* Row 4: Gemini AI Personalized Section */}
        <AIAdvisorPlan activities={activities} totalSavedCo2={totalSavedCo2} />

        {/* Row 4.5: Botanical Plant Growth & Awareness Hub */}
        <GreenPlantingHub onCommitOffset={handleAddSavedCarbon} />

        {/* Row 5: Action check sheet, Daily savings challenge & Active log list creators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 xl:col-span-4 md:col-span-6 lg:col-span-4">
            <ActionChecklist onAddSavedCarbon={handleAddSavedCarbon} />
          </div>
          <div className="lg:col-span-12 xl:col-span-4 md:col-span-6 lg:col-span-4">
            <DailyChallenge onAwardOffset={handleAddSavedCarbon} />
          </div>
          <div className="lg:col-span-12 xl:col-span-4 md:col-span-12 lg:col-span-4">
            <EmissionLogger onAddActivity={handleAddActivity} />
          </div>
        </div>

        {/* Row 6: History Table logs with Search, Category Pills & Sorters */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          
          <div className="p-6 border-b border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-left">
                <h3 className="font-bold text-slate-800 text-base font-display">Carbon Footprint Tracking Logs</h3>
                <p className="text-xs text-slate-400 mt-0.5">A complete breakdown of recorded activities, emissions and intensities.</p>
              </div>
              <span className="text-xs font-bold text-slate-550 text-slate-650 bg-slate-50 border border-slate-250/20 shadow-sm px-3 py-1 rounded-xl">
                {activities.length} total entries
              </span>
            </div>

            {/* Filter toolbar container */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              
              {/* Search keywords field */}
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search logs e.g. Commute, Electricity, Diet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                />
              </div>

              {/* Category pills selection buttons */}
              <div className="sm:col-span-4 flex flex-wrap gap-1.5 items-center">
                {[
                  { id: "all", label: "All Items" },
                  { id: "energy", label: "Energy" },
                  { id: "transport", label: "Travel" },
                  { id: "food_waste", label: "Diet/Waste" }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategory(pill.id)}
                    className={`py-1.5 px-3.5 rounded-xl text-[11px] font-bold transition-all shadow-sm cursor-pointer ${
                      selectedCategory === pill.id
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Sort filter */}
              <div className="sm:col-span-3 flex items-center bg-white rounded-xl border border-slate-200 px-3 shadow-sm focus-within:ring-1 focus-within:ring-emerald-500">
                <ArrowUpDown className="text-slate-400 w-3.5 h-3.5 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-slate-600 py-2 w-full focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="impact-desc">Highest Emission</option>
                  <option value="impact-asc">Lowest Emission</option>
                </select>
              </div>

            </div>
          </div>

          {(() => {
            const listFiltered = activities
              .filter((a) => {
                const matchesKeyword = a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.unit.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
                return matchesKeyword && matchesCategory;
              })
              .sort((a, b) => {
                if (sortBy === "date-desc") {
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
                if (sortBy === "date-asc") {
                  return new Date(a.date).getTime() - new Date(b.date).getTime();
                }
                if (sortBy === "impact-desc") {
                  return b.co2e - a.co2e;
                }
                if (sortBy === "impact-asc") {
                  return a.co2e - b.co2e;
                }
                return 0;
              });

            if (listFiltered.length === 0) {
              return (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <p className="text-slate-450 text-slate-500 text-sm font-bold">No carbon records found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your keyword filter or categories.</p>
                </div>
              );
            }

            return (
              <div className="overflow-x-auto text-left">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 uppercase font-extrabold tracking-wider">
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-6">Logged Date</th>
                      <th className="py-3.5 px-6">Description</th>
                      <th className="py-3.5 px-6 text-right">Value Context</th>
                      <th className="py-3.5 px-6 text-right text-slate-650">CO₂e Footprint</th>
                      <th className="py-3.5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {listFiltered.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/55 transition-all text-slate-600">
                        <td className="py-3.5 px-6 font-bold">
                          <span className={`inline-block px-2.5 py-1 rounded-full capitalize text-[10px] uppercase tracking-wider font-bold shadow-sm ${
                            a.category === "energy" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            a.category === "transport" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                            "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}>
                            {a.category.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 text-xs font-mono">
                          {a.date}
                        </td>
                        <td className="py-3.5 px-6 font-bold text-slate-805 text-slate-850">
                          {a.description}
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono text-xs text-slate-500">
                          {a.value} {a.unit}
                        </td>
                        <td className="py-3.5 px-6 text-right text-slate-800 font-bold font-mono">
                          {a.co2e.toFixed(1)} kg
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <button
                            onClick={() => handleDeleteActivity(a.id, a.description)}
                            className="p-1.5 text-slate-350 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete custom log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>

        {/* Row 7: Education Section list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm font-display">Green Cloud Deployment</h4>
              <p className="text-xs text-slate-450 text-slate-500 mt-1.5 leading-relaxed">
                Our Cloud Run microservices container utilizes active carbon-intelligent grid matching options to minimize compute footprint.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
              <TreeDeciduous className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm font-display">Habit Mitigation</h4>
              <p className="text-xs text-slate-550 text-slate-500 mt-1.5 leading-relaxed">
                Small structural modifications like switching off power-draw switches, walking active trips, and eating organic grains avoid carbon output immediately.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-start gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm font-display">Climate Handprint</h4>
              <p className="text-xs text-slate-550 text-slate-500 mt-1.5 leading-relaxed">
                By growing your virtual forest, you celebrate real-world proactive offsets—activities that diminish baseline outputs and build green resilience.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Sustainable Foot */}
      <footer className="bg-white border-t border-slate-100 py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-850 flex items-center justify-center gap-1.5 font-display text-slate-850 text-slate-800">
            <Leaf className="w-4.5 h-4.5 text-emerald-600" />
            Carbon Footprint Tracker &amp; Advisor
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Powered by Gemini modern models. Fully compliant with state-defined environmental principles &amp; GCP cloud practices.
          </p>
        </div>
      </footer>

    </div>
  );
}
