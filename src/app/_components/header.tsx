"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface User {
  // name: string;
  email: string;
  token: string;
   user: {
    name: string;
   }
}

const Header = () => {
  const [userStorage, setUserStorage] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  const getUserID = (): string | null => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      try {
        const parsed = userData ? JSON.parse(userData) : null;
        return parsed?.user?._id || parsed?.user?.id || null;
      } catch (error) {
        console.error("Error parsing userData:", error);
        return null;
      }
    }
    return null;
  };

  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    setUserID(getUserID());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        setUserStorage(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserStorage(null);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      setUserStorage(null);
    }
  };

  const navLinkClass =
    "relative px-3 py-2 transition-all duration-200 text-xl text-white hover:text-yellow-300 font-medium after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-green-700 shadow-lg">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="TurfMate Logo" className="h-10 w-auto" />
        <span className="text-2xl font-bold text-white tracking-wide">TurfMate</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 items-center">
        <Link href="/" className={navLinkClass}>Home</Link>
        <Link href="/contact" className={navLinkClass}>Contact</Link>
        <Link href="/about" className={navLinkClass}>About Us</Link>
        <Link href="/wallet" className={navLinkClass}>Wallet</Link>
        <button
          onClick={() => router.push(`/user/allbookings/${userID}`)}
          className="px-4 py-2 bg-white text-green-700 rounded-md font-semibold hover:bg-yellow-300 hover:text-black transition-all"
        >
          All Bookings
        </button>
      </nav>

      {/* Authentication Buttons */}
   <div className="hidden md:flex items-center space-x-4">
  {userStorage ? (
    <>
      <span className="text-2xl text-white font-bold">Hi, {userStorage.user?.name}</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className="text-white hover:underline font-medium">Log In</Link>
      <Link
        href="/signup"
        className="px-4 py-2 bg-white text-green-700 font-semibold rounded-md hover:bg-yellow-300 hover:text-black transition-all"
      >
        Sign Up
      </Link>
    </>
  )}
</div>


      {/* Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-green-700 text-white px-6 py-4 space-y-4 z-50 shadow-xl">
          <Link href="/" className="block text-2xl  hover:text-yellow-300">Home</Link>
          <Link href="/contact" className="block font-medium hover:text-yellow-300">Contact</Link>
          <Link href="/about" className="block font-medium hover:text-yellow-300">About Us</Link>
          <Link href="/wallet" className="bloc  k font-medium hover:text-yellow-300">Wallet</Link>
          <button
            onClick={() => {  
              setIsMenuOpen(false);
              router.push(`/user/allbookings/${userID}`);
            }}
            className=" text-left font-medium px-4 py-2 bg-white text-green-700 rounded-md  hover:text-black transition-all"
          >
            All Bookings
          </button>
          
         {userStorage ? (
  <>
    <div className="text-2xl text-white font-bold">Hi, {userStorage.user?.name}</div>
    <button
      onClick={handleLogout}
      className="block w-full text-left font-medium px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition-all"
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link href="/login" className="block font-medium hover:underline">Log In</Link>
    <Link
      href="/signup"
      className="block font-medium px-4 py-2 bg-white text-green-700 rounded-md hover:bg-yellow-300 hover:text-black transition-all"
    >
      Sign Up
    </Link>
  </>
)}

        </div>
      )}
    </header>
  );
};

export default Header;
