const express = require('express');
const router = express.Router();
const utility = require('../utility/utility');
const {saveFileToServer} = require('../config/uploadConfig');

const TrainerData = require('../models/trainerData');
const UserData = require('../models/userData');
const User = require('../models/user');
const {userTypes} =  require("../constants")

router.get('/:email?', async function (req, res, next) {
  try {
    let {email} = req.params;
    if(!email) email = req.user;

    const {userType} = await User.get(email);
    if(!userType) throw new Error('User does not exist');

    let model = userType === userTypes.TRAINER? TrainerData: UserData;
    const user = await model.get(email);
    if (!user) throw new Error('Internal server error. code 45621');

    res.json({user});
  } catch (error) {
    res.status(500).json({error: error.toLocaleString()});
  }
});

router.put('/', async function (req, res, next) {
  try {
    console.log(`User ${req.user} update request`);
    const {user, userType} = req;
    let model = userType === userTypes.TRAINER? TrainerData: UserData;
    const userData = await model.edit(
      user,
      {
        ...req.body
      });
    if (userData) {
      res.json({success: true, userData});
    } else throw new Error("Could not update user data");
  } catch (error) {
    res.status(500).json({error: error.toLocaleString()});
  }
});

router.put('/displayImage', saveFileToServer.single('image'), async function (req, res, next) {
  try {
    let imageUrl = '';
    if (req.file && req.file.path) {
      imageUrl = await utility.uploadLocalFile(req.file.path);
    }
    if (!imageUrl)
      throw new Error("Image upload failed");
    const {user, userType} = req;
    let model = userType === userTypes.TRAINER? TrainerData: UserData;

    const userData = await model.edit(
      user,
      {
        displayPictureUrl: imageUrl,
      });
    if (!(userData && userData.email))
      throw new Error("display image updation failed");

    res.json({imageUrl, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
