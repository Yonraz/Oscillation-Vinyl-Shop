"use client";

import { getVinyls } from "@/api/get-vinyls";
import { Vinyl } from "@/types/vinyl";
import VinylCard from "./VinylCard";
import { Genre } from "@/types/genre";
import Select from "../ui/Select";
import { useRouter } from "next/navigation";

export default function ShowVinyls(props: {
  vinyls: Vinyl[];
  genre?: Genre | undefined;
}) {
  const { vinyls, genre } = props;
  const router = useRouter();
  return (
    <>
      <h1 className="mx-2 text-2xl">
        {genre ? `${genre} Records` : "Available Records"}
      </h1>
      <select
        className="mx-2"
        onChange={(e) => router.push(`/vinyls?genre=${e.currentTarget.value}`)}
      >
        <option value="">{genre ? `${genre}` : "All Genres"}</option>
        {Object.keys(Genre).map((key) => (
          <option key={key} value={key}>
            {/* @ts-ignore */}
            {Genre[key]}
          </option>
        ))}
      </select>
      {vinyls && (
        <div className="m-2 grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {vinyls.map((vinyl: Vinyl) => (
            <div>
              <VinylCard vinyl={vinyl} key={vinyl.id} />
            </div>
          ))}
        </div>
      )}
      {!vinyls && <p>No vinyls found</p>}
    </>
  );
}
