export interface CarbonActivity {
  id: string;
  category: 'energy' | 'transport' | 'food_waste';
  date: string;
  description: string;
  value: number; // numerical value tracked (e.g. kWh, km, days)
  co2e: number; // calculated CO2 equivalent in kg
  unit: string; // e.g. kWh, miles, flights, meals
}

export interface SavedAction {
  id: string;
  title: string;
  description: string;
  category: 'energy' | 'transport' | 'food_waste';
  co2Saved: number; // kg saved per action
  icon: string;
}

export interface ActionLog {
  id: string;
  actionId: string;
  date: string;
  times: number;
  totalSaved: number; // co2Saved * times
}

export interface AIPlanGoal {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  co2eSavedEstimate: string;
  steps: string[];
}

export interface AICarbonAdvice {
  summary: string;
  weakestCategory: string;
  personalizedTips: string[];
  reductionPlan: AIPlanGoal[];
  emissionProfileAnalysis: string;
}
