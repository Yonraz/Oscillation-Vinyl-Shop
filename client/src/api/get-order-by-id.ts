"use server";

import { buildClient } from "./build-client";

export const getOrderById = async (id: string) => {
  try {
    const client = await buildClient();
    if (!client) {
      throw new Error("Failed to build client");
    }
    const { data } = await client.get(`/api/orders/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return [];
  }
};
