"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { stagger, fadeIn } from "@/components/animations/motion-presets";

const reviews = [
  {name:'Ramesh', role:'Homeowner', text:'Great service, technician arrived on time and fixed AC quickly.', avatar:'/images/avatar-1.jpg'},
  {name:'Anita', role:'Working Professional', text:'Transparent pricing and excellent communication.', avatar:'/images/avatar-2.jpg'},
  {name:'Sanjay', role:'Business Owner', text:'Reliable and trusted technicians for our office needs.', avatar:'/images/avatar-3.jpg'},
];

export default function Testimonials(){
  const idx = useRef(0);
  useEffect(()=>{
    const t = setInterval(()=>{ idx.current = (idx.current+1)%reviews.length; const el = document.getElementById('testi-scroll'); if(el) el.scrollTo({left: idx.current* (el.clientWidth), behavior:'smooth'}); },4000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-2xl font-semibold text-foreground">What customers say</h3>
        <motion.div id="testi-scroll" variants={stagger} initial="hidden" whileInView="visible" className="mt-6 flex gap-4 overflow-hidden scroll-smooth">
          {reviews.map((r, i)=> (
            <motion.div key={i} variants={fadeIn} className="min-w-full rounded-2xl bg-muted p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <img src={r.avatar} className="h-12 w-12 rounded-full object-cover" alt={r.name} />
                <div>
                  <div className="font-semibold text-foreground">{r.name}</div>
                  <div className="text-sm text-muted-foreground">{r.role}</div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{r.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
