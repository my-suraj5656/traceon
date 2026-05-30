"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { IMAGES } from "@/lib/media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GlobalBackground() {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isJourney = pathname.startsWith("/diamond/");

  const targetOpacity = isHome ? 0.60 : isJourney ? 0.10 : 0.10;

  useGSAP(() => {
    if (isHome) {
      gsap.fromTo(".global-bg-diamond",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.60, duration: 2, ease: "power2.out",
          onComplete: () => {
            ScrollTrigger.create({
              trigger: "body",
              start: `${window.innerHeight * 0.7}px top`,
              end: `${window.innerHeight * 1.2}px top`,
              scrub: 1,
              onUpdate: (self) => {
                gsap.set(".global-bg-diamond", {
                  opacity: 0.60 - (0.60 - 0.10) * self.progress,
                });
              },
            });
          }
        }
      );
    } else {
      gsap.fromTo(".global-bg-diamond",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: targetOpacity, duration: 2, ease: "power2.out" }
      );
    }
  }, { scope: container, dependencies: [targetOpacity] });

  return (
    <div ref={container} className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
       <div className="global-bg-diamond relative w-[800px] md:w-[1200px] h-full flex items-center justify-center opacity-0">
           <img
             src={IMAGES.transparentDiamond}
             alt="Background Diamond"
             className="w-full h-auto max-h-[120vh] object-contain drop-shadow-[0_0_80px_rgba(165,215,232,0.6)]"
           />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-sky-blue/20 blur-[120px] rounded-full" />
       </div>
    </div>
  );
}
