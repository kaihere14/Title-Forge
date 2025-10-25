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

export const TitlesSectionSkeleton = ({ count = 5, variant = "gray" }) => {
  const bgColor = variant === "green" ? "bg-green-50" : "bg-gray-50";
  const borderColor =
    variant === "green" ? "border-green-100" : "border-gray-100";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          {variant === "green" && (
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          )}
        </div>
        {variant === "green" ? (
          <div className="h-6 w-16 bg-green-200 rounded-full"></div>
        ) : (
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        )}
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 ${bgColor} rounded-lg border ${borderColor}`}
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="ml-4 w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Channel Info Skeleton */}
      <ChannelInfoSkeleton />

      {/* Old Titles Skeleton */}
      <TitlesSectionSkeleton count={5} variant="gray" />

      {/* New Titles Skeleton */}
      <TitlesSectionSkeleton count={5} variant="green" />
    </div>
  );
};

export default {
  TitleCardSkeleton,
  ChannelInfoSkeleton,
  TitlesSectionSkeleton,
  DashboardLoadingSkeleton,
};
