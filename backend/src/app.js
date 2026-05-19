

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/event.routes");
const questionRoutes = require("./routes/question.routes");
const sessionRoutes = require("./routes/session.routes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/events", eventRoutes);
app.use("/questions", questionRoutes);
app.use("/sessions", sessionRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});
