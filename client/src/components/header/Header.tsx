import BuildClient from "@/api/build-client";
import { CurrentUser } from "@/types/currentUser";
import axios from "axios";
import { NextPageContext } from "next";
import Link from "next/link";

export default function Header(props: { currentUser: CurrentUser }) {
  return (
    <>
      <nav className="h-12 bg-slate-400 px-6 text-gray-800 flex items-center mb-3 w-full">
        <Link className="font-bold text-xl" href="/">
          Ticketing
        </Link>
        <div className="absolute right-0 mx-6">
          {props.currentUser ? (
            <Link href="/auth/signout">Sign Out</Link>
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
