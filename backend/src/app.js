import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/event.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(eventRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});