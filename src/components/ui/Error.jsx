import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "오류가 발생했습니다", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center p-8 ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">문제가 발생했습니다</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          다시 시도
        </button>
      )}
    </div>
  );
};

export default Error;