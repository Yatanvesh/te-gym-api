const express = require('express');
const router = express.Router();

const Posts = require('../models/post');
const Comment = require('../models/comment');

router.post('/:postId', async function (req, res, next) {
  try {
    const {postId} = req.params;
    const {user} = req;
    const {commentText} = req.body;
    const comment = await Comment.create({
      email:user,
      commentText
    });
    if(!comment) throw new Error("Failed to create comment");

    const post = await Posts.addComment(postId, comment._id);
    if(!post) throw new Error("Failed to add comment to post");

    res.json({comment});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.put('/:commentId', async function (req, res, next) {
  try {
    const {commentId} = req.params;
    const {user} = req;
    const {commentText} = req.body;
    const comment = await Comment.edit(
      commentId,
      user,
      commentText
    );
    if (!comment) throw new Error("Failed to edit comment");

    res.json({comment});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.delete('/:commentId', async function (req, res, next) {
  try {
    const {commentId} = req.params;
    const {user} = req;
    const comment = await Comment.remove(
      commentId,
      user
    );
    if (comment)
      res.json({success:true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});
module.exports = router;
