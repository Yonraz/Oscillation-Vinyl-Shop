"use server";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const getClientCookie = async (
  cookieName: string
): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const cookieValue = getCookie(cookieName, { cookies });
    resolve(cookieValue);
  });
};
