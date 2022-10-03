const express = require("express");
const router = express.Router();

const Channel = require("../models/channel");
const errorResponse = require("../utils/error");
const Views = require("../models/view/view");
const mongoose = require("mongoose");

//Get channel based on user auth
router.get("/owner", async (req, res) => {
  try {
    if (req.userError) throw req.userError;
    //Get user by id
    const channel = await Channel.findById(req.userId);
    if (!channel) {
      throw {
        name: "InvalidResourceError",
        message: "Invalid video",
      };
    }
    res.json({
      id: channel._id,
      name: channel.name,
      email: channel.email,
      imageLink: channel.imageLink,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

//Get channel by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //Get user by id
    const channel = await Channel.findById(id);
    if (!channel) {
      throw {
        name: "InvalidResourceError",
        message: "Invalid video",
      };
    }
    res.json({
      id: channel._id,
      name: channel.name,
      email: channel.email,
      imageLink: channel.imageLink,
    });
  } catch (err) {
    errorResponse(err, res);
  }
});

router.post("/getMonthlyViews", async (req, res) => {
  try {
    const { channelID } = req.body;
    if (!channelID) {
      throw { message: "ChannelID is missing" };
    }
    const pipeline = [
      {
        $match: {
          channelID: mongoose.Types.ObjectId(channelID),
        },
      },
      {
        $group: {
          _id: {
            $month: "$date",
          },
          numberOfViews: {
            $sum: 1,
          },
        },
      },
    ];
    const date = new Date();
    const currentYear = date.getFullYear();

    //clean all data which is not current year
    const data = await Views.deleteMany({
      yearOfCreation: { $ne: currentYear },
    });
    console.log("Deleted ", data.deletedCount, " documents");

    //aggregate all monthly view Data
    const monthData = await Views.aggregate(pipeline);
    if (monthData) {
      return res.status(200).send({
        message: "successfully retrived data",
        monthlyData: monthData,
      });
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
