import BuildClient from "@/api/build-client";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPageContext,
} from "next";
import { cookies } from "next/headers";

interface CurrentUser {
  id: string;
  email: string;
}

export const getCookie = async (name: string) => {
  return cookies().get(name)?.value ?? "";
};

export const getCurrentUser = async () => {
  let response;
  const cookie = await getCookie("session");
  if (typeof window === "undefined") {
    response = await fetch("http://ticketing.dev/api/users/currentuser", {
      headers: { cookie },
      cache: "no-store",
    });
  } else {
    response = await fetch("http://ticketing.dev/api/users/currentuser");
  }
  console.log(response);
  // const data = await response.json();
  // console.log(data);
  // return { currentUser: response.currentUser };
  return response;
};

export default async function HomePage() {
  const r = await getCurrentUser();
  console.log(r);
  return (
    <>
      {/* {currentUser ? <h1>You are signed in</h1> : <h1>You aren't signed in</h1>} */}
      {r.toString()}
    </>
  );
}
