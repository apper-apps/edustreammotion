import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const VideoCard = ({ 
  video, 
  onClick, 
  onEdit, 
  onPin, 
  onDelete, 
  showActions = false,
  userGrade = "free",
  className = "" 
}) => {
  const hasAccess = checkAccess(userGrade, video.accessLevels);
  
  const handleCardClick = () => {
    if (hasAccess && onClick) {
      onClick(video);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(video);
  };

  const handlePin = (e) => {
    e.stopPropagation();
    if (onPin) onPin(video);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(video);
  };

  return (
    <div className={cn(
      "group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      hasAccess ? "cursor-pointer" : "opacity-60",
      className
    )}>
      <div className="relative aspect-video">
        <img
          src={video.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
          alt={video.title}
          className="w-full h-full object-cover"
          onClick={handleCardClick}
        />
        
        {video.isPinned && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning" size="xs">
              <ApperIcon name="Pin" className="w-3 h-3 mr-1" />
              고정
            </Badge>
          </div>
        )}

        {!hasAccess && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <ApperIcon name="Lock" className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">접근 권한이 필요합니다</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ApperIcon name="Play" className="w-6 h-6 text-primary-600 ml-1" />
            </div>
          </div>
        )}

        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePin}
              className="p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              title={video.isPinned ? "고정 해제" : "고정하기"}
            >
              <ApperIcon name="Pin" className={cn("w-4 h-4", video.isPinned ? "text-amber-600" : "text-gray-600")} />
            </button>
            <button
              onClick={handleEdit}
              className="p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              title="수정하기"
            >
              <ApperIcon name="Edit" className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
              title="삭제하기"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {video.accessLevels?.map(level => (
            <Badge key={level} variant={level} size="xs">
              {getGradeLabel(level)}
            </Badge>
          ))}
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {video.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{video.category}</span>
          <span>{formatDuration(video.duration)}</span>
        </div>
      </div>
    </div>
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

function formatDuration(seconds) {
  if (!seconds) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default VideoCard;