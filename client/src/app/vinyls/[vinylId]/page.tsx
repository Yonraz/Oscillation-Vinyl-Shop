import { getVinyls } from "@/api/get-vinyls";
import { Vinyl as VinylType } from "@/types/vinyl";
import { getVinylById } from "@/api/get-vinyl-by-id";
import VinylDetails from "@/components/vinyls/VinylDetails";

const Vinyl = async ({ params }: { params: { vinylId: string } }) => {
  const vinyl: VinylType = await getVinylById(params.vinylId);
  return (
    <div>
      <h1>{vinyl.title}</h1>
      {vinyl && <VinylDetails vinyl={vinyl} />}
      {!vinyl && <p>No vinyls found</p>}
    </div>
  );
};
export default Vinyl;
