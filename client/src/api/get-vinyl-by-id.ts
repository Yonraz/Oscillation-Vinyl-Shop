"use server";

import { buildClient } from "./build-client";

export const getVinylById = async (id: string) => {
  try {
    const client = await buildClient();
    if (!client) {
      throw new Error("Failed to build client");
    }
    const { data } = await client.get(`/api/vinyls/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch vinyls:", error);
    return [];
  }
};
