import { SavedAction, CarbonActivity } from "./types";

// Dynamic carbon calculators based on standard environmental metrics
export const CARBON_INTENSITIES = {
  electricity_kWh: 0.412, // kg CO2e per kWh of grid electricity
  naturalGas_therm: 5.3,  // kg CO2e per therm of natural gas
  carGasoline_mile: 0.404, // kg CO2e per mile driven in regular car
  carGasoline_km: 0.251,   // kg CO2e per km driven in regular car
  flight_hour: 250,       // kg CO2e per hour of flight
  publicTransit_km: 0.045, // kg CO2e per km on trains/buses
  diet_meat_heavy: 4.5,     // kg CO2e per day
  diet_meat_average: 3.0,   // kg CO2e per day
  diet_vegetarian: 1.7,     // kg CO2e per day
  diet_vegan: 1.2           // kg CO2e per day
};

export const DEFAULT_ACTIONS: SavedAction[] = [
  {
    id: "act-1",
    title: "Line-dry laundry",
    description: "Hang clothes to dry naturally instead of using an electric dryer.",
    category: "energy",
    co2Saved: 0.60,
    icon: "Sun"
  },
  {
    id: "act-2",
    title: "Eco commute (Cycle or Walk)",
    description: "Replace a short drive with healthy walking or cycling.",
    category: "transport",
    co2Saved: 0.40, // per km or average trip
    icon: "Bike"
  },
  {
    id: "act-3",
    title: "Meatless Day",
    description: "Switch heavy meals to vegetarian or vegan recipes today.",
    category: "food_waste",
    co2Saved: 1.80,
    icon: "Utensils"
  },
  {
    id: "act-4",
    title: "Standby shutdown",
    description: "Completely unplug non-active TVs, computers, and chargers.",
    category: "energy",
    co2Saved: 0.15,
    icon: "Power"
  },
  {
    id: "act-5",
    title: "Smart Thermostat Turn",
    description: "Set thermostat 1-2 degrees lower in winter or higher in summer.",
    category: "energy",
    co2Saved: 0.90,
    icon: "Thermometer"
  },
  {
    id: "act-6",
    title: "Utilize Public Transit",
    description: "Take the bus or train instead of driving your car.",
    category: "transport",
    co2Saved: 1.20,
    icon: "Train"
  },
  {
    id: "act-7",
    title: "Zero Waste Food Prep",
    description: "Plan meals perfectly to ensure absolutely nothing gets discarded.",
    category: "food_waste",
    co2Saved: 0.50,
    icon: "Trash2"
  },
  {
    id: "act-8",
    title: "Recycling Hub Sort",
    description: "Carefully sort and clean plastic bottles, cardboard, and metals.",
    category: "food_waste",
    co2Saved: 0.35,
    icon: "RotateCw"
  }
];

export const INITIAL_ACTIVITIES: CarbonActivity[] = [
  {
    id: "tr-1",
    category: "energy",
    date: "2026-06-15",
    description: "Monthly Home Electricity (Grid Connection)",
    value: 180,
    co2e: 74.16, // 180 * 0.412
    unit: "kWh"
  },
  {
    id: "tr-2",
    category: "transport",
    date: "2026-06-16",
    description: "Weekly Office Highway Commuting",
    value: 120,
    co2e: 48.48, // 120 * 0.404
    unit: "miles"
  },
  {
    id: "tr-3",
    category: "food_waste",
    date: "2026-06-17",
    description: "Average Meat Diet (Weekly Baseline)",
    value: 7,
    co2e: 21.0, // 7 * 3.0
    unit: "days"
  },
  {
    id: "tr-4",
    category: "transport",
    date: "2026-06-18",
    description: "Weekend Regional Flight",
    value: 1.5,
    co2e: 375.0, // 1.5 * 250
    unit: "hours"
  }
];
