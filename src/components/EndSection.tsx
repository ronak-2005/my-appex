"use client";

import { motion,useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EndSection({ shouldAnimate = false }) {
  const [firstVisit, setFirstVisit] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const visitedBefore = sessionStorage.getItem("visited");
      if (visitedBefore) {
        setFirstVisit(false);
      } else {
        sessionStorage.setItem("visited", "true");
        setFirstVisit(true);
      }
    }
  }, []);

  useEffect(() => {
    if (shouldAnimate) {
      (async () => {
        await controls.start({
          opacity: 1,
          y: 0,
          rotateX: 180,
          transition: { duration: 0.6, delay: 1 },
        });
        await controls.start({
          rotateX: 0,
          transition: { duration: 0.8, ease: "easeInOut", delay: 0.4 },
        });
      })();
    }
  }, [shouldAnimate, controls]);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {/* Background Shapes */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full top-[60%] left-[-60px] z-0 bg-gradient-to-tr from-green-400 to-teal-500 shadow-xl"
        style={{ transformOrigin: "center" }}
        animate={shouldAnimate ? { rotate: 360 } : false}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      />

      <motion.div
        className="absolute top-[25%] left-[13%] z-0"
        style={{
          width: 0,
          height: 0,
          borderLeft: "50px solid transparent",
          borderRight: "50px solid transparent",
          borderBottom: "80px solid #f472b6",
        }}
        animate={shouldAnimate ? { rotate: 360 } : false}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      />

      <motion.div
        className="absolute w-32 h-32 rotate-45 bg-blue-500 top-[48%] rounded-2xl left-[56%] z-0 shadow-lg"
        animate={shouldAnimate ? { rotate: 360 } : false}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      />

      <motion.svg
        className="absolute w-25 h-25 top-[13%] left-[75%] z-0"
        viewBox="0 0 100 100"
        animate={shouldAnimate ? { rotate: 360 } : false}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
      >
        <polygon
          points="50,5 95,35 78,90 22,90 5,35"
          fill="#facc15"
          strokeWidth="0"
        />
      </motion.svg>

      <motion.svg
        className="absolute w-25 h-25 top-[73%] left-[89%] z-0"
        viewBox="0 0 100 100"
        animate={shouldAnimate ? { rotate: 360 } : false}
        transition={{ duration: 55, ease: "linear", repeat: Infinity }}
      >
        <polygon
          points="50,5 95,35 78,90 22,90 5,35"
          fill="#9867E5"
          strokeWidth="0"
        />
      </motion.svg>
      {/* Center Blue Square */}
      <motion.div
        className="absolute w-28 h-19 bg-gradient-to-tr from-cyan-400 to-sky-600 z-10 top-[38%] left-[32%] rounded-tl-xl rounded-br-xl shadow-lg"
        style={{ transformOrigin: "center" }}
        animate={shouldAnimate ? { rotate: 360 } : false}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      />

      {/* Main Title */}
      <div className="z-20 relative flex flex-wrap items-center justify-center text-white text-5xl md:text-7xl font-extrabold gap-2">
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Start
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 40 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Your
        </motion.span>
        <motion.span
      initial={{ opacity: 0, y: 40, rotateX: 180 }}
      animate={controls}
      className="bg-purple-600 text-white px-4 py-2 rounded-md font-bold text-[2.5rem] md:text-[4rem] origin-center"
    >
      Journey
    </motion.span>
      </div>

      {/* Subtext with rotating diamond */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="text-lg md:text-2xl text-gray-300 max-w-2xl mt-6 z-20 flex items-center justify-center flex-wrap gap-2"
      >
        Discover your perfect role with Career AI — from the journey to exploration,
        <motion.span
          className="inline-block w-5 h-5 bg-yellow-300 rotate-45 shadow-sm"
          animate={shouldAnimate ? { rotate: 360 } : false}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
        tailored to your skills, goals, and interests.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 2 }}
        className="mt-10 z-20 flex gap-4"
      >
        <Link
          href="/start"
          className="bg-green-400 hover:bg-green-300 text-black font-bold py-3 px-6 rounded-full transition"
        >
          Get Started
        </Link>
        <Link
          href="/learn"
          className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded-full transition"
        >
          Learn More
        </Link>
      </motion.div>

      {/* Developer Credit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 0.4 } : {}}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-6 text-sm text-gray-400 z-20"
      >
        Made by Ronak Chaturvedi •{' '}
        <a href="https://github.com/ronak-2005" className="underline">
          GitHub
        </a>
      </motion.div>
    </section>
  );
}
