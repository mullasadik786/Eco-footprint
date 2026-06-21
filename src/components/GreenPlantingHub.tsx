import { useState } from "react";
import { TreeDeciduous, Sprout, Heart, Compass, CheckCircle2, Award, Sparkles, PlusCircle } from "lucide-react";

interface GreenPlantingHubProps {
  onCommitOffset: (co2Amount: number, actionTitle: string) => void;
}

interface PlantType {
  id: string;
  name: string;
  scientific: string;
  co2SequestrationKgPerYear: number;
  bestUse: "Indoor" | "Outdoor Shade" | "Backyard/Avenue";
  description: string;
  iconColor: string;
  difficulty: "Easy" | "Medium" | "Expert";
}

export default function GreenPlantingHub({ onCommitOffset }: GreenPlantingHubProps) {
  // Array of scientifically grounded carbon mitigation plant categories
  const plantCatalog: PlantType[] = [
    {
      id: "mature_tree",
      name: "Deciduous Broadleaf Tree",
      scientific: "Acer / Quercus spp.",
      co2SequestrationKgPerYear: 22.0,
      bestUse: "Backyard/Avenue",
      description: "A mature broadleaf tree absorbs standard high capacity carbon, releasing dense daily cooling vapor.",
      iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/30",
      difficulty: "Medium"
    },
    {
      id: "bamboo_bush",
      name: "Fast-Growing Giant Bamboo",
      scientific: "Bambusa vulgaris",
      co2SequestrationKgPerYear: 12.0,
      bestUse: "Outdoor Shade",
      description: "Generates massive dense fiber fast, releasing up to 35% more oxygen than standard tree stands.",
      iconColor: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/30",
      difficulty: "Easy"
    },
    {
      id: "garden_shrub",
      name: "Azalea & Rhododendron Shrub",
      scientific: "Ericaceae shrub",
      co2SequestrationKgPerYear: 4.8,
      bestUse: "Outdoor Shade",
      description: "Blossoming thicket that structures rich garden biosystems, purifying local urban ground carbon dioxide.",
      iconColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/30",
      difficulty: "Easy"
    },
    {
      id: "snake_plant",
      name: "Snake Plant (Mother-in-law's Tongue)",
      scientific: "Sansevieria trifasciata",
      co2SequestrationKgPerYear: 1.5,
      bestUse: "Indoor",
      description: "Resilient household plant that converts carbon dioxide at night, cleaning out continuous indoor ozone particles.",
      iconColor: "text-lime-600 bg-lime-50 dark:bg-lime-950/40 border border-lime-200/30",
      difficulty: "Easy"
    }
  ];

  // Quantities currently designed
  const [quantities, setQuantities] = useState<Record<string, number>>({
    mature_tree: 1,
    bamboo_bush: 2,
    garden_shrub: 3,
    snake_plant: 4
  });

  const [activeSpecies, setActiveSpecies] = useState<PlantType>(plantCatalog[0]);
  const [hasCommittedState, setHasCommittedState] = useState<Record<string, boolean>>({});

  const handleUpdateQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const nextVal = Math.max(0, current + delta);
      return { ...prev, [id]: nextVal };
    });
  };

  // Compute total forecasted yearly offset values
  const totalAnnualSequestration = plantCatalog.reduce((acc, plant) => {
    const qty = quantities[plant.id] || 0;
    return acc + (plant.co2SequestrationKgPerYear * qty);
  }, 0);

  // Users can commit a monthly portion of this annual offset capacity to their balance sheet
  const handleCommitPledge = (plant: PlantType) => {
    const totalQty = quantities[plant.id] || 0;
    if (totalQty === 0) {
      alert("Please increase quantity to at least 1 before pledging your plant!");
      return;
    }
    
    // Monthly portion = (annual sequestration / 12 months) * quantity
    const monthlyOffset = (plant.co2SequestrationKgPerYear / 12) * totalQty;
    
    onCommitOffset(monthlyOffset, `Growing ${totalQty}x ${plant.name}`);
    
    setHasCommittedState(prev => ({
      ...prev,
      [plant.id]: true
    }));

    setTimeout(() => {
      setHasCommittedState(prev => ({
        ...prev,
        [plant.id]: false
      }));
    }, 4000);
  };

  return (
    <div 
      id="green-planting-hub-card"
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
    >
      {/* Banner Area with Generated Beautiful Illustration */}
      <div className="relative h-56 sm:h-64 md:h-76 w-full overflow-hidden bg-emerald-900">
        <img 
          src="/src/assets/images/reforestation_awareness_1782010452921.jpg" 
          alt="Reforestation Awareness and Collective Organic Growth" 
          className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          id="planting-hub-hero-banner"
        />
        {/* Sleek Dark Gradient overlay for premium legible typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-left">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-1 rounded-full w-max shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-100 animate-spin" />
              <span>Plant Growth & Awareness Hub</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight leading-tight">
              Mitigate Carbon Footprints by Growing Green Ecosystems
            </h2>
            <p className="text-xs text-emerald-200/90 leading-relaxed font-sans font-medium">
              Every leaf absorbs active carbon. Plant native flora in your residential garden, urban balcony, or community groves to naturally draw down surrounding greenhouse gases.
            </p>
          </div>
        </div>
      </div>

      {/* Main Feature Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* Left Side: Interactive Carbon Sequestration Estimator Tool */}
        <div className="lg:col-span-7 p-6 space-y-5 text-left">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display">
                Botanical Sequestration Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your active botanical items and calculate natural offset rates.
              </p>
            </div>
            {/* Visual badge */}
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-xl px-3.5 py-1.5 text-center shadow-xs">
              <span className="text-[9px] uppercase font-bold text-emerald-600 block tracking-wider leading-none">Forecast Offset</span>
              <span className="text-sm font-bold font-mono text-emerald-700 mt-1 block">
                -{totalAnnualSequestration.toFixed(1)} kg/yr
              </span>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {plantCatalog.map((plant) => {
              const qty = quantities[plant.id] || 0;
              const contribution = plant.co2SequestrationKgPerYear * qty;

              return (
                <div 
                  key={plant.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    qty > 0 
                      ? "bg-slate-50/50 border-slate-200 shadow-xs" 
                      : "bg-white border-slate-100 opacity-60"
                  }`}
                >
                  {/* Plant Identity Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl ${plant.iconColor} flex-shrink-0`}>
                      <Sprout className="w-5 h-5 animate-bounce" style={{ animationDuration: `${3 + Math.random() * 3}s` }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm leading-tight truncate">
                          {plant.name}
                        </span>
                        <span className="text-[9px] font-mono font-medium text-slate-400 italic">
                          {plant.scientific}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 leading-snug block mt-0.5 description-clamp">
                        {plant.description}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-1.5 bg-emerald-50 w-max px-2 py-0.5 rounded-md border border-emerald-100/50">
                        Sequestration: {plant.co2SequestrationKgPerYear} kg/year each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Actions & Pledge button */}
                  <div className="flex sm:flex-col items-end gap-3.5 justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 flex-shrink-0">
                    {/* Controls row */}
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleUpdateQty(plant.id, -1)}
                        className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-sm shadow-xs"
                        title="Reduce quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold font-mono text-sm text-slate-800">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(plant.id, 1)}
                        className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-sm shadow-xs"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Pledge mini action */}
                    <button
                      onClick={() => handleCommitPledge(plant)}
                      disabled={qty === 0}
                      className={`w-full sm:w-auto text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        qty === 0 
                          ? "bg-slate-50 text-slate-400 border border-slate-200/50 cursor-not-allowed"
                          : hasCommittedState[plant.id]
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      }`}
                    >
                      {hasCommittedState[plant.id] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pledged!</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Log Pledge</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Educational Species Information Carousel / Deep Dive */}
        <div className="lg:col-span-5 p-6 bg-slate-50/30 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display">
                High-Performance Oxygen Ecosystems
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select species below to learn how botanical organisms optimize carbon-mitigation.
              </p>
            </div>

            {/* Quick selectors pills */}
            <div className="flex flex-wrap gap-1.5">
              {plantCatalog.map((plant) => (
                <button
                  key={`btn-${plant.id}`}
                  onClick={() => setActiveSpecies(plant)}
                  className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                    activeSpecies.id === plant.id
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {plant.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* In-depth educational detail panel card */}
            <div className="bg-white border border-slate-150 p-4.5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {activeSpecies.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 italic">
                    {activeSpecies.scientific}
                  </p>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-md">
                  {activeSpecies.bestUse}
                </span>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed font-medium space-y-2">
                <p>{activeSpecies.description}</p>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carbon absorption capacity:</span>
                    <span className="font-bold text-slate-700">{activeSpecies.co2SequestrationKgPerYear.toFixed(1)} kg / yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Survival Difficulty rating:</span>
                    <span className="font-bold text-teal-600 font-mono uppercase tracking-wider text-[10px]">{activeSpecies.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Urban microclimate value:</span>
                    <span className="font-bold text-amber-600 text-[10px]">High Cooling & Shade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100/70 mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Award className="text-amber-500 w-4.5 h-4.5" />
              <h4 className="text-xs font-bold text-slate-800 font-display">
                Did you know?
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              A single urban plot planting of 5 trees can completely neutralize your household's baseline digital, cloud storage, or lighting carbon imprint. Bring home a green leaf today to create active oxygen lungs!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
