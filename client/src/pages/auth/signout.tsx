"use client";

import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Signout() {
  const router = useRouter();
  const { sendRequest } = useRequest();
  useEffect(() => {
    async function sendSignoutRequest() {
      await sendRequest({
        url: "/api/users/signout",
        method: "post",
        onSuccess: () => {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        },
      });
    }
    sendSignoutRequest();
  }, []);
  return (
    <>
      <div className="flex  h-screen w-full justify-center items-center">
        <h1 className=" text-3xl font-bold">Signing Out...</h1>
        <LoadingSpinner />
      </div>
    </>
  );
}
