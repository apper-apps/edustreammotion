import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const BlogCard = ({ 
  post, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  userGrade = "free",
  className = "" 
}) => {
  const hasAccess = checkAccess(userGrade, post.accessLevels);
  
  const handleCardClick = () => {
    if (hasAccess && onClick) {
      onClick(post);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(post);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(post);
  };

  return (
    <article className={cn(
      "group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      hasAccess ? "cursor-pointer" : "opacity-60",
      className
    )}>
      <div className="relative aspect-video sm:aspect-[4/3]">
        <img
          src={post.featuredImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          alt={post.title}
          className="w-full h-full object-cover"
          onClick={handleCardClick}
        />
        
        {!hasAccess && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <ApperIcon name="Lock" className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">접근 권한이 필요합니다</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleEdit}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              title="수정하기"
            >
              <ApperIcon name="Edit" className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              title="삭제하기"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {post.accessLevels?.map(level => (
            <Badge key={level} variant={level} size="xs">
              {getGradeLabel(level)}
            </Badge>
          ))}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {post.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
            <span>{format(new Date(post.publishedAt), "yyyy.MM.dd")}</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
            <span>{estimateReadTime(post.content)} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
};

function checkAccess(userGrade, accessLevels) {
  if (!accessLevels || accessLevels.length === 0) return true;
  if (userGrade === "admin") return true;
  if (userGrade === "both") return accessLevels.some(level => ["free", "member", "master"].includes(level));
  return accessLevels.includes(userGrade);
}

function getGradeLabel(grade) {
  const labels = {
    free: "무료",
    member: "멤버",
    master: "마스터",
    both: "멤버+마스터",
    admin: "관리자"
  };
  return labels[grade] || grade;
}

function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  return Math.ceil(words / wordsPerMinute) || 1;
}

export default BlogCard;