"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { status,   } = useSession();

  return (
    <nav className="w-full p-6 gap-4 border-2 border-gray-300 shadow-sm">
      <div className="container flex justify-center items-center mx-auto">
        <Link href="/">
          <h1 className="text-3xl font-bold text-gray-950">ChefGPT</h1>
        </Link>
        <div className="flex-1 flex justify-end gap-4 items-center text-lg text-gray-800 ">
          {status == "unauthenticated" || status == "loading" ? (
            <>
              <Link href="/login">
                <Button variant="link">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="link">Signup</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/personalised">
                <Button variant="link">Recommended</Button>
              </Link>
              <Link href="/myrecipes">
                <Button variant="link">MyRecipes</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
