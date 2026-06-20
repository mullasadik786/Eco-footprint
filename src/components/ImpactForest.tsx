interface ImpactForestProps {
  totalSavedCo2: number;
}

export default function ImpactForest({ totalSavedCo2 }: ImpactForestProps) {
  // 5 kg of CO2 saved = 1 virtual mature tree sprouted
  const matureTrees = Math.floor(totalSavedCo2 / 5);
  const remainingCo2PrTree = totalSavedCo2 % 5;
  const progressionPct = (remainingCo2PrTree / 5) * 100;

  return (
    <div id="forest-impact" className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
      {/* Background ambient circular highlights */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-400/20 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
        <div>
          <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-emerald-300/10">
            🌳 Climate Action Impact Forest
          </span>
          <h3 className="text-2xl font-black mt-3 leading-tight">
            Your Virtual Forest Grove
          </h3>
          <p className="text-teal-100 text-xs mt-1 leading-relaxed max-w-sm">
            Every 5.0 kg of CO₂e emission avoided sprouts another mature tree in your personal eco-landscape!
          </p>
        </div>

        {/* Tree Render Canvas */}
        <div className="my-6 min-h-[80px] flex items-end justify-center gap-4 border-b border-teal-400/20 pb-4">
          {totalSavedCo2 === 0 ? (
            <div className="flex flex-col items-center gap-1.5 text-center">
              {/* Seed / sprout SVG */}
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-300 animate-bounce">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.25c0 .41-.34.75-.75.75H11.5a.75.75 0 0 1-.75-.75V13h-1.5a.5.5 0 0 1-.35-.85l2.5-2.5c.2-.2.53-.2.73 0l2.5 2.5c.22.22.06.6-.25.6h-1.5v3.25z" />
              </svg>
              <p className="text-[11px] font-medium text-teal-200">
                Awaiting your first sustainable checklist task to plant a sprout!
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-end justify-center gap-3">
              {/* Render mature trees */}
              {Array.from({ length: Math.min(matureTrees, 8) }).map((_, i) => (
                <div key={`tree-${i}`} className="flex flex-col items-center animate-fade-in group relative" title="Mature Tree Sprouted! (5 kg saved)">
                  <svg viewBox="0 0 32 32" className="w-10 h-10 text-emerald-200 hover:scale-110 hover:text-green-300 transition-transform cursor-pointer">
                    <path fill="currentColor" d="M16 2L8 14h6v10h4V14h6L16 2z" />
                    <path fill="rgba(255, 255, 255, 0.4)" d="M16 6l5 8h-3v10h-4V14h-3l5-8zm-2 20h4v2h-4v-2z" />
                  </svg>
                  <span className="text-[9px] font-bold text-teal-100">Tree #{i+1}</span>
                </div>
              ))}

              {/* Sprout representing the progressing tree */}
              {progressionPct > 0 && (
                <div className="flex flex-col items-center animate-pulse" title={`Sprout growing! (${progressionPct.toFixed(0)}% to next tree)`}>
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-300">
                    <path fill="currentColor" d="M12 3a9 9 0 0 0-9 9c0 1.25.26 2.45.74 3.53a1 1 0 0 0 .91.59L12 16.25l7.35.87a1 1 0 0 0 .91-.59 9.002 9.002 0 0 0-6.26-13.53V3z" />
                    <rect x="11.25" y="16.25" width="1.5" height="4.5" fill="#f59e0b" rx="0.5" />
                  </svg>
                  <span className="text-[9px] font-bold text-amber-300">{progressionPct.toFixed(0)}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic statistics row */}
        <div className="flex justify-between items-center text-xs mt-2 border-t border-emerald-400/20 pt-3">
          <div>
            <span className="text-teal-200 block text-[10px] uppercase font-semibold">Avoided Carbon Emissions</span>
            <span className="text-xl font-black text-amber-300">{totalSavedCo2.toFixed(2)} kg CO₂e</span>
          </div>
          <div className="text-right">
            <span className="text-teal-200 block text-[10px] uppercase font-semibold">Estimated Trees Planted</span>
            <span className="text-xl font-black text-white">{matureTrees}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
