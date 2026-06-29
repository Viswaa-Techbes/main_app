import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Heart, Award, Cpu, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

export const metadata = {
  title: "About Us | Techbes",
  description: "Learn about the mission, vision, and certified team behind Techbes IT Marketplace.",
};

export default function AboutPage() {
  const stats = [
    { label: "Bookings Fulfilled", value: "12,000+" },
    { label: "OEM Certified Techs", value: "250+" },
    { label: "Average Review Rating", value: "4.9 / 5" },
    { label: "Metro Cities Covered", value: "10" }
  ];

  const coreValues = [
    {
      icon: <Heart className="h-5 w-5 text-blue-600" />,
      title: "Customer Obsession",
      desc: "We align every SLA check and pricing worksheet to guarantee transparency and hassle-free tech management."
    },
    {
      icon: <Award className="h-5 w-5 text-blue-600" />,
      title: "OEM Vetted Standards",
      desc: "Our technicians undergo background verification and OEM manufacturer audits before receiving customer calls."
    },
    {
      icon: <Cpu className="h-5 w-5 text-blue-600" />,
      title: "Technology Driven",
      desc: "Automated real-time dispatch, worksheet invoice tracking, and digital completion validation guarantee compliance."
    }
  ];

  const team = [
    { name: "Rahul Deshmukh", role: "Co-Founder & CEO", origin: "Ex-Cisco Systems" },
    { name: "Meera Nair", role: "Head of Operations", origin: "Ex-Urban Company" },
    { name: "Amit Patel", role: "Chief Technology Officer", origin: "Ex-Razorpay Engineer" }
  ];

  return (
    <PageShell>
      <div className="bg-slate-50/30 min-h-screen py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Banner */}
          <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_50%)] pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex rounded-full bg-white/10 px-3.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-300">
                Our Story
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                We Keep India's IT Infrastructures Up and Running
              </h1>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Techbes is the premier on-demand marketplace connecting commercial offices, IT parks, and residential spaces with audited, certified engineers.
              </p>
            </div>
          </section>

          {/* Story & Vision */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6.5 space-y-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Our Vision</h2>
              <p className="text-xs leading-relaxed text-slate-500 font-semibold">
                To transform IT infrastructure repair and maintenance into a structured, predictable utility. No hidden service charges, unvetted contractor visits, or delayed SLAs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6.5 space-y-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Our Mission</h2>
              <p className="text-xs leading-relaxed text-slate-500 font-semibold">
                Empowering small businesses and households to resolve CCTV surveillance setup, access controls, network cabling, and hardware maintenance within 4 hours.
              </p>
            </div>
          </section>

          {/* Statistics Strip */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((st, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
                <p className="text-2xl font-black text-blue-600">{st.value}</p>
                <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{st.label}</p>
              </div>
            ))}
          </section>

          {/* Why Techbes Core Values */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Our Core Operating Values</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {coreValues.map((val, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-6.5 shadow-sm space-y-3">
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-blue-600 w-fit">
                    {val.icon}
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{val.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 font-semibold">{val.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="py-8 space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Leadership Team</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {team.map((member, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm space-y-3">
                  <div className="h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg mx-auto">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{member.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{member.role}</p>
                    <p className="text-[9px] text-blue-600 font-extrabold mt-1">{member.origin}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Audited certifications */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6.5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Enterprise Stack & Integrations</h2>
            <p className="text-xs leading-relaxed text-slate-500 font-semibold">
              Our platform orchestrates jobs using Node.js backend controllers, Razorpay Checkout SDKs, Leaflet Geolocation proxies, and Next.js SSR interfaces. Every connected field partner holds certifications across leading OEM brands like Cisco, Ubiquiti, Hikvision, and D-Link.
            </p>
          </section>

          {/* CTA Banner */}
          <section className="bg-slate-900 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.15),transparent_40%)] pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-md mx-auto">
              <h2 className="text-xl font-extrabold tracking-tight">Outsource Your Network Setup Today</h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Connect with our certified specialist team. Browse list categories and book instant troubleshooting services.
              </p>
              <Button asChild className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-sm">
                <Link href="/services">Get Started Now</Link>
              </Button>
            </div>
          </section>

        </div>
      </div>
    </PageShell>
  );
}
