import express from "express";
import certificateRoutes from "./routes/certificates";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/certificates", certificateRoutes);

app.get("/", (req, res) => {
  res.send("ChainVerse Certificate API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
