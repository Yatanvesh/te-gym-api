const cuid = require('cuid');

const db = require('../config/db');

const Model = db.model('Package', {
  _id: {
    type: String,
    default: cuid
  },
  title: {
    type: String,
    default:'Sample package'
  },
  duration: {
    type: Number, //in weeks
    default: 12
  },
  price:{
    type:Number,
    default:6500,
  },
  currency:{
    type:String,
    default:'INR'
  },
  description: {
    type: String,
    default:"Add or create new packages, customise their duration and cost. Click to add or delete packages"
  }
})

async function get(_id) {
  const model = await Model.findOne(
    {_id},
    {__v: 0}
  );
  return model;
}

async function remove(_id) {
  const model = await get(_id);
  if (!model) throw new Error("Package not found");
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
  if (!model) throw new Error("Package not found");
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