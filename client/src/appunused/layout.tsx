import type { Metadata, NextPageContext } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import axios from "axios";
import BuildClient from "@/api/build-client";
import { cookies, headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticketing",
};

export const getCookie = async (name: string) => {
  return cookies().get(name)?.value ?? "";
};
//ingress-nginx-controller.ingress-nginx.svc.cluster.local
export const getCurrentUser = async () => {
  let response;
  const cookie = await getCookie("session");
  if (typeof window === "undefined") {
    // If running on the server
    response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc/api/users/currentuser",
      {
        headers: { cookie },
        withCredentials: true,
      }
    );
  } else {
    // If running in the browser
    response = await axios.get("/api/users/currentuser", {
      withCredentials: true,
    });
  }
  // const data = await response.json();
  // console.log(data);
  // return { currentUser: response.currentUser };
  return response.data;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  console.log("adfasasfdsfgasdfg");
  console.log(currentUser);
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
