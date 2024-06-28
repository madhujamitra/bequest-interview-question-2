import express from "express";
import cors from "cors";
import crypto from "crypto";

const PORT = 8080;
const app = express();
let database = { data: "Hello World" };
let blockchain: { hash: string; data: string; previousHash: string }[] = [];

const calculateHash = (data: string, previousHash: string) => {
  return crypto
    .createHash("sha256")
    .update(data + previousHash)
    .digest("hex");
};

const addBlock = (data: string) => {
  const previousHash = blockchain.length
    ? blockchain[blockchain.length - 1].hash
    : "0";
  const hash = calculateHash(data, previousHash);
  blockchain.push({ data, hash, previousHash });
};

addBlock(database.data);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json(database);
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  addBlock(database.data);
  res.sendStatus(200);
});

app.post("/verify", (req, res) => {
  const currentData = req.body.data;
  let isValid = false;
  for (let i = 0; i < blockchain.length; i++) {
    const block = blockchain[i];
    const calculatedHash = calculateHash(currentData, block.previousHash);
    if (block.hash === calculatedHash && block.data === currentData) {
      isValid = true;
      break;
    }
  }

  res.json({ valid: isValid });
});

app.get("/history", (req, res) => {
  res.json(blockchain);
});

app.post("/recover", (req, res) => {
  const { index } = req.body;
  if (index >= 0 && index < blockchain.length) {
    const block = blockchain[index];
    database.data = block.data;
    addBlock(block.data);
    res.json({ data: block.data });
  } else {
    res.status(404).json({ error: "Invalid index" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
