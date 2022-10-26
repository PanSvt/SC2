import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const status = req.query.status || "";
  const keywords = req.query.keywords || "";
  const page = req.query.page || 1;

  const PAGE_SIZE = 5;
  const offset = (page - 1) * PAGE_SIZE;

  let query = "";
  let values = [];

  if (status && keywords) {
    query = `select * from posts
    where status=$1
    and title ilike $2
    limit $3
    offset $4`;
    values = [status, keywords, PAGE_SIZE, offset];
  } else if (keywords) {
    query = `select * from posts
    where title ilike $1
    limit $2
    offset $3`;
    values = [keywords, PAGE_SIZE, offset];
  } else if (status) {
    query = `select * from posts
    where status=$1
    limit $2
    offset $3`;
    values = [status, PAGE_SIZE, offset];
  } else {
    query = `select * from posts
    limit $1
    offset $2`;
    values = [PAGE_SIZE, offset];
  }

  const results = await pool.query(query, values);

  return res.json({
    data: results.rows,
  });
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;

  const result = await pool.query("select * from posts where post_id=$1", [
    postId,
  ]);

  return res.json({
    data: result.rows,
  });
});

postRouter.post("/", async (req, res) => {
  const hasPublished = req.body.status === "published";
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  await pool.query(
    `
  insert into posts(user_id,title,content,likes,category,)
  values($1,$2,$3,$4,$5)`,
    [
      1,
      newPost.title,
      newPost.content,
      newPost.likes,
      newPost.category,
    ]
  );
  return res.json({
    message: "Post has been created.",
  });
});

postRouter.put("/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  const postId = req.params.id;
  await pool.query(
    `update posts set user_id=$1,title=$2,content=$3,likes=$4,category_id=$5,
    where post_id=$6
    `,
    [
      updatedPost.user_id,
      updatedPost.title,
      updatedPost.content,
      updatedPost.likes,
      updatedPost.category_id,
      postId
    ]
  );

  return res.json({
    message: `Post ${postId} has been updated.`,
  });
});

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;

  await pool.query(`delete from posts where post_id=$1`, [postId]);

  return res.json({
    message: `Post ${postId} has been deleted.`,
  });
});

export default postRouter;