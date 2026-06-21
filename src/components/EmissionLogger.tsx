import React, { useState } from "react";
import { CarbonActivity } from "../types";
import { CARBON_INTENSITIES } from "../data";
import { PlusCircle, Zap, Car, Utensils } from "lucide-react";

interface LoggerProps {
  onAddActivity: (activity: Omit<CarbonActivity, "id">) => void;
}

export default function EmissionLogger({ onAddActivity }: LoggerProps) {
  const [activeTab, setActiveTab] = useState<"energy" | "transport" | "food_waste">("energy");
  const [description, setDescription] = useState("");
  const [numericValue, setNumericValue] = useState<number>(0);

  // Category specific sub-types
  const [energyType, setEnergyType] = useState<"electricity" | "natural_gas">("electricity");
  const [transportType, setTransportType] = useState<"car" | "flight" | "transit">("car");
  const [dietType, setDietType] = useState<"meat_heavy" | "meat_average" | "vegetarian" | "vegan">("meat_average");
  const [daysCount, setDaysCount] = useState<number>(7);

  // Real-time dynamic emission preview calculation
  const calculateRealTimeCO2e = (): { co2e: number; unit: string } => {
    if (activeTab === "energy") {
      if (energyType === "electricity") {
        return { co2e: numericValue * CARBON_INTENSITIES.electricity_kWh, unit: "kWh" };
      } else {
        return { co2e: numericValue * CARBON_INTENSITIES.naturalGas_therm, unit: "therms" };
      }
    } else if (activeTab === "transport") {
      if (transportType === "car") {
        return { co2e: numericValue * CARBON_INTENSITIES.carGasoline_mile, unit: "miles" };
      } else if (transportType === "transit") {
        return { co2e: numericValue * CARBON_INTENSITIES.publicTransit_km, unit: "km" };
      } else {
        return { co2e: numericValue * CARBON_INTENSITIES.flight_hour, unit: "hours" };
      }
    } else {
      const dailySustValue = CARBON_INTENSITIES[`diet_${dietType}`];
      return { co2e: daysCount * dailySustValue, unit: "days" };
    }
  };

  const { co2e, unit } = calculateRealTimeCO2e();

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    
    let defaultDesc = description.trim();
    if (!defaultDesc) {
      if (activeTab === "energy") {
        defaultDesc = `${energyType === "electricity" ? "Electricity grid consumption" : "Natural gas heating space usage"}`;
      } else if (activeTab === "transport") {
        defaultDesc = `${transportType === "car" ? "Automobile commuting distance" : transportType === "transit" ? "Public transit route" : "Airlines flight duration"}`;
      } else {
        defaultDesc = `${dietType === "vegan" ? "Strict vegan dietary weekly footprint" : dietType === "vegetarian" ? "Vegetarian dietary lifestyle" : "Meat standard consumption footprint"}`;
      }
    }

    onAddActivity({
      category: activeTab,
      date: new Date().toISOString().split("T")[0],
      description: defaultDesc,
      value: activeTab === "food_waste" ? daysCount : numericValue,
      co2e: Number(co2e.toFixed(2)),
      unit: unit
    });

    // Reset inputs
    setDescription("");
    setNumericValue(0);
  };

  return (
    <div id="logger-form" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-emerald-600 w-5 h-5" />
        <h3 className="font-bold text-slate-800 text-lg font-display">Log Activity Emissions</h3>
      </div>

      {/* Tabs list */}
      <div className="flex border border-slate-200/50 mb-5 gap-1 p-1 bg-slate-50 rounded-xl">
        <button
          type="button"
          onClick={() => { setActiveTab("energy"); setNumericValue(0); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "energy"
              ? "bg-white text-amber-700 shadow-sm border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Energy</span>
          <span className="sm:hidden">Energy</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("transport"); setNumericValue(0); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "transport"
              ? "bg-white text-rose-700 shadow-sm border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Car className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Travel</span>
          <span className="sm:hidden">Travel</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("food_waste"); setNumericValue(0); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "food_waste"
              ? "bg-white text-emerald-700 shadow-sm border border-slate-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Utensils className="w-4 h-4 text-emerald-500" />
          <span className="hidden sm:inline">Diet</span>
          <span className="sm:hidden">Diet</span>
        </button>
      </div>

      <form onSubmit={handleAddLog} className="space-y-4">
        
        {/* Step 1: Sub category choices */}
        {activeTab === "energy" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setEnergyType("electricity")}
              className={`p-3 rounded-xl border text-left transition-all shadow-sm cursor-pointer ${
                energyType === "electricity"
                  ? "border-amber-500 bg-amber-50/50 text-amber-850 font-semibold"
                  : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600 text-xs"
              }`}
            >
              <div className="font-bold text-slate-800 text-sm">Electricity</div>
              <div className="text-[10px] text-slate-450 mt-0.5">Billing in kWh</div>
            </button>
            <button
              type="button"
              onClick={() => setEnergyType("natural_gas")}
              className={`p-3 rounded-xl border text-left transition-all shadow-sm cursor-pointer ${
                energyType === "natural_gas"
                  ? "border-amber-500 bg-amber-50/50 text-amber-850 font-semibold"
                  : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600 text-xs"
              }`}
            >
              <div className="font-bold text-slate-800 text-sm">Natural Gas</div>
              <div className="text-[10px] text-slate-450 mt-0.5">Billing in therms</div>
            </button>
          </div>
        )}

        {activeTab === "transport" && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "car", label: "Auto", sub: "Gas car (mi)" },
              { id: "transit", label: "Transit", sub: "Rail/bus (km)" },
              { id: "flight", label: "Flight", sub: "Airlines (hrs)" }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTransportType(opt.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all shadow-sm cursor-pointer ${
                  transportType === opt.id
                    ? "border-rose-300 bg-rose-50/60 text-rose-800 font-semibold"
                    : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600 text-xs"
                }`}
              >
                <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "food_waste" && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">Select Dietary Profile Type:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "meat_heavy", label: "Heavy Meat", sub: "Daily red meat" },
                { id: "meat_average", label: "Average Meat", sub: "Moderate beef/poultry" },
                { id: "vegetarian", label: "Vegetarian", sub: "Egg & dairy mix" },
                { id: "vegan", label: "Vegan Plan", sub: "100% plant foods" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDietType(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all shadow-sm cursor-pointer ${
                    dietType === opt.id
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold"
                      : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600 text-xs"
                  }`}
                >
                  <div className="font-bold text-slate-800 text-xs">{opt.label}</div>
                  <div className="text-[9px] text-slate-450 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-slate-600 flex justify-between">
                <span>Duration tracking:</span>
                <span className="text-emerald-650 font-bold font-mono">{daysCount} Days</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        )}

        {/* Enter Quantities */}
        {activeTab !== "food_waste" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 flex justify-between">
              <span>Enter Quantities consumed / traveled:</span>
              <span className="text-emerald-700 font-bold font-mono">
                {numericValue} {unit}
              </span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={numericValue === 0 ? "" : numericValue}
              onChange={(e) => setNumericValue(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder={`e.g. 150 ${unit}`}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-450"
              required
            />
          </div>
        )}

        {/* Enter Custom Title Description (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 block">Custom Description (Optional):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Commute to downtown, Household billing..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-450"
          />
        </div>

        {/* Dynamic Live Counter Preview Card */}
        <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Calculated Log Impact</span>
            <span className="text-base font-bold font-mono text-slate-800">
              +{co2e.toFixed(2)} kg CO₂e
            </span>
          </div>
          <div>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase border border-emerald-200/50 capitalize font-mono">
              {activeTab.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={activeTab !== "food_waste" && numericValue <= 0}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Add Log To Dashboard
        </button>

      </form>
    </div>
  );
}
