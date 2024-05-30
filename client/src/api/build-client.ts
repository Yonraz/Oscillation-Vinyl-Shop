import axios from "axios";
import { NextPageContext } from "next";

export default async function BuildClient(context: NextPageContext) {
  try {
    const { req } = context;
    if (typeof window === "undefined") {
      console.log("creating axios instance");
      // running on server
      return axios.create({
        baseURL:
          "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", //ingress-nginx-controller.ingress-nginx.svc.cluster.local
        headers: req!.headers,
      });
    } else {
      // running on browser
      return axios.create({
        baseURL: "/",
      });
    }
  } catch (error: any) {
    console.error(error.message);
  }
}
