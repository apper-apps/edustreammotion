import React, { useState, useEffect } from "react";
import ReviewComposer from "@/components/organisms/ReviewComposer";
import ReviewCard from "@/components/molecules/ReviewCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/atoms/Modal";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";

const Reviews = ({ userGrade = "free" }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editContent, setEditContent] = useState("");

  const isAdmin = userGrade === "admin";

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewService.getAll();
      
      // Filter hidden reviews for non-admin users
      const filteredData = isAdmin ? data : data.filter(review => !review.isHidden);
      setReviews(filteredData);
    } catch (err) {
      setError("후기를 불러오는데 실패했습니다.");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (content) => {
    try {
      setSubmitLoading(true);
      await reviewService.create({
        content,
        userName: `사용자${Math.floor(Math.random() * 1000)}`,
        userGrade,
        isHidden: false,
        likes: 0,
        createdAt: new Date().toISOString()
      });
      toast.success("후기가 작성되었습니다.");
      loadReviews();
    } catch (err) {
      toast.error("후기 작성 중 오류가 발생했습니다.");
      console.error("Error creating review:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditContent(review.content);
    setShowEditModal(true);
  };

  const handleSubmitEdit = async () => {
    try {
      await reviewService.update(editingReview.Id, {
        ...editingReview,
        content: editContent
      });
      toast.success("후기가 수정되었습니다.");
      setShowEditModal(false);
      setEditingReview(null);
      setEditContent("");
      loadReviews();
    } catch (err) {
      toast.error("수정 중 오류가 발생했습니다.");
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (review) => {
    if (window.confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      try {
        await reviewService.delete(review.Id);
        toast.success("후기가 삭제되었습니다.");
        loadReviews();
      } catch (err) {
        toast.error("삭제 중 오류가 발생했습니다.");
        console.error("Error deleting review:", err);
      }
    }
  };

  const handleToggleVisibility = async (review) => {
    try {
      await reviewService.update(review.Id, {
        ...review,
        isHidden: !review.isHidden
      });
      toast.success(review.isHidden ? "후기가 표시됩니다." : "후기가 숨겨집니다.");
      loadReviews();
    } catch (err) {
      toast.error("처리 중 오류가 발생했습니다.");
      console.error("Error toggling visibility:", err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReviews} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            도전 후기
          </h1>
          <p className="text-gray-600">
            여러분의 학습 여정과 도전 경험을 공유해주세요
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <ApperIcon name="MessageSquare" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">전체 후기</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isAdmin ? reviews.length : reviews.filter(r => !r.isHidden).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">오늘 작성</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(review => {
                    const today = new Date().toDateString();
                    const reviewDate = new Date(review.createdAt).toDateString();
                    return reviewDate === today;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <ApperIcon name="Heart" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">평균 좋아요</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(reviews.reduce((acc, review) => acc + (review.likes || 0), 0) / Math.max(reviews.length, 1))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Composer */}
        <div className="mb-8">
          <ReviewComposer
            onSubmit={handleSubmitReview}
            loading={submitLoading}
          />
        </div>

        {/* Reviews Feed */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.Id}
                review={review}
                onEdit={handleEditReview}
                onDelete={isAdmin ? handleDeleteReview : null}
                onToggleVisibility={isAdmin ? handleToggleVisibility : null}
                showActions={true}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <Empty
              title="작성된 후기가 없습니다"
              description="첫 번째 도전 후기를 작성해보세요"
              icon="MessageSquare"
            />
          )}
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingReview(null);
            setEditContent("");
          }}
          title="후기 수정"
        >
          <div className="space-y-4">
            <TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="수정할 내용을 입력하세요"
              maxLength={500}
              rows={6}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingReview(null);
                  setEditContent("");
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleSubmitEdit}
                disabled={!editContent.trim() || editContent.length > 500}
                icon="Save"
              >
                수정하기
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Reviews;