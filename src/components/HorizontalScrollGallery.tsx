// HorizontalScrollPage.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import EndSection from "@/components/EndSection";

export default function HorizontalScrollPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const isEndInView = useInView(endRef, { once: true, amount: 0.5 });

  const [scrollHeight, setScrollHeight] = useState(0);
  const [shiftX, setShiftX] = useState("0px");

  useLayoutEffect(() => {
    const updateMetrics = () => {
      if (!containerRef.current || !contentRef.current) return;
      const contentWidth = contentRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const shift = contentWidth - viewportWidth;
      const dynamicHeight = shift + viewportHeight;

      setScrollHeight(dynamicHeight);
      setShiftX(`-${shift}px`);
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0px", shiftX]);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const sentence = [
    { text: "AI-powered career", color: "text-purple-500" },
    { text: " guidance at your fingertips", color: "text-white" }
  ];

  return (
    <>
      <section
        ref={containerRef}
        style={{ height: `${scrollHeight}px` }}
        className="relative bg-black"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <motion.div
            ref={contentRef}
            className="flex whitespace-nowrap pl-[10vw] pr-[10vw]"
            style={{ x }}
          >
            {sentence.map(({ text, color }, i) => (
              <span key={i} className={`flex ${color}`}>
                {text.split("").map((letter, index) => (
                  <AnimatedLetter
                    key={`${i}-${index}`}
                    letter={letter}
                    delay={(i * 10 + index) * 0.03}
                  />
                ))}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full origin-left"
            style={{ scaleX }}
          />
        </motion.div>
      </section>

      <section ref={endRef} className="h-screen flex items-center justify-center">
        <EndSection shouldAnimate={isEndInView} />
      </section>
    </>
  );
}

function AnimatedLetter({ letter, delay }: { letter: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: "some", once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="text-[9vw] font-extrabold tracking-tight"
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}
