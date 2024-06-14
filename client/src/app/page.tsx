"use client";
import Banner from "@/components/banner/Banner";
import Carousel from "@/components/carousel/Carousel";
import ShowVinyls from "@/components/vinyls/ShowVinyls";
import { useUser } from "@/context/user-context";
import { vinyls } from "./dev/data/vinyls";
import VinylCard from "@/components/vinyls/VinylCard";
import Image from "next/image";
import { Vinyl } from "@/types/vinyl";
import { Genre } from "@/types/genre";

const Home = () => {
  const { currentUser } = useUser();
  return (
    <>
      <Banner />
      <Carousel>
        {Object.keys(Genre).map((genre) => (
          <div key={genre}>
            <h2>{genre}</h2>
          </div>
        ))}
      </Carousel>
    </>
  );
};
export default Home;
