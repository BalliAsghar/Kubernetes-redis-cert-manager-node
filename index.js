import Redis from "ioredis";
import Express from "express";
import { config } from "dotenv";
import fs from "fs";
config();

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const app = Express();
app.use(Express.json());

// Read the certificates
const ca = fs.readFileSync("/etc/redis/certs/ca.crt");
const cert = fs.readFileSync("/etc/redis/certs/tls.crt");
const key = fs.readFileSync("/etc/redis/certs/tls.key");

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  tls: {
    ca,
    cert,
    key,
  },
});

app.get("/ping", async (_req, res) => {
  console.log("Received ping request");
  try {
    const pong = await redis.ping();
    res.status(200).send(pong);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/set/:value", async (req, res) => {
  console.log("Received set request");
  try {
    const { value } = req.params;
    // create a random key
    const key = Math.random().toString(36).substring(7);
    await redis.set(key, value);
    res.status(200).send("OK");
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
