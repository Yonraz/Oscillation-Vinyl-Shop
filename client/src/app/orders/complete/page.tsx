import useRequest from "@/hooks/useRequest";
import { stripe } from "@/utils/stripe";
import Link from "next/link";
import { useEffect } from "react";

export default async function CheckoutReturn({
  searchParams,
}: {
  searchParams: { sessionId: string };
}) {
  const { sendRequest, requestErrors, isLoading } = useRequest();

  const session = await getSession(searchParams.sessionId);
  return (
    <OrderComplete sessionId={session.id} orderId={session.metadata!.orderId} />
  );
}

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

("use client");
export function OrderComplete({
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
        method: "POST",
        body: {
          sessionId,
          orderId,
        },
      });
    };
    handleRequest();
  }, []);
  return (
    <div className="flex justify-center items-center">
      <h1>Order Complete</h1>
      <Link className="button-primary" href="/">
        Back To Main Page
      </Link>
    </div>
  );
}
