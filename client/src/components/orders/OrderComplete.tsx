"use client";

import useRequest from "@/hooks/useRequest";
import Link from "next/link";
import { useEffect } from "react";

export default function OrderComplete({
  orderId,
  sessionId,
}: {
  orderId: string;
  sessionId: string;
}) {
  const { sendRequest } = useRequest();
  useEffect(() => {
    const handleRequest = async () => {
      await sendRequest({
        url: "/api/payments",
        method: "post",
        body: {
          sessionId,
          orderId,
        },
      });
    };
    handleRequest();
  }, []);
  return (
    <div className="flex justify-center items-center flex-col">
      <h1>Order Complete</h1>
      <Link className="button-primary" href="/">
        Back To Main Page
      </Link>
    </div>
  );
}
