import React, { useEffect } from "react";
import Meta from "../components/Meta";
import VideoGrowthCard from "../components/Growth";
import TestimonialCard from "../components/Review";
import PricingSection from "../components/Pricing";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/userContext";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, fetchUserData } = useUser();
  useEffect(() => {
    fetchUserData();
  }, [isLoggedIn]);

  return (
    <>
      <Meta
        title="Get More Views — TitleForge"
        description="Leverage AI to transform your YouTube video titles into clickable, search-optimized masterpieces with TitleForge."
        image="https://i.postimg.cc/TYQsxx9Y/logo2.png"
        url="https://title-forge.vercel.app/"
      />
      <div className="text-2xl w-full h-fit flex flex-col gap-3  mt-20 md:mt-30 items-center">
        <div className="text-center bg-[#E1FF04] py-2 px-4 rounded-full ">
          <h1 className="text-sm flex items-center gap-2 font-medium">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM8.00065 4.33325 10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z"></path>
            </svg>
            Titles Forge. Powered by AI
          </h1>
        </div>
        <div className="text-center font-bold mt-4 md:text-5xl">
          <h1>Get More Views. Automatically</h1>
          <h1>With AI-Powered Titles.</h1>
        </div>
        <div className="mt-0 md:mt-5">
          <p className="w-100 text-sm text-gray-600 px-8 md:px-0">
            Leverage cutting-edge AI to instantly transform your YouTube video
            titles into clickable, search-optimized masterpieces.
          </p>
        </div>
        <div className="flex mt-5 gap-5 ">
          <button
            onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")}
            className="bg-[#F44505] transition-all duration-200 cursor-pointer hover:bg-[#D93D05] text-white py-4 px-8 rounded-xl text-sm flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM8.00065 4.33325 10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z"></path>
            </svg>
            {isLoggedIn ? "Dashboard" : "Get A Demo"}
          </button>
          <button
            onClick={() => navigate("/about")}
            className="bg-[#161616] transition-all duration-200 hover:bg-[#353535] cursor-pointer text-white py-4 px-10 rounded-xl text-sm flex items-center gap-2"
          >
            Explore More
          </button>
        </div>
      </div>
      <div className="h-fit mt-6 md:mt-10 w-full flex flex-col md:flex-row px-4 md:px-10 gap-4 md:gap-5">
        <div className="left h-auto mt-8 md:mt-20 w-full md:w-[40%]">
          <VideoGrowthCard />
        </div>
        <div className="right h-auto mt-8 md:mt-20 w-full md:w-[60%] flex justify-center items-center">
          <TestimonialCard />
        </div>
      </div>
      <div>
        <PricingSection />
      </div>

      <div className="bg-white  py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your YouTube Success?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators who've already discovered the power of
            AI-optimized titles. Stop guessing what works and start using
            data-driven insights to maximize your reach, boost engagement, and
            grow your channel faster than ever before.
          </p>

          {/* Primary CTA */}
          <div className="mb-8">
            <button className="bg-[#F44505] hover:bg-[#D93D05] cursor-pointer text-white py-4 px-12 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM8.00065 4.33325 10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z" />
              </svg>
              Get Free Demo Now
            </button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Get your first try for free - no credit card verification
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Directly into your inbox</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>24/7 support available</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM8.00065 4.33325 10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z" />
                </svg>
                <h3 className="text-xl font-bold">TitleForge</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                AI-powered YouTube title optimization for creators who want to
                maximize their reach and engagement.
              </p>
              {/* Product Hunt Badge */}
              <div className="mb-4">
                <a
                  href="https://www.producthunt.com/products/title-forge?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-title&#0045;forge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1032347&theme=light&t=1761764545570"
                    alt="Title&#0032;Forge - Forge&#0032;viral&#0044;&#0032;click&#0045;worthy&#0032;YouTube&#0032;titles&#0032;using&#0032;AI | Product Hunt"
                    style={{ width: "250px", height: "54px" }}
                    width="250"
                    height="54"
                  />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account Column */}
            <div>
              <h4 className="font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 TitleForge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
