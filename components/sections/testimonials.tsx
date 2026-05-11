"use client";

import Image from "next/image";

export function Testimonials() {
  const items = [
    { name: "Sanjay R.", title: "IT Manager, Retail", quote: "Techbes reduced our downtime by 72% — reliable technicians and clear SLAs.", avatar: "/faces/face-1.jpg" },
    { name: "Priya M.", title: "Facilities Head", quote: "Booked AMC for 30 sites with predictable outcomes and transparent pricing.", avatar: "/faces/face-2.jpg" },
    { name: "Rohan K.", title: "Operations Lead", quote: "The onsite team diagnostics are top-notch — fast, professional, and accountable.", avatar: "/faces/face-3.jpg" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Trusted by operations teams</h3>
        <h2 className="mt-3 text-3xl font-extrabold text-foreground">What field teams and managers say</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.name} className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden">
                <Image src={it.avatar} alt={it.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{it.name}</p>
                <p className="text-xs text-foreground/60">{it.title}</p>
                <blockquote className="mt-3 text-sm text-foreground/80">“{it.quote}”</blockquote>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
