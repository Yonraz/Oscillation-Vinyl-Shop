"use client";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import StripeCheckout from "react-stripe-checkout";
import { useUser } from "@/context/user-context";
import useRequest from "@/hooks/useRequest";
import ErrorList from "../errors/ErrorList";

export default function NewOrder(props: { order: Order }) {
  const { currentUser } = useUser();
  const router = useRouter();
  if (!currentUser) router.push("/login");

  const msLeft =
    new Date(props.order.expiresAt).getTime() - new Date().getTime();
  const [seconds, setSeconds] = useState(Math.round(msLeft / 1000));

  const { sendRequest, isLoading, requestErrors } = useRequest();
  function handleToken(token: any) {
    sendRequest({
      url: "/api/payments",
      method: "post",
      body: {
        token,
        orderId: props.order.id,
      },
      onSuccess: (payment) => {
        console.log(payment);
        router.push("/vinyls");
      },
    });
  }

  useEffect(() => {
    const getTimeLeft = () => {
      const msLeft =
        new Date(props.order.expiresAt).getTime() - new Date().getTime();
      setSeconds(Math.round(msLeft / 1000));
    };
    const interval = setInterval(getTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  if (seconds <= 0) {
    return (
      <>
        <div>Order expired.</div>
        <button onClick={() => router.push("/vinyls")}>Take me back!</button>
      </>
    );
  }

  const { order } = props;
  return (
    <div>
      <p>You have {seconds} seconds to complete the order.</p>
      <OrderDetails order={order} />
      <StripeCheckout
        amount={order.vinyl.price * 100}
        token={({ id }) => {
          handleToken(id);
        }}
        email={currentUser!.email!}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      />
      {requestErrors && <ErrorList errors={requestErrors} />}
    </div>
  );
}
