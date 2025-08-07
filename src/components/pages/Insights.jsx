import React, { useState, useEffect } from "react";
import BlogGrid from "@/components/organisms/BlogGrid";
import BlogEditor from "@/components/organisms/BlogEditor";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";
import { blogService } from "@/services/api/blogService";
import { toast } from "react-toastify";

const Insights = ({ userGrade = "free" }) => {
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editorLoading, setEditorLoading] = useState(false);

  const canManage = ["admin"].includes(userGrade);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getAll();
      setPosts(data);
    } catch (err) {
      setError("글을 불러오는데 실패했습니다.");
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    navigate(`/insights/${post.Id}`);
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setShowEditorModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditorModal(true);
  };

  const handleDeletePost = async (post) => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await blogService.delete(post.Id);
        toast.success("글이 삭제되었습니다.");
        loadPosts();
      } catch (err) {
        toast.error("삭제 중 오류가 발생했습니다.");
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleSubmitPost = async (formData) => {
    try {
      setEditorLoading(true);
      
      if (editingPost) {
        await blogService.update(editingPost.Id, formData);
        toast.success("글이 수정되었습니다.");
      } else {
        await blogService.create({
          ...formData,
          publishedAt: new Date().toISOString()
        });
        toast.success("글이 발행되었습니다.");
      }
      
      setShowEditorModal(false);
      setEditingPost(null);
      loadPosts();
    } catch (err) {
      toast.error("처리 중 오류가 발생했습니다.");
      console.error("Error submitting post:", err);
    } finally {
      setEditorLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              인사이트
            </h1>
            <p className="text-gray-600">
              업계 전문가들의 통찰력 있는 글과 인사이트
            </p>
          </div>
          
          {canManage && (
            <Button
              onClick={handleAddPost}
              icon="PenTool"
              size="lg"
            >
              글 작성
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <ApperIcon name="FileText" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">총 글</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <ApperIcon name="Users" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">이번 달 발행</p>
                <p className="text-2xl font-bold text-gray-900">
                  {posts.filter(post => {
                    const publishDate = new Date(post.publishedAt);
                    const now = new Date();
                    return publishDate.getMonth() === now.getMonth() && 
                           publishDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">평균 읽기 시간</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(posts.reduce((acc, post) => {
                    const words = post.content?.split(/\s+/).length || 0;
                    return acc + Math.ceil(words / 200);
                  }, 0) / Math.max(posts.length, 1))}분
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <BlogGrid
          posts={posts}
          loading={loading}
          error={error}
          onPostClick={handlePostClick}
          onPostEdit={canManage ? handleEditPost : null}
          onPostDelete={canManage ? handleDeletePost : null}
          onRetry={loadPosts}
          showActions={canManage}
          userGrade={userGrade}
          emptyTitle="등록된 인사이트가 없습니다"
          emptyDescription="새로운 인사이트를 공유해보세요"
          onAddPost={canManage ? handleAddPost : null}
        />

        {/* Editor Modal */}
        <Modal
          isOpen={showEditorModal}
          onClose={() => {
            setShowEditorModal(false);
            setEditingPost(null);
          }}
          title={editingPost ? "글 수정" : "새 글 작성"}
          size="full"
        >
          <BlogEditor
            onSubmit={handleSubmitPost}
            onCancel={() => {
              setShowEditorModal(false);
              setEditingPost(null);
            }}
            initialData={editingPost}
            loading={editorLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Insights;