import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Target, 
  Lightbulb, 
  Users, 
  Award, 
  Network, 
  Database, 
  ShieldCheck, 
  Video, 
  ShoppingBag, 
  Wrench, 
  Flame, 
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle,
  ThumbsUp,
  Cpu
} from "lucide-react";

import { getSeoMetadata } from "@/lib/seo-helpers";

export const metadata = getSeoMetadata({
  title: "About TechBes | Corporate IT Solutions in Bangalore",
  description:
    "Learn about TechBes, Bangalore's leading IT infrastructure solutions provider. We specialize in CCTV, networking, data centers, and corporate AMC.",
  path: "/about",
});

export default function AboutPage() {
  const values = [
    {
      icon: <Lightbulb className="h-5 w-5 text-blue-600" />,
      title: "Innovation",
      desc: "We embrace innovation as the driving force behind progress. We continuously explore new technologies, methodologies, and ideas to deliver innovative solutions that empower our clients to thrive in a rapidly evolving digital landscape."
    },
    {
      icon: <Target className="h-5 w-5 text-blue-600" />,
      title: "Customer Focus",
      desc: "We are dedicated to understanding and exceeding the needs and expectations of our clients. We prioritize customer satisfaction, listening attentively to their feedback, and continuously improving our solutions and services to deliver maximum value."
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Collaboration",
      desc: "We believe in the power of collaboration to achieve shared goals and objectives. We foster a culture of collaboration, teamwork, and mutual respect, leveraging the diverse talents and expertise of our team to deliver exceptional results for our clients."
    },
    {
      icon: <Award className="h-5 w-5 text-blue-600" />,
      title: "Excellence",
      desc: "We are committed to excellence in everything we undertake. We strive for excellence in the quality of our solutions, the professionalism of our services, and the satisfaction of our clients, setting the benchmark for industry standards."
    }
  ];

  const servicesOffer = [
    {
      icon: <Network className="h-5 w-5 text-blue-600" />,
      title: "Network Infrastructure Solutions",
      desc: "We design, implement, and manage secure and reliable network infrastructures, including LAN, WAN, wireless networks, and SD-WAN solutions, to ensure seamless connectivity and communication."
    },
    {
      icon: <Database className="h-5 w-5 text-blue-600" />,
      title: "Data Centre Solutions",
      desc: "We provide end-to-end data centre solutions, including design, deployment, optimization, and management, to optimize performance, reliability, and security while reducing operational costs."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-blue-600" />,
      title: "Security Solutions",
      desc: "Our security solutions encompass network security, endpoint security, data protection, and compliance services to safeguard businesses against evolving cyber threats and ensure regulatory compliance."
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Collaboration Solutions",
      desc: "We offer collaboration solutions such as unified communications, video conferencing, and collaboration platforms to enhance communication and collaboration among teams, regardless of their location."
    },
    {
      icon: <Video className="h-5 w-5 text-blue-600" />,
      title: "CCTV Solutions",
      desc: "Our CCTV solutions include the design, installation, and maintenance of closed-circuit television systems to enhance security and surveillance capabilities, ensuring the safety of premises and assets."
    },
    {
      icon: <ShoppingBag className="h-5 w-5 text-blue-600" />,
      title: "System Sales and Services",
      desc: "We provide system sales and services for a wide range of IT infrastructure components, including servers, storage, networking equipment, and security appliances, ensuring businesses have access to high-quality technology solutions tailored to their needs."
    },
    {
      icon: <Wrench className="h-5 w-5 text-blue-600" />,
      title: "Annual Maintenance Contracts (AMC)",
      desc: "Our AMC services offer proactive maintenance, support, and optimization of IT infrastructure components, ensuring maximum uptime, performance, and reliability while minimizing downtime and disruption to business operations."
    },
    {
      icon: <Flame className="h-5 w-5 text-blue-600" />,
      title: "Fire Alarm System",
      desc: "Ensure the safety of your employees and assets with our advanced fire alarm systems, designed for early detection and rapid response to potential fire hazards."
    }
  ];

  const whyChooseUs = [
    {
      title: "Expertise",
      desc: "Our team of highly skilled and certified professionals possesses extensive expertise in designing, implementing, and managing complex IT infrastructure solutions."
    },
    {
      title: "Innovation",
      desc: "We leverage the latest technologies and best practices to deliver innovative solutions that drive business transformation and competitive advantage."
    },
    {
      title: "Reliability",
      desc: "We are committed to delivering reliable and scalable IT infrastructure solutions that meet the evolving needs of our clients and exceed their expectations."
    },
    {
      title: "Customer-centric Approach",
      desc: "We prioritize customer satisfaction and strive to build long-term relationships based on trust, transparency, and integrity."
    },
    {
      title: "Tailored Solutions",
      desc: "We understand that every business is unique, which is why we tailor our solutions to address the specific challenges and objectives of each client."
    }
  ];

  const majorClients = [
    "Kia",
    "Justdial",
    "Debts Recovery Appellate Tribunals (DRATs)",
    "Blue Dart",
    "Azuga (Bridgestone)",
    "Amazon Warehouse",
    "Ingram Micro"
  ];

  const channelPartners = [
    "Lenovo", "TP-Link", "Cisco", "Dell", "Red Hat", "Secureye", "CP Plus", "D-Link", "HP", "Microsoft", "Bosch", "Dahua", "Hikvision", "Honeywell"
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
                Company Profile
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
                Empowering Businesses Through Robust IT Infrastructure
              </h1>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Techbes is a leading IT infrastructure solutions provider committed to delivering cutting-edge technology solutions tailored to meet the unique needs of businesses.
              </p>
            </div>
          </section>

          {/* Overview */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overview</h2>
            <p className="text-xs leading-relaxed text-slate-650 font-semibold">
              Techbes is a leading IT infrastructure solutions provider committed to delivering cutting-edge technology solutions tailored to meet the unique needs of businesses across various industries. With a focus on innovation, reliability, and customer satisfaction, we strive to empower organizations to thrive in the digital era through robust and scalable IT infrastructure.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-2.5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-4 w-4 text-blue-600" /> Our Mission
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 font-semibold">
                To deliver cutting-edge technology solutions tailored to meet the unique needs of businesses, empowering organizations to thrive in the digital era through robust and scalable IT infrastructure.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-2.5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" /> Our Vision
              </h2>
              <p className="text-xs leading-relaxed text-slate-500 font-semibold">
                To drive strategic direction and focus areas for achieving sustainable growth and delivering value to our clients, partners, and stakeholders with innovation, reliability, and excellence.
              </p>
            </div>
          </section>

          {/* Our Values */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((val) => (
                <div key={val.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-2 text-blue-600 w-fit">
                      {val.icon}
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{val.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500 font-semibold">{val.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Objectives */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Our Objectives</h2>
            <p className="text-xs leading-relaxed text-slate-505 font-semibold leading-relaxed">
              At Techbes, our objectives serve as guiding principles that drive our actions and decisions, ensuring alignment with our mission and vision. These objectives define our strategic direction and focus areas for achieving sustainable growth and delivering value to our clients, partners, and stakeholders.
            </p>
          </section>

          {/* Services We Offer */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Services We Offer</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {servicesOffer.map((srv) => (
                <div key={srv.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex gap-4">
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-blue-600 shrink-0 h-fit">
                    {srv.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{srv.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500 font-semibold">{srv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Techbes */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Why Choose Techbes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyChooseUs.map((item, idx) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2.5">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">0{idx + 1}</span>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500 font-semibold">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trust Credentials (E-E-A-T) */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">E-E-A-T Certified Trust & Business Credentials</h2>
            <div className="grid gap-4 sm:grid-cols-3 pt-2 text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">100% Verified Experts</h3>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                  Every field technician undergoes thorough police background validation, safety training, and holds professional certifications in system integration.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Workmanship Guarantee</h3>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                  TechBes provides a 30-day post-service warranty on all manual terminations, mount structures, and wring paths, ensuring high stability.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4.5 w-4.5 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">SLA Enterprise Operations</h3>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                  We maintain strict Service Level Agreements (SLAs) with corporate partners, guaranteeing defined turnaround times on AMC breakdown diagnostics.
                </p>
              </div>
            </div>
          </section>

          {/* Major Clients */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Our Major Clients</h2>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-75">
              {majorClients.map((client) => (
                <span key={client} className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{client}</span>
              ))}
            </div>
          </section>

          {/* Channel Partners */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">Our Channel Partners</h2>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-60">
              {channelPartners.map((partner) => (
                <span key={partner} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{partner}</span>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-slate-900 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.15),transparent_40%)] pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-md mx-auto">
              <h2 className="text-xl font-extrabold tracking-tight">Experience the Power of Technology</h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Contact us today to learn more about our IT infrastructure solutions and how we can help your business thrive in the digital age.
              </p>
              <Button asChild className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-sm">
                <Link href="/contact">Contact Techbes</Link>
              </Button>
            </div>
          </section>

        </div>
      </div>
    </PageShell>
  );
}
