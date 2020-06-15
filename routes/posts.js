const express = require('express');
const router = express.Router();

const Posts = require('../models/post');
const utility = require('../utility/utility');
const {saveFileToServer} = require('../config/uploadConfig');

router.get('/', async function (req, res, next) {
  try {
    const posts = await Posts.list();
    if (!posts) throw new Error("Could not retrieve posts");
    res.json({posts});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/', saveFileToServer.single('image'), async function (req, res, next) {
  try {
    const {user} = req;
    console.log(`User ${user} requesting post creation`);
    let imageUrl = '', post;
    if (req.file && req.file.path) {
      imageUrl = await utility.uploadLocalFile(req.file.path);
      if (!imageUrl)
        throw new Error("Image upload failed");
      post = await Posts.create(
        {
          ...req.body,
          email: user,
          postImageUrl: imageUrl, // ignored if no image url provided,
          postType: 'IMAGE'
        });
    } else {
      post = await Posts.create(
        {
          ...req.body,
          email: user,
          postType:'TEXT'
        });
    }

    if (!post) throw new Error("Post creation failed");
    res.json({
      post,
      success: true
    });
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
})

module.exports = router;
