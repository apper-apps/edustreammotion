import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";
import { videoService } from "@/services/api/videoService";
import { blogService } from "@/services/api/blogService";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";

const AdminDashboard = ({ userGrade = "free" }) => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (userGrade !== "admin") {
      window.location.href = "/";
      return;
    }
    loadDashboardData();
  }, [userGrade]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, videosData, postsData, reviewsData] = await Promise.all([
        userService.getAll(),
        Promise.all([
          videoService.getMembershipVideos(),
          videoService.getMasterVideos()
        ]).then(([membership, master]) => [...membership, ...master]),
        blogService.getAll(),
        reviewService.getAll()
      ]);

      setUsers(usersData);
      setStats({
        totalUsers: usersData.length,
        totalVideos: videosData.length,
        totalPosts: postsData.length,
        totalReviews: reviewsData.length,
        usersByGrade: {
          free: usersData.filter(u => u.grade === "free").length,
          member: usersData.filter(u => u.grade === "member").length,
          master: usersData.filter(u => u.grade === "master").length,
          both: usersData.filter(u => u.grade === "both").length,
          admin: usersData.filter(u => u.grade === "admin").length
        },
        recentActivity: {
          newUsers: usersData.filter(u => {
            const joinDate = new Date(u.joinedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return joinDate > weekAgo;
          }).length,
          newVideos: videosData.filter(v => {
            const createDate = new Date(v.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createDate > weekAgo;
          }).length,
          newPosts: postsData.filter(p => {
            const publishDate = new Date(p.publishedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return publishDate > weekAgo;
          }).length
        }
      });
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = async (userId, newGrade) => {
    try {
      const user = users.find(u => u.Id === userId);
      await userService.update(userId, { ...user, grade: newGrade });
      toast.success("사용자 등급이 변경되었습니다.");
      loadDashboardData();
    } catch (err) {
      toast.error("등급 변경 중 오류가 발생했습니다.");
      console.error("Error updating user grade:", err);
    }
  };

  if (userGrade !== "admin") {
    return null;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              관리자 대시보드
            </h1>
            <p className="text-gray-600">
              플랫폼 통계와 사용자 관리
            </p>
          </div>
          <Badge variant="admin" size="lg">
            <ApperIcon name="Shield" className="w-4 h-4 mr-1" />
            관리자
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <ApperIcon name="Video" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">전체 강의</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <ApperIcon name="FileText" className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">인사이트 글</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100 mr-4">
                <ApperIcon name="MessageSquare" className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">도전 후기</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Grade Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">등급별 사용자</h3>
            <div className="space-y-3">
              {Object.entries(stats.usersByGrade || {}).map(([grade, count]) => (
                <div key={grade} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant={grade} className="mr-3">
                      {getGradeLabel(grade)}
                    </Badge>
                  </div>
                  <span className="font-medium text-gray-900">{count}명</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동 (7일)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="UserPlus" className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">신규 가입</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.recentActivity?.newUsers || 0}명
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="Video" className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">신규 강의</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.recentActivity?.newVideos || 0}개
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ApperIcon name="PenTool" className="w-5 h-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">신규 게시글</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {stats.recentActivity?.newPosts || 0}개
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">사용자 관리</h3>
              <p className="text-sm text-gray-600 mt-1">사용자 등급을 관리할 수 있습니다</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      현재 등급
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가입일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등급 변경
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.Id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {user.name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.grade}>
                          {getGradeLabel(user.grade)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinedAt).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.grade}
                          onChange={(e) => handleGradeChange(user.Id, e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="free">무료</option>
                          <option value="member">멤버</option>
                          <option value="master">마스터</option>
                          <option value="both">멤버+마스터</option>
                          <option value="admin">관리자</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

export default AdminDashboard;