const ytSearch = require("yt-search");
const ytdl = require("@distube/ytdl-core")

module.exports = {
  searchSongs: async function (query) {
    const results = await ytSearch(query);
    return results.videos.slice(0, 5).map(video => ({
      id: video.videoId,
      title: video.title,
      url: video.url,
      duration: video.timestamp,
      author: video.author.name
    }));
  },

  getAudioStreamURL: async function (videoId) {
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    return format.url;
  }
};
