const express = require("express");
const fileProcess = require("../services/fileProcess");
const Video = require("../models/video");
const View = require("../models/view/view");
const ChannelSubscription = require("../models/channelSubscription");
const filePut = require("../web3Storage/file-put");

const { extractVideoInfo } = require("../utils");

const errorResponse = require("../utils/error");
const { result } = require("lodash");

const router = express.Router();

// Save video temporary
router.post("/", (req, res) => {
  try {
    fileProcess.uploadFile(req, res, (err) => {
      if (err) {
        errorResponse(
          {
            name: "UploadError",
            message: err.message,
          },
          res
        );
      } else {
        res.json({
          filename: res.req.file.filename,
        });
      }
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

//delete
// router.post("/delete", async (req, res) => {
//   try {
//     const videoId = req.body.videoId;
//     if (!videoId) {
//       throw { message: "Video ID is missing" };
//     }
//     const result = await Video.findOneAndRemove({ _id: videoId });
//     if (!result) {
//       throw { message: "video doesnt Exist" };
//     }
//     const response = await googleStore.deleteFile(result.videoStoreId);
//     if (!response) {
//       throw { message: "some error occured during deletion from drive" };
//     }
//     if (result && response) {
//       return res
//         .status(200)
//         .send({ message: "video deleted successfully", Data: result });
//     } else {
//       return res.status(404).send({ message: "video deleted unsuccessfully" });
//     }
//   } catch (e) {
//     return res.status(500).send(e);
//   }
// });

//Get thumbnail
//TODO: test
router.get("/thumbnail/:thumbFile", async (req, res) => {
  const { userId } = req;
  const { thumbFile } = req.params;
  const { temporary } = req.query;
  try {
    const isTemporary = temporary == "true";
    if (isTemporary) {
      await fileProcess.sendImage({
        filename: decodeURIComponent(thumbFile),
        res,
      });
      return;
    } else {
      throw err;
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// Save video
router.post("/upload", async (req, res) => {
  try {
    const uploadInfo = req.body;
    const cidInfo = await filePut(uploadInfo);
    console.log(cidInfo);
    const video = await Video.findOne({ videoCid: cidInfo.videoCid });
    if (video) {
      return res.status(500).send({ message: "Video is already uploaded" });
    }
    const { duration } = await fileProcess.videoInfo(uploadInfo.filename);
    uploadInfo.duration = duration;
    await Video.create({
      ...cidInfo,
      ...uploadInfo,
    });
    res.json({
      success: true,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});
router.get("/recommended", async (req, res) => {
  const { userId } = req;
  try {
    const videos = await Video.getRecommended({ userId });
    res.json({
      videos,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get trending videos
router.get("/trending", async (req, res) => {
  try {
    const videos = await Video.getTrendingByCategory({});
    res.json({
      videos,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get trending videos in a category
router.get("/trending/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const videos = await Video.getTrendingByCategory({
      category: categoryId,
    });
    res.json({
      videos,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

// Search for videos
router.get("/search", async (req, res) => {
  const { search_query } = req.query;
  try {
    const videos = await Video.findByTitle(search_query);
    res.json({
      videos,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get channel videos
router.get("/channel/:channelId", async (req, res) => {
  const { userId } = req;
  const { channelId } = req.params;
  try {
    const videos = await Video.getChannelVideos({
      channelId,
      userId,
    });
    res.json({ videos });
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get subscription videos
router.get("/subscription", async (req, res) => {
  const { userId } = req;
  try {
    if (!userId) throw { message: "userId is required" };
    const channelSubscriptions = await ChannelSubscription.find({
      subscriber: userId,
    });
    const channels = channelSubscriptions.map(({ channel }) => channel);
    const videos = await Video.find({ uploader: { $in: channels } }).populate(
      "uploader"
    );
    const videoResults = videos.map((video) => extractVideoInfo(video));
    res.json({ videos: videoResults });
  } catch (err) {
    errorResponse(err, res);
  }
});

//Generate thumbnails
router.post("/thumbnails", async (req, res) => {
  const { filename } = req.body;
  try {
    const thumbLinks = await fileProcess.generateThumbnails(filename, 3); // problem is in gererate thumbnaiil error is ffprobe is not found
    console.log("we succesfully generated thumbnail");
    const thumbnails = thumbLinks.map((thumb) => ({
      ...thumb,
      link: thumb.link + "?temporary=true",
    }));
    res.json({ thumbnails });
    console.log("response sent");
  } catch (err) {
    errorResponse(err, res);
  }
});

// Get video info
router.get(
  "/:videoId",
  /*auth, */ async (req, res) => {
    const { userId } = req;
    const { videoId } = req.params;
    try {
      const video = await Video.getVideo({ videoId, userId });
      res.json({ video });
    } catch (err) {
      errorResponse(err, res);
    }
  }
);

// Update video info
router.patch(
  "/:videoId",
  /*auth, */ async (req, res) => {
    const { userId } = req;
    const { videoId } = req.params;
    const { updateViews } = req.body;

    try {
      let updatedVideo;
      const video = await Video.getVideo({ videoId, userId, withDoc: true });

      if (video && updateViews === true) {
        const date = new Date();
        const year = date.getFullYear();
        const view = new View({
          channelID: video.doc.uploader._id,
          date: date,
          yearOfCreation: year,
        });
        view.save();
        updatedVideo = await video.doc.increaseViews();
      }
      res.json({ video: updatedVideo });
    } catch (err) {
      console.log(err);
      errorResponse(err, res);
    }
  }
);

module.exports = router;
