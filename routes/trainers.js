const express = require('express');
const router = express.Router();

const TrainerData = require('../models/trainerData');
const Slot = require('../models/slot');
const {userTypes} = require("../constants")

router.get('/', async function (req, res, next) {
  try {
    let trainers = await TrainerData.list({userType: userTypes.TRAINER});

    res.json({trainers});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/addSlot', async function (req, res, next) {
  try {
    const {user} = req;
    const {startTime, duration, days} = req.body;

    const slot = await Slot.create({
      startTime, duration, days
    });
    if (!slot) throw new Error("Error in creating slot");

    const trainer = await TrainerData.addSlot(user, slot._id);
    res.json({trainer});


  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }

});

module.exports = router;
