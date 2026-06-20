export default function EquivalentsCard({ energyCO2, transportCO2 }: any) {
  return <div className="p-6 bg-[#0b1411] border border-emerald-950 rounded-2xl text-left">Equivalents Card Loaded ({energyCO2 + transportCO2} kg)</div>;
}
