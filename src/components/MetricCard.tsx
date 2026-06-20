import { Zap, Car, Utensils } from "lucide-react";
import { CarbonActivity } from "../types";

interface MetricRowProps {
  activities: CarbonActivity[];
}

export default function MetricCard({ activities }: MetricRowProps) {
  // Extract category counts and totals
  const aggregateCategoryData = (cat: "energy" | "transport" | "food_waste") => {
    const subset = activities.filter((a) => a.category === cat);
    const co2Sum = subset.reduce((acc, a) => acc + a.co2e, 0);
    return {
      sum: Number(co2Sum.toFixed(1)),
      count: subset.length
    };
  };

  const energy = aggregateCategoryData("energy");
  const transport = aggregateCategoryData("transport");
  const foodWaste = aggregateCategoryData("food_waste");

  return (
    <div id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Energy Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Energy Utility</span>
            <div className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {energy.sum} kg CO₂e
            </div>
            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
              {energy.count} log entries recorded
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          Amber
        </span>
      </div>

      {/* Transport Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-xl text-red-500">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Mobility &amp; Travel</span>
            <div className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {transport.sum} kg CO₂e
            </div>
            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
              {transport.count} transit trips logged
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-red-50 text-red-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          Red
        </span>
      </div>

      {/* Food Diet Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Dietary Habits</span>
            <div className="text-xl font-extrabold text-slate-800 tracking-tight mt-0.5">
              {foodWaste.sum} kg CO₂e
            </div>
            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
              {foodWaste.count} lifestyle logs
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          Emerald
        </span>
      </div>

    </div>
  );
}
