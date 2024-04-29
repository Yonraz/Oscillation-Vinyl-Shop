import { AppProps } from "next/app";
import "../globals.css";
import BuildClient from "@/api/build-client";
import Header from "@/components/header/Header";
import { NextPageContext } from "next";

// export const getServerSideProps = async (context) => {
//   const client = await BuildClient(context);
//   if (!client) throw new Error("Client is undefined");
//   const response = await client.get("/api/users/currentuser");
//   if (!response) throw new Error("Response is undefined");
//   return { props: { currentUser: response.data.currentUser } };
// };

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (context) => {
  const client = await BuildClient(context.ctx);
  if (!client) throw new Error("Client is undefined");
  const response = await client.get("/api/users/currentuser");
  if (!response) throw new Error("Response is undefined");
  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }
  return { pageProps, currentUser: response.data.currentUser };
};

export default AppComponent;
