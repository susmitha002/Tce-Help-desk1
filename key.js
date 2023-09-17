const crypto = require('crypto');

const newSecretKey = crypto.randomBytes(32).toString('hex');
console.log(newSecretKey);