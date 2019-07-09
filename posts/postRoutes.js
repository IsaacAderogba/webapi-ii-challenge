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
      // add logic to find created post
      res.status(201).json(response);
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

router.post("/:id/comments", (req, res) => {
  const { id } = req.params.id;
  // do get logic first
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

router.get("/:id/comments", (req, res) => {
  res.json("Get api/posts/:id/comments");
});

// DELETE
router.delete("/:id", (req, res) => {
  res.json("delete api/posts/ by id");
});

// PUT
router.put("/:id", (req, res) => {
  res.json("update api/posts/ by id");
});

// get post by ID helper method
const getPostById = async id => {
  try {
    return await Posts.findById(id);
  } catch {
    res
      .status(500)
      .json({ errorMessage: "The post information could not be retrieved." });
  }
};

// check if object is empty helper method

module.exports = router;
