import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="animate-shimmer h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="animate-shimmer h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="animate-shimmer h-4 bg-gray-200 rounded"></div>
              <div className="animate-shimmer h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="animate-shimmer h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="animate-shimmer h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;