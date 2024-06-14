"use client";
import Image from "next/image";

export default function Banner() {
  return (
    <>
      <div className="bg-custom-purple h-64 relative flex items-center ">
        <Image
          className="z-10 absolute top-0 left-0"
          src="/images/logo.png"
          alt="logo"
          width={270}
          height={270}
        />
        <div className="bg-slate-800 p-4 text-white text-center z-0 w-full">
          <h1 className="text-4xl">Welcome to Oscillation Vinyl Shop</h1>
          <p className="text-lg">The best place to buy records online</p>
        </div>
      </div>
    </>
  );
}
