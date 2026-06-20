import { CarbonActivity } from "../types";

interface AnalyticsProps {
  activities: CarbonActivity[];
}

export default function AnalyticsChart({ activities }: AnalyticsProps) {
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
  const peerAverage = 450; // kg CO2e monthly baseline Peer Avg
  const targetEmission = 250; // Ideal target sustainable limit

  // Circle chart calculation
  let accumulatedAngle = 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div id="analytics-section" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left pane: Circular Breakdown */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Emissions Breakdown
          </h4>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            {totalCO2 === 0 ? (
              <div className="text-center p-4">
                <p className="text-slate-400 text-sm">No emissions logged yet.</p>
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
                      strokeWidth="12"
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
                      strokeWidth="12"
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
                      strokeWidth="12"
                      strokeDasharray={`${(foodWastePct * circumference) / 100} ${circumference}`}
                      strokeDashoffset={`-${((energyPct + transportPct) * circumference) / 100}`}
                      className="transition-all duration-500"
                    />
                  )}
                </svg>
                {/* Center Content */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {totalCO2.toFixed(0)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    kg CO2e
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Graphic Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>Energy ({energyPct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Transport ({transportPct.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Diet/Waste ({foodWastePct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Peer Comparison Bars */}
        <div className="w-full md:w-1/2 flex flex-col justify-between self-stretch gap-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              How You Compare
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your logged activity benchmarked against national averages and optimal sustainability targets.
            </p>
          </div>

          <div className="flex items-end justify-around gap-2 bg-slate-50/50 rounded-xl p-4 border border-slate-50/80">
            {/* Target Limit */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-emerald-600">{targetEmission} kg</div>
              <div className="w-10 bg-emerald-100 rounded-t h-20 transition-all duration-300 relative overflow-hidden flex items-end">
                <div className="w-full bg-emerald-500 h-20"></div>
              </div>
              <div className="text-[10px] font-bold text-slate-500">Ideal Target</div>
            </div>

            {/* Current Active User */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold text-slate-800">{totalCO2.toFixed(0)} kg</div>
              <div className="w-10 bg-slate-200 rounded-t h-28 relative overflow-hidden flex items-end">
                <div 
                  className={`w-full transition-all duration-500 ${
                    totalCO2 > peerAverage 
                      ? "bg-red-500" 
                      : totalCO2 > targetEmission 
                        ? "bg-amber-500" 
                        : "bg-emerald-500"
                  }`}
                  style={{ height: `${Math.min((totalCO2 / 500) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-bold text-slate-800">Your Current</div>
            </div>

            {/* Peer Average Limit */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-amber-800">{peerAverage} kg</div>
              <div className="w-10 bg-amber-100 rounded-t h-24 transition-all duration-300 relative overflow-hidden flex items-end">
                <div className="w-full bg-amber-600 h-24"></div>
              </div>
              <div className="text-[10px] font-bold text-slate-500">Peer Average</div>
            </div>
          </div>

          {/* Assessment Indicator Callout */}
          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50 text-xs">
            {totalCO2 > peerAverage ? (
              <p className="text-red-700 font-medium">
                ⚠️ Your current emissions are higher than average. Utilize the action checklist and request an custom AI guide below to identify quick changes.
              </p>
            ) : totalCO2 <= targetEmission && totalCO2 > 0 ? (
              <p className="text-emerald-700 font-medium">
                ✨ Incredible! Your emissions match sustainable boundaries. Continue tracking and logging to nurture your Virtual Impact Forest!
              </p>
            ) : totalCO2 === 0 ? (
              <p className="text-slate-500 font-medium">
                🌱 Log some activities using the fields below to see how your carbon emissions compare to targets.
              </p>
            ) : (
              <p className="text-amber-700 font-medium">
                👍 You are beating the regional peer average! Target reaching the sustainable limit of 250kg through targeted weekly habits.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
