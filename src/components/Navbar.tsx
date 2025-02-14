"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import ThemeButton from "./ThemeButton";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  const currPath = usePathname();

  return (
    <nav className="fixed top-0 z-20 min-w-full border-b border-dashed dark:bg-black bg-white">
      <div className="px-12 py-2 md:py-4">
        <div className="flex justify-between items-center">
          <Link
            className="text-xl font-bold mb-4 md:mb-0 relative z-20 bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-200 dark:to-neutral-500 from-stone-950 to-stone-500"
            href="/"
          >
            Question Me
          </Link>
          <div className="flex gap-x-3 items-center">
            {session ? (
              <>
                <span>Welcome, {user.username || user.email}</span>{" "}
                {currPath !== "/dashboard" && (
                  <Link href="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                )}
                <Button
                  className="w-full md:w-auto"
                  variant="destructive"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  as="button"
                  className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 py-1 border dark:border-sky-400/50 border-sky-700/50"
                >
                  Log in
                </HoverBorderGradient>
              </Link>
            )}
            <ThemeButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
