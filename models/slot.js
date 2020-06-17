const cuid = require('cuid');

const db = require('../config/db');

const Model = db.model('Slot', {
  _id: {
    type: String,
    default: cuid
  },
  startTime: {
    type: String,
    default: '900' // military time
  },
  duration: {
    type: Number,
    default: 30
  },
  assignedTo: {
    type: String,
    ref: 'User',
    index: true,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now // temporary
  }
})

async function get(_id) {
  const model = await Model.findOne(
    {_id},
    {__v: 0}
  );
  return model;
}

async function remove(_id,) {
  const model = await get(_id);
  if (!model) throw new Error("Slot not found");
  await Model.deleteOne({
    _id
  });
  return true;
}

async function create(fields) {
  const model = new Model(fields);
  await model.save();
  return model;
}

async function edit(_id, change) {
  const model = await get(_id);
  if (!model) throw new Error("Comment not found");

  Object.keys(change).forEach(key => {
    model[key] = change[key]
  });
  await model.save();
  return model;
}


module.exports = {
  get,
  create,
  edit,
  remove,
  model: Model
}