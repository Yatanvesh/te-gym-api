const cuid = require('cuid');
const {emailSchema,hashPassword} = require('./utility');

const db = require('../db');


const Trainer = db.model('Trainer', {
  _id: {
    type: String,
    default: cuid
  },
  password: {
    type: String,
    maxLength: 120,
    required: true
  },
  email: emailSchema({
    required: true
  }),
  firstName:{
    type:String,
    required: true
  },
  lastName:{
    type:String
  },
  phone:{
    type:String
  },
  displayPicture:{
    type:String
  },
  bmi:{
    type:Number
  },
  weight:{
    type:Number
  },
  cost:{
    type:Number
  },
})

async function get(email) {
  const trainer = await Trainer.findOne({
    email
  });
  return trainer;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25
  } = opts
  const trainers = await Trainer.find()
    .sort({
      _id: 1
    })
    .skip(offset)
    .limit(limit)
  return trainers;
}

async function remove(email) {
  await Trainer.deleteOne({
    email
  })
}

async function create(fields) {
  const trainer = new Trainer(fields)
  await hashPassword(trainer)
  await trainer.save()
  return trainer;
}

async function edit(email, change) {
  const trainer = await get(email);
  Object.keys(change).forEach(key => {
    trainer[key] = change[key]
  });
  if (change.password) await hashPassword(trainer);
  await trainer.save();
  return trainer;
}



module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Trainer
}