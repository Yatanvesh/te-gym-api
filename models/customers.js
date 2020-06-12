const cuid = require('cuid');

const db = require('../db');
const {emailSchema,hashPassword} = require('./utility');


const Customer = db.model('Customer', {
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
  targetWeight:{
    type:Number
  },
  height:{
    type:Number
  }
})


async function get(email) {
  const customer = await Customer.findOne({
    email
  });
  return customer;
}

async function list(opts = {}) {
  const {
    offset = 0, limit = 25
  } = opts
  const customers = await Customer.find()
    .sort({
      _id: 1
    })
    .skip(offset)
    .limit(limit)
  return customers;
}

async function remove(email) {
  await Customer.deleteOne({
    email
  })
}

async function create(fields) {
  const customer = new Customer(fields)
  await hashPassword(customer)
  await customer.save()
  return customer;
}

async function edit(email, change) {
  const customer = await get(email);
  Object.keys(change).forEach(key => {
    customer[key] = change[key]
  });
  if (change.password) await hashPassword(customer);
  await customer.save();
  return customer;
}

module.exports = {
  get,
  list,
  create,
  edit,
  remove,
  model: Customer
}