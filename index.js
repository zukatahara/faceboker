const axios = require("axios");
const fs = require("fs");
const videoUrl = "https://www.facebook.com/watch?v=868904670972525";
const filePath = "myvideo.mp4";
// Fetch the video data using axios
axios
  .get(videoUrl)
  .then((response) => {
    console.log("response: ", response);
    // include node fs module

    // writeFile function with filename, content and callback function
    fs.writeFile("newfile.txt", response.data, function (err) {
      if (err) throw err;
      console.log("File is created successfully.");
    });
    return;
    // Extract the video URL from the response
    const videoData = response.data;
    const videoUrlMatch = videoData.match(/sd_src:"([^"]+)"/i);
    console.log("videoUrlMatch: ", videoUrlMatch);
    const videoUrl = videoUrlMatch ? videoUrlMatch[1] : null;

    if (!videoUrl) {
      throw new Error("Unable to extract video URL");
    }

    // Download the video using the video URL
    return axios({
      url: videoUrl,
      method: "get",
      responseType: "stream",
    });
  })
  .then((response) => {
    // Save the video stream to the specified file path
    const videoStream = response.data;
    const fileStream = fs.createWriteStream(filePath);
    videoStream.pipe(fileStream);

    // Log success message once the video is downloaded
    fileStream.on("finish", () => {
      console.log("Video downloaded successfully");
    });
  })
  .catch((err) => {
    console.error("Error downloading video:", err);
  });
