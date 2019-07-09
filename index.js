const express = require("express");

const postRoutes = require('./posts/postRoutes');
const server = express();

server.use('/api/posts', postRoutes);

server.listen(8000, () => console.log("API running on port 8000"));
