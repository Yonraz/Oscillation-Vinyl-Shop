import OrderComplete from "@/components/orders/OrderComplete";
import { stripe } from "@/utils/stripe";

export default async function CheckoutReturn({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  console.log(searchParams);
  const session = await getSession(searchParams.session_id);
  console.log(session)
  return (
    <OrderComplete sessionId={session.id} orderId={session.metadata!.orderId} />
  );
}

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}
