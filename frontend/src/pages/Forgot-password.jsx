import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Forgot_password = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Step 1: Send OTP to email
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/generate-otp`,
                { email }
            );
            setSuccess("OTP sent to your email!");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setSuccess("OTP verified! Enter your new password");
        setStep(3);
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/forgot-password`,
                { email, otp, newPassword }
            );
            setSuccess("Password reset successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] bg-white flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Reset Password
                    </h2>
                    <p className="text-gray-600">
                        {step === 1 && "Enter your email to receive a verification code"}
                        {step === 2 && "Enter the 6-digit code sent to your email"}
                        {step === 3 && "Create a new secure password"}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-2">
                        {/* Step 1 */}
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {step > 1 ? (
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                "1"
                            )}
                        </div>
                        <div
                            className={`h-1 w-16 ${step >= 2 ? "bg-black" : "bg-gray-200"}`}
                        ></div>

                        {/* Step 2 */}
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {step > 2 ? (
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                "2"
                            )}
                        </div>
                        <div
                            className={`h-1 w-16 ${step >= 3 ? "bg-black" : "bg-gray-200"}`}
                        ></div>

                        {/* Step 3 */}
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step >= 3 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            3
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 text-red-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-red-800 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-green-800 font-medium">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP}>
                            <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Verification Code"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Input */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP}>
                            <div className="mb-6">
                                <label
                                    htmlFor="otp"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-center text-2xl font-mono tracking-widest"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Check your email for the verification code
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                            >
                                Verify Code
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Back to Email
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-6">
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Password Requirements */}
                            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1 font-medium">
                                    Password Requirements:
                                </p>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    <li className="flex items-center gap-1">
                                        <span
                                            className={
                                                newPassword.length >= 6
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            ✓
                                        </span>{" "}
                                        At least 6 characters
                                    </li>
                                    <li className="flex items-center gap-1">
                                        <span
                                            className={
                                                newPassword === confirmPassword && newPassword !== ""
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            ✓
                                        </span>{" "}
                                        Passwords match
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Back to OTP
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-black font-semibold hover:underline"
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Forgot_password;
