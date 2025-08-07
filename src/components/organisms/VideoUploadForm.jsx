import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import AccessCheckbox from "@/components/molecules/AccessCheckbox";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const VideoUploadForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    topic: initialData?.topic || "",
    description: initialData?.description || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    accessLevels: initialData?.accessLevels || ["free"],
    isPinned: initialData?.isPinned || false,
    videos: initialData?.videos || [{ title: "", videoUrl: "", description: "" }]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = formData.videos.map((video, i) => 
      i === index ? { ...video, [field]: value } : video
    );
    setFormData(prev => ({
      ...prev,
      videos: updatedVideos
    }));
  };

  const addVideo = () => {
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, { title: "", videoUrl: "", description: "" }]
    }));
  };

  const removeVideo = (index) => {
    if (formData.videos.length > 1) {
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("주제 제목을 입력해주세요.");
      return;
    }

    if (!formData.topic.trim()) {
      toast.error("주제를 입력해주세요.");
      return;
    }

    if (formData.accessLevels.length === 0) {
      toast.error("최소 하나의 접근 권한을 선택해주세요.");
      return;
    }

    const validVideos = formData.videos.filter(video => 
      video.title.trim() && video.videoUrl.trim()
    );

    if (validVideos.length === 0) {
      toast.error("최소 하나의 강의 영상을 추가해주세요.");
      return;
    }

    const submitData = {
      ...formData,
      videos: validVideos,
      thumbnailUrl: formData.thumbnailUrl.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="주제 제목"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="강의 주제 제목을 입력하세요"
          required
        />
        
        <Input
          label="카테고리/주제"
          value={formData.topic}
          onChange={(e) => handleInputChange("topic", e.target.value)}
          placeholder="카테고리를 입력하세요"
          required
        />
      </div>

      <TextArea
        label="주제 설명"
        value={formData.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="강의 주제에 대한 설명을 입력하세요"
        rows={3}
      />

      <Input
        label="썸네일 이미지 URL"
        value={formData.thumbnailUrl}
        onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
        placeholder="썸네일 이미지 URL (비워두면 기본 이미지 사용)"
        helperText="이미지 URL을 입력하지 않으면 기본 이미지가 사용됩니다."
      />

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isPinned"
          checked={formData.isPinned}
          onChange={(e) => handleInputChange("isPinned", e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
          상단 고정
        </label>
      </div>

      <AccessCheckbox
        selectedLevels={formData.accessLevels}
        onChange={(levels) => handleInputChange("accessLevels", levels)}
      />

      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">강의 영상 목록</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVideo}
            icon="Plus"
          >
            영상 추가
          </Button>
        </div>

        <div className="space-y-4">
          {formData.videos.map((video, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">영상 {index + 1}</h4>
                {formData.videos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVideo(index)}
                    icon="Trash2"
                    className="text-red-600 hover:text-red-700"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="영상 제목"
                  value={video.title}
                  onChange={(e) => handleVideoChange(index, "title", e.target.value)}
                  placeholder="영상 제목을 입력하세요"
                  required
                />
                
                <Input
                  label="영상 URL"
                  value={video.videoUrl}
                  onChange={(e) => handleVideoChange(index, "videoUrl", e.target.value)}
                  placeholder="YouTube URL, Vimeo URL 등"
                  required
                />
              </div>

              <TextArea
                label="영상 설명"
                value={video.description}
                onChange={(e) => handleVideoChange(index, "description", e.target.value)}
                placeholder="영상에 대한 설명을 입력하세요"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          type="submit"
          loading={loading}
          icon="Save"
        >
          {initialData ? "수정하기" : "등록하기"}
        </Button>
      </div>
    </form>
  );
};

export default VideoUploadForm;