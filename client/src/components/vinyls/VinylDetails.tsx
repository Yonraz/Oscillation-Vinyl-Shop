"use client";

import useRequest from "@/hooks/useRequest";
import { Vinyl } from "@/types/vinyl";
import VinylCard from "./VinylCard";
import ErrorList from "../errors/ErrorList";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Seperator from "../ui/Seperator";

export default function VinylDetails(props: { vinyl: Vinyl }) {
  const router = useRouter();
  const { vinyl } = props;
  const { sendRequest, isLoading, requestErrors } = useRequest();
  const placeOrder = async () => {
    const response = await sendRequest({
      url: "/api/orders",
      method: "post",
      body: {
        vinylId: vinyl.id,
      },
      onSuccess: (order) => router.push(`/orders/${order.id}`),
    });
  };
  return (
    <>
      <div className="flex flex-col items-center h-screen bg-neutral-800">
        <div className="md:flex max-h-fit w-1/2 bg-slate-100 rounded-md m-6">
          <div className="  max-w-full xl:h-[270px] lg:h-[250px] xs:h-auto bg-neutral-800 flex justify-center items-center md:rounded-l-md xs:rounded-t-md">
            <img
              src={vinyl.imageUrl}
              alt={vinyl.title}
              className={`object-fit md:rounded-l-md xs:rounded-t-md w-full h-full `}
            />
          </div>
          <div className="basis-1 grow max-h-[270px] flex flex-col justify-start xs:overflow-y-auto ">
            <div className="">
              <h2 className="ml-2 font-bold text-lg overflow-hidden whitespace-nowrap text-ellipsis">
                {vinyl.title}
              </h2>
              <Seperator />
              <p className="ml-2 text-neutral-500 font-extralight  mb-2">
                {vinyl.genre}
              </p>
              <div>
                <p className="ml-2 font-semibold">{vinyl.price}$</p>
                <Button className="button-primary w-full" onClick={placeOrder}>
                  Purchase
                </Button>
              </div>
            </div>
            <div className="whitespace-wrap font-light overflow-auto min-h-fit ">
              {vinyl.description}
            </div>
          </div>
        </div>
      </div>
      {requestErrors && <ErrorList errors={requestErrors} />}
    </>
  );
}
