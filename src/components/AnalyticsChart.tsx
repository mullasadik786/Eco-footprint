import { CarbonActivity } from "../types";
import { Sliders } from "lucide-react";

interface AnalyticsProps {
  activities: CarbonActivity[];
  targetEmission: number;
  setTargetEmission: (target: number) => void;
}

export default function AnalyticsChart({ activities, targetEmission, setTargetEmission }: AnalyticsProps) {
  // Aggregate carbon values by category
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

  // Percentages
  const energyPct = totalCO2 > 0 ? (energyCO2 / totalCO2) * 100 : 0;
  const transportPct = totalCO2 > 0 ? (transportCO2 / totalCO2) * 100 : 0;
  const foodWastePct = totalCO2 > 0 ? (foodWasteCO2 / totalCO2) * 100 : 0;

  // Ideal limits vs real tracked values
  const peerAverage = 450; 

  // Circle chart calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div id="analytics-section" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 text-left hover:shadow-md transition-all duration-300">
      
      {/* Top Banner Control Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-150 p-4 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Sliders className="text-emerald-600 w-5 h-5" />
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Custom Emissions Budget</h4>
            <span className="text-[10px] text-slate-400 font-semibold block">Optimize your monthly target limit threshold</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="range"
            min="50"
            max="800"
            step="10"
            value={targetEmission}
            onChange={(e) => setTargetEmission(Number(e.target.value))}
            className="w-full sm:w-32 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-xs font-bold font-mono text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded min-w-[75px] text-center shadow-sm">
            {targetEmission} kg
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left pane: Circular Breakdown */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Emissions Breakdown
          </h4>
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            {totalCO2 === 0 ? (
              <div className="text-center p-4">
                <p className="text-slate-400 text-xs font-semibold leading-normal">🌱 No emissions logged.<br/>Enter items to view statistics.</p>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                  {/* Energy Segment */}
                  {energyPct > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#f59e0b" // Warm amber
                      strokeWidth="11"
                      strokeDasharray={`${(energyPct * circumference) / 100} ${circumference}`}
                      strokeDashoffset="0"
                      className="transition-all duration-500"
                    />
                  )}
                  {/* Transport Segment */}
                  {transportPct > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#ef4444" // Vivid Red
                      strokeWidth="11"
                      strokeDasharray={`${(transportPct * circumference) / 100} ${circumference}`}
                      strokeDashoffset={`-${(energyPct * circumference) / 100}`}
                      className="transition-all duration-500"
                    />
                  )}
                  {/* Food/Waste Segment */}
                  {foodWastePct > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#10b981" // Vibrant Emerald Green
                      strokeWidth="11"
                      strokeDasharray={`${(foodWastePct * circumference) / 100} ${circumference}`}
                      strokeDashoffset={`-${((energyPct + transportPct) * circumference) / 100}`}
                      className="transition-all duration-500"
                    />
                  )}
                </svg>
                {/* Center Content */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-display text-slate-800">
                    {totalCO2.toFixed(0)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                    kg CO2e
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Graphic Legend */}
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-[11px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Energy ({energyPct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Transport ({transportPct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Lifestyle ({foodWastePct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Peer Comparison Bars */}
        <div className="w-full md:w-1/2 flex flex-col justify-between self-stretch gap-6">
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Competitive Benchmark
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Your logged real-world activity benchmarked against typical national averages and optimal sustainability target budgets.
            </p>
          </div>

          <div className="flex items-end justify-around gap-2 bg-slate-50/80 rounded-xl p-4 border border-slate-100 shadow-sm">
            {/* Target Limit */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold font-mono text-emerald-600">{targetEmission} kg</div>
              <div className="w-10 bg-emerald-100 rounded-t h-20 transition-all duration-300 relative overflow-hidden flex items-end shadow-inner">
                <div className="w-full bg-emerald-500 h-20"></div>
              </div>
              <div className="text-[10px] font-bold text-slate-400">My Target</div>
            </div>

            {/* Current Active User */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold font-mono text-slate-800">{totalCO2.toFixed(0)} kg</div>
              <div className="w-10 bg-slate-200 rounded-t h-28 relative overflow-hidden flex items-end shadow-inner">
                <div 
                  className={`w-full transition-all duration-500 ${
                    totalCO2 > peerAverage 
                      ? "bg-rose-500" 
                      : totalCO2 > targetEmission 
                        ? "bg-amber-400" 
                        : "bg-emerald-500"
                  }`}
                  style={{ height: `${Math.min((totalCO2 / 500) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-bold text-slate-700">Your Current</div>
            </div>

            {/* Peer Average Limit */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold font-mono text-amber-700">{peerAverage} kg</div>
              <div className="w-10 bg-amber-100 rounded-t h-24 transition-all duration-300 relative overflow-hidden flex items-end shadow-inner">
                <div className="w-full bg-amber-500 h-24"></div>
              </div>
              <div className="text-[10px] font-bold text-slate-400">Peer Average</div>
            </div>
          </div>

          {/* Assessment Indicator Callout */}
          <div className="text-left font-sans">
            {totalCO2 > peerAverage ? (
              <div className="p-3.5 bg-rose-50 rounded-lg border border-rose-100 text-xs text-rose-800 font-semibold leading-relaxed">
                ⚠️ Your current emissions are higher than average. Utilize the daily checklists or request custom AI milestoning below to identify simple changes.
              </div>
            ) : totalCO2 <= targetEmission && totalCO2 > 0 ? (
              <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-100 text-xs text-emerald-800 font-semibold leading-relaxed">
                ✨ Incredible! Your emissions match sustainable boundaries. Continue avoiding and matching logs to plant more trees in your grove!
              </div>
            ) : totalCO2 === 0 ? (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-150 text-xs text-slate-500 font-medium text-center">
                🌱 Log activities above to see your benchmark.
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-800 font-semibold leading-relaxed">
                👍 You are beating the regional peer average! Target reaching your budget limit of {targetEmission}kg through regular small carbon-avoiding habits.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
