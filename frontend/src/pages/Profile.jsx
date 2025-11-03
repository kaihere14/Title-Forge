import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { Link } from "react-router";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

const Profile = () => {
  const { userData, fetchUserData, isLoggedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [favLogs, setFavLogs] = useState([]);
  const [favLoading, setFavLoading] = useState(() => new Set());
  const [showAllFavs, setShowAllFavs] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      fetchUserData();
      paymentHistorHandler();
      fetchFavLogs();
      setIsLoading(false);
    };
    loadUserData();
  }, []);

  const fetchFavLogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/all-fav-logs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setFavLogs(response.data.favLogs || []);
      // Process the favorite logs as needed
    } catch (error) {
      console.error("Error fetching favorite logs:", error);
    }
  };

  const deleteAccountHandler = async () => {
    if (deleteConfirmText !== "delete") {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // Clear local storage and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmText("");
    }
  };
  const paymentHistorHandler = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/payment/fetch-payments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setPaymentHistory(response.data.payments || []);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Please log in to access your account and continue
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and subscription</p>
        </div>

        <div className="grid gap-6">
          {/* User Information Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Account Information
              </h2>
              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userData?.user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userData?.user?.username || "User"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Member since{" "}
                    {new Date(userData?.user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-3 py-3">
                <span className="text-sm font-medium text-gray-600">Email</span>
                <span className="col-span-2 text-sm text-gray-900">
                  {userData?.user?.email}
                </span>
              </div>

              {/* Credits */}
              <div className="grid grid-cols-3 py-3">
                <span className="text-sm font-medium text-gray-600">
                  Credits
                </span>
                <span className="col-span-2 text-sm font-semibold text-gray-900">
                  {userData?.user?.credits || 0} credits remaining
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Subscription
              </h2>
              {(!userData?.user?.subscription ||
                userData?.user?.subscription === "free") && (
                <Link
                  to="/pricing"
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>

            {userData?.user?.subscription &&
            userData?.user?.subscription !== "free" ? (
              <div className="space-y-4">
                {/* Subscription Status */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {typeof userData?.user?.subscription === "string"
                        ? userData.user.subscription.charAt(0).toUpperCase() +
                          userData.user.subscription.slice(1)
                        : userData?.user?.subscription?.plan || "Premium"}{" "}
                      Plan
                    </h3>
                    <p className="text-sm text-green-600">Active</p>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="grid grid-cols-3 py-3">
                  <span className="text-sm font-medium text-gray-600">
                    Plan
                  </span>
                  <span className="col-span-2 text-sm text-gray-900 capitalize">
                    {typeof userData?.user?.subscription === "string"
                      ? userData.user.subscription
                      : userData?.user?.subscription?.plan || "Premium"}
                  </span>
                </div>

                <div className="grid grid-cols-3 py-3">
                  <span className="text-sm font-medium text-gray-600">
                    Status
                  </span>
                  <span className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {typeof userData?.user?.subscription === "string"
                        ? "Active"
                        : userData?.user?.subscription?.status || "Active"}
                    </span>
                  </span>
                </div>

                {typeof userData?.user?.subscription === "object" && (
                  <div className="grid grid-cols-3 py-3">
                    <span className="text-sm font-medium text-gray-600">
                      Next billing
                    </span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {userData?.user?.subscription?.nextBillingDate
                        ? new Date(
                            userData.user.subscription.nextBillingDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                )}

                {/* Manage Subscription */}
                {typeof userData?.user?.subscription === "object" && (
                  <div className="pt-4 border-t border-gray-100">
                    <button className="text-sm text-red-600 hover:text-red-700 transition-colors">
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {userData?.user?.subscription === "free"
                    ? "Free Plan"
                    : "No Active Subscription"}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {userData?.user?.subscription === "free"
                    ? "Upgrade to a premium plan to unlock unlimited titles and advanced features"
                    : "Get started with a free plan or upgrade to premium for unlimited access"}
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Plans
                </Link>
              </div>
            )}
          </div>

          {/* Usage Stats Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Usage Statistics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {userData?.user?.credits || 0}
                </div>
                <div className="text-sm text-gray-600">Credits Left</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {userData?.user?.usedCredits || 0}
                </div>
                <div className="text-sm text-gray-600">Credits Used</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.floor(
                    Math.abs(new Date() - new Date(userData?.user?.createdAt)) /
                      (1000 * 60 * 60 * 24)
                  )}
                </div>

                <div className="text-sm text-gray-600">Days Active</div>
              </div>
            </div>
          </div>

          {/* Payment History Card */}
          {/* Favorites Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Favorites
            </h2>
            {favLogs && favLogs.length > 0 ? (
              (() => {
                const sortedFavs = favLogs
                  .slice()
                  .sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  );
                const favsToShow = showAllFavs
                  ? sortedFavs
                  : sortedFavs.slice(0, 3);

                return (
                  <div>
                    <div className="space-y-3">
                      {favsToShow.map((fav) => (
                        <div
                          key={fav._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {fav.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(fav.createdAt).toLocaleDateString()} at{" "}
                              {new Date(fav.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            {favLoading.has(fav._id) ? (
                              <svg
                                className="animate-spin ml-2 h-5 w-5 text-gray-500"
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
                                />
                              </svg>
                            ) : (
                              <button
                                onClick={async () => {
                                  if (favLoading.has(fav._id)) return;
                                  setFavLoading((prev) => {
                                    const next = new Set(prev);
                                    next.add(fav._id);
                                    return next;
                                  });
                                  try {
                                    await axios.post(
                                      `${
                                        import.meta.env.VITE_BACKEND_DOMAIN
                                      }/api/user/remove-fav-log`,
                                      { title: fav.title },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${localStorage.getItem(
                                            "accessToken"
                                          )}`,
                                        },
                                      }
                                    );
                                    setFavLogs((prev) =>
                                      prev.filter((f) => f._id !== fav._id)
                                    );
                                  } catch (err) {
                                    console.error(
                                      "Failed to remove favorite:",
                                      err
                                    );
                                    alert(
                                      "Failed to remove favorite. Please try again."
                                    );
                                  } finally {
                                    setFavLoading((prev) => {
                                      const next = new Set(prev);
                                      next.delete(fav._id);
                                      return next;
                                    });
                                  }
                                }}
                                className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-md"
                              >
                                <FaHeart /> Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {favLogs.length > 3 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setShowAllFavs((s) => !s)}
                          className="text-sm text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {showAllFavs
                            ? "Show less"
                            : `Show all (${favLogs.length})`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-8">
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
                  No Favorites
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  You haven't favorited any titles yet. Generate titles and
                  click the heart to save favorites.
                </p>
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment History
            </h2>
            {paymentHistory && paymentHistory.length > 0 ? (
              (() => {
                // show newest payments first
                const sorted = paymentHistory
                  .slice()
                  .sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  );
                const paymentsToShow = showAllPayments
                  ? sorted
                  : sorted.slice(0, 3);

                return (
                  <div>
                    <div className="space-y-3">
                      {paymentsToShow.map((payment) => (
                        <div
                          key={payment._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {/* Status Icon */}
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                payment.status === "completed"
                                  ? "bg-green-100"
                                  : payment.status === "failed"
                                  ? "bg-red-100"
                                  : "bg-yellow-100"
                              }`}
                            >
                              {payment.status === "completed" ? (
                                <svg
                                  className="h-5 w-5 text-green-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : payment.status === "failed" ? (
                                <svg
                                  className="h-5 w-5 text-red-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-5 w-5 text-yellow-600"
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
                              )}
                            </div>

                            {/* Payment Details */}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 capitalize">
                                  {payment.plan} Plan
                                </h3>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    payment.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : payment.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}{" "}
                                at{" "}
                                {new Date(payment.createdAt).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Order ID: {payment.merchantOrderId}
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ₹{(payment.amount / 100).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.plan === "starter"
                                ? "+5 credits"
                                : "+10 credits"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {paymentHistory.length > 3 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setShowAllPayments((s) => !s)}
                          className="text-sm text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {showAllPayments
                            ? "Show less"
                            : `Show all (${paymentHistory.length})`}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-8">
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Payment History
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  You haven't made any payments yet. Upgrade to a premium plan
                  to get started.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  View Plans
                </Link>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 text-center mb-6">
              This action cannot be undone. This will permanently delete your
              account and remove all your data.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">delete</span> to
                confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type delete here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccountHandler}
                disabled={deleteConfirmText !== "delete" || isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
