import { Order } from "@/types/order";

const orderStatusToColor = (status: string) => {
  switch (status) {
    case "awaitingPayment":
      return "bg-yellow-100";
    case "complete":
      return "bg-green-100";
    case "cancelled":
      return "bg-red-100";
    default:
      return "bg-yellow-100";
  }
};

export default function UserOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="mx-6 grid lg:grid-cols-4 xs:grid-cols-1 md:grid-cols-3 gap-4">
      {orders.reverse().map((order) => {
        return (
          <table
            key={order.id}
            className="md:table-auto bg-slate-100 shadow-custom rounded-lg"
          >
            <tr className="border-b border-neutral-800">
              <th>Order Id:</th>
              <th className="whitespace-wrap px-6 py-4 font-medium">
                {order.id}
              </th>
            </tr>
            <tr
              className={`border-b border-neutral-500 ${orderStatusToColor(
                order.status
              )}`}
            >
              <td>Status: </td>
              <td className="whitespace-wrap px-6 py-4 font-medium">
                {order.status}
              </td>
            </tr>
            <tr className="border-b border-neutral-500">
              <td>Vinyl Title: </td>
              <td className="whitespace-wrap px-6 py-4 font-medium">
                {order.vinyl.title}
              </td>
            </tr>
            <tr className="">
              <td>Price: </td>
              <td className="whitespace-wrap px-6 py-4 font-medium">
                {order.vinyl.price}
              </td>
            </tr>
          </table>
        );
      })}
    </div>
  );
}
