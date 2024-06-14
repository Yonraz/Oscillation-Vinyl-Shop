import { getVinyls } from "@/api/get-vinyls";
import { Vinyl } from "@/types/vinyl";
import VinylCard from "@/components/vinyls/VinylCard";

const Vinyls = async () => {
  const vinyls = await getVinyls();
  return (
    <div>
      <h1>Available Records</h1>
      {vinyls && (
        <div className=" grid grid-cols-5 ">
          {vinyls.map((vinyl: Vinyl) => (
            <VinylCard vinyl={vinyl} key={vinyl.id} />
          ))}
        </div>
      )}
      {!vinyls && <p>No vinyls found</p>}
    </div>
  );
};
export default Vinyls;
