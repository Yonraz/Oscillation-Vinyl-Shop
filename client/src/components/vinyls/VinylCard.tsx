import { Vinyl } from "@/types/vinyl";
import Image from "next/image";

export default function VinylCard(props: { vinyl: Vinyl }) {
  const { vinyl } = props;
  return (
    <div key={vinyl.id}>
      <h2>{vinyl.title}</h2>
      <p>{vinyl.price}</p>
      <p>{vinyl.genre}</p>
      <p>{vinyl.description}</p>
      <Image src={vinyl.image} alt={vinyl.title} />
    </div>
  );
}
