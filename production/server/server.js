const express = require("express");
const { archiveOldData } = require("./");
require("./cronJob"); // Start the cron job

const app = express();

app.get("/", (req, res) => {
  res.send("DB Archival Service is running");
});

app.get("/archive-now", async (req, res) => {
  try {
    // await archiveOldData();
    res.send("Data archived successfully");
  } catch (error) {
    res.status(500).send("Error archiving data: " + error.message);
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
