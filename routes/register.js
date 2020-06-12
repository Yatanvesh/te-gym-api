const express = require('express');
const router = express.Router();
var multer = require('multer');

const Trainers = require('../models/trainers');
const Customers = require('../models/customers');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
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

router.post('/trainer', upload.single('file'), async function (req, res, next) {
  try {
    const filename = req.file && req.file.filename;
    // console.log(req.body, filename)
    const {startTime, endTime} = req.body;
    if(startTime && endTime){

    }

    const trainer = await Trainers.create({
      ...req.body,
      displayPicture: filename
    });
    const {
      email
    } = trainer;
    res.json({
      email,
      success: true
    });
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

router.post('/user', upload.single('file'), async function (req, res, next) {
  try {
    const filename = req.file && req.file.filename;
    console.log(req.body, filename)

    const customer = await Customers.create({
      ...req.body,
      displayPicture: filename
    });
    const {
      email
    } = customer;
    res.json({
      email,
      success: true
    });
  } catch (err) {
    res.status(500).json({
      err: err.message
    });
  }
});

module.exports = router;
