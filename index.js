import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" })); // limit untuk gambar
app.use(express.static("public"));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { conversation } = req.body;

    const lastMessage = conversation[conversation.length - 1];

    // Bangun "parts" untuk Gemini
    const parts = [];

    // Jika ada gambar, tambahkan sebagai inlineData
    if (lastMessage.image) {
      const [meta, base64Data] = lastMessage.image.split(",");
      const mimeType = meta.match(/:(.*?);/)[1]; // "image/png"

      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    // Tambahkan teks (jika ada)
    if (lastMessage.text) {
      parts.push({ text: lastMessage.text });
    }

    // Fallback jika keduanya kosong
    if (parts.length === 0) {
      return res.status(400).json({ error: "Pesan kosong" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
