import Redis from "ioredis";
import Express from "express";
import { config } from "dotenv";

config();

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

console.log(`Connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

const app = Express();
app.use(Express.json());

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

app.get("/ping", async (_req, res) => {
  console.log("Received ping request");
  try {
    const ping = await redis.ping();
    res.status(200).json({ ping });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
