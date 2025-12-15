require('dotenv').config();
const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

// Bedrock Client Configuration
const bedrock = new AWS.BedrockRuntime({
  accessKeyId: process.env.BEDROCK_ACCESS_KEY,
  secretAccessKey: process.env.BEDROCK_SECRET_KEY,
  region: process.env.BEDROCK_REGION || 'us-east-1'
});

// Gemini Client Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Endpoint: Agent Query
app.post('/api/agent/query', async (req, res) => {
  try {
    const { message, model = 'gemini', language = 'hi' } = req.body;

    // System instruction for farming context
    const systemContext = "You are Kisaan Mitra, an expert farming assistant. Respond helpfully and accurately to farmers.";
    const languageInstruction = `Respond in ${language}.`;
    const fullPrompt = `${systemContext} ${languageInstruction} User asks: ${message}`;

    let responseText = "";

    if (model === 'bedrock') {
      // Claude 3 Messages API Format
      const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: fullPrompt
          }
        ]
      };

      const params = {
        body: JSON.stringify(payload),
        modelId: process.env.BEDROCK_MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json'
      };

      const result = await bedrock.invokeModel(params).promise();
      const responseBody = JSON.parse(result.body);
      responseText = responseBody.content[0].text;

    } else {
      // Gemini - Use gemini-pro as default if GEMINI_MODEL not specified
      const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
      const genModel = genAI.getGenerativeModel({ model: modelName });
      const genRes = await genModel.generateContent(fullPrompt);
      if (genRes.response && genRes.response.text) {
        responseText = genRes.response.text();
      } else {
        responseText = "Sorry, I could not generate a response. (Gemini Error)";
      }
    }

    res.json({ response: responseText });

  } catch (error) {
    console.error("Agent Query Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
