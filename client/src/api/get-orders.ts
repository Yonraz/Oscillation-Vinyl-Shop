"use server";
import { buildClient } from "./build-client";

export const getOrders = async () => {
  try {
    const client = await buildClient();
    if (!client) {
      throw new Error("Failed to build client");
    }
    const { data } = await client.get("/api/orders");
    return data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};