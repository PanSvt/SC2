import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/posts.js";

async function init() {
  const app = express();
  const port = 4000;

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/posts", postRouter);

  // app.get("/", (req, res) => {
  //   res.send("Hello World");
  // });

  // app.get("*", (req, res) => {
  //   res.status(404).send("Not found");
  // });

  app.get("/posts", (req, res) => {
    res.send("post has been got successfully");
  });

  app.get("/comments", (req, res) => {
    res.send("comment has been got successfully");
  });

  app.post("/posts", (req, res) => {
    res.send("post has been created successfully");
  });

  app.post("/comments", (req, res) => {
    res.send("comment has been created successfully");
  });

  app.put("/posts", (req, res) => {
    res.send("post has been updated successfully");
  });

  app.put("/comments", (req, res) => {
    res.send("comment has been updated successfully");
  });

  app.delete("/posts", (req, res) => {
    res.send("post has been deleted successfully");
  });

  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}

init();