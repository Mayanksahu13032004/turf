"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface User {
  name: string;
  email: string;
  token: string;
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

  return (
    <header className="flex items-center justify-between p-5 bg-green-700 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="TurfMate Logo" className="h-12 w-auto" />
        <div className="text-2xl font-bold">TurfMate</div>
      </div>

      {/* Navigation for larger screens */}
      <nav className="hidden md:flex space-x-6 text-lg">
        <Link href="/" className="relative group">Home</Link>
        <Link href="/contact" className="relative group">Contact</Link>
        <Link href="/about" className="relative group">About Us</Link>
        <button
          onClick={() => router.push(`/user/allbookings/${userID}`)}
          className="relative group px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
        >
          All Bookings
        </button>
      </nav>

      {/* Authentication buttons for larger screens */}
      <div className="hidden md:flex items-center space-x-6">
        {userStorage ? (
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">Logout</button>
        ) : (
          <>
            <Link href="/login" className="hover:underline self-center">Log In</Link>
            <Link href="/signup" className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-200">Sign Up</Link>
          </>
        )}
      </div>

      {/* Hamburger menu for mobile screens */}
      <div className="md:hidden flex items-center">
        <button
          className="text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-green-700 text-white p-5 space-y-4 z-10">
          <Link href="/" className="block">Home</Link>
          <Link href="/contact" className="block">Contact</Link>
          <Link href="/about" className="block">About Us</Link>
          <button
            onClick={() => router.push(`/user/allbookings/${userID}`)}
            className="block px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
          >
            All Bookings
          </button>
          {userStorage ? (
            <button onClick={handleLogout} className="block px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">Logout</button>
          ) : (
            <>
              <Link href="/login" className="block text-center hover:underline">Log In</Link>
              <Link href="/signup" className="block px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-200">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
