import React from "react";

export const TitleCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="ml-4 w-5 h-5 bg-gray-200 rounded"></div>
    </div>
  );
};

export const ChannelInfoSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";

export const TitlesSectionSkeleton = ({ count = 5, variant = "gray" }) => {
  const [phase, setPhase] = useState("analyzing"); // "analyzing" or "enhancing"
  const [visibleItems, setVisibleItems] = useState(0);

  const bgColor = variant === "green" ? "bg-green-50" : "bg-gray-50";
  const borderColor =
    variant === "green" ? "border-green-500" : "border-gray-100";
  const titleText =
    variant === "green" ? "AI Generated Titles" : "Original Titles";
  const subtitleText =
    variant === "green"
      ? "Optimized titles based on channel analysis"
      : "Recent titles from the channel";

  useEffect(() => {
    // Phase 1: Analyzing (10 seconds)
    const analyzingTimer = setTimeout(() => {
      setPhase("enhancing");
    }, 10000);

    // Phase 2: Progressive item reveal
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
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      {/* Header - matching Dashboard design */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {titleText}
          </h2>
          <p className="text-sm text-gray-600">{subtitleText}</p>
        </div>
        {variant === "green" ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
            New
          </span>
        ) : (
          <span className="text-sm text-gray-600 animate-pulse">
            {count} titles
          </span>
        )}
      </div>

      {/* Phase Indicator */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">
            {phase === "analyzing" ? (
              <>
                <span className="inline-block">Analyzing tone and details</span>
                <span className="inline-block animate-pulse">...</span>
              </>
            ) : (
              <>
                <span className="inline-block">Enhancing titles</span>
                <span className="inline-block animate-pulse">...</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content Items - matching Dashboard title cards */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => {
          const isVisible = phase === "enhancing" && index < visibleItems;
          const isAnimating =
            phase === "enhancing" && index === visibleItems - 1;

          return (
            <div
              key={index}
              className={`transition-all duration-500 ${
                phase === "analyzing"
                  ? "opacity-30"
                  : isVisible
                  ? "opacity-100"
                  : "opacity-30"
              }`}
            >
              <div
                className={`flex items-center justify-between p-4 ${bgColor} rounded-lg border ${borderColor} ${
                  isAnimating ? "ring-2 ring-blue-300 ring-opacity-50" : ""
                } hover:${
                  variant === "green" ? "border-green-300" : "border-gray-300"
                } transition-colors group`}
              >
                <div className="flex-1 space-y-2">
                  <div className="relative overflow-hidden h-4 bg-gray-200 rounded w-full">
                    {isAnimating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    )}
                  </div>
                  <div className="relative overflow-hidden h-4 bg-gray-200 rounded w-3/4">
                    {isAnimating && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    )}
                  </div>
                </div>
                {/* Copy icon placeholder */}
                <div className="ml-4 w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - only for green variant to match Dashboard */}
      {variant === "green" && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
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
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Channel Info Skeleton */}
      <ChannelInfoSkeleton />

      {/* New Titles Skeleton - NOW ON TOP */}
      <TitlesSectionSkeleton count={5} variant="green" />

      {/* Old Titles Skeleton - NOW ON BOTTOM */}
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
