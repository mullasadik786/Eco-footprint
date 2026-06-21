import { useState } from "react";
import { ChevronRight, Check, Compass, RotateCcw } from "lucide-react";
import { CarbonActivity } from "../types";
import { CARBON_INTENSITIES } from "../data";

interface QuizProps {
  onPrepopulateLogs: (activitiesToAdd: CarbonActivity[]) => void;
}

export default function LifestyleQuiz({ onPrepopulateLogs }: QuizProps) {
  const [step, setStep] = useState<number>(0); // 0 = not started, 1..4 = questions, 5 = summary result
  const [diet, setDiet] = useState<string>("meat_average");
  const [miles, setMiles] = useState<number>(20);
  const [electricity, setElectricity] = useState<string>("mixed"); // mixed, solar, standard
  const [thermostat, setThermostat] = useState<string>("balanced"); // economy, climate_heavy
  
  // Completed result calculations
  const calculateResultOffset = () => {
    let dietEmission = 30 * (CARBON_INTENSITIES[`diet_${diet}`] || 3.0); // monthly
    let transportEmission = 30 * (miles * CARBON_INTENSITIES.carGasoline_mile);
    
    let baseElectricitykWh = 320; 
    let factor = 1.0;
    if (electricity === "solar") factor = 0.15; 
    if (electricity === "mixed") factor = 0.6;
    let electricityEmission = baseElectricitykWh * factor * CARBON_INTENSITIES.electricity_kWh;

    let thermoOffset = thermostat === "economy" ? -40 : thermostat === "climate_heavy" ? 60 : 0;
    let totalPowerEmission = Math.max(20, electricityEmission + thermoOffset);

    return {
      diet: Math.round(dietEmission),
      transport: Math.round(transportEmission),
      energy: Math.round(totalPowerEmission),
      total: Math.round(dietEmission + transportEmission + totalPowerEmission)
    };
  };

  const results = calculateResultOffset();

  const handleApplyToDashboard = () => {
    // Generate initial baseline logs matching their parameters
    const baselineItems: CarbonActivity[] = [
      {
        id: `quiz-diet-${Date.now()}`,
        category: "food_waste",
        date: new Date().toISOString().split("T")[0],
        description: `Baseline Food Consumption (${diet.replace("_", " ")} diet)`,
        value: 30,
        co2e: results.diet,
        unit: "days"
      },
      {
        id: `quiz-trans-${Date.now()}`,
        category: "transport",
        date: new Date().toISOString().split("T")[0],
        description: `Car Commute Baseline (Avg ${miles} miles daily)`,
        value: miles * 30,
        co2e: results.transport,
        unit: "miles"
      },
      {
        id: `quiz-power-${Date.now()}`,
        category: "energy",
        date: new Date().toISOString().split("T")[0],
        description: `Monthly Home Power Baseline (${electricity} electricity)`,
        value: 320,
        co2e: results.energy,
        unit: "kWh"
      }
    ];

    onPrepopulateLogs(baselineItems);
    setStep(5); 
  };

  return (
    <div id="lifestyle-quiz-widget" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-left hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-center">
      
      {/* Quiz Introduction */}
      {step === 0 && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3.5">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-800 leading-snug">Assess Your Lifestyle Baseline</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Answer 4 simple questions about your regular habits to immediately estimate your starting carbon footprint baseline &amp; prepopulate log history.
          </p>
          <button
            onClick={() => setStep(1)}
            className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            Start Habit Quiz
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 1: Diet Selector */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-700">Question 1 of 4</span>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Lifestyle Diet</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Which of the following closely fits your primary diet choices?</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: "meat_heavy", title: "Heavy Meat Intake", text: "Beef or pork consumed almost daily" },
              { key: "meat_average", title: "Omnivore Balanced", text: "Moderate meats with poultry, dairy & grains" },
              { key: "vegetarian", title: "Vegetarian Lifestyle", text: "Egg and milk proteins, zero cut meat" },
              { key: "vegan", title: "Strict Plant Vegan", text: "100% plant foods and dairy-free alternatives" }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setDiet(opt.key)}
                className={`p-3 rounded-xl border text-left text-xs transition-all shadow-sm cursor-pointer ${
                  diet === opt.key
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold"
                    : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="font-bold text-slate-800">{opt.title}</div>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-tight">{opt.text}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Mobility */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-700">Question 2 of 4</span>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Travel Commuting</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">How many average miles do you drive in a gasoline-powered car daily?</h4>
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-slate-600">
              <span>0 miles (Transit / Bike)</span>
              <span className="text-emerald-750 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded font-mono">{miles} miles/day</span>
              <span>80+ miles</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={miles}
              onChange={(e) => setMiles(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[10px] text-slate-450 leading-relaxed">
              *If you commute strictly by walking, biking, electric scooters or trains, slide to 0.
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Power source */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-700">Question 3 of 4</span>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Household Grid</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">What is the primary power generation source for your household?</h4>
          
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "solar", title: "Renewable / Solar Micro Generation", text: "Generates using local rooftop panels, clean microgrids, or certified net-neutral plans." },
              { key: "mixed", title: "Standard Grid Blend", text: "Combines standard municipal utilities containing natural gas, hydro, and some regional solar/wind." },
              { key: "standard", title: "Industrial Fossil Standard Utilities", text: "Connected directly to standard coal or heavy gas regional grids with zero offsets." }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setElectricity(opt.key)}
                className={`p-3 rounded-xl border text-left text-xs transition-all shadow-sm cursor-pointer ${
                  electricity === opt.key
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold"
                    : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="font-bold text-slate-805 text-slate-800">{opt.title}</div>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-snug">{opt.text}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Thermostat controls */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-700">Question 4 of 4</span>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">HVAC Setpoint</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm">How do you manage your space cooling/heating thermostat generally?</h4>
          
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "economy", title: "Active Conservationist Eco", text: "Supports wider temperature ranges (cooler winter, warmer summer) to conserve energy cycles." },
              { key: "balanced", title: "Balanced Comfort Smart Setpoint", text: "Employs balanced smart scheduling or standard stable setpoints during occupied cycles." },
              { key: "climate_heavy", title: "Maximum Heating/Cooling", text: "Prioritizes immediate high-power temperature conditions constantly." }
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setThermostat(opt.key)}
                className={`p-3 rounded-xl border text-left text-xs transition-all shadow-sm cursor-pointer ${
                  thermostat === opt.key
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold"
                    : "border-slate-100 bg-white hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="font-bold text-slate-800">{opt.title}</div>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-snug">{opt.text}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            
            <button
              onClick={handleApplyToDashboard}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Calculate Baseline
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Completed result */}
      {step === 5 && (
        <div className="text-center py-4 space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold font-display text-slate-850">Baseline Calculated!</h3>
          
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-150 max-w-sm mx-auto">
            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest leading-none">Est. Starting Footprint</span>
            <span className="text-2xl font-bold font-display text-rose-600 tracking-tight block mt-1.5">
              {results.total} kg CO₂e /mo
            </span>
            <div className="flex justify-between text-[10px] font-medium text-slate-500 border-t border-slate-150/60 mt-3 pt-3">
              <span>Energy: {results.energy} kg</span>
              <span>Transport: {results.transport} kg</span>
              <span>Diet: {results.diet} kg</span>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-emerald-700 leading-normal">
            Baseline logs successfully appended to your analytics dashboard logs below!
          </p>

          <button
            onClick={() => setStep(0)}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        </div>
      )}

    </div>
  );
}
