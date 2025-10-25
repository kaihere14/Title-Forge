import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, isLoggedIn } = useUser();

  const [channelName, setChannelName] = useState("");
  const [useAccountEmail, setUseAccountEmail] = useState(true);
  const [customEmail, setCustomEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowResults(false);

    // Validation
    if (!channelName.trim()) {
      setError("Please enter a channel name");
      setIsLoading(false);
      return;
    }

    if (!useAccountEmail && !customEmail.trim()) {
      setError("Please enter an email address");
      setIsLoading(false);
      return;
    }

    const emailToUse = useAccountEmail ? userData?.user?.email : customEmail;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/youtube/channel-id`,
        {
          name: channelName.trim(),
          email: emailToUse,
        },
        {
          withCredentials: true,
        }
      );

      // Store the complete response data
      setResultData({
        oldTitles: response.data.oldTitles || [],
        newTitles: response.data.newTitles || [],
        channelName: response.data.channelName || channelName,
        channelId: response.data.channelId || "",
        emailSentTo: emailToUse,
      });
      setShowResults(true);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate titles. Please try again."
      );
      setResultData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTitle = (title) => {
    navigator.clipboard.writeText(title);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Title Generator
          </h1>
          <p className="text-gray-600">
            Generate engaging YouTube titles for any channel
          </p>
        </div>

        {/* Credits Display */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Available Credits
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {userData?.user?.credits || 0}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Credits Used
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {userData?.user?.usedCredits || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Name Input */}
            <div>
              <label
                htmlFor="channelName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                YouTube Channel Name
              </label>
              <input
                type="text"
                id="channelName"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Enter channel name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the exact YouTube channel name you want to analyze
              </p>
            </div>

            {/* Email Options */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Send Results To
              </label>

              {/* Use Account Email Option */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    id="accountEmail"
                    name="emailOption"
                    checked={useAccountEmail}
                    onChange={() => setUseAccountEmail(true)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    disabled={isLoading}
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="accountEmail"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Use account email
                  </label>
                  <p className="text-sm text-gray-500">
                    {userData?.user?.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Custom Email Option */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    id="customEmail"
                    name="emailOption"
                    checked={!useAccountEmail}
                    onChange={() => setUseAccountEmail(false)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                    disabled={isLoading}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <label
                    htmlFor="customEmail"
                    className="text-sm font-medium text-gray-900 cursor-pointer block mb-2"
                  >
                    Use different email
                  </label>
                  {!useAccountEmail && (
                    <input
                      type="email"
                      id="customEmailInput"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      disabled={isLoading}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (userData?.user?.credits || 0) === 0}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Titles...
                </span>
              ) : (userData?.user?.credits || 0) === 0 ? (
                "No Credits Available"
              ) : (
                "Generate Titles"
              )}
            </button>

            {(userData?.user?.credits || 0) === 0 && (
              <p className="text-sm text-center text-gray-600">
                You need credits to generate titles.{" "}
                <button
                  type="button"
                  onClick={() => navigate("/pricing")}
                  className="text-gray-900 font-medium hover:underline"
                >
                  Get more credits
                </button>
              </p>
            )}
          </form>
        </div>

        {/* Results Section */}
        {showResults && resultData && (
          <div className="space-y-6">
            {/* Channel Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {resultData.channelName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Channel ID: {resultData.channelId}
                  </p>
                </div>
              </div>
            </div>

            {/* Old Titles Section */}
            {resultData.oldTitles && resultData.oldTitles.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Original Titles
                  </h2>
                  <span className="text-sm text-gray-600">
                    {resultData.oldTitles.length} titles
                  </span>
                </div>

                <div className="space-y-3">
                  {resultData.oldTitles.map((title, index) => (
                    <div
                      key={`old-${index}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors group"
                    >
                      <p className="text-gray-900 flex-1">{title}</p>
                      <button
                        onClick={() => handleCopyTitle(title)}
                        className="ml-4 text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New AI Generated Titles Section */}
            {resultData.newTitles && resultData.newTitles.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      AI Generated Titles
                    </h2>
                    <p className="text-sm text-gray-600">
                      Optimized titles based on channel analysis
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    New
                  </span>
                </div>

                <div className="space-y-3">
                  {resultData.newTitles.map((title, index) => (
                    <div
                      key={`new-${index}`}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:border-green-300 transition-colors group"
                    >
                      <p className="text-gray-900 flex-1 font-medium">
                        {title}
                      </p>
                      <button
                        onClick={() => handleCopyTitle(title)}
                        className="ml-4 text-green-400 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-center">
                    Results have been sent to{" "}
                    <span className="font-medium text-gray-900">
                      {resultData.emailSentTo}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!resultData.oldTitles || resultData.oldTitles.length === 0) &&
              (!resultData.newTitles || resultData.newTitles.length === 0) && (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Titles Generated
                  </h3>
                  <p className="text-sm text-gray-600">
                    We couldn't generate any titles. Please try again.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* How It Works Section */}
        {!showResults && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Enter Channel
                </h3>
                <p className="text-sm text-gray-600">
                  Provide the YouTube channel name you want to analyze
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Choose Email</h3>
                <p className="text-sm text-gray-600">
                  Select where to receive the generated titles
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Get Results</h3>
                <p className="text-sm text-gray-600">
                  AI generates optimized titles sent to your email
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
