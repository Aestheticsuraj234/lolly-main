const config = require("../config/index");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const { getPath } = require("../services/fileProcess");

async function filePut(uploadInfo) {
  const fileName = uploadInfo.filename;
  const thumbnail = uploadInfo.thumbnailFilename;
  const videopath = await getPath({ type: "video", filename: fileName });
  const thumbnailpath = await getPath({
    type: "thumbnail",
    filename: thumbnail,
  });
  const token = config.WEB3TOKEN;
  const storage = new Web3Storage({ token });
  const videoFile = await getFilesFromPath(videopath);
  const videoCid = await storage.put(videoFile);
  console.log(`Uploaded video`);

  const thumbNailFile = await getFilesFromPath(thumbnailpath);
  const thumbnailCid = await storage.put(thumbNailFile);

  console.log(`Uploaded thumbnail`);

  return {
    videoCid: videoCid,
    thumbnailCid: thumbnailCid,
  };
}

module.exports = filePut;
