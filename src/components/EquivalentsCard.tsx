import { Zap, Smartphone, Car, Award, ShieldAlert, Leaf } from "lucide-react";

interface EquivalentsCardProps {
  totalCO2: number;
  totalSavedCO2: number;
}

export default function EquivalentsCard({ totalCO2, totalSavedCO2 }: EquivalentsCardProps) {
  // Conversions based on EPA Greenhouse Gas Equivalencies Calculator
  const emittedPhones = Math.round(totalCO2 * 121.5);
  const emittedCarMiles = (totalCO2 * 2.47).toFixed(1);
  const emittedGallonsGas = (totalCO2 * 0.112).toFixed(2);

  // Equivalents for what we saved
  const savedTrashBags = Math.round(totalSavedCO2 * 0.155); 
  const savedLEDs = Math.round(totalSavedCO2 * 0.03); 
  const savedSeedlings = (totalSavedCO2 * 0.016).toFixed(3); 

  return (
    <div id="equivalents-dashboard" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 text-left">
      
      {/* Title block */}
      <div>
        <div className="flex items-center gap-2">
          <Award className="text-emerald-600 w-5 h-5 animate-pulse" />
          <h3 className="font-bold text-slate-800 text-lg font-display">Carbon Equivalency Metrics</h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Translating your footprint emissions and avoided offsets into human-scale tangible equivalents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Emissions impact comparison */}
        <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Your Emitted Footprint:
            </span>
            <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded border border-rose-150">
              {totalCO2.toFixed(1)} kg CO₂e
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Row 1 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-rose-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Smartphone className="w-4 h-4 text-rose-400" />
                <span>Smartphones fully charged</span>
              </div>
              <span className="font-bold text-slate-800">{emittedPhones.toLocaleString()} charges</span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-rose-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Car className="w-4 h-4 text-rose-400" />
                <span>Miles driven in passenger car</span>
              </div>
              <span className="font-bold text-slate-800">{emittedCarMiles} miles</span>
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-rose-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="w-4 h-4 text-rose-400" />
                <span>Gallons of gasoline burned</span>
              </div>
              <span className="font-bold text-slate-800">{emittedGallonsGas} gal</span>
            </div>
          </div>
        </div>

        {/* Right: Avoided environmental offsets */}
        <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              Avoided Offsets Saved:
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-150">
              -{totalSavedCO2.toFixed(1)} kg CO₂e
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Row 1 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-emerald-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>Seedlings grown for 10 years</span>
              </div>
              <span className="font-bold text-emerald-700">{savedSeedlings} seedlings</span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-emerald-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Trash bags of waste recycled</span>
              </div>
              <span className="font-bold text-slate-800">{savedTrashBags} bags</span>
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-emerald-100/50 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>LED bulbs run for a full year</span>
              </div>
              <span className="font-bold text-slate-800">{savedLEDs} bulbs</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
