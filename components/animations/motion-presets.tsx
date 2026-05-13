"use client";

import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
};

export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};

export const hoverLift: Variants = {
  hover: { y: -6, transition: { duration: 0.24, ease: [0.2, 0.8, 0.2, 1] } },
};

export const modalPreset: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.18 } },
};

export const floatGlow: Variants = {
  animate: { y: [0, -6, 0], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } },
};

export default { fadeIn, stagger, hoverLift, modalPreset, floatGlow };
