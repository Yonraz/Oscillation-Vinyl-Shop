import axios, { AxiosInstance } from "axios";
import { getClientCookie } from "@/utils/get-cookie";

export const buildClient = async (): Promise<AxiosInstance | null> => {
  try {
    const cookie = await getClientCookie("session");
    const baseURL =
      typeof window === "undefined"
        ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
        : "/";

    const headers =
      typeof window === "undefined" && cookie
        ? { Cookie: `session=${cookie}`, Host: "ticketing.dev" }
        : {};

    return axios.create({ baseURL, headers });
  } catch (error) {
    //@ts-ignore
    console.error("Failed to initialize axios client:", error.message);
    return null;
  }
};

export const getBaseUrl = () => {
  return typeof window === "undefined"
    ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
    : "";
};
