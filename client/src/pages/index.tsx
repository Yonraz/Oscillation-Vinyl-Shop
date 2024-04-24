import BuildClient from "@/api/build-client";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPageContext,
} from "next";

interface CurrentUser {
  id: string;
  email: string;
}

export const getServerSideProps = async (context: NextPageContext) => {
  const client = await BuildClient(context);
  if (!client) throw new Error("Client is undefined");
  const response = await client.get("/api/users/currentuser");
  if (!response) throw new Error("Response is undefined");
  return { props: { data: response.data } };
};

export default function HomePage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { currentUser } = props.data;
  console.log(currentUser);
  return (
    <>
      {currentUser ? <h1>You are signed in</h1> : <h1>You aren't signed in</h1>}
    </>
  );
}
