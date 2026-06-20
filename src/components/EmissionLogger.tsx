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
    <div id="logger-form" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="text-emerald-600 w-5 h-5" />
        <h3 className="font-bold text-slate-800 text-lg">Log Activity Emissions</h3>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-100 mb-6 gap-1 p-0.5 bg-slate-50/80 rounded-lg">
        <button
          onClick={() => { setActiveTab("energy"); setNumericValue(0); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === "energy"
              ? "bg-white text-amber-600 shadow-sm border border-amber-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Zap className="w-4 h-4" />
          Household Energy
        </button>
        <button
          onClick={() => { setActiveTab("transport"); setNumericValue(0); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === "transport"
              ? "bg-white text-red-600 shadow-sm border border-red-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Car className="w-4 h-4" />
          Travel & Mobility
        </button>
        <button
          onClick={() => { setActiveTab("food_waste"); setNumericValue(0); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === "food_waste"
              ? "bg-white text-emerald-600 shadow-sm border border-emerald-100"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Utensils className="w-4 h-4" />
          Diet & Footprint
        </button>
      </div>

      <form onSubmit={handleAddLog} className="space-y-5">
        
        {/* Step 1: Sub category choices */}
        {activeTab === "energy" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setEnergyType("electricity")}
              className={`p-3 rounded-xl border text-left transition-all ${
                energyType === "electricity"
                  ? "border-amber-500 bg-amber-50/20 text-amber-950 font-medium"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 text-xs"
              }`}
            >
              <div className="font-semibold text-sm">Electricity Grid</div>
              <div className="text-[10px] text-slate-500 mt-1">Grid billing in kWh</div>
            </button>
            <button
              type="button"
              onClick={() => setEnergyType("natural_gas")}
              className={`p-3 rounded-xl border text-left transition-all ${
                energyType === "natural_gas"
                  ? "border-amber-500 bg-amber-50/20 text-amber-950 font-medium"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 text-xs"
              }`}
            >
              <div className="font-semibold text-sm">Natural Gas</div>
              <div className="text-[10px] text-slate-500 mt-1">Heating gas therms</div>
            </button>
          </div>
        )}

        {activeTab === "transport" && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "car", label: "Automobile", sub: "Gas car (miles)" },
              { id: "transit", label: "Public Transit", sub: "Buses/Trains (km)" },
              { id: "flight", label: "Airline", sub: "Flights (hours)" }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTransportType(opt.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  transportType === opt.id
                    ? "border-red-500 bg-red-50/20 text-red-950 font-medium"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 text-xs"
                }`}
              >
                <div className="font-semibold text-xs">{opt.label}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "food_waste" && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-600 block">Select Dietary Profile Type:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "meat_heavy", label: "Heavy Meat", sub: "Frequent red beef/pork" },
                { id: "meat_average", label: "Average Meat", sub: "Moderate meat mix" },
                { id: "vegetarian", label: "Vegetarian", sub: "Egg & dairy, no meat" },
                { id: "vegan", label: "Vegan Plan", sub: "100% plant-based diet" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDietType(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    dietType === opt.id
                      ? "border-emerald-500 bg-emerald-50/20 text-emerald-950 font-medium"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 text-xs"
                  }`}
                >
                  <div className="font-semibold text-xs">{opt.label}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <label className="text-xs font-semibold text-slate-600 flex justify-between">
                <span>Duration tracking:</span>
                <span className="text-slate-900 font-bold">{daysCount} Days</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        )}

        {/* Enter Quantities */}
        {activeTab !== "food_waste" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 flex justify-between">
              <span>Enter Quantities consumed / traveled:</span>
              <span className="text-slate-900 font-bold">
                {numericValue} {unit}
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={numericValue === 0 ? "" : numericValue}
                onChange={(e) => setNumericValue(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder={`e.g. 150 ${unit}`}
                className="flex-1 bg-slate-50 border border-slate-100/50 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:bg-white"
                required
              />
            </div>
          </div>
        )}

        {/* Enter Custom Title Description (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 block">Custom Label / Description (Optional):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Commute to town center, Utility bill..."
            className="w-full bg-slate-50 border border-slate-100/50 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:bg-white"
          />
        </div>

        {/* Dynamic Live Counter Preview Card */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[9px]">Calculated Footprint Impact</span>
            <span className="text-base font-extrabold text-slate-800">
              +{co2e.toFixed(2)} kg CO₂e
            </span>
          </div>
          <div>
            <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-1 rounded-full uppercase">
              {activeTab} item
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={activeTab !== "food_waste" && numericValue <= 0}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
        >
          Add Log To Dashboard
        </button>

      </form>
    </div>
  );
}
