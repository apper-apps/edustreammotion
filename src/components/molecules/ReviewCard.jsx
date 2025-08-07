import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ReviewCard = ({ 
  review, 
  onEdit, 
  onDelete, 
  onToggleVisibility, 
  showActions = false,
  isAdmin = false,
  className = "" 
}) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(review);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(review);
  };

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    if (onToggleVisibility) onToggleVisibility(review);
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md",
      review.isHidden && "opacity-50 border-red-200 bg-red-50",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {review.userName?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                {review.userName || "익명 사용자"}
              </h4>
              <Badge variant={review.userGrade || "free"} size="xs">
                {getGradeLabel(review.userGrade)}
              </Badge>
              {review.isHidden && (
                <Badge variant="danger" size="xs">
                  숨김
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {format(new Date(review.createdAt), "yyyy.MM.dd HH:mm")}
            </p>
          </div>
        </div>

        {(showActions || isAdmin) && (
          <div className="flex items-center space-x-1">
            {showActions && (
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="수정하기"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </button>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={handleToggleVisibility}
                  className={cn(
                    "p-1 transition-colors duration-200",
                    review.isHidden 
                      ? "text-green-400 hover:text-green-600" 
                      : "text-amber-400 hover:text-amber-600"
                  )}
                  title={review.isHidden ? "표시하기" : "숨기기"}
                >
                  <ApperIcon name={review.isHidden ? "Eye" : "EyeOff"} className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                  title="삭제하기"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <ApperIcon name="MessageCircle" className="w-4 h-4 mr-1" />
            {review.content?.length || 0}/500
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center text-gray-400 hover:text-primary-500 transition-colors duration-200">
            <ApperIcon name="Heart" className="w-4 h-4 mr-1" />
            <span>{review.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function getGradeLabel(grade) {
  const labels = {
    free: "무료",
    member: "멤버",
    master: "마스터",
    both: "멤버+마스터",
    admin: "관리자"
  };
  return labels[grade] || "무료";
}

export default ReviewCard;