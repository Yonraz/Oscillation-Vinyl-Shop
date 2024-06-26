"use client";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useEffect, useRef, useState } from "react";
import useRequest from "@/hooks/useRequest";
import { Order } from "@/types/order";
import { get } from "http";
import { getBaseUrl } from "@/api/build-client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function EmbeddedCheckoutButton({
  order,
  isExpired,
}: {
  order: Order;
  isExpired: boolean;
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const { sendRequest } = useRequest();

  useEffect(() => {
    if (isExpired) {
      handleCloseModal();
    }
  }, [isExpired]);

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    const response = await fetch(`/api/embedded-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.id,
        orderPrice: order.vinyl.price,
        name: order.vinyl.title,
      }),
    });
    const data = await response.json();
    console.log(data);
    return data.client_secret;
  }, []);

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    modalRef.current?.close();
  };

  return (
    <div id="checkout" className="my-4">
      <button className="btn" onClick={handleCheckoutClick}>
        Open Modal with Embedded Checkout
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-100 max-w-screen-2xl">
          <h3 className="font-bold text-white text-lg">Embedded Checkout</h3>
          <div className="py-4">
            {showCheckout && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleCloseModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
