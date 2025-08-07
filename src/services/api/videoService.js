import membershipVideos from "@/services/mockData/membershipVideos.json";
import masterVideos from "@/services/mockData/masterVideos.json";

class VideoService {
  constructor() {
    this.membershipData = [...membershipVideos];
    this.masterData = [...masterVideos];
  }

  // Get all membership videos
  async getMembershipVideos() {
    await this.delay();
    return [...this.membershipData];
  }

  // Get all master videos
  async getMasterVideos() {
    await this.delay();
    return [...this.masterData];
  }

  // Get video by ID (searches both categories)
  async getById(id) {
    await this.delay();
    const allVideos = [...this.membershipData, ...this.masterData];
    return allVideos.find(video => video.Id === id) || null;
  }

  // Create new video
  async create(video) {
    await this.delay();
    const newId = Math.max(
      ...this.membershipData.map(v => v.Id),
      ...this.masterData.map(v => v.Id),
      0
    ) + 1;

    const newVideo = {
      ...video,
      Id: newId
    };

    if (video.category === "master") {
      this.masterData.unshift(newVideo);
    } else {
      this.membershipData.unshift(newVideo);
    }

    return newVideo;
  }

  // Update video
  async update(id, videoData) {
    await this.delay();
    
    let updated = false;
    
    // Try membership videos first
    const membershipIndex = this.membershipData.findIndex(v => v.Id === id);
    if (membershipIndex !== -1) {
      this.membershipData[membershipIndex] = { ...this.membershipData[membershipIndex], ...videoData };
      updated = true;
    } else {
      // Try master videos
      const masterIndex = this.masterData.findIndex(v => v.Id === id);
      if (masterIndex !== -1) {
        this.masterData[masterIndex] = { ...this.masterData[masterIndex], ...videoData };
        updated = true;
      }
    }

    if (!updated) {
      throw new Error("Video not found");
    }

    return this.getById(id);
  }

  // Delete video
  async delete(id) {
    await this.delay();
    
    let deleted = false;
    
    // Try membership videos first
    const membershipIndex = this.membershipData.findIndex(v => v.Id === id);
    if (membershipIndex !== -1) {
      this.membershipData.splice(membershipIndex, 1);
      deleted = true;
    } else {
      // Try master videos
      const masterIndex = this.masterData.findIndex(v => v.Id === id);
      if (masterIndex !== -1) {
        this.masterData.splice(masterIndex, 1);
        deleted = true;
      }
    }

    if (!deleted) {
      throw new Error("Video not found");
    }

    return true;
  }

  // Utility method to add delay for realistic loading
  delay(ms = Math.random() * 300 + 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const videoService = new VideoService();