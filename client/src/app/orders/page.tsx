import { getOrders } from "@/api/get-orders";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import LoadingVinyl from "@/components/loadingSpinner/LoadingVinyl";
import UserOrders from "@/components/orders/UserOrders";
import { Order } from "@/types/order";
import { Suspense } from "react";



const Orders = async () => {
  const orders: Order[] = await getOrders();

  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full">
        <h1 className="font-bold text-lg">Orders</h1>
      </div>
      <Suspense fallback={<LoadingVinyl />}>
        <UserOrders orders={orders} />
      </Suspense>
    </div>
  );
};
export default Orders;
