"use client";

import useRequest from "@/hooks/useRequest";
import { Vinyl } from "@/types/vinyl";
import VinylCard from "./VinylCard";
import ErrorList from "../errors/ErrorList";
import { useRouter } from "next/navigation";

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
      <div className=" grid grid-cols-5 ">
        <VinylCard vinyl={vinyl} key={vinyl.id} />
        <button onClick={placeOrder}>Purchase</button>
      </div>
      {requestErrors && <ErrorList errors={requestErrors} />}
    </>
  );
}
