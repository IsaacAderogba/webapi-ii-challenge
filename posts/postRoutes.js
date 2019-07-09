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
    const foundPost = await getPostById(postId, res);
    if (foundPost) {
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
  const foundPost = await getPostById(req.params.id, res);
  if (foundPost) {
    res.status(200).json(foundPost);
  }
});

router.get("/:id/comments", async (req, res) => {
  const foundPost = await getPostById(req.params.id, res);
  if (foundPost) {
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
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const foundPost = await getPostById(req.params.id, res);
  if (foundPost) {
    try {
      const response = await Posts.remove(req.params.id);
      if (response) {
        res.status(200).json(foundPost);
      } else {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist."
        });
      }
    } catch {
      res.status(500).json({ errorMessage: "The post could not be removed" });
    }
  }
});

// PUT
router.put("/:id", async (req, res) => {
  const { title, contents } = req.body;

  if (title && contents) {
    const foundPost = await getPostById(req.params.id, res);
    if (foundPost) {
      try {
        const updatedPost = await Posts.update(req.params.id, {
          title,
          contents
        });
        let foundUpdatedPost;
        if (updatedPost) foundUpdatedPost = await getPostById(req.params.id);
        res.status(200).json(foundUpdatedPost);
      } catch {
        res.status(500).json({
          errorMessage: "The post information could not be modified."
        });
      }
    }
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// HELPERS
const getPostById = async (id, res) => {
  try {
    const foundPost = await Posts.findById(id);
    if (foundPost.length > 0) {
      return foundPost;
    } else {
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist."
      });
    }
  } catch {
    res
      .status(500)
      .json({ errorMessage: "The post information could not be retrieved." });
  }
};

module.exports = router;
