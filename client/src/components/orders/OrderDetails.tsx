import { Order } from "@/types/order";
import Seperator from "../ui/Seperator";

export default function OrderDetails(props: { order: Order }) {
  const { order } = props;
  return (
    <div className="font-light">
      <h1 className="font-bold">Order Details</h1>
      <Seperator />
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Vinyl Title: {order.vinyl.title}</p>
      <p>Price: {order.vinyl.price}</p>
    </div>
  );
}
