"use server";
import { CurrentUser } from "@/types/currentUser";
import { buildClient } from "./build-client";

export const getCurrentUser = async (): Promise<CurrentUser> => {
  try {
    const client = await buildClient();
    if (!client) return { currentUser: null };
    const { data } = await client.get<CurrentUser>("/api/users/currentuser");
    return { currentUser: data.currentUser || null };
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { currentUser: null };
  }
};
