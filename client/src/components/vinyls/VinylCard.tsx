"use client";
import { Vinyl } from "@/types/vinyl";
import Image from "next/image";
import Link from "next/link";

export default function VinylCard(props: { vinyl: Vinyl }) {
  const { vinyl } = props;
  return (
    <div key={vinyl.id}>
      <img src={vinyl.imageUrl} alt={vinyl.title} />
      <h2>{vinyl.title}</h2>
      <p>{vinyl.price}</p>
      <p>{vinyl.genre}</p>
      <p>{vinyl.description}</p>
      <button>
        <Link href={`/vinyls/[vinylId]`} as={`/vinyls/${vinyl.id}`}>
          View Vinyl
        </Link>
      </button>
    </div>
  );
}
