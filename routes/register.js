const express = require('express');
const router = express.Router();

const Trainers = require('../models/trainers');

router.post('/trainer', async function (req, res, next) {
  try {
    const trainer = await Trainers.create(req.body);
    const {
      email
    } = trainer;
    res.json({
      email
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
