const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const SALT_ROUNDS = 10;
async function hashPassword(user) {
  if (!user.password) throw user.invalidate('password', 'password is required')
  if (user.password.length < 6) throw user.invalidate('password', 'password must be at least 6 characters')
  user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
}

const uploadLocalFile = async (path) => {
  const res = await cloudinary.uploader.upload(path);
  fs.unlinkSync(path);
  if (res && res.secure_url) {
    console.log('file uploaded to Cloudinary', res.secure_url);
  } else {
    return '';
  }
  return res.secure_url;
}

module.exports = {
  hashPassword,
  uploadLocalFile
}