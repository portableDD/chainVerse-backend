const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const connectDB = require('./src/config/database/connection');
const studentRoute = require('./src/routes/authRoute')

dotEnv.config();

app.use(cors());

connectDB();
// dotEnv.config();

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(helmet());
app.use(morgan('dev'));

// Define Routes
app.use('/admin', require('./src/routes/admin'));
app.use('/platform-info', require('./src/routes/platformInfo'));
app.use('/student', studentRoute)

app.get("/", (req, res) => {
  res.send("Welcome to ChainVerse Academy");
});

const tutorRoutes = require("./routes/tutorRoutes");
app.use("/api", tutorRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    status: error.status || 500,
    message: error.message,
    body: {},
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

