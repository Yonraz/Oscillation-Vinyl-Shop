"use client";
import { useUser } from "@/context/user-context";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const { currentUser } = useUser();
  return (
    <>
      <nav className="nav">
        <Image src="/images/logo.png" alt="logo" width={30} height={30} />
        <Link className="font-bold text-xl" href="/">
          OSCILLATION
        </Link>
        <div className="flex absolute right-0 px-6">
          {currentUser ? (
            <>
              <Link className="nav-item" href="/vinyls">
                Records
              </Link>
              <Link className="nav-item" href="/vinyls/new">
                Sell Records
              </Link>
              <Link className="nav-item" href="/orders">
                My Orders
              </Link>
              <Link href="/auth/signout">Sign Out</Link>
            </>
          ) : (
            <>
              <Link className="nav-item" href="/auth/signup">
                Sign Up
              </Link>
              <Link className="nav-item" href="/auth/signin">
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
