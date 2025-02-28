import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-20 left-0 w-full bg-transparent  text-white p-4 z-50">
      <div className="container mx-auto flex justify-center items-center">
        {/* Hamburger Icon */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navbar Links */}
        <ul
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent md:flex gap-6 p-4 md:p-0 transition-all duration-300 flex ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {["Home", "Turf","Offer","Contect","Booking"].map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <li key={item} className="text-center md:text-left text-xl p-2 md:p-0">
                <Link href={path} className="hover:text-gray-300 transition">
                  {item}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
