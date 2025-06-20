
"use client";

import { motion } from 'framer-motion'
import Link from "next/link";
import { useEffect, useRef, useState } from "react";


export default function InternalScroll() {

  const [isHovered, setIsHovered] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

  const scrollTargetRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isRightPanelScrollComplete, setIsRightPanelScrollComplete] = useState(false);
  const [isInFooterSection, setIsInFooterSection] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);



  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      const rightPanel = scrollTargetRef.current;
      const footer = footerRef.current;

      if (!rightPanel || !footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const footerInView = footerRect.top <= windowHeight * 0.1;
      const footerCompletelyPassed = footerRect.bottom < 0;

      if (footerInView && !footerCompletelyPassed) {
        setIsInFooterSection(true);

        const scrollTop = rightPanel.scrollTop;
        const scrollHeight = rightPanel.scrollHeight;
        const clientHeight = rightPanel.clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        const isAtTop = scrollTop <= 10;
        if (e.deltaY > 0) {
          if (!isAtBottom) {
            e.preventDefault();
            e.stopPropagation();
            rightPanel.scrollTop += e.deltaY;
            const newScrollTop = rightPanel.scrollTop;
            const newIsAtBottom = newScrollTop + clientHeight >= scrollHeight - 10;
            setIsRightPanelScrollComplete(newIsAtBottom);
          } else {
            setIsRightPanelScrollComplete(true);
            window.scrollBy(0, e.deltaY);
            e.preventDefault();
          }
        } else {
          if (isRightPanelScrollComplete && !isAtTop) {
            e.preventDefault();
            e.stopPropagation();
            rightPanel.scrollTop += e.deltaY;
            setIsRightPanelScrollComplete(false);
          } else if (!isAtTop && !isRightPanelScrollComplete) {
            e.preventDefault();
            e.stopPropagation();
            rightPanel.scrollTop += e.deltaY;
          } else {
            window.scrollBy(0, e.deltaY);
            e.preventDefault();
          }
        }
      } else {
        setIsInFooterSection(false);
        setIsRightPanelScrollComplete(false);

        if (!footerInView) {
          window.scrollBy(0, e.deltaY * 0.3);
          e.preventDefault();
        }

        if (footerCompletelyPassed) {
          rightPanel.scrollTop = 0;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isRightPanelScrollComplete]);

  useEffect(() => {
    const rightPanel = scrollTargetRef.current;
    if (!rightPanel) return;

    const handleScroll = () => {
      if (!isInFooterSection) return;

      const scrollTop = rightPanel.scrollTop;
      const scrollHeight = rightPanel.scrollHeight;
      const clientHeight = rightPanel.clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;

      setIsRightPanelScrollComplete(isAtBottom);
    };

    rightPanel.addEventListener("scroll", handleScroll);
    return () => rightPanel.removeEventListener("scroll", handleScroll);
  }, [isInFooterSection]);

  return (
    <>
    <footer ref={footerRef} className="h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
          className="flex h-screen px-70">
          <div
            onMouseEnter={() => !isScrolling && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-1/2 h-screen flex items-center relative"
          >
            <div className="absolute top-8 left-0 transform z-20">
              <p className="text-gray-300 text-5xl pb-5 font-extrabold  align-text">
              Explore your ideal career path with AI-powered guidance tailored to your interests and skills.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <p className="text-gray-300 text-sm font-light">May 2025</p>
                <p className="text-gray-300 text-sm font-light">Product</p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center text-sm px-3 py-3 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                >
                  Try now &gt;
                </Link>
              </div>
            </div>
            <img
              src="/fight-static.jpg"
              alt="Static Image"
              className={`w-[95%] h-[65%] pt-14 rounded object-cover transition-opacity duration-300 ${(isHovered && !isScrolling) ? 'opacity-0' : 'opacity-100'
                }`}
            />
            <img
              src="/fight.gif"
              alt="Animated GIF"
              className={`w-[95%] h-[65%] absolute top-1/2 left-[47%] pt-14 transform -translate-x-1/2 -translate-y-1/2 rounded object-cover transition-opacity duration-300 ${(isHovered && !isScrolling) ? 'opacity-100' : 'opacity-0'
                }`}
            />
          </div>
          <div
            ref={scrollTargetRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="w-1/2 h-[90vh] overflow-y-auto scrollbar-hidden"
          >
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start w-[65%]">
                <p className="font-bold text-3xl">
                Get personalized job suggestions and roadmaps aligned with your goals and programming languages.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
              <img
                src="/waves.jpg"
                alt="Wave"
                className="h-[15vh] w-[15vh] rounded-2xl object-cover"
              />
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start">
                <p className="font-bold text-3xl">
                Our intelligent system identifies roles that suit your learning style, tools, and experience level.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start w-[65%]">
                <p className="font-bold text-3xl">
                Discover top career tracks in AI, software, data science, design, and more—with real-world relevance.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
              <img
                src="/ai.jpg"
                alt="Wave"
                className="h-[15vh] w-[15vh] rounded-2xl object-cover"
              />
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start w-[65%]">
                <p className="font-bold text-3xl">
                Track your journey step-by-step—from learning resources to projects to landing your first job.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
              <img
                src="/dolly.jpg"
                alt="Wave"
                className="h-[15vh] w-[15vh] rounded-2xl object-cover"
              />
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start w-[65%]">
                <p className="font-bold text-3xl">
                Match with in-demand roles based on current tech trends and the future job market.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
              <img
                src="/girl.jpg"
                alt="Wave"
                className="h-[15vh] w-[15vh] rounded-2xl object-cover"
              />
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start">
                <p className="font-bold text-3xl">
                Let AI analyze your skills and suggest what to learn next to boost your job readiness.

                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start w-[65%]">
                <p className="font-bold text-3xl">
                Let AI analyze your skills and suggest what to learn next to boost your job readiness.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
              <img
                src="/code.jpg"
                alt="Wave"
                className="h-[15vh] w-[15vh] rounded-2xl object-cover"
              />
            </div>
            <hr className='border-gray-300' />
            <div className="h-[24vh] text-gray-300 flex items-center justify-between px-4 ">
              <div className="flex flex-col justify-start w-[65%]">
                <p className="font-bold text-3xl">
                Confused between frontend, backend, or ML? Get clarity with dynamic role-fit analysis.
                </p>
                <div className="flex items-center gap-4 pt-3">
                  <p className="text-sm font-light">May 2025</p>
                  <p className=" text-sm font-light">Product</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-sm px-3 py-2 bg-gray-300 text-gray-950 rounded-full hover:bg-white transition leading-none"
                  >
                    Try now &gt;
                  </Link>
                </div>
              </div>
              <img
                src="/camel.jpg"
                alt="camel"
                className="h-[15vh] w-[15vh] rounded-2xl object-cover"
              />
            </div>
            <hr className='border-gray-300' />
          </div>
        </motion.div>
        </footer>
        </>
  );
}