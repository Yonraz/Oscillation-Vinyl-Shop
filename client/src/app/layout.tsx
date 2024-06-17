import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header/Header";
import { UserProvider } from "@/context/user-context";
import { getCurrentUser } from "@/api/get-current-user";
import { CurrentUser } from "@/types/currentUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oscillation Vinyl Records",
};

const AsyncLayout: React.FC<{
  children: React.ReactNode;
}> = async ({ children }) => {
  let currentUser: CurrentUser = { currentUser: null };
  try {
    currentUser = await getCurrentUser();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to get current user:", error.message);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider initialUser={currentUser.currentUser}>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  );
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AsyncLayout>
      <main>{children}</main>
    </AsyncLayout>
  );
}
