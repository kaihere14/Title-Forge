import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "../context/userContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    // Handle logout logic here
    try {
      // Call logout from context which clears localStorage
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="pl-1  bg-white pr-6 md:px-10 pt-4 flex justify-between items-center w-full relative">
      <div className="left flex items-center gap-4 md:gap-40">
        <div
          onClick={() => navigate("/")}
          className="logo cursor-pointer flex items-center"
        >
          <img src="https://i.postimg.cc/TYQsxx9Y/logo2.png" alt="" className="h-8 w-auto" />
          <h1 className="text-sm md:text-md font-bold ml-1">TitleForge</h1>
        </div>
        

        {/* Desktop Navigation */}
        <div className="links hidden lg:flex items-center text-sm font-medium gap-4">
          <Link to="/" className="hover:text-gray-600 transition-colors">
            Home
          </Link>
          <Link
            to="/pricing"
            className="ml-4 hover:text-gray-600 transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="ml-4 hover:text-gray-600 transition-colors"
          >
            About
          </Link>
          {/* <Link to="/contact" className='ml-4 hover:text-gray-600 transition-colors'>Contact</Link> */}
          {isLoggedIn && (
            <div className="indicator ml-4">
              <span className="indicator-item badge badge-sm bg-red-500 text-white border-none absolute -top-2 -right-3">
                !
              </span>
              <Link
                to="/dashboard"
                className="hover:text-gray-600 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="right hidden md:flex items-center gap-3">
        <Link
          to={isLoggedIn ? "/profile" : "/login"}
          className="text-sm font-medium hover:text-gray-600 transition-colors"
        >
          {isLoggedIn ? "Profile" : "Login"}
        </Link>
        <Link
          to={isLoggedIn ? "/#" : "/signup"}
          onClick={() => {
            if (isLoggedIn) {
              handleLogout();
            }
          }}
          className="text-xs md:text-sm font-medium px-3 md:px-5 py-2 bg-black rounded-md text-white hover:bg-gray-800 transition-colors"
        >
          {isLoggedIn ? "Logout" : "Get Started"}
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-1"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span
          className={`w-5 h-0.5 bg-black transition-all duration-300 ${
            isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        ></span>
        <span
          className={`w-5 h-0.5 bg-black transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`w-5 h-0.5 bg-black transition-all duration-300 ${
            isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        ></span>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 md:hidden z-50">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link
              to="/"
              className="text-sm font-medium py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="text-sm font-medium py-2 hover:text-gray-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {/* <Link to="/contact" className="text-sm font-medium py-2 hover:text-gray-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link> */}
            <hr className="border-gray-200" />
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="text-sm font-medium py-2 hover:text-gray-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isLoggedIn ? "Profile" : "Login"}
            </Link>
            <Link
              to={isLoggedIn ? "/#" : "/signup"}
              className="text-sm font-medium py-2 px-4 bg-black rounded-md text-white text-center hover:bg-gray-800 transition-colors"
              onClick={() => {
                if (isLoggedIn) {
                  handleLogout();
                }
              }}
            >
              {isLoggedIn ? "Logout" : "Get Started"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
