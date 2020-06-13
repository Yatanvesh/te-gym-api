const express = require('express');
const router = express.Router();
const utility = require('../utility/utility');
const {saveFileToServer} = require('../config/uploadConfig');
const UserData = require('../models/userData');
const User = require('../models/user');

router.post('/trainer', saveFileToServer.single('file'), async function (req, res, next) {
  try {
    let imageUrl = '';
    if (req.file && req.file.path) {
      imageUrl = await utility.uploadLocalFile(req.file.path);
    }
    const trainer = await User.create({
      ...req.body,
    });
    if (!(trainer && trainer.email))
      throw new Error("User creation failed");

    const trainerData = await UserData.create({
      ...req.body,
      displayPictureUrl: imageUrl
    });
    if (!(trainerData && trainerData.email))
      throw new Error("UserData creation failed");

    const {email} = trainer;
    res.json({email, success: true});

    // const {startTime, endTime} = req.body;
    // if(startTime && endTime){
    //
    // }
  } catch
    (err) {
    res.status(500).json({
      err: err.message
    });
  }
})
;

router.post('/user', saveFileToServer.single('file'), async function (req, res, next) {
  try {
    let imageUrl = '';
    if (req.file && req.file.path) {
      imageUrl = await utility.uploadLocalFile(req.file.path);
    }
    const customer = await User.create({
      ...req.body,
    });
    if (!(customer && customer.email))
      throw new Error("User creation failed");

    const customerData = await UserData.create({
      ...req.body,
      displayPictureUrl: imageUrl
    });
    if (!(customerData && customerData.email))
      throw new Error("UserData creation failed");

    const {email} = customer;
    res.json({email, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
