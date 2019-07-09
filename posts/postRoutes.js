const express = require("express");
const router = express.Router();

// api/posts is the root

// POST
router.post("/", (req, res) => {
  res.json("post api/posts/");
});

router.post("/:id/comments", (req, res) => {
  res.json("post api/posts/comments");
});

// GET
router.get("/", (req, res) => {
  res.json("Get api/posts");
});

router.get("/:id", (req, res) => {
  res.json("Get api/posts by id");
});

router.get("/:id/comments", (req, res) => {
  res.json("Get api/posts/:id/comments");
});

// DELETE
router.delete("/:id", (req, res) => {
    res.json('delete api/posts/ by id')
});

// PUT
router.put("/:id", (req, res) => {
    res.json('update api/posts/ by id')
});

module.exports = router;
