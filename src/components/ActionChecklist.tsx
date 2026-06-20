import { SavedAction } from "../types";
import { DEFAULT_ACTIONS } from "../data";
import { Check, Bike, Sun, Utensils, Power, Thermometer, Train, Trash2, RotateCw, Leaf } from "lucide-react";

interface ActionChecklistProps {
  onAddSavedCarbon: (co2Amount: number, actionTitle: string) => void;
}

export default function ActionChecklist({ onAddSavedCarbon }: ActionChecklistProps) {
  
  // Icon selector helper
  const renderIcon = (iconName: string, category: string) => {
    const specs = "w-5 h-5";
    const colors = 
      category === "energy" 
        ? "text-amber-500" 
        : category === "transport" 
          ? "text-red-500" 
          : "text-emerald-500";
          
    switch (iconName) {
      case "Sun": return <Sun className={`${specs} ${colors}`} />;
      case "Bike": return <Bike className={`${specs} ${colors}`} />;
      case "Utensils": return <Utensils className={`${specs} ${colors}`} />;
      case "Power": return <Power className={`${specs} ${colors}`} />;
      case "Thermometer": return <Thermometer className={`${specs} ${colors}`} />;
      case "Train": return <Train className={`${specs} ${colors}`} />;
      case "Trash2": return <Trash2 className={`${specs} ${colors}`} />;
      case "RotateCw": return <RotateCw className={`${specs} ${colors}`} />;
      default: return <Leaf className={`${specs} ${colors}`} />;
    }
  };

  return (
    <div id="checklist-section" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="text-emerald-600 w-5 h-5" />
          <h3 className="font-bold text-slate-800 text-lg">Daily Eco Action Plan</h3>
        </div>
        <p className="text-xs text-slate-400">
          Click to log sustainable habits you did today to immediately reduce your carbon print count &amp; nurture the Virtual Forest.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {DEFAULT_ACTIONS.map((act) => (
          <div
            key={act.id}
            className="flex flex-col justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/20 hover:bg-slate-50/50 hover:border-slate-100 transition-all gap-4"
          >
            <div className="flex gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm self-start">
                {renderIcon(act.icon, act.category)}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                  {act.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100/40 pt-2.5">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                -{act.co2Saved.toFixed(2)} kg CO₂e
              </span>
              
              <button
                onClick={() => onAddSavedCarbon(act.co2Saved, act.title)}
                className="flex items-center gap-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
