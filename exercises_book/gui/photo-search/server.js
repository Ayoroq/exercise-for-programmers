import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/reddit", async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    const redditResponse = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=20`);
    const redditData = await redditResponse.json();
    res.json(redditData);
  } catch (error) {
    console.error("Error fetching Reddit data:", error);
    res.status(500).json({ error: "Failed to fetch data from Reddit" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});