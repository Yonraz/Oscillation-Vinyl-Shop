"use client";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import { useUser } from "@/context/user-context";
import useRequest from "@/hooks/useRequest";
import ErrorList from "../errors/ErrorList";
import Seperator from "../ui/Seperator";
import Button from "../ui/Button";
import EmbeddedCheckoutButton from "../payment/EmbeddedCheckoutButton";

export default function NewOrder(props: { order: Order }) {
  const { currentUser } = useUser();
  const router = useRouter();
  // if (!currentUser) router.push("/login");
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
        <Button
          className="button-secondary"
          onClick={() => router.push("/vinyls")}
        >
          Take me back!
        </Button>
      </>
    );
  }

  const { order } = props;
  return (
    <div className="flex justify-center">
      <div className="flex flex-col m-6">
        {seconds > 60 ? (
          <p className="text-white">
            You have{" "}
            <span className="text-green-400">{Math.ceil(seconds / 60)}</span>{" "}
            minutes to complete the order.
          </p>
        ) : (
          <p className="text-white">
            You have <span className="text-red-400">{seconds}</span> seconds to
            complete the order.
          </p>
        )}
        <div className="bg-slate-100 rounded-md px-2 py-1">
          <OrderDetails order={order} />
          <Seperator />
          <div className="mt-4">
            {/* <StripeCheckout
              amount={order.vinyl.price * 100}
              token={({ id }) => {
                handleToken(id);
              }}
              email={currentUser!.email!}
              stripeKey={stripePublishableKey}
            /> */}
            <EmbeddedCheckoutButton order={order} />
          </div>
          {requestErrors && <ErrorList errors={requestErrors} />}
        </div>
      </div>
    </div>
  );
}
