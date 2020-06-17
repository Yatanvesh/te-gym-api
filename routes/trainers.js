const express = require('express');
const router = express.Router();

const TrainerData = require('../models/trainerData');
const Slot = require('../models/slot');
const Package = require('../models/package');
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

router.get('/:trainerEmail', async function (req, res, next) {
  try {
    const {trainerEmail} = req.params;
    let trainer = await TrainerData.get(trainerEmail);

    res.json({trainer});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/addSlot', async function (req, res, next) {
  try {
    const {user} = req;
    const {startTime, duration, startDate,endDate} = req.body;

    const slot = await Slot.create({
      startTime, duration, startDate,endDate
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

router.post('/package', async function (req, res, next) {
  try {
    const {user} = req;
    const {title, duration, price, description} = req.body;

    const package_ = await Package.create({
      title, duration, price, description
    });
    if (!package_) throw new Error("Error in creating package");

    const trainer = await TrainerData.addPackage(user, package_._id);
    res.json({package_});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.put('/package/:packageId', async function (req, res, next) {
  try {
    const {user} = req;
    const {packageId} = req.params;
    const {title, duration, price, description} = req.body;

    const package_ = await Package.edit(packageId,{
      title, duration, price, description
    });
    if (!package_) throw new Error("Error in editing package");

    res.json({package_});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.delete('/package/:packageId', async function (req, res, next) {
  try {
    const {user} = req;
    const {packageId} = req.params;

    const trainer = await TrainerData.removePackage(user, packageId);
    res.json({success:true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
