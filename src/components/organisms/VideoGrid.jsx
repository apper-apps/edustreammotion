import React from "react";
import VideoCard from "@/components/molecules/VideoCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const VideoGrid = ({ 
  videos, 
  loading, 
  error, 
  onVideoClick,
  onVideoEdit,
  onVideoPin,
  onVideoDelete,
  onRetry,
  showActions = false,
  userGrade = "free",
  emptyTitle = "등록된 강의가 없습니다",
  emptyDescription = "새로운 강의를 추가해보세요",
  onAddVideo
}) => {
  if (loading) {
    return <Loading className="mt-8" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={onRetry}
        className="mt-8"
      />
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        action={onAddVideo}
        actionLabel="강의 추가"
        icon="Video"
        className="mt-8"
      />
    );
  }

  // Sort videos: pinned first, then by creation date
  const sortedVideos = [...videos].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {sortedVideos.map((video) => (
        <VideoCard
          key={video.Id}
          video={video}
          onClick={onVideoClick}
          onEdit={onVideoEdit}
          onPin={onVideoPin}
          onDelete={onVideoDelete}
          showActions={showActions}
          userGrade={userGrade}
        />
      ))}
    </div>
  );
};

export default VideoGrid;