const express = require('express');
const router = express.Router();
const utility = require('../utility/utility');
const {saveFileToServer} = require('../config/uploadConfig');

const UserData = require('../models/userData');

router.get('/:email', async function (req, res, next) {
  try {
    const {email} = req.params;
    const user = await UserData.get(email);
    if (!user) throw new Error('User does not exist');
    res.json({user});
  } catch (error) {
    res.status(500).json({error: error.toLocaleString()});
  }

});

router.put('/', async function (req, res, next) {
  try {
    console.log(`User ${req.user} update request`);
    const {user} = req;
    const userData = await UserData.edit(
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
    const {user} = req;

    const userData = await UserData.edit(
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
