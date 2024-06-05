"use client";
import { useEffect } from "react";
import useRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import { useUser } from "@/context/user-context";

export default function Signout() {
  const { sendRequest } = useRequest();
  const Router = useRouter();
  const { setCurrentUser } = useUser();
  const sendRequestHandler = () =>
    sendRequest({
      url: "/api/users/signout",
      method: "post",
      body: {},
      onSuccess: () => {
        Router.push("/");
        setCurrentUser(null);
      },
    });
  useEffect(() => {
    sendRequestHandler();
  }, []);

  return <LoadingSpinner />;
}
