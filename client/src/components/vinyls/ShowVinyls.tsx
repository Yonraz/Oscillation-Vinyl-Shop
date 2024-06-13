"use client";

import { getVinyls } from "@/api/get-vinyls";
import { Vinyl } from "@/types/vinyl";
import VinylCard from "./VinylCard";

export default async function ShowVinyls(props: { vinyls: Vinyl[] }) {
  const { vinyls } = props;
  return (
    <div>
      <h1>Available Vinyls</h1>
      <ul>
        {vinyls.map((vinyl) => (
          <VinylCard vinyl={vinyl} />
        ))}
      </ul>
    </div>
  );
}
