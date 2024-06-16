import { getOrders } from "@/api/get-orders";
import { Order } from "@/types/order";

const Orders = async () => {
  const orders: Order[] = await getOrders();
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Vinyl Title: {order.vinyl.title}</p>
              <p>Price: {order.vinyl.price}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Orders;
