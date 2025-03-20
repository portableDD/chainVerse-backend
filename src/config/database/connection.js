const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { });
    console.log('Database Connected');
  } catch (error) {
    console.log('Database Connectivity Error', error);
    throw new Error(error);
  }
}


