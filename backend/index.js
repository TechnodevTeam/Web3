const express = require("express");
const cors = require("cors");
require("dotenv").config();
<<<<<<< HEAD
=======

const contentRangeMiddleware = require('./src/middleware/contentRange');

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
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
<<<<<<< HEAD
=======

app.use(cors({ exposedHeaders: ['Content-Range'] }));
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    if (req.method === 'GET' && !req.params.id && Array.isArray(data)) {
      const resource = req.baseUrl.replace(/^\//, '');
      const total = data.length;
      res.set('Content-Range', `${resource} 0-${total-1}/${total}`);
    }
    originalJson.call(this, data);
  };
  next();
});

app.use('/events', contentRangeMiddleware);
app.use('/sessions', contentRangeMiddleware);
app.use('/rooms', contentRangeMiddleware);
app.use('/speakers', contentRangeMiddleware);

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
app.use("/events", eventRoutes);
app.use("/rooms", roomRoutes);
app.use("/sessions", sessionRoutes);
app.use("/questions", questionRoutes);
app.use("/speakers", speakerRoutes);
<<<<<<< HEAD
=======


>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend sur le port ${PORT}`);
});
