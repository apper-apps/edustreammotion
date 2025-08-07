import React, { useState, useEffect } from "react";
import VideoGrid from "@/components/organisms/VideoGrid";
import VideoUploadForm from "@/components/organisms/VideoUploadForm";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";
import { videoService } from "@/services/api/videoService";
import { toast } from "react-toastify";

const Membership = ({ userGrade = "free" }) => {
  const navigate = useNavigate();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const canManage = ["admin", "member", "both"].includes(userGrade);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoService.getMembershipVideos();
      setVideos(data);
    } catch (err) {
      setError("강의를 불러오는데 실패했습니다.");
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    navigate(`/membership/video/${video.Id}`);
  };

  const handleAddVideo = () => {
    setEditingVideo(null);
    setShowUploadModal(true);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setShowUploadModal(true);
  };

  const handlePinVideo = async (video) => {
    try {
      await videoService.update(video.Id, { ...video, isPinned: !video.isPinned });
      toast.success(video.isPinned ? "고정이 해제되었습니다." : "상단에 고정되었습니다.");
      loadVideos();
    } catch (err) {
      toast.error("처리 중 오류가 발생했습니다.");
      console.error("Error pinning video:", err);
    }
  };

  const handleDeleteVideo = async (video) => {
    if (window.confirm("정말로 이 강의를 삭제하시겠습니까?")) {
      try {
        await videoService.delete(video.Id);
        toast.success("강의가 삭제되었습니다.");
        loadVideos();
      } catch (err) {
        toast.error("삭제 중 오류가 발생했습니다.");
        console.error("Error deleting video:", err);
      }
    }
  };

  const handleSubmitVideo = async (formData) => {
    try {
      setUploadLoading(true);
      
      if (editingVideo) {
        await videoService.update(editingVideo.Id, {
          ...formData,
          category: "membership"
        });
        toast.success("강의가 수정되었습니다.");
      } else {
        // Create multiple videos for the curriculum
        for (const videoData of formData.videos) {
          await videoService.create({
            title: videoData.title,
            description: videoData.description,
            thumbnailUrl: formData.thumbnailUrl,
            videoUrl: videoData.videoUrl,
            topic: formData.topic,
            category: "membership",
            accessLevels: formData.accessLevels,
            isPinned: formData.isPinned,
            createdAt: new Date().toISOString()
          });
        }
        toast.success("강의가 등록되었습니다.");
      }
      
      setShowUploadModal(false);
      setEditingVideo(null);
      loadVideos();
    } catch (err) {
      toast.error("처리 중 오류가 발생했습니다.");
      console.error("Error submitting video:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              멤버십 강의
            </h1>
            <p className="text-gray-600">
              멤버 전용 고품질 강의로 전문성을 키워보세요
            </p>
          </div>
          
          {canManage && (
            <Button
              onClick={handleAddVideo}
              icon="Plus"
              size="lg"
            >
              강의 업로드
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-primary-100 mr-4">
                <ApperIcon name="Video" className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">총 강의</p>
                <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-secondary-100 mr-4">
                <ApperIcon name="Users" className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">접근 등급</p>
                <p className="text-2xl font-bold text-gray-900">멤버 이상</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-accent-100 mr-4">
                <ApperIcon name="Star" className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">고정 강의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {videos.filter(v => v.isPinned).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          onVideoClick={handleVideoClick}
          onVideoEdit={canManage ? handleEditVideo : null}
          onVideoPin={canManage ? handlePinVideo : null}
          onVideoDelete={canManage ? handleDeleteVideo : null}
          onRetry={loadVideos}
          showActions={canManage}
          userGrade={userGrade}
          emptyTitle="등록된 멤버십 강의가 없습니다"
          emptyDescription="새로운 멤버십 강의를 추가해보세요"
          onAddVideo={canManage ? handleAddVideo : null}
        />

        {/* Upload Modal */}
        <Modal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setEditingVideo(null);
          }}
          title={editingVideo ? "강의 수정" : "새 강의 업로드"}
          size="xl"
        >
          <VideoUploadForm
            onSubmit={handleSubmitVideo}
            onCancel={() => {
              setShowUploadModal(false);
              setEditingVideo(null);
            }}
            initialData={editingVideo}
            loading={uploadLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Membership;