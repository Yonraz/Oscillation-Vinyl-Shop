import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header/Header";
import { UserProvider } from "@/context/user-context";
import { getCurrentUser } from "@/api/get-current-user";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticketing",
};

const AsyncLayout: React.FC<{
  children: React.ReactNode;
}> = async ({ children }) => {
  const currentUser = await getCurrentUser();

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
