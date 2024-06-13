import { getOrderById } from "@/api/get-order-by-id";
import { Order as OrderType } from "@/types/order";

export default async function Order({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  const order: OrderType = await getOrderById(orderId);
  return (
    <NewOrder order={order} />
  );
}
