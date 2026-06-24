// backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/event.routes");
const questionRoutes = require("./routes/question.routes");
const sessionRoutes = require("./routes/session.routes");
const speakerRoutes = require("./routes/speaker.routes");
const { syncAllSequences } = require("./utils/syncSequences"); // ✅ IMPORTER

const contentRangeMiddleware = require('./middleware/contentRange');

dotenv.config();
const app = express();

app.use(cors({
  exposedHeaders: ['Content-Range']
}));

app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/speakers", speakerRoutes);

app.use('/api', contentRangeMiddleware);

const PORT = process.env.PORT || 8080;

// ✅ Démarrer le serveur après synchronisation des séquences
async function startServer() {
  try {
    // Synchroniser les séquences avant de démarrer
    await syncAllSequences();
    
    app.listen(PORT, () => {
      console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
      console.log(`📋 Speakers: http://localhost:${PORT}/api/speakers`);
      console.log(`📋 Events: http://localhost:${PORT}/api/events`);
      console.log(`📋 Sessions: http://localhost:${PORT}/api/sessions`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

startServer();