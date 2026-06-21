import { useState, useEffect } from "react";
import { Trophy, Flame, CheckCircle, RefreshCcw, Award } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "energy" | "transport" | "food_waste";
  potentialSavings: number; // kg CO2e
  difficulty: "Easy" | "Medium" | "Hard";
  tasks: string[];
}

const CHALLENGES_POOL: Challenge[] = [
  {
    id: "ch-1",
    title: "The Air-Dry Champion",
    description: "Wash your clothes and air-dry or line-dry them 100% naturally today. Avoid the energy-intensive heat dryer cycles completely.",
    category: "energy",
    potentialSavings: 1.8,
    difficulty: "Easy",
    tasks: ["Wash laundry with cold water", "Hang dry on a rack or clothesline", "Avoid using the tumble dryer"]
  },
  {
    id: "ch-2",
    title: "100% Car-Free Commuter",
    description: "Leave your car parked in the driveway. Complete all of today's errands and travel utilizing bicycles, active walking, or transit links.",
    category: "transport",
    potentialSavings: 3.5,
    difficulty: "Medium",
    tasks: ["Walk or cycle for trips under 2 miles", "Utilize train, light rail, or bus lines", "Zero single-occupancy gasoline driving"]
  },
  {
    id: "ch-3",
    title: "Plant-Powered Sovereign",
    description: "Commit to eating strictly plant-based meals (breakfast, lunch, and dinner) without any beef, pork, poultry, or dairy proteins.",
    category: "food_waste",
    potentialSavings: 2.9,
    difficulty: "Medium",
    tasks: ["Oatmeal or plant-protein breakfast", "Grain bowl or vegetarian lunch veggie dish", "Completely animal-product-free dinner"]
  },
  {
    id: "ch-4",
    title: "The Vampire Power Purge",
    description: "Hunt down and totally isolate standby power draw. Unplug charger transformers, unused media boards, and appliance adapters before sleeping.",
    category: "energy",
    potentialSavings: 0.8,
    difficulty: "Easy",
    tasks: ["Unplug active idle display monitors", "Uncouple phone chargers left in empty wall outlets", "Switch off heavy power strip toggles completely"]
  },
  {
    id: "ch-5",
    title: "Zero-Food-Waste Planner",
    description: "Turn leftover ingredients and partial food reserves into a beautiful resource recipe. Throw absolutely zero food organic remains into standard trash bins.",
    category: "food_waste",
    potentialSavings: 1.5,
    difficulty: "Easy",
    tasks: ["Inspect refrigerator for near-date items", "Compose a creative 'leftovers stew or salad'", "Compost non-consumables if necessary"]
  },
  {
    id: "ch-6",
    title: "Climate Moderate Comfort",
    description: "Dial down HVAC systems. Keep air-conditioning thermostats at 78°F (25°C) or higher, or heating systems at 68°F (20°C) or lower for the cycle.",
    category: "energy",
    potentialSavings: 2.2,
    difficulty: "Hard",
    tasks: ["Adjust home thermostat by 2 degrees toward ambient climate", "Utilize natural window cross-ventilation or warm sweaters", "Keep automated system setpoint restricted for 24 hours"]
  }
];

interface DailyChallengeProps {
  onAwardOffset: (co2Saved: number, challengeTitle: string) => void;
}

export default function DailyChallenge({ onAwardOffset }: DailyChallengeProps) {
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([false, false, false]);
  const [hasCompletedChallenge, setHasCompletedChallenge] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("challenge_streak");
      return stored ? parseInt(stored, 10) : 3; 
    } catch {
      return 3;
    }
  });

  const activeChallenge = CHALLENGES_POOL[challengeIdx];

  useEffect(() => {
    localStorage.setItem("challenge_streak", streakCount.toString());
  }, [streakCount]);

  const toggleTask = (index: number) => {
    if (hasCompletedChallenge) return;
    const next = [...completedTasks];
    next[index] = !next[index];
    setCompletedTasks(next);
  };

  const handleClaimReward = () => {
    if (hasCompletedChallenge) return;
    setHasCompletedChallenge(true);
    setStreakCount((prev) => prev + 1);
    onAwardOffset(activeChallenge.potentialSavings, `Daily Challenge: ${activeChallenge.title}`);
  };

  const handleDrawNewChallenge = () => {
    const nextIdx = (challengeIdx + 1) % CHALLENGES_POOL.length;
    setChallengeIdx(nextIdx);
    setCompletedTasks([false, false, false]);
    setHasCompletedChallenge(false);
  };

  const allTasksChecked = completedTasks.every((val) => val === true);

  return (
    <div id="daily-challenge-pane" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full space-y-5 text-left hover:shadow-md transition-all duration-300">
      
      {/* Challenge Title Banner */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full w-fit uppercase tracking-wider border border-amber-100">
            <Trophy className="w-3.5 h-3.5" />
            <span>Daily Saver Challenge</span>
          </div>
          <h3 className="text-base font-bold font-display text-slate-800 tracking-tight mt-2.5 leading-tight">
            {activeChallenge.title}
          </h3>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1 bg-rose-50 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-100 flex-shrink-0" title="Daily challenge streak count">
          <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
          <span>{streakCount} Day Streak</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        {activeChallenge.description}
      </p>

      {/* Checklist list */}
      <div className="space-y-2 p-1 bg-slate-50/80 rounded-xl border border-slate-100">
        {activeChallenge.tasks.map((task, idx) => (
          <button
            key={`task-${idx}`}
            onClick={() => toggleTask(idx)}
            disabled={hasCompletedChallenge}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-xs transition-all ${
              completedTasks[idx]
                ? "bg-emerald-50 border border-emerald-100 text-emerald-800 font-semibold"
                : "bg-white hover:bg-slate-50 border border-slate-100/50 text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all ${
                completedTasks[idx]
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-300 text-transparent"
              }`}>
                ✓
              </span>
              <span>{task}</span>
            </div>
            {completedTasks[idx] && <span className="text-[10px] text-emerald-600 font-bold">Done</span>}
          </button>
        ))}
      </div>

      {/* Goal Summary Reward Claim */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3.5 border-t border-slate-100">
        <div className="self-start sm:self-auto">
          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Reward Offset</span>
          <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide font-display">
            -{activeChallenge.potentialSavings.toFixed(1)} kg CO₂e Saved
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleDrawNewChallenge}
            className="p-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all"
            title="Shuffle a new target challenge"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>

          {hasCompletedChallenge ? (
            <div className="flex-1 sm:flex-none py-2.5 px-4 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Claimed</span>
            </div>
          ) : (
            <button
              onClick={handleClaimReward}
              disabled={!allTasksChecked}
              className="flex-1 sm:flex-none py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <Award className="w-4 h-4" />
              <span>Claim Savings</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
