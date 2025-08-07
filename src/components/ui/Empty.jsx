import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "표시할 내용이 없습니다", 
  description = "새로운 콘텐츠를 추가해보세요",
  action,
  actionLabel = "추가하기",
  icon = "Package",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] text-center p-8 ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;