// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Question = require("./models/questions");
const PORT = 8000;
const MONGODB_URI =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
const Answer = require("./models/answers");
const Tag = require("./models/tags");
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server started on https://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.get("/posts/answer/:id", async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId);

    res.json(answer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

app.post("/posts/question/:id/answers", async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    const { text, ans_by } = req.body;
    const answer = new Answer({
      text,
      ans_by,
    });
    question.answers.push(answer);

    await answer.save();
    await question.save();
    res.redirect(question.url);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

app.get("/posts/question/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId);

    question.views += 1;
    await question.save();

    res.json(question);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

app.get("/posts/questions", (req, res) => {
  Question.find()
    .then((questions) => {
      res.json(questions);
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Server error fetching questions" });
    });
});

app.post("/posts/questions", async (req, res) => {
  const { title, text, tags, asked_by } = req.body;

  const newQuestion = new Question({
    title,
    text,
    tags: [],
    asked_by,
  });

  const tagObjects = [];

  for (const tag of tags) {
    const existingTag = await Tag.findOne({ name: tag });
    if (existingTag) {
      tagObjects.push(existingTag);
    } else {
      const newTag = new Tag({ name: tag });
      await newTag.save();
      tagObjects.push(newTag);
    }
  }

  newQuestion.tags = tagObjects;

  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ error: "Server error creating question" });
  }
});

app.post("/posts/tags", async (req, res) => {
  try {
    const { tags } = req.body;
    const newTags = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOne({ name: tag });
      if (!existingTag) {
        const newTag = new Tag({ name: tag });
        await newTag.save();
        newTags.push(newTag);
      } else {
        newTags.push(existingTag);
      }
    }

    res.json(newTags);
  } catch (err) {
    console.error("Error creating tags:", err);
    res.status(500).json({ error: "Server error creating tags" });
  }
});

app.post("/delete-all", async (req, res) => {
  try {
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await Tag.deleteMany({});
    res.status(200).json({ message: "All data deleted successfully" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Server error deleting data" });
  }
});

app.get("/posts/tags", async (req, res) => {
  try {
    const results = await Question.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

app.get("/posts/tag/:id", async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findById(tagId);

    res.json(tag);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

process.on("SIGINT", () => {
  mongoose.connection.close();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});

module.exports = router;
