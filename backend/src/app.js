const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/event.routes");
const questionRoutes = require("./routes/question.routes");
const sessionRoutes = require("./routes/session.routes");
<<<<<<< HEAD
=======
const contentRangeMiddleware = require('./middleware/contentRange');

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
dotenv.config();
const app = express();
<<<<<<< HEAD
app.use(cors());
=======

app.use(cors({
  exposedHeaders: ['Content-Range']
}));
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
app.use(express.json());
app.use("/events", eventRoutes);
app.use("/questions", questionRoutes);
app.use("/sessions", sessionRoutes);
<<<<<<< HEAD
=======

app.use('/api', contentRangeMiddleware);

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});
