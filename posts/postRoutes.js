const express = require("express"); // import
const router = express.Router();
router.get("/", (req, res) => {
    res.send('Hello from api/users')
});

module.exports = router;
