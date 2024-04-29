import BuildClient from "@/api/build-client";
import { getCurrentUser } from "@/appunused/layout";
import { CurrentUser } from "@/types/currentUser";
import { NextPageContext } from "next";

export const getServerSideProps = async (context: NextPageContext) => {
  const client = await BuildClient(context);
  if (!client) throw new Error("Client is undefined");
  const response = await client.get("/api/users/currentuser");
  if (!response) throw new Error("Response is undefined");
  console.log("data");
  console.log(response.data);
  return { props: { currentUser: response.data.currentUser } };
};

export default function HomePage(props: { currentUser: CurrentUser }) {
  return (
    <>
      {props.currentUser ? (
        <h1>You are signed in as {props.currentUser.email}</h1>
      ) : (
        <h1>You aren't signed in</h1>
      )}
    </>
  );
}
