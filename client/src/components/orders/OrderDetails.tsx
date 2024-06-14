import { Order } from "@/types/order";

export default function OrderDetails(props: { order: Order }) {
  const { order } = props;
  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Vinyl Title: {order.vinyl.title}</p>
      <p>Price: {order.vinyl.price}</p>
    </div>
  );
}
