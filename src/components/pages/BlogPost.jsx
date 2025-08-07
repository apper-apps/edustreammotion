import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogCard from "@/components/molecules/BlogCard";
import BlogEditor from "@/components/organisms/BlogEditor";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { blogService } from "@/services/api/blogService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BlogPost = ({ userGrade = "free" }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const canEdit = userGrade === "admin";

  useEffect(() => {
    if (postId) {
      loadPostData();
    }
  }, [postId]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      setError(null);

      const postData = await blogService.getById(parseInt(postId));
      
      if (!postData) {
        setError("글을 찾을 수 없습니다.");
        return;
      }

      // Check access
      if (!checkAccess(userGrade, postData.accessLevels)) {
        setError("이 글에 접근할 권한이 없습니다.");
        return;
      }

      setPost(postData);

      // Load related posts
      const allPosts = await blogService.getAll();
      const related = allPosts
        .filter(p => p.Id !== postData.Id)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 3);
      
      setRelatedPosts(related);
    } catch (err) {
      setError("글을 불러오는데 실패했습니다.");
      console.error("Error loading post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = () => {
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (formData) => {
    try {
      setEditLoading(true);
      await blogService.update(post.Id, formData);
      toast.success("글이 수정되었습니다.");
      setShowEditModal(false);
      loadPostData();
    } catch (err) {
      toast.error("수정 중 오류가 발생했습니다.");
      console.error("Error updating post:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleRelatedPostClick = (relatedPost) => {
    navigate(`/insights/${relatedPost.Id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadPostData}
      />
    );
  }

  if (!post) {
    return (
      <Error 
        message="글을 찾을 수 없습니다."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/insights")}
            icon="ArrowLeft"
          >
            인사이트로 돌아가기
          </Button>
        </div>

        {/* Article */}
        <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          {/* Featured Image */}
          <div className="aspect-video">
            <img
              src={post.featuredImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.accessLevels?.map(level => (
                    <Badge key={level} variant={level}>
                      {getGradeLabel(level)}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(post.publishedAt), "yyyy년 MM월 dd일")}
                  </span>
                  <span className="mx-2">•</span>
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                  <span>{estimateReadTime(post.content)}분 읽기</span>
                </div>
              </div>
              
              {canEdit && (
                <Button
                  onClick={handleEditPost}
                  variant="outline"
                  icon="Edit"
                >
                  수정
                </Button>
              )}
            </div>

            {/* Article Content */}
            <div 
              className="rich-editor prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(post.content)
              }}
            />
            
            {/* Share Actions */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  이 글이 도움이 되셨나요?
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Heart" className="w-4 h-4 mr-1" />
                    좋아요
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Share2" className="w-4 h-4 mr-1" />
                    공유
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">다른 글들</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <BlogCard
                  key={relatedPost.Id}
                  post={relatedPost}
                  onClick={handleRelatedPostClick}
                  userGrade={userGrade}
                />
              ))}
            </div>
          </section>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="글 수정"
          size="full"
        >
          <BlogEditor
            onSubmit={handleSubmitEdit}
            onCancel={() => setShowEditModal(false)}
            initialData={post}
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

function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length || 0;
  return Math.ceil(words / wordsPerMinute) || 1;
}

// Simple markdown to HTML converter
function convertMarkdownToHtml(markdown) {
  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/\n/g, '<br/>');
}

export default BlogPost;