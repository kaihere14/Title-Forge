import React from "react";
import Meta from "../components/Meta";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const About = () => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-white">
      <Meta
        title="About — TitleForge"
        description="About TitleForge — AI-powered YouTube title optimization to help creators craft engaging, SEO-friendly titles."
        url="https://title-forge.vercel.app/about"
      />
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-6 py-20 md:py-32">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-8 text-center bg-[#E1FF04] py-2 px-4 rounded-full">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.0007 1.20825 18.3195 3.68108 20.7923 4.99992 18.3195 6.31876 17.0007 8.79159 15.6818 6.31876 13.209 4.99992 15.6818 3.68108 17.0007 1.20825ZM8.00065 4.33325 10.6673 9.33325 15.6673 11.9999 10.6673 14.6666 8.00065 19.6666 5.33398 14.6666.333984 11.9999 5.33398 9.33325 8.00065 4.33325ZM19.6673 16.3333 18.0007 13.2083 16.334 16.3333 13.209 17.9999 16.334 19.6666 18.0007 22.7916 19.6673 19.6666 22.7923 17.9999 19.6673 16.3333Z"></path>
          </svg>
          <span>About TitleForge</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Helping Creators Grow with <br className="hidden md:block" />
          Intelligent Title Optimization
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We combine AI technology with data-driven insights to help YouTube
          creators craft titles that drive engagement and maximize reach.
        </p>
      </div>
      {/* Mission Section */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe every creator deserves access to professional-grade
                optimization tools. Our platform democratizes title
                optimization, making data-driven insights accessible to
                everyone—from aspiring YouTubers to established channels.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By analyzing millions of data points, we generate titles that
                capture attention and drive meaningful engagement, helping
                creators focus on what they do best: creating great content.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[#F44505] flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Advanced machine learning models trained on millions of
                    successful titles to deliver optimization insights.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[#F44505] flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Data-Driven Results
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Every suggestion is backed by real performance metrics and
                    engagement data from successful videos.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-[#F44505] flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Instant Delivery
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Generate optimized titles in seconds and receive them
                    directly in your inbox, ready to use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-gray-600">
              Making an impact, one title at a time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F44505] mb-2">50+</div>
              <div className="text-sm text-gray-600">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F44505] mb-2">
                1000+
              </div>
              <div className="text-sm text-gray-600">Titles Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F44505] mb-2">85%</div>
              <div className="text-sm text-gray-600">Avg. CTR Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F44505] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Our Principles
            </h2>
            <p className="text-gray-600">
              The values that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Innovation First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We continuously push boundaries with the latest AI advancements,
                ensuring creators always have access to cutting-edge
                optimization tools.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Creator-Centric
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every feature begins with one question: "How does this help
                creators succeed?" Your growth and success drive our
                development.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Transparent & Trustworthy
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We're upfront about how our AI works and how we use data. Clear
                communication and reliable results, every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built by Creators, for Creators
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
            Our team combines deep expertise in AI, data science, and content
            creation. We understand the challenges you face because we've
            experienced them firsthand.
          </p>

          <div className="border border-gray-200 rounded-2xl p-8 md:p-12 bg-white">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Join Our Team
            </h3>
            <p className="text-gray-600 mb-6">
              We're looking for passionate people who want to help creators
              succeed.
            </p>
            <button
              className="bg-gray-200 text-gray-500 py-3 px-8 rounded-lg font-medium cursor-not-allowed"
              disabled
            >
              We're Hiring Soon
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-gray-100 py-20 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Join thousands of creators using AI to maximize their reach and grow
            faster.
          </p>

          <button
            onClick={() => {
              navigate(isLoggedIn ? "/dashboard" : "/login");
            }}
            className="bg-[#F44505] hover:bg-[#D93D05] cursor-pointer text-white py-4 px-12 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            <span>{isLoggedIn ? "Go To Dashboard" : "Get Started Free"}</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#F44505]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>1 free credit - no credit card verification</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#F44505]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-[#F44505]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
