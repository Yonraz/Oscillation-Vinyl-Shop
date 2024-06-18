import { getOrderById } from "@/api/get-order-by-id";
import { orders } from "@/app/dev/data/orders";
import LoadingVinyl from "@/components/loadingSpinner/LoadingVinyl";
import NewOrder from "@/components/orders/NewOrder";
import { Order as OrderType } from "@/types/order";
import { Suspense } from "react";

export default async function Order({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const order: OrderType = await getOrderById(orderId);
  return (
    <div className="h-screen bg-neutral-800">
      <Suspense fallback={<LoadingVinyl />}>
        <NewOrder order={order!} />
      </Suspense>
    </div>
  );
}
