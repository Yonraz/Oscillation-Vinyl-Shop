"use client";
import { Vinyl } from "@/types/vinyl";
import Image from "next/image";
import Link from "next/link";
import Seperator from "../ui/Seperator";
import { useState } from "react";

export default function VinylCard(props: { vinyl: Vinyl }) {
  const { vinyl } = props;
  const [isMouseOver, setIsMouseOver] = useState(false);
  return (
    <div
      className="rounded-lg shadow-custom bg-white hover:cursor-pointer"
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <Link href={`/vinyls/[vinylId]`} as={`/vinyls/${vinyl.id}`}>
        <div className="max-w-full xl:h-[270px] lg:h-[250px] xs:h-auto bg-neutral-800 flex justify-center items-center rounded-t-lg">
          <img
            src={vinyl.imageUrl}
            alt={vinyl.title}
            className={`object-fit rounded-t-lg w-full h-full transition-all duration-150 ease-in-out ${
              isMouseOver ? "opacity-50" : "opacity-100"
            }`}
          />
          {isMouseOver && (
            <div className="text-white font-extralight text-2xl absolute">
              View Record
            </div>
          )}
        </div>
        <h2 className="font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis">
          {vinyl.title}
        </h2>
        <Seperator />
        <p className="text-neutral-500 font-extralight  mb-8">{vinyl.genre}</p>
        <p className=" font-semibold">{vinyl.price}$</p>
      </Link>
    </div>
  );
}
