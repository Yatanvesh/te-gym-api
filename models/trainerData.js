const mongoose = require('mongoose');
const {isEmail} = require('validator');

const db = require('../config/db');
const {userTypes} = require("../constants")

const Package = require('./package');
const Slot = require('./slot');

const opts = {toJSON: {virtuals: true}};

const trainerSchema = mongoose.Schema({
  _id: {
    type: String,
    required:true
    // default: cuid
  },
  email: emailSchema({
    required: true
  }),
  userType: {type: String, default: userTypes.TRAINER}, // helpful for frontend
  name: {
    type: String,
    default:''
  },
  experience: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.0
  },
  workingDays: {
    type: Array,
    default: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  },
  slots: [{type: String, ref: 'Slot'}],
  packages: [{type: String, ref: 'Package'}],
  phone: {
    type: String
  },
  gender: {
    type: String
  },
  displayPictureUrl: {
    type: String,
    default:''
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
  )
    .populate('packages')
    .populate('slots')
    .exec();

  return model;
}

async function getById(_id) {
  const model = await Model.findOne(
    {_id},
  )
    .populate('packages')
    .populate('slots')
    .exec();

  return model;
}

// async function list(opts = {}) {
//   const {
//     offset = 0, limit = 25, userType = ''
//   } = opts;
//   const conditions = !!userType ? {userType} : {};
//   const model = await Model.find(conditions, {__v: 0})
//     .sort({
//       _id: 1
//     })
//     .skip(offset)
//     .limit(limit)
//     .populate('packages')
//     .exec();
//   return model;
// }

async function list(opts = {}) {
  const {
    offset = 0, limit = 25
  } = opts;
  const model = await Model.find({}, {userType:0,packages:0,__v:0,id:0})
    .sort({
      _id: 1
    })
    .skip(offset)
    .limit(limit)
    // .populate('packages')
    // .exec();
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

async function edit(userId, change) {
  const model = await getById(userId);
  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
  await model.save();
  return model;
}

async function addPackage(trainerId, packageId) {
  const model = await getById(trainerId);
  model.packages.push(packageId);
  await model.save();
  return model;
}

async function addSlot(trainerId, slotId) {
  const model = await getById(trainerId);
  model.slots.push(slotId);
  await model.save();
  return getById(model); // doing this cuz of late updation bug, look into later
}

async function removePackage(trainerId, packageId) {
  const model = await getById(trainerId);
  model.packages = model.packages.filter(package_ => package_._id !== packageId);
  await Package.remove(packageId);
  await model.save();
  return model;
}

async function removeSlot(trainerId, slotId) {
  const model = await getById(trainerId);
  model.slots = model.slots.filter(slot => slot._id !== slotId);
  await Slot.remove(slotId);
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
  get,
  getById,
  list,
  create,
  edit,
  remove,
  addPackage,
  addSlot,
  removePackage,
  removeSlot,
  model: Model
}