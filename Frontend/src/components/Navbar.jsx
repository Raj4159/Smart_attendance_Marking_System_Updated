import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define the menu items
  const menuItems = [
    // { name: "Parameters", href: "/parameters" },
    { name: "Admin Login", href: "/Admin_login", avatar: "/profile_avtar.png" }
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-cyan-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <Link
            to="/"
            className="font-bold flex items-center space-x-2 cursor-pointer"
          >
            {/* <img src="./login.jpg" alt="Logo" className="h-10 cursor-pointer" /> */}
            <h1 className="text-xl md:text-3xl font-bold">Smart Attendance System</h1>
          </Link>
        </div>
        <nav className="hidden lg:block px-3 py-2 rounded-full">
          <ul className="inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="font-semibold cursor-pointer flex items-center px-2 hover:text-cyan-600"
                  style={{ fontSize: "inherit !important", fontFamily: "inherit !important" }} // inherit font size and style
                >
                  <span>{item.name}</span>
                  {item.avatar && (
                    <span className="flex items-center ml-2">
                      <img src={item.avatar} alt="Profile Avatar" className="h-8" />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>

        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2">
                    <img src="/mental_health_logo.jpeg" alt="Logo" className="h-8" />
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2"
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
