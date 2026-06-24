// backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/event.routes");
const questionRoutes = require("./routes/question.routes");
const sessionRoutes = require("./routes/session.routes");
const speakerRoutes = require("./routes/speaker.routes");

const contentRangeMiddleware = require('./middleware/contentRange');

dotenv.config();
const app = express();

app.use(cors({
  exposedHeaders: ['Content-Range']
}));

app.use(express.json());

// ✅ CORRECTION : Ajouter /api/ devant toutes les routes
app.use("/api/events", eventRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/speakers", speakerRoutes);

// backend/src/app.js
app.get("/test", (req, res) => {
  res.json({ message: "✅ Serveur fonctionne !" });
});

// Puis tes routes
app.use("/api/speakers", speakerRoutes);

app.use('/api', contentRangeMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
  console.log(`📋 Speakers: http://localhost:${PORT}/api/speakers`);
  console.log(`📋 Events: http://localhost:${PORT}/api/events`);
  console.log(`📋 Sessions: http://localhost:${PORT}/api/sessions`);
});