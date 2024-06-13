"use client";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";

export default function NewOrder(props: { order: Order }) {
  const msLeft =
    new Date(props.order.expiresAt).getTime() - new Date().getTime();
  const [seconds, setSeconds] = useState(Math.round(msLeft / 1000));

  useEffect(() => {
    const getTimeLeft = () => {
      const msLeft =
        new Date(props.order.expiresAt).getTime() - new Date().getTime();
      setSeconds(Math.round(msLeft / 1000));
    };
    const interval = setInterval(getTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  const { order } = props;
  return (
    <div>
      <p>You have {seconds} seconds to complete the order.</p>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Vinyl Title: {order.vinyl.title}</p>
      <p>Price: {order.vinyl.price}</p>
    </div>
  );
}
