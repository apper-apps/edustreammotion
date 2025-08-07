import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const CurriculumSidebar = ({ 
  videos = [], 
  currentVideo = null, 
  onVideoSelect,
  userGrade = "free",
  className = "" 
}) => {
  const [expandedTopics, setExpandedTopics] = useState(new Set());

  // Group videos by topic/category
  const groupedVideos = videos.reduce((acc, video) => {
    const topic = video.topic || video.category || "기타";
    if (!acc[topic]) {
      acc[topic] = [];
    }
    acc[topic].push(video);
    return acc;
  }, {});

  const toggleTopic = (topic) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };

  const hasAccess = (video) => {
    if (!video.accessLevels || video.accessLevels.length === 0) return true;
    if (userGrade === "admin") return true;
    if (userGrade === "both") return video.accessLevels.some(level => ["free", "member", "master"].includes(level));
    return video.accessLevels.includes(userGrade);
  };

  return (
    <div className={cn("w-full bg-white rounded-lg border border-gray-200 overflow-hidden", className)}>
      <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ApperIcon name="List" className="w-5 h-5 mr-2" />
          강의 목록
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          총 {videos.length}개 강의
        </p>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {Object.entries(groupedVideos).map(([topic, topicVideos]) => {
          const isExpanded = expandedTopics.has(topic);
          
          return (
            <div key={topic} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleTopic(topic)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <ApperIcon 
                    name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                    className="w-4 h-4 mr-2 text-gray-400" 
                  />
                  <span className="font-medium text-gray-900">{topic}</span>
                  <span className="ml-2 text-sm text-gray-500">({topicVideos.length})</span>
                </div>
              </button>

              {isExpanded && (
                <div className="bg-gray-50">
                  {topicVideos.map((video, index) => {
                    const videoHasAccess = hasAccess(video);
                    const isCurrentVideo = currentVideo?.Id === video.Id;
                    
                    return (
                      <div
                        key={video.Id}
                        className={cn(
                          "flex items-center p-3 cursor-pointer transition-colors duration-200",
                          isCurrentVideo ? "bg-primary-100 border-l-4 border-primary-500" : "hover:bg-white",
                          !videoHasAccess && "opacity-50"
                        )}
                        onClick={() => videoHasAccess && onVideoSelect && onVideoSelect(video)}
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded text-xs font-medium flex items-center justify-center text-gray-600 mr-3">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            "text-sm font-medium truncate",
                            isCurrentVideo ? "text-primary-700" : "text-gray-900"
                          )}>
                            {video.title}
                          </h4>
                          
                          <div className="flex items-center mt-1 space-x-2">
                            <div className="flex space-x-1">
                              {video.accessLevels?.map(level => (
                                <Badge key={level} variant={level} size="xs">
                                  {getGradeLabel(level)}
                                </Badge>
                              ))}
                            </div>
                            
                            {!videoHasAccess && (
                              <ApperIcon name="Lock" className="w-3 h-3 text-gray-400" />
                            )}
                            
                            {isCurrentVideo && (
                              <ApperIcon name="Play" className="w-3 h-3 text-primary-600" />
                            )}
                            
                            {video.isPinned && (
                              <ApperIcon name="Pin" className="w-3 h-3 text-amber-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
  return labels[grade] || grade;
}

export default CurriculumSidebar;