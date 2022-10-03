const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const urljoin = require("url-join");
const config = require("../config");
const errorResponse = require("../utils/error");

const localVidPath = path.join(__dirname, "../", "data", "videos");
const localThumbPath = path.join(__dirname, "../", "data", "thumbnails");

const getPath = async ({ type, filename = "" }) => {
  const pathDir = type === "video" ? localVidPath : localThumbPath;
  try {
    const isDirExist = await checkFileExists({ type, filename: "" });
    if (!isDirExist) {
      await fs.promises.mkdir(pathDir, { recursive: true });
    }
  } finally {
    return path.join(pathDir, filename);
  }
};

const sendImage = async ({ filename, res }) => {
  //TODO: need getPath function that creates path if dont exist
  const filePath = await getPath({ type: "thumbnail", filename });
  res.sendFile(filePath, function (err) {
    if (err) {
      errorResponse(
        {
          name: "FileError",
          message: "File do not exist",
        },
        res
      );
    }
  });
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await getPath({ type: "video" });
    cb(null, localVidPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".mp4") {
    return cb({ message: "Only .mp4 allowed" });
  }
  cb(null, true);
};
const uploadFile = multer({ storage, fileFilter: uploadFilter }).single("file");

const generateThumbnails = async (videoFile, limit) => {
  const videoPath = await getPath({ type: "video", filename: videoFile });
  let thumbnailLinks;
  const promise = new Promise((resolve, reject) => {
    //till here everything is working fine
    ffmpeg(videoPath)
      .on("filenames", function (filenames) {
        thumbnailLinks = filenames.map((filename) => {
          const link = generateLink({ filename, type: "thumbnail" });
          return { filename, link };
        });
      })
      .on("error", (err) => {
        console.log("this error is from gerneratethumbnails" + " " + err);
        reject(err);
      })
      .on("end", function () {
        resolve(thumbnailLinks);
      })
      .screenshots({
        count: limit,
        folder: localThumbPath,
        size: "1280x720",
        filename: "thumbnail_%b.png",
      });
  });
  return promise;
};

const generateLink = ({ filename, type }) => {
  const url = type === "video" ? "/api/videos/stream" : "/api/videos/thumbnail";
  return urljoin(config.BACKEND_URL, url, encodeURIComponent(filename));
};
const videoInfo = async (filename) => {
  const videoPath = await getPath({ type: "video", filename });
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, function (err, metadata) {
      if (err) {
        reject(err);
      } else {
        resolve({ duration: metadata.format.duration });
      }
    });
  });
};

const checkFileExists = async ({ type, filename }) => {
  const file =
    type === "video"
      ? path.join(localVidPath, filename)
      : path.join(localThumbPath, filename);
  try {
    await fs.promises.access(file, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  uploadFile,
  generateThumbnails,
  generateLink,
  videoInfo,
  checkFileExists,
  sendImage,
  getPath,
};
