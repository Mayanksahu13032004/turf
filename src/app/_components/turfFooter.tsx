export default function TurfFooter() {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand & Description */}
          <div>
            <h2 className="text-2xl font-bold text-green-500">Turfer</h2>
            <p className="text-gray-400 mt-2">
              Book your favorite turfs easily and enjoy seamless gaming experiences.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-green-400">Home</a></li>
              <li><a href="/turfs" className="text-gray-400 hover:text-green-400">Turfs</a></li>
              <li><a href="/tournaments" className="text-gray-400 hover:text-green-400">Tournaments</a></li>
              <li><a href="/offers" className="text-gray-400 hover:text-green-400">Offers</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-green-400">Contact</a></li>
            </ul>
          </div>
  
          {/* Contact Info & Socials */}
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-gray-400 mt-2">Ahmedabad, Gujarat, India</p>
            <p className="text-gray-400">Email: support@turfer.com</p>
            <p className="text-gray-400">Phone: +91 98765 43210</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} Turfer. All rights reserved.
        </div>
      </footer>
    );
  }
  