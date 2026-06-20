import { useState } from "react";
import { CarbonActivity, AICarbonAdvice } from "../types";
import { Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";

interface AIAdvisorPlanProps {
  activities: CarbonActivity[];
  totalSavedCo2: number;
}

export default function AIAdvisorPlan({ activities, totalSavedCo2 }: AIAdvisorPlanProps) {
  const [advice, setAdvice] = useState<AICarbonAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

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

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStatements.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      // Vercel Environment Variables నుండి కీ ని డైరెక్ట్‌గా రీడ్ చేస్తుంది
      const aiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyYourFallbackKeyIfAny";
      
      const ai = new GoogleGenAI({
        apiKey: aiKey
      });

      const actString = JSON.stringify(activities);
      const actionsString = JSON.stringify({ count: activities.length, totalSaved: totalSavedCo2 });

      const promptText = `
        You are an expert environmental carbon footprint strategist and sustainability advisor.
        User's Activity Footprint Logs: ${actString}
        User's Saved Carbon Reduction Actions: ${actionsString}
        Respond with a schema-aligned JSON object containing summary, weakestCategory, personalizedTips (array of 4 strings), reductionPlan (array of goals with title, difficulty, co2eSavedEstimate, steps), and emissionProfileAnalysis.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              weakestCategory: { type: Type.STRING },
              personalizedTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              reductionPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    co2eSavedEstimate: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "difficulty", "co2eSavedEstimate", "steps"]
                }
              },
              emissionProfileAnalysis: { type: Type.STRING }
            },
            required: ["summary", "weakestCategory", "personalizedTips", "reductionPlan", "emissionProfileAnalysis"]
          }
        }
      });

      const parsedData = JSON.parse(response.text?.trim() || "{}");
      setAdvice(parsedData);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      // ఒకవేళ కీ లేకపోతే ఫాల్‌బ్యాక్ ప్లాన్ లోడ్ అవుతుంది
      setAdvice({
        summary: "You are doing an excellent job tracking your carbon footprint. Energy and transport categories present the highest opportunities for carbon reduction.",
        weakestCategory: "transport",
        personalizedTips: [
          "Unplug appliances when not in use.",
          "Line-dry clothes to save electricity.",
          "Utilize public transit or active cycling.",
          "Switch to energy-efficient LED lighting."
        ],
        reductionPlan: [
          {
            title: "Optimize Home Power Consumption",
            difficulty: "Easy",
            co2eSavedEstimate: "100 kg CO2e/year",
            steps: ["Enable power saving modes", "Lower water heater settings", "Install smart plug strips"]
          }
        ],
        emissionProfileAnalysis: "Continuing to reduce active utility usage will significantly flatten your emission curves."
      });
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-600 animate-pulse w-5 h-5" />
            <h3 className="font-bold text-slate-800 text-lg">AI Carbon Advisor</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Get an instant, customized emission reduction implementation plan powered by Gemini AI.
          </p>
        </div>

        <button
          onClick={handleFetchAdvice}
          disabled={loading}
          className="flex items-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
        >
          {loading ? <span>Analyzing Profile...</span> : <span>Generate Custom Guide Plan</span>}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
          <h4 className="text-sm font-semibold text-slate-700 animate-pulse">{loadingStatements[loadingStep]}</h4>
        </div>
      )}

      {!loading && !advice && (
        <div className="text-center py-8 bg-slate-50/50 rounded-xl border p-6">
          <h4 className="font-bold text-slate-700 text-sm">Review Your Emissions Implementation Outline</h4>
          <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
            Click "Generate Custom Guide Plan" to begin.
          </p>
        </div>
      )}

      {advice && (
        <div className="space-y-6 text-left animate-fade-in">
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 flex gap-3">
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-widest">Sustainable Assessment</h4>
              <p className="text-xs text-slate-700 mt-1">{advice.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/50 rounded-xl border">
              <p className="text-xs text-slate-600 italic">"{advice.emissionProfileAnalysis}"</p>
            </div>
            <div className="p-4 bg-amber-50/30 rounded-xl border">
              <span className="text-sm font-bold text-slate-800">⚠️ Primary Target: {advice.weakestCategory}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">🎯 Milestones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advice.reductionPlan.map((goal, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500">{goal.co2eSavedEstimate}</span>
                  <h5 className="font-bold text-slate-800 text-sm my-2">{goal.title}</h5>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                    {goal.steps.map((st, sidx) => <li key={sidx}>{st}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
