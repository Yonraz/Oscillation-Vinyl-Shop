"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Banner() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const handleDragStart = (e: any) => {
    e.preventDefault();
  };
  const rotate = useTransform(x, [100, -100], [360, -360]);

  return (
    <>
      <div className=" bg-gradient-to-r from-indigo-400 to-slate-500 h-64 relative flex items-center ">
        <motion.div
          className={`hover:cursor-grab active:cursor-grabbing z-10 absolute `}
          style={{ x, y, rotate }}
          drag
          dragConstraints={{ left: -100, right: 100, top: -45, bottom: 45 }}
        >
          <Image
            onDragStart={handleDragStart}
            className={`z-10 relative hidden lg:block `}
            src="/images/logo.png"
            alt="logo"
            width={270}
            height={270}
          />
        </motion.div>
        <div className="bg-slate-800 p-4 text-white text-center z-0 w-full">
          <h1 className="text-4xl xs:text-2xl">
            Welcome to Oscillation Vinyl Shop
          </h1>
          <p className="text-lg">The best place to buy records online</p>
        </div>
        <div className="absolute top-3/4 text-center w-full">
          <h1 className="z-10  text-3xl font-extrabold">Explore Genres!</h1>
        </div>
      </div>
    </>
  );
}
