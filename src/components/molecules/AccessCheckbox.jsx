import React from "react";
import { cn } from "@/utils/cn";

const AccessCheckbox = ({ 
  selectedLevels = [], 
  onChange, 
  className = "" 
}) => {
  const accessLevels = [
    { value: "free", label: "무료", description: "누구나 접근 가능" },
    { value: "member", label: "멤버", description: "멤버 등급 이상" },
    { value: "master", label: "마스터", description: "마스터 등급 이상" },
    { value: "both", label: "멤버+마스터", description: "멤버와 마스터 모두" }
  ];

  const handleLevelChange = (level, checked) => {
    if (checked) {
      onChange([...selectedLevels, level]);
    } else {
      onChange(selectedLevels.filter(l => l !== level));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        접근 권한 설정
      </label>
      
      <div className="space-y-2">
        {accessLevels.map(level => (
          <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedLevels.includes(level.value)}
              onChange={(e) => handleLevelChange(level.value, e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {level.label}
              </div>
              <div className="text-xs text-gray-500">
                {level.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      {selectedLevels.length === 0 && (
        <p className="text-xs text-red-500">
          최소 하나의 접근 권한을 선택해주세요.
        </p>
      )}
    </div>
  );
};

export default AccessCheckbox;