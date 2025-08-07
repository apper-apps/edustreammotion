import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layout Components
import Header from "@/components/organisms/Header";

// Page Components
import Home from "@/components/pages/Home";
import Membership from "@/components/pages/Membership";
import Master from "@/components/pages/Master";
import VideoPlayer from "@/components/pages/VideoPlayer";
import Insights from "@/components/pages/Insights";
import BlogPost from "@/components/pages/BlogPost";
import Reviews from "@/components/pages/Reviews";
import AdminDashboard from "@/components/pages/AdminDashboard";

function App() {
  // For demo purposes, using a fixed user grade - in real app, this would come from auth context
  const userGrade = "admin"; // Can be: free, member, master, both, admin

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header userGrade={userGrade} />
        
        <main>
          <Routes>
            <Route path="/" element={<Home userGrade={userGrade} />} />
            <Route path="/membership" element={<Membership userGrade={userGrade} />} />
            <Route path="/membership/video/:videoId" element={<VideoPlayer userGrade={userGrade} category="membership" />} />
            <Route path="/master" element={<Master userGrade={userGrade} />} />
            <Route path="/master/video/:videoId" element={<VideoPlayer userGrade={userGrade} category="master" />} />
            <Route path="/insights" element={<Insights userGrade={userGrade} />} />
            <Route path="/insights/:postId" element={<BlogPost userGrade={userGrade} />} />
            <Route path="/reviews" element={<Reviews userGrade={userGrade} />} />
            <Route path="/admin" element={<AdminDashboard userGrade={userGrade} />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;