const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from a Dockerized Node app! 🚀');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
