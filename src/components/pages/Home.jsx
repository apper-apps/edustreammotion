import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import VideoCard from "@/components/molecules/VideoCard";
import BlogCard from "@/components/molecules/BlogCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useNavigate } from "react-router-dom";
import { videoService } from "@/services/api/videoService";
import { blogService } from "@/services/api/blogService";

const Home = ({ userGrade = "free" }) => {
  const navigate = useNavigate();
  
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const [membershipVideos, masterVideos, blogPosts] = await Promise.all([
        videoService.getMembershipVideos(),
        videoService.getMasterVideos(),
        blogService.getAll()
      ]);

      // Get pinned and recent videos from both categories
      const allVideos = [...membershipVideos, ...masterVideos];
      const pinnedVideos = allVideos.filter(video => video.isPinned).slice(0, 4);
      const recentVideos = allVideos
        .filter(video => !video.isPinned)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4 - pinnedVideos.length);

      setFeaturedVideos([...pinnedVideos, ...recentVideos]);
      setRecentPosts(blogPosts.slice(0, 3));
    } catch (err) {
      setError("콘텐츠를 불러오는데 실패했습니다.");
      console.error("Error loading featured content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    const category = video.category === "master" ? "master" : "membership";
    navigate(`/${category}/video/${video.Id}`);
  };

  const handlePostClick = (post) => {
    navigate(`/insights/${post.Id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Error message={error} onRetry={loadFeaturedContent} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-sm font-medium mb-6">
              <ApperIcon name="Sparkles" className="w-4 h-4 mr-2" />
              온라인 학습의 새로운 경험
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              배움의 여정을 함께하는
              <br />
              <span className="gradient-text">EduStream</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              전문가가 제작한 고품질 강의와 인사이트를 통해 
              새로운 지식과 기술을 습득하고 성장하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/membership")}
                icon="Play"
              >
                멤버십 강의 보기
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                onClick={() => navigate("/insights")}
                icon="BookOpen"
              >
                인사이트 둘러보기
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-50"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-200 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-200 rounded-full opacity-40"></div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">추천 강의</h2>
              <p className="text-gray-600">엄선된 고품질 강의를 만나보세요</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/membership")}
              icon="ArrowRight"
              iconPosition="right"
            >
              모든 강의 보기
            </Button>
          </div>

          {featuredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVideos.map(video => (
                <VideoCard
                  key={video.Id}
                  video={video}
                  onClick={handleVideoClick}
                  userGrade={userGrade}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="Video" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">등록된 강의가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">최신 인사이트</h2>
              <p className="text-gray-600">업계 전문가들의 통찰력 있는 글</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/insights")}
              icon="ArrowRight"
              iconPosition="right"
            >
              모든 글 보기
            </Button>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map(post => (
                <BlogCard
                  key={post.Id}
                  post={post}
                  onClick={handlePostClick}
                  userGrade={userGrade}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="PenTool" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">등록된 글이 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">왜 EduStream인가요?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              체계적인 학습 관리와 다양한 콘텐츠로 여러분의 성장을 돕습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="GraduationCap" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">전문 강의</h3>
              <p className="text-gray-600">
                업계 전문가들이 제작한 고품질 강의로 실무 스킬을 향상시키세요
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">커뮤니티</h3>
              <p className="text-gray-600">
                같은 목표를 가진 학습자들과 함께 성장하고 경험을 나누세요
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Trophy" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">성취 시스템</h3>
              <p className="text-gray-600">
                체계적인 학습 관리와 성취 추적으로 꾸준한 성장을 이어가세요
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;