import { useUser } from "@/context/user-context";

const Home = () => {
  const { currentUser } = useUser();

  return (
    <>
      {currentUser ? (
        <h1>You are signed in as {currentUser.email}</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </>
  );
};
