import React from "react";
import BlogCard from "@/components/molecules/BlogCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const BlogGrid = ({ 
  posts, 
  loading, 
  error, 
  onPostClick,
  onPostEdit,
  onPostDelete,
  onRetry,
  showActions = false,
  userGrade = "free",
  emptyTitle = "등록된 글이 없습니다",
  emptyDescription = "새로운 인사이트를 공유해보세요",
  onAddPost
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

  if (!posts || posts.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        action={onAddPost}
        actionLabel="글 작성"
        icon="PenTool"
        className="mt-8"
      />
    );
  }

  // Sort posts by publication date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {sortedPosts.map((post) => (
        <BlogCard
          key={post.Id}
          post={post}
          onClick={onPostClick}
          onEdit={onPostEdit}
          onDelete={onPostDelete}
          showActions={showActions}
          userGrade={userGrade}
        />
      ))}
    </div>
  );
};

export default BlogGrid;