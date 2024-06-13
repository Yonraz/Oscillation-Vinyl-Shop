"use client";
import { useUser } from "@/context/user-context";
import Link from "next/link";

export default function Header() {
  const { currentUser } = useUser();
  return (
    <>
      <nav className="h-12 bg-slate-400 px-6 text-gray-800 flex items-center mb-3 w-full">
        <Link className="font-bold text-xl" href="/">
          Ticketing
        </Link>
        <div className="absolute right-0 mx-6">
          {currentUser ? (
            <>
              <Link className="text-xs text-blue-700 mx-3" href="/vinyls/new">
                Sell Tickets
              </Link>
              <Link href="/auth/signout">Sign Out</Link>
            </>
          ) : (
            <>
              <Link className="text-xs text-blue-700 mx-3" href="/auth/signup">
                Sign Up
              </Link>
              <Link className="text-xs text-blue-700" href="/auth/signin">
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
