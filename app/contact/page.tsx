import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export const metadata = {
  title: "Contact Techbes | Bangalore Corporate IT Office",
  description: "Get in touch with Techbes corporate office in Nagarbhavi, Bangalore.",
};

export default function ContactPage() {
  const supportCards = [
    {
      icon: <Phone className="h-5 w-5 text-blue-600" />,
      title: "Call Us",
      detail: "+91 91644 87296",
      sub: "Available Mon-Sat, 9AM-7PM",
      link: "tel:+919164487296"
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      title: "Email Us",
      detail: "lohith@techbes.co.in",
      sub: "Expected response within 4 hours",
      link: "mailto:lohith@techbes.co.in"
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-600" />,
      title: "Corporate HQ",
      detail: "Nagarbhavi, Bangalore",
      sub: "1st Floor, Above SBI Bank",
      link: "https://maps.google.com/?q=12.9625,77.5155"
    }
  ];

  const faqs = [
    {
      q: "Where is the Techbes corporate office located?",
      a: "Our corporate office is located at 1st Floor, #962, Above SBI Bank, Near Deepa Complex, Papareddy Palya, 2nd Stage, Nagarbhavi, Bangalore – 560072."
    },
    {
      q: "How can I book an urgent IT installation?",
      a: "You can book directly through our online marketplace catalog or call lohith@techbes.co.in for customized corporate AMC audits."
    }
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
                Contact Us
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Get in Touch with Techbes
              </h1>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Connect with our IT infrastructure specialists. We offer structured cabling, data centre, surveillance, and AMC subscription audits.
              </p>
            </div>
          </section>

          {/* Support Cards */}
          <section className="grid gap-6 md:grid-cols-3">
            {supportCards.map((card, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-blue-600 w-fit">
                  {card.icon}
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{card.title}</h3>
                {card.link ? (
                  <a href={card.link} className="text-sm font-extrabold text-blue-600 hover:underline block truncate">
                    {card.detail}
                  </a>
                ) : (
                  <p className="text-sm font-extrabold text-slate-900">{card.detail}</p>
                )}
                <p className="text-[10px] text-slate-400 font-semibold">{card.sub}</p>
              </div>
            ))}
          </section>

          {/* Form & Map */}
          <section className="grid gap-6 md:grid-cols-2">
            
            {/* Form */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-50">Send Message</h2>
              <form className="space-y-4 text-xs font-semibold text-slate-650">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-slate-700">
                    Full Name
                    <Input className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20" placeholder="Your Name" required />
                  </label>
                  <label className="grid gap-1.5 text-slate-700">
                    Email address
                    <Input className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20" type="email" placeholder="email@example.com" required />
                  </label>
                </div>
                <label className="grid gap-1.5 text-slate-700">
                  Subject
                  <Input className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs focus:ring-blue-500/20" placeholder="e.g. CCTV setup request" required />
                </label>
                <label className="grid gap-1.5 text-slate-700">
                  Message
                  <textarea className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-slate-50" placeholder="Enter query parameters..." required />
                </label>
                <Button className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 shadow-sm w-full flex items-center justify-center gap-1.5">
                  Submit Support Ticket
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Address Details & Map link */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between gap-6">
              <div className="space-y-3.5 text-xs text-slate-600 font-semibold leading-relaxed">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-50">Corporate HQ</h2>
                <div className="flex gap-2.5 items-start">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-800">Techbes Address</h3>
                    <p className="mt-1 text-slate-500">
                      1st Floor, #962, Above SBI Bank,<br />
                      Near Deepa Complex, Papareddy Palya,<br />
                      2nd Stage, Nagarbhavi,<br />
                      Bangalore – 560072
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0" />
                  <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              {/* Map pin */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center flex flex-col items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600 animate-bounce" />
                <h3 className="text-xs font-bold text-slate-800">Nagarbhavi Office</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Above SBI Bank, Papareddy Palya</p>
                <a 
                  href="https://maps.google.com/?q=12.9625,77.5155" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
                >
                  Open in Google Maps <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </section>

          {/* Contact FAQs */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border-slate-50">
                  <AccordionTrigger className="text-xs font-bold text-slate-800 hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-slate-500">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

        </div>
      </div>
    </PageShell>
  );
}
