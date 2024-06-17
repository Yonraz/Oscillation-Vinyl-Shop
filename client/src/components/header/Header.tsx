"use client";
import { useUser } from "@/context/user-context";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CurrentUser } from "@/types/currentUser";
import { FaRegUserCircle } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const { currentUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 640) {
      setIsMobile(true);
    }
  }, []);
  return (
    <>
      <nav className="nav">
        <Link className="flex" href="/">
          <Image src="/images/logo.png" alt="logo" width={30} height={30} />
          <p className="font-bold text-xl xs:hidden">OSCILLATION</p>
        </Link>
        <div className="flex absolute right-0">
          {isMobile ? (
            <UserActionsMobile currentUser={currentUser} />
          ) : (
            <UserActions currentUser={currentUser} />
          )}
        </div>
      </nav>
    </>
  );
}

const UserActionsMobile = ({
  currentUser,
}: {
  currentUser: CurrentUser["currentUser"];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClick = () => setIsOpen((prev) => !prev);
  return (
    <>
      <>
        <div
          className={`transition-all duration-300 ease-in flex items-center ${
            isOpen ? "slide-in" : "slide-out"
          }`}
        >
          <UserActions currentUser={currentUser} />
        </div>
        <FaRegUserCircle onClick={handleClick} size={40} />
      </>
    </>
  );
};

const UserActions = ({
  currentUser,
}: {
  currentUser: CurrentUser["currentUser"];
}) => {
  return (
    <div className="flex items-center mx-2">
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
  );
};
