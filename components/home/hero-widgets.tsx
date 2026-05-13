"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/skeleton";

function Sparkline({ data = [3,5,4,7,6,9,8] }: { data?: number[] }){
  const points = data.map((d,i)=> `${i*(100/(data.length-1))},${100-(d*10)}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-14">
      <polyline points={points} fill="none" stroke="url(#g)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95" />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HeroWidgets(){
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const t = setTimeout(()=>setLoading(false), 600);
    return ()=>clearTimeout(t);
  },[]);

  return (
    <div className="w-full">
      <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="glass-card p-3">
              {loading ? (
                <Skeleton height={48} radius={12} />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Live bookings</div>
                    <div className="text-lg font-bold text-white">{Math.floor(20 + Math.random()*80)} active</div>
                  </div>
                  <div className="w-36">
                    <Sparkline />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-36">
            <div className="glass-card p-3 text-center">
              {loading ? <Skeleton height={44} radius={10} /> : (
                <>
                  <div className="text-xs text-muted-foreground">Technicians</div>
                  <div className="text-lg font-bold text-white">{Math.floor(200 + Math.random()*800)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <motion.div whileHover={{ y: -6 }} className="glass-card p-3 tilt" data-magnetic>
            {loading ? <Skeleton height={64} radius={12} /> : (
              <div>
                <div className="text-xs text-muted-foreground">Recent</div>
                <div className="mt-2 text-sm font-semibold text-white">AC Repair — Ravi Kumar • 12m ago</div>
                <div className="mt-3"><Sparkline data={[2,4,3,6,5,8,7]} /></div>
              </div>
            )}
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="glass-card p-3 tilt" data-magnetic>
            {loading ? <Skeleton height={64} radius={12} /> : (
              <div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className="mt-2 flex items-baseline gap-2"><div className="text-2xl font-bold text-white">98.7%</div><div className="text-xs text-muted-foreground">last 30 days</div></div>
                <div className="mt-3"><Sparkline data={[9,8,9,9,8,9,10]} /></div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }} className="mt-3">
          <div className="glass-card p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Notifications</div>
              <div className="text-sm text-white mt-1">You have <strong>3</strong> unassigned urgent tickets</div>
            </div>
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2563EB]/40 to-[#F97316]/20 animate-pulse-soft" />
              <Image src="/icons/bell.png" alt="bell" fill className="object-contain p-2" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
