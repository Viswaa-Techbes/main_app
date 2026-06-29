export function Brands() {
  const brandNames = ["Cisco", "Ubiquiti", "Hikvision", "Honeywell", "CP Plus", "TP-Link", "Dell", "HP"];

  return (
    <section className="py-10 bg-white rounded-3xl border border-slate-100 px-6 shadow-sm">
      <div className="text-center max-w-sm mx-auto mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trusted Integration Partners</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
        {brandNames.map((name) => (
          <span 
            key={name} 
            className="text-sm font-extrabold text-slate-400 hover:text-slate-800 tracking-wider uppercase transition-colors select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
