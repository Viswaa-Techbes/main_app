"use client"
import { motion } from "framer-motion"

export default function SkeletonPremium({ className = "", style = {} }: { className?: string; style?: any }) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className={`w-full rounded-xl bg-gradient-to-r from-white/6 via-white/10 to-white/6 ${className}`}
      style={style}
    />
  )
}
