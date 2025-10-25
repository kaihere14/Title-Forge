import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

const PaymentVerify = () => {
  const { merchantOrderId } = useParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/api/payment/verify-payment`,
          {
            merchantOrderId: merchantOrderId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        response.data.redirectUrl && (window.location.href = response.data.redirectUrl);

        // Backend will handle redirect
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    if (merchantOrderId) {
      verifyPayment();
    }
  }, [merchantOrderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="animate-spin h-8 w-8 text-gray-900"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we confirm your payment...
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Do not refresh or close this page
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;
