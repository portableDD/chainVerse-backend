const express = require("express");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const dbConnection = require("./src/config/database/connection");
const router = require("./src/routes/index");

dotEnv.config();

app.use(cors());
dbConnection();

dotEnv.config();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to ChainVerse Academy");
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

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
