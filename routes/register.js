const express = require('express');
const router = express.Router();
var multer = require('multer');
var cloudinary = require('cloudinary').v2;
const fs = require('fs')

const Trainers = require('../models/trainers');
const Customers = require('../models/customers');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
});
const upload = multer({storage: storage});

const uploadLocalFile = async (path) => {
  const res = await cloudinary.uploader.upload(path);
  if (res && res.secure_url) {
    console.log('file uploaded to Cloudinary', res.secure_url);
  } else {
    return '';
  }
  fs.unlinkSync(path);
  return res.secure_url;
}

router.post('/trainer', upload.single('file'), async function (req, res, next) {
  try {
    let imageUrl = '';
    if (req.file && req.file.path) {
      imageUrl = await uploadLocalFile(req.file.path);
    }
    const trainer = await Trainers.create({
      ...req.body,
      displayPictureUrl: imageUrl
    });
    const {email} = trainer;
    res.json({email, success: true});

    // const {startTime, endTime} = req.body;
    // if(startTime && endTime){
    //
    // }
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/user', upload.single('file'), async function (req, res, next) {
  try {
    let imageUrl = '';
    if (req.file && req.file.path) {
      imageUrl = await uploadLocalFile(req.file.path);
    }
    const customer = await Customers.create({
      ...req.body,
      displayPictureUrl: imageUrl
    });
    const {email} = customer;
    res.json({email, success: true});
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
