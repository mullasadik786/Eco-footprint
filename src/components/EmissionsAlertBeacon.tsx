import { AlertTriangle, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface EmissionsAlertBeaconProps {
  totalCO2: number;
  targetEmission: number;
  onCommitEcoAction: (co2Amount: number, actionTitle: string) => void;
}

export default function EmissionsAlertBeacon({ 
  totalCO2, 
  targetEmission, 
  onCommitEcoAction 
}: EmissionsAlertBeaconProps) {
  
  const isHighEmissions = totalCO2 > targetEmission;
  const ratio = targetEmission > 0 ? (totalCO2 / targetEmission) * 100 : 100;
  
  // High-impact quick-wins that users can take to immediately compensate
  const fastReductionOffsets = [
    { title: "Swap Gasoline Commute with Bus/Transit", co2: 3.5, category: "transport" },
    { title: "Unplug Idle Display Consoles & Heavy Power Strips", co2: 1.2, category: "energy" },
    { title: "Switch Traditional Load to Line-Dry Clothes Rack", co2: 1.8, category: "energy" },
    { title: "Commit to a 100% Plant-Based Vegetable Stew", co2: 2.2, category: "diet" }
  ];

  return (
    <div 
      id="emissions-alert-beacon-panel"
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 p-6 shadow-sm hover:shadow-md text-left ${
        isHighEmissions 
          ? "bg-gradient-to-br from-rose-500/10 via-white to-rose-550/5 border-rose-200/80" 
          : "bg-gradient-to-br from-emerald-500/10 via-white to-emerald-550/5 border-emerald-200/80"
      }`}
    >
      {/* Background soft glow effects */}
      <div 
        className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isHighEmissions ? "bg-rose-500/10 animate-pulse" : "bg-emerald-500/15"
        }`}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Status Lights and Descriptive Explanations */}
        <div className="flex items-start gap-4 flex-1">
          {/* Glowing Status Light */}
          <div className="relative flex-shrink-0 mt-1">
            {isHighEmissions ? (
              // RED Beacon
              <div className="relative">
                {/* Outermost pulsing shock ring */}
                <div className="absolute inset-0 rounded-full bg-rose-500/50 animate-ping opacity-75" />
                {/* Secondary bloom ring */}
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-650 bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.85)] border-2 border-white"></span>
                </span>
              </div>
            ) : (
              // GREEN Beacon
              <div className="relative">
                {/* Outermost breathing bloom */}
                <span className="relative flex h-5 w-5">
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-650 bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.85)] border-2 border-white"></span>
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isHighEmissions 
                  ? "bg-rose-50 text-rose-700 border-rose-250/20" 
                  : "bg-emerald-50 text-emerald-700 border-emerald-250/20"
              }`}>
                {isHighEmissions ? "High Emission Alert Lamp" : "Low Emission Safe Lamp"}
              </span>
              <span className="text-slate-400 font-mono text-xs">
                Status: {ratio.toFixed(0)}% of limit
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 font-display tracking-tight pt-1">
              {isHighEmissions 
                ? "Carbon Footprint Exceeds Safe Threshold!" 
                : "Carbon Emissions Safely Conserved!"}
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              {isHighEmissions 
                ? `Alert: Your current accumulated footprint of ${totalCO2.toFixed(1)} kg CO₂e is ${Math.abs(totalCO2 - targetEmission).toFixed(1)} kg above your preferred target limit of ${targetEmission} kg. Complete daily eco-saving habits below to balance our ecosystems.` 
                : `Perfect Level: Your tracked greenhouse contribution of ${totalCO2.toFixed(1)} kg is securely regulated under your carbon limit of ${targetEmission} kg CO₂e. Keep practicing sustainable micro-habits!`}
            </p>
          </div>
        </div>

        {/* Right Side: High-contrast statistical comparison indicators */}
        <div className="flex items-center gap-6 bg-slate-50 border border-slate-150 p-4 rounded-xl flex-shrink-0">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Current</span>
            <span className={`text-xl font-bold font-mono block ${isHighEmissions ? "text-rose-600" : "text-slate-800"}`}>
              {totalCO2.toFixed(0)} kg
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Limit</span>
            <span className="text-xl font-bold font-mono text-slate-800 block">
              {targetEmission} kg
            </span>
          </div>
        </div>

      </div>

      {/* Recommended Compensating Environmental Actions */}
      {isHighEmissions && (
        <div className="mt-6 pt-5 border-t border-rose-150/40 bg-rose-50/20 rounded-xl p-4 border border-rose-100/50 animate-fade-in text-left">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-rose-500 w-4 h-4" />
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider font-display">
              Recommended High-Impact Carbon Compensation Habits
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
            Isolate emissions quickly! Click "Avoid Action" below to log these avoided carbon impacts. This immediately compensates for your high parameters and helps restore green status:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {fastReductionOffsets.map((opt, idx) => (
              <div 
                key={`offset-${idx}`}
                className="bg-white border border-rose-100 rounded-xl p-3 flex justify-between items-center hover:border-rose-250 hover:shadow-xs transition-all text-xs"
              >
                <div className="text-left pr-3">
                  <span className="font-bold text-slate-700 block text-xs leading-snug">
                    {opt.title}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide block mt-1">
                    -{opt.co2.toFixed(1)} kg CO₂ Avoided
                  </span>
                </div>
                <button
                  onClick={() => onCommitEcoAction(opt.co2, opt.title)}
                  className="flex-shrink-0 cursor-pointer flex items-center gap-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Avoid Action</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If within limit, provide congratulatory encouragement */}
      {!isHighEmissions && (
        <div className="mt-5 pt-4 border-t border-emerald-150/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-4 h-4" />
            <span className="text-xs font-bold text-emerald-800 font-display">
              Healthy Carbon Footprint Maintained!
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            💡 Green Beacon active. No immediate compensation necessary.
          </span>
        </div>
      )}

    </div>
  );
}
