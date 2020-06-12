const cuid = require('cuid');
const bcrypt = require('bcrypt');
const {
  isEmail,
} = require('validator');

const db = require('../db');

const SALT_ROUNDS = 10;

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
  })
})

function emailSchema(opts = {}) {
  const {
    required
  } = opts
  return {
    type: String,
    required: !!required,
    unique:true,
    lowercase:true,
    validate: [{
      validator: isEmail,
      message: props => `${props.value} is not a valid email address`
    },
      {
        validator: function (email) {
          return isUnique(this, email)
        },
        message: props => 'Email already in use'
      }
    ]
  }
}

async function isUnique(doc, email) {
  const existing = await get(email)
  return !existing || doc._id === existing._id
}

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

async function hashPassword(trainer) {
  if (!trainer.password) throw trainer.invalidate('password', 'password is required')
  if (trainer.password.length < 5) throw trainer.invalidate('password', 'password must be at least 5 characters')
  trainer.password = await bcrypt.hash(trainer.password, SALT_ROUNDS)
}

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Trainer
}