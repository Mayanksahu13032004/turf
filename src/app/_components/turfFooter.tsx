"use client";

import { Facebook, Twitter, Instagram, MapPin, Mail, Phone } from "lucide-react";

export default function TurfFooter() {
  return (
    <footer className="bg-gray-300 text-gray-800 py-10 mt-10 shadow-lg border-t">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Turfer</h2>
          <p className="text-gray-600 mt-3">
            Book your favorite turfs easily and enjoy seamless gaming experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><a href="/" className="text-gray-600 hover:text-blue-600 transition">Home</a></li>
            <li><a href="/turfs" className="text-gray-600 hover:text-blue-600 transition">Turfs</a></li>
            <li><a href="/tournaments" className="text-gray-600 hover:text-blue-600 transition">Tournaments</a></li>
            <li><a href="/offers" className="text-gray-600 hover:text-blue-600 transition">Offers</a></li>
            <li><a href="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
          <p className="flex items-center text-gray-600 mt-3"><MapPin className="w-5 h-5 mr-2 text-blue-600"/> Ahmedabad, Gujarat, India</p>
          <p className="flex items-center text-gray-600"><Mail className="w-5 h-5 mr-2 text-blue-600"/> support@turfer.com</p>
          <p className="flex items-center text-gray-600"><Phone className="w-5 h-5 mr-2 text-blue-600"/> +91 98765 43210</p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-300 pt-4">
        &copy; {new Date().getFullYear()} Turfer. All rights reserved.
      </div>
    </footer>
  );
}
