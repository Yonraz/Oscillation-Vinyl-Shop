import { getVinyls } from "@/api/get-vinyls";
import { Vinyl as VinylType } from "@/types/vinyl";
import { getVinylById } from "@/api/get-vinyl-by-id";
import VinylDetails from "@/components/vinyls/VinylDetails";
import { vinyls } from "@/app/dev/data/vinyls";

const Vinyl = async ({ params }: { params: { vinylId: string } }) => {
  // const vinyl: VinylType = await getVinylById(params.vinylId);
  const vinyl = vinyls.find((vinyl) => vinyl.id === parseInt(params.vinylId));
  return (
    <div>
      {vinyl && <VinylDetails vinyl={vinyl} />}
      {!vinyl && <p>No vinyls found</p>}
    </div>
  );
};
export default Vinyl;
