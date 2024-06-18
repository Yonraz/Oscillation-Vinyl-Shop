import { getVinyls } from "@/api/get-vinyls";
import { Vinyl as VinylType } from "@/types/vinyl";
import { getVinylById } from "@/api/get-vinyl-by-id";
import VinylDetails from "@/components/vinyls/VinylDetails";
import { vinyls } from "@/app/dev/data/vinyls";
import { Suspense } from "react";
import LoadingVinyl from "@/components/loadingSpinner/LoadingVinyl";

const Vinyl = async ({ params }: { params: { vinylId: string } }) => {
  const vinyl: VinylType = await getVinylById(params.vinylId);
  return (
    <div>
      <Suspense fallback={<LoadingVinyl />}>
        {vinyl && <VinylDetails vinyl={vinyl} />}
        {!vinyl && <p>No vinyls found</p>}
      </Suspense>
    </div>
  );
};
export default Vinyl;
