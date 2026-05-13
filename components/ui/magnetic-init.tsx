"use client";

import { useEffect } from "react";

export default function MagneticInit() {
  useEffect(() => {
    const handlers = new Map<Element, (ev: PointerEvent) => void>();

    function attach(el: Element) {
      if (handlers.has(el)) return;
      const rect = () => (el as HTMLElement).getBoundingClientRect();
      const onMove = (e: PointerEvent) => {
        const r = rect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * 0.06; // sensitivity
        const dy = (e.clientY - cy) * 0.04;
        const rx = (dy * -0.08).toFixed(2);
        (el as HTMLElement).style.setProperty("--mx", `${dx.toFixed(1)}px`);
        (el as HTMLElement).style.setProperty("--my", `${dy.toFixed(1)}px`);
        (el as HTMLElement).style.setProperty("--mr", `${rx}deg`);
      };
      const onLeave = () => {
        (el as HTMLElement).style.setProperty("--mx", `0px`);
        (el as HTMLElement).style.setProperty("--my", `0px`);
        (el as HTMLElement).style.setProperty("--mr", `0deg`);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      handlers.set(el, onMove);
    }

    function scan() {
      document.querySelectorAll('[data-magnetic], [data-magnetic-btn]').forEach(attach);
    }

    scan();
    const obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      handlers.forEach((fn, el) => el.removeEventListener('pointermove', fn));
      handlers.clear();
    };
  }, []);

  return null;
}
