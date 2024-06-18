import LoadingVinyl from "@/components/loadingSpinner/LoadingVinyl";
import OrderComplete from "@/components/orders/OrderComplete";
import { stripe } from "@/utils/stripe";
import { Suspense } from "react";

export default async function CheckoutReturn({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  console.log(searchParams);
  const session = await getSession(searchParams.session_id);
  console.log(session)
  return (
    <Suspense fallback={<LoadingVinyl />}>
    <OrderComplete sessionId={session.id} orderId={session.metadata!.orderId} />
    </Suspense>
  );
}

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}
