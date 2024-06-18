import { getVinyls } from "@/api/get-vinyls";
import { Vinyl } from "@/types/vinyl";
import VinylCard from "@/components/vinyls/VinylCard";
import { vinyls } from "@/app/dev/data/vinyls";
import { Genre } from "@/types/genre";
import ShowVinyls from "@/components/vinyls/ShowVinyls";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

const Vinyls = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  let { genre } = searchParams;
  const vinyls: Vinyl[] = await getVinyls();
  
  let vinylsToShow: Vinyl[] = vinyls;
  if (genre && genre in Genre) {
    vinylsToShow = vinyls.filter((vinyl) => vinyl.genre === genre);
  } else genre = undefined;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ShowVinyls vinyls={vinylsToShow} genre={genre as Genre} />
    </Suspense>
  );
};

export default Vinyls;
