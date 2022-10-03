const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
  channelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "channel",
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  yearOfCreation: {
    type: Number,
    default: null,
    require: true,
  },
});

module.exports = mongoose.model("view", viewSchema);
