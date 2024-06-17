import { getOrderById } from "@/api/get-order-by-id";
import { orders } from "@/app/dev/data/orders";
import NewOrder from "@/components/orders/NewOrder";
import { Order as OrderType } from "@/types/order";

export default async function Order({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  console.log(orderId);
  const order: OrderType = await getOrderById(orderId);
  return (
    <div className="h-screen bg-neutral-800">
      <NewOrder order={order} />
    </div>
  );
}
