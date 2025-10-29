import React, { useState, useEffect } from "react";

export const TitleCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/60 shadow-sm">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      
      <div className="flex-1 space-y-3 relative z-10">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 animate-pulse" style={{ animationDelay: '150ms' }}></div>
      </div>
      <div className="ml-4 w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md animate-pulse" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export const ChannelInfoSkeleton = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 border border-gray-200/60 rounded-2xl p-6 shadow-lg">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse shadow-sm"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/5 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/5 animate-pulse" style={{ animationDelay: '200ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export const TitlesSectionSkeleton = ({ count = 5, variant = "gray" }) => {
  const [phase, setPhase] = useState("analyzing");
  const [visibleItems, setVisibleItems] = useState(0);

  const bgColor = variant === "green" ? "from-emerald-50 to-green-50/30" : "from-gray-50 to-slate-50/30";
  const borderColor = variant === "green" ? "border-emerald-200/60" : "border-gray-200/60";
  const ringColor = variant === "green" ? "ring-emerald-300/50" : "ring-blue-300/50";
  const badgeColor = variant === "green" ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700" : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700";
  const iconBg = variant === "green" ? "from-emerald-200 to-green-300" : "from-gray-200 to-gray-300";
  
  const titleText = variant === "green" ? "AI Generated Titles" : "Original Titles";
  const subtitleText = variant === "green"
    ? "Optimized titles based on channel analysis"
    : "Recent titles from the channel";

  useEffect(() => {
    const analyzingTimer = setTimeout(() => {
      setPhase("enhancing");
    }, 10000);

    if (phase === "enhancing") {
      let currentItem = 0;
      const itemInterval = setInterval(() => {
        if (currentItem <= count) {
          setVisibleItems(currentItem);
          currentItem++;
        } else {
          clearInterval(itemInterval);
        }
      }, 3000);

      return () => clearInterval(itemInterval);
    }

    return () => clearTimeout(analyzingTimer);
  }, [phase, count]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/20 border border-gray-200/60 rounded-2xl p-8 shadow-lg">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
            {titleText}
          </h2>
          <p className="text-sm text-gray-600">{subtitleText}</p>
        </div>
        {variant === "green" ? (
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold ${badgeColor} shadow-sm animate-pulse`}>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-ping absolute"></span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 relative"></span>
            New
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-500 animate-pulse px-3 py-1 bg-gray-100/80 rounded-full">
            {count} titles
          </span>
        )}
      </div>

      {/* Enhanced Phase Indicator */}
      <div className="mb-6 flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-xl border border-blue-100/50 relative z-10">
        <div className="relative flex items-center justify-center">
          <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-3 h-3 bg-blue-400/30 rounded-full animate-ping"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 font-semibold">
            {phase === "analyzing" ? (
              <>
                <span className="inline-block">Analyzing tone and details</span>
                <span className="inline-block animate-bounce">...</span>
              </>
            ) : (
              <>
                <span className="inline-block">Enhancing titles</span>
                <span className="inline-block animate-bounce">...</span>
              </>
            )}
          </span>
        </div>
        {/* Progress bar */}
        <div className="ml-auto">
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000 ${
              phase === "analyzing" ? "w-1/2" : "w-full"
            }`}></div>
          </div>
        </div>
      </div>

      {/* Content Items */}
      <div className="space-y-3 relative z-10">
        {Array.from({ length: count }).map((_, index) => {
          const isVisible = phase === "enhancing" && index < visibleItems;
          const isAnimating = phase === "enhancing" && index === visibleItems - 1;

          return (
            <div
              key={index}
              className={`transition-all duration-700 transform ${
                phase === "analyzing"
                  ? "opacity-40 scale-[0.98]"
                  : isVisible
                  ? "opacity-100 scale-100"
                  : "opacity-40 scale-[0.98]"
              }`}
            >
              <div
                className={`relative overflow-hidden flex items-center justify-between p-5 bg-gradient-to-br ${bgColor} rounded-xl border ${borderColor} ${
                  isAnimating ? `ring-2 ${ringColor} shadow-lg` : "shadow-sm"
                } hover:shadow-md hover:scale-[1.01] transition-all duration-300 group`}
              >
                {isAnimating && (
                  <div className="absolute inset-0 -translate-x-full animate-shimmer-fast bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                )}
                
                <div className="flex-1 space-y-3 relative z-10">
                  <div className="relative overflow-hidden h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full">
                    {isAnimating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-fast"></div>
                    )}
                  </div>
                  <div className="relative overflow-hidden h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4">
                    {isAnimating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer-fast" style={{ animationDelay: '200ms' }}></div>
                    )}
                  </div>
                </div>
                
                <div className={`ml-4 w-6 h-6 bg-gradient-to-br ${iconBg} rounded-lg animate-pulse shadow-sm group-hover:scale-110 transition-transform duration-300`}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Footer */}
      {variant === "green" && (
        <div className="mt-8 pt-6 border-t border-gray-200/60 relative z-10">
          <div className="flex items-center justify-center gap-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-emerald-200 via-green-300 to-emerald-200 rounded-lg w-40 animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        .animate-shimmer-fast {
          animation: shimmer-fast 1.2s infinite;
        }
      `}</style>
    </div>
  );
};

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <ChannelInfoSkeleton />
      <TitlesSectionSkeleton count={5} variant="green" />
      <TitlesSectionSkeleton count={5} variant="gray" />
    </div>
  );
};

export default {
  TitleCardSkeleton,
  ChannelInfoSkeleton,
  TitlesSectionSkeleton,
  DashboardLoadingSkeleton,
};