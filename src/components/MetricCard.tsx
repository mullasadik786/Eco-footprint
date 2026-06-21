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
    <div id="metrics-grid" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      {/* Energy Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between text-left">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Energy Utility</span>
            <div className="text-xl font-bold font-display text-slate-900 tracking-tight mt-0.5">
              {energy.sum} kg CO₂e
            </div>
            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
              {energy.count} logs recorded
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-100">
          Utility
        </span>
      </div>

      {/* Transport Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between text-left">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mobility &amp; Travel</span>
            <div className="text-xl font-bold font-display text-slate-900 tracking-tight mt-0.5">
              {transport.sum} kg CO₂e
            </div>
            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
              {transport.count} trips logged
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-rose-50 text-rose-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-rose-100">
          Transit
        </span>
      </div>

      {/* Food Diet Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between text-left">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dietary Habits</span>
            <div className="text-xl font-bold font-display text-slate-900 tracking-tight mt-0.5">
              {foodWaste.sum} kg CO₂e
            </div>
            <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
              {foodWaste.count} meals/days logged
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-150">
          Lifestyle
        </span>
      </div>

    </div>
  );
}
