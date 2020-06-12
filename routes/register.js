const express = require('express');
const router = express.Router();
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = '';
    if(file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if(file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if(file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
});
const upload = multer({storage: storage});
const fileUploader = upload.single('file');
const Trainers = require('../models/trainers');

router.post('/trainer',upload.single('file'), async function (req, res, next) {
  try {
    const filename = req.file && req.file.filename;
    console.log(req.body, filename)

    const trainer = await Trainers.create({
      ...req.body,
      displayPicture:filename
    });
    const {
      email
    } = trainer;
    res.json({
      email,
      success:true
    });
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/customer', function (req, res, next) {
  res.send('customer');
});

module.exports = router;
