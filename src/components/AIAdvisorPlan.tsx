import { useState } from "react";
import { CarbonActivity, AICarbonAdvice } from "../types";
import { Sparkles, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

interface AIAdvisorPlanProps {
  activities: CarbonActivity[];
  totalSavedCo2: number;
}

export default function AIAdvisorPlan({ activities, totalSavedCo2 }: AIAdvisorPlanProps) {
  const [advice, setAdvice] = useState<AICarbonAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Motivational ecofriendly steps on compilation
  const loadingStatements = [
    "Analyzing energy habits...",
    "Benchmarking local travel parameters...",
    "Compiling dietary carbon offsets...",
    "Formulating optimal reduction milestones...",
    "Finetuning your personalized implementation plan..."
  ];

  const handleFetchAdvice = async () => {
    setLoading(true);
    setAdvice(null);
    setLoadingStep(0);

    // Dynamic timer to cycle loading statements
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStatements.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activities,
          loggedActions: { count: activities.length, totalSaved: totalSavedCo2 }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to compile AI insights.");
      }

      const data: AICarbonAdvice = await response.json();
      setAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div id="ai-advisor-section" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-600 animate-pulse w-5 h-5" />
            <h3 className="font-bold text-slate-800 text-lg font-display">AI Carbon Advisor</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Get an instant, customized emission reduction implementation plan powered by Gemini AI.
          </p>
        </div>

        <button
          onClick={handleFetchAdvice}
          disabled={loading}
          className="flex items-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span>Analyzing ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Custom Guide Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state showing revolving green prompts */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
          <h4 className="text-sm font-bold text-slate-800 animate-pulse font-display">
            {loadingStatements[loadingStep]}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing your household log footprints to compile optimal tips.
          </p>
        </div>
      )}

      {/* If no plan has been queried yet, offer introductory card */}
      {!loading && !advice && (
        <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-slate-150 p-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-700 text-sm leading-tight font-display">Review Your Emissions Implementation Outline</h4>
          <p className="text-xs text-slate-450 text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Our intelligent adviser processes your logged energy consumption and transportation parameters to compose step-by-step carbon reduction milestones. Click the button above to begin.
          </p>
        </div>
      )}

      {/* Render AI Advisor Guide Plan outputs */}
      {advice && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Summary Box */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-105 border-emerald-100 flex gap-3">
            <div className="p-2 bg-emerald-105 bg-emerald-100 text-emerald-800 rounded-lg self-start border border-emerald-200/50">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-855 text-emerald-800 uppercase tracking-wider block">
                Sustainable Assessment
              </h4>
              <p className="text-xs text-slate-650 text-slate-700 mt-1 leading-relaxed font-sans">
                {advice.summary}
              </p>
            </div>
          </div>

          {/* Analysis & Priority Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Relative Impact Analysis
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mt-2 italic font-medium">
                "{advice.emissionProfileAnalysis}"
              </p>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  Weakest Category Check
                </span>
                <span className="text-sm font-bold text-rose-900 block mt-1 capitalize font-display">
                  ⚠️ Primary Target: {advice.weakestCategory.replace("_", " & ")}
                </span>
              </div>
              <p className="text-[11px] text-rose-700/80 mt-2 leading-relaxed font-semibold">
                This sustainability sector represents your highest current greenhouse intensity. Prioritize reduction exercises here first.
              </p>
            </div>
          </div>

          {/* Step-by-Step Implementation Goals */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block leading-none">
              🎯 Custom Carbon-Mitigation Implementation Milestones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advice.reductionPlan.map((goal, idx) => (
                <div key={`goal-${idx}`} className="p-4 bg-white rounded-xl border border-slate-150 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        goal.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        goal.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        {goal.difficulty}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-450 text-slate-400">
                        {goal.co2eSavedEstimate}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-800 text-xs sm:text-sm mb-3 font-display leading-tight">
                      {goal.title}
                    </h5>

                    <ul className="space-y-2">
                      {goal.steps.map((st, sidx) => (
                        <li key={`step-${sidx}`} className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-snug">
                          <ArrowRight className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Advice list */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              💡 Expert Quick-Win Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advice.personalizedTips.map((tip, idx) => (
                <div key={`tip-${idx}`} className="flex items-center gap-2 p-2.5 bg-slate-50/50 rounded-lg text-xs text-slate-650 border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
