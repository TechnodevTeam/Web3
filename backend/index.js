const express = require("express");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./src/routes/event.routes");
const roomRoutes = require("./src/routes/room.routes");
const sessionRoutes = require("./src/routes/session.routes");
const questionRoutes = require("./src/routes/question.routes");
const speakerRoutes = require("./src/routes/speaker.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend EventSync fonctionne !");
});

app.use("/events", eventRoutes);
app.use("/rooms", roomRoutes);
app.use("/sessions", sessionRoutes);
app.use("/questions", questionRoutes);
app.use("/speakers", speakerRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend sur le port ${PORT}`);
});