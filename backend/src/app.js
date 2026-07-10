const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/event.routes");
const questionRoutes = require("./routes/question.routes");
const sessionRoutes = require("./routes/session.routes");
const speakerRoutes = require("./routes/speaker.routes");
const roomRoutes = require("./routes/room.routes");
const authRoutes = require("./routes/auth.routes");
const { syncAllSequences } = require("./utils/syncSequences");
const { authMiddleware, adminMiddleware } = require('./middleware/auth.middleware')
const contentRangeMiddleware = require("./middleware/contentRange");
const statsRoutes = require('./routes/stats.routes')
const userRoutes = require('./routes/user.routes')


dotenv.config();

const app = express();


app.use(cors({
  exposedHeaders: ['Content-Range']
}));

app.use(express.json());

app.use('/api', contentRangeMiddleware);


app.use("/api/events", eventRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/speakers", speakerRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await syncAllSequences();
    app.listen(PORT, () => {
      console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
      console.log(`📋 Speakers: http://localhost:${PORT}/api/speakers`);
      console.log(`📋 Events: http://localhost:${PORT}/api/events`);
      console.log(`📋 Sessions: http://localhost:${PORT}/api/sessions`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage:", error);
    process.exit(1);
  }
}

startServer();
