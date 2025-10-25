import React from "react";
import { useNavigate } from "react-router";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. Please try again.
          </p>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-red-900 mb-2">
              Common reasons for payment failure:
            </h3>
            <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
              <li>Insufficient funds in account</li>
              <li>Incorrect payment details</li>
              <li>Payment was cancelled</li>
              <li>Network connection issues</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/pricing")}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-6">
            Need help? Our support team is here to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Failure;
