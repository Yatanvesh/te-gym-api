const cuid = require('cuid');
const mongoose = require('mongoose');
const {isEmail} = require('validator');

const db = require('../config/db');
const {userTypes} = require("../constants")

const opts = {toJSON: {virtuals: true}};

const trainerSchema = mongoose.Schema({
  _id: {
    type: String,
    default: cuid
  },
  email: emailSchema({
    required: true
  }),
  userType: {type: String, default: userTypes.TRAINER}, // helpful for frontend
  name: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.0
  },
  slots: [{type: String, ref: 'Slot', index: true}],
  chargePerSession: {
    type: Number
  },
  phone: {
    type: String
  },
  gender: {
    type: String
  },
  displayPictureUrl: {
    type: String
  },
  bmi: {
    type: Number
  },
  weight: {
    type: Number
  },
  height: {
    type: Number
  },
  chest: {
    type: Number
  },
  biceps: {
    type: Number
  }
}, opts);

trainerSchema.virtual('totalSlots')
  .get(function () {
    return this.slots.length;
  });

trainerSchema.virtual('usedSlots')
  .get(function () {
    let count = 0;
    this.slots.forEach(slot => {
      if (slot.assignedTo) count++;
    });
    return count;
  });

const Model = db.model('TrainerData', trainerSchema);

async function get(email) {
  const model = await Model.findOne(
    {email},
  );
  return model;
}

async function getPublic(email) {
  const model = await Model.findOne(
    {email},
    {__v: 0}
  )
    .populate('slots')
    .exec();
  return model;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25, userType = ''
  } = opts;
  const conditions = !!userType ? {userType} : {};
  const model = await Model.find(conditions, {__v: 0})
    .sort({
      _id: 1
    })
    .skip(offset)
    .limit(limit)
    .populate('slots')
    .exec();
  return model;
}

async function remove(email) {
  await Model.deleteOne({
    email
  })
}

async function create(fields) {
  const model = new Model(fields);
  await model.save()
  return model;
}

async function edit(email, change) {
  const model = await get(email);
  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
  await model.save();
  return await getPublic(email);
}

async function addSlot(email, slotId) {
  const model = await get(email);
  model.slots.push(slotId);
  await model.save();
  return model;
}

function emailSchema(opts = {}) {
  const {
    required
  } = opts
  return {
    type: String,
    required: !!required,
    unique: true,
    lowercase: true,
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

async function isUnique(doc, property) {
  const existing = await get(property);
  return !existing || doc._id === existing._id;
}

module.exports = {
  get: getPublic,
  list,
  create,
  edit,
  remove,
  addSlot,
  model: Model
}