const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();

// module.exports = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URL, { });
//     console.log('Database Connected');
//   } catch (error) {
//     console.log('Database Connectivity Error', error);
//     throw new Error(error);
//   }
// }

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;