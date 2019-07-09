const express = require("express");
const router = express.Router();
const Posts = require("../data/db");

// api/posts is the root

// POST
router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    try {
      const response = await Posts.insert({ title, contents });
      const foundPost = await getPostById(response.id);
      res.status(201).json(foundPost);
    } catch {
      res.status(500).json({
        errorMessage: "There was an error while saving the post to the database"
      });
    }
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;

  if (text) {
    const foundPost = await getPostById(postId);
    if (foundPost.length > 0) {
      try {
        const response = await Posts.insertComment({
          text: text,
          post_id: postId
        });
        const foundComment = await Posts.findCommentById(response.id);
        res.status(200).json(foundComment);
      } catch {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the comment to the database"
        });
      }
    } else {
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist"
      });
    }
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment" });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const response = await Posts.find();
    res.status(200).json(response);
  } catch {
    res
      .status(500)
      .json({ errorMessage: "The posts information could not be retrieved." });
  }
});

router.get("/:id", async (req, res) => {
  const response = await getPostById(req.params.id);
  if (response.length > 0) {
    res.status(200).json(response);
  } else {
    res
      .status(404)
      .json({ errorMessage: "The post with the specified ID does not exist." });
  }
});

router.get("/:id/comments", async (req, res) => {
  const response = await getPostById(req.params.id);
  if (response.length > 0) {
    try {
      const foundComments = await Posts.findPostComments(req.params.id);
      if (foundComments.length > 0) {
        res.status(200).json(foundComments);
      } else {
        res
          .status(404)
          .json({ errorMessage: "No comments exist for this post" });
      }
    } catch {
      res.status(500).json({
        errorMessage: "The comments information could not be retrieved"
      });
    }
  } else {
    res
      .status(404)
      .json({ errorMessage: "The post with the specified ID does not exist." });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const foundPost = await getPostById(req.params.id);
  if (foundPost.length > 0) {
    try {
      const response = await Posts.remove(req.params.id);
      if (response) {
        res.status(200).json(foundPost);
      } else {
        res
          .status(404)
          .json({
            errorMessage: "The post with the specified ID does not exist."
          });
      }
    } catch {
      res.status(500).json({ errorMessage: "The post could not be removed" });
    }
  } else {
    res
      .status(404)
      .json({ errorMessage: "The post with the specified ID does not exist." });
  }
});

// PUT
router.put("/:id", (req, res) => {
  res.json("update api/posts/ by id");
});

// HELPERS
const getPostById = async id => {
  try {
    return await Posts.findById(id);
  } catch {
    res
      .status(500)
      .json({ errorMessage: "The post information could not be retrieved." });
  }
};

module.exports = router;
