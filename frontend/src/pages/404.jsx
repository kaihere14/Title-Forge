export default function Orange404Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 with Orange Theme */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-black text-gray-200 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-64 h-64"
              viewBox="0 0 200 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Orange fruit illustration */}
              <circle cx="100" cy="75" r="45" fill="#FF8C42" />
              <circle cx="100" cy="75" r="42" fill="#FFA45C" />

              {/* Leaf */}
              <ellipse cx="100" cy="25" rx="12" ry="18" fill="#4CAF50" />
              <path
                d="M 100 25 Q 95 35 100 43"
                stroke="#2E7D32"
                strokeWidth="2"
                fill="none"
              />

              {/* Orange segments */}
              <path
                d="M 100 75 L 100 30"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 130 50"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 140 75"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 130 100"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 100 120"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 70 100"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 60 75"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <path
                d="M 100 75 L 70 50"
                stroke="#FF6B1A"
                strokeWidth="1.5"
                opacity="0.3"
              />

              {/* Highlight */}
              <circle cx="85" cy="60" r="8" fill="#FFD700" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-black mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-lg text-black mb-8 max-w-md mx-auto">
          The page you're looking for seems to have rolled away. Don't worry,
          we'll help you get back on track!
        </p>

        {/* Button */}
        <button
          onClick={() => window.history.back()}
          className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Go Back Home
        </button>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-4">
          <div
            className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
