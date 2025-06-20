"use client";

import Link from "next/link";
import InternalScroll from '@/components/InternalScroll';
import HorizontalScrollText from "@/components/HorizontalScrollGallery";

export default function Home() {

  return (
    <div className="bg-gray-950 min-h-screen">
      <header className="text-center">
        <div>
          <h1 className="pt-25 pb-6 font-bold text-7xl text-blue-500">
            Career AI
          </h1>
          <p className="text-gray-300 text-[1.5rem]">
            -Improvise your career experience and achieve the job you enjoy
          </p>
        </div>
        <div className="flex flex-col gap-5 pt-6 ">
          <div className="flex flex-row gap-4 mx-auto w-fit">
            <Link
              href="/"
              className="inline-flex items-left px-4 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-100 transition"
            >
              <span className="mr-2">✦</span> Ask AI about your career
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-100 transition"
            >
              <span className="mr-2">⌕</span> Search the job for you
            </Link>
            <Link
              href="/"
              className="inline-flex items-right px-4 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-100 transition"
            >
              <span className="mr-2">🛠</span> Build Resume
            </Link>
          </div>
          <div className="flex flex-row gap-4 mx-auto w-fit">
            <Link
              href="/"
              className="inline-flex items-left px-4 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-100 transition"
            >
              <span className="mr-2">
                <>&lt; &gt;</>
              </span>{" "}
              your Build
            </Link>
            <Link
              href="/"
              className="inline-flex items-right px-4 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-100 transition"
            >
              <span className="mr-2">[ ◉¯]</span> Creata a image
            </Link>
          </div>
          <div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-400 text-black rounded-full hover:bg-gray-100 transition"
            >
              <span className="mr-2">🗒</span> Learn about carrer ai
            </Link>
          </div>
        </div>
      </header>
      <hr className="border-t border-gray-500 my-20 w-[105rem] mx-auto" />
      <footer>
        <InternalScroll/>
      </footer>
        <div className="h-[100vh]">
          <HorizontalScrollText/>
        </div>
      </div>
  );
}