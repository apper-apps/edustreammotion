import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CurriculumSidebar from "@/components/organisms/CurriculumSidebar";
import VideoUploadForm from "@/components/organisms/VideoUploadForm";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { videoService } from "@/services/api/videoService";
import { toast } from "react-toastify";

const VideoPlayer = ({ userGrade = "free" }) => {
  const { category, videoId } = useParams();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const canEdit = ["admin", category].includes(userGrade) || 
    (userGrade === "both" && ["membership", "master"].includes(category));

  useEffect(() => {
    if (videoId) {
      loadVideoData();
    }
  }, [videoId, category]);

  const loadVideoData = async () => {
    try {
      setLoading(true);
      setError(null);

      const videoData = await videoService.getById(parseInt(videoId));
      
      if (!videoData) {
        setError("강의를 찾을 수 없습니다.");
        return;
      }

      // Check access
      if (!checkAccess(userGrade, videoData.accessLevels)) {
        setError("이 강의에 접근할 권한이 없습니다.");
        return;
      }

      setVideo(videoData);

      // Load related videos
      const allVideos = category === "master" 
        ? await videoService.getMasterVideos()
        : await videoService.getMembershipVideos();
      
      setRelatedVideos(allVideos.filter(v => v.Id !== videoData.Id));
    } catch (err) {
      setError("강의를 불러오는데 실패했습니다.");
      console.error("Error loading video:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (selectedVideo) => {
    navigate(`/${category}/video/${selectedVideo.Id}`);
  };

  const handleEditVideo = () => {
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (formData) => {
    try {
      setEditLoading(true);
      await videoService.update(video.Id, {
        ...formData,
        category: video.category
      });
      toast.success("강의가 수정되었습니다.");
      setShowEditModal(false);
      loadVideoData();
    } catch (err) {
      toast.error("수정 중 오류가 발생했습니다.");
      console.error("Error updating video:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    // YouTube URL conversion
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo URL conversion
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadVideoData}
      />
    );
  }

  if (!video) {
    return (
      <Error 
        message="강의를 찾을 수 없습니다."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Content */}
          <div className="flex-1">
            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="aspect-video bg-black">
                <iframe
                  src={getEmbedUrl(video.videoUrl)}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {video.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {video.accessLevels?.map(level => (
                        <Badge key={level} variant={level}>
                          {getGradeLabel(level)}
                        </Badge>
                      ))}
                      {video.isPinned && (
                        <Badge variant="warning">
                          <ApperIcon name="Pin" className="w-3 h-3 mr-1" />
                          고정
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {canEdit && (
                    <Button
                      onClick={handleEditVideo}
                      variant="outline"
                      icon="Edit"
                    >
                      수정
                    </Button>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {video.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(video.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Folder" className="w-4 h-4 mr-1" />
                    <span>{video.topic || video.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Curriculum (shows below video on mobile) */}
            <div className="lg:hidden">
              <CurriculumSidebar
                videos={relatedVideos}
                currentVideo={video}
                onVideoSelect={handleVideoSelect}
                userGrade={userGrade}
              />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80">
            <CurriculumSidebar
              videos={relatedVideos}
              currentVideo={video}
              onVideoSelect={handleVideoSelect}
              userGrade={userGrade}
            />
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="강의 수정"
          size="xl"
        >
          <VideoUploadForm
            onSubmit={handleSubmitEdit}
            onCancel={() => setShowEditModal(false)}
            initialData={{
              ...video,
              videos: [{ 
                title: video.title, 
                videoUrl: video.videoUrl, 
                description: video.description 
              }]
            }}
            loading={editLoading}
          />
        </Modal>
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

export default VideoPlayer;