# 🤖 MonXbot

> Chatbot AI berbasis **Gemini 2.5 Flash** dengan tampilan modern dark glassmorphism. Mendukung percakapan teks dan analisis gambar secara real-time.

---

## 📸 Screenshots / Demo

<p align="center">
  <img src="/public/img/preview1.png" alt="preview" width="300"/>
  <img src="/public/img/preview2.png" alt="preview" width="100" height="200"/>
</p>

---

## ✨ Fitur

- 💬 **Chat teks** — percakapan natural dengan Gemini AI
- 🖼️ **Upload gambar** — analisis & deskripsi gambar oleh AI
- 📋 **Paste gambar** — langsung paste dari clipboard (`Ctrl+V`)
- 🖱️ **Drag & drop** — seret gambar ke area chat
- 🔍 **Lightbox** — klik gambar untuk melihat ukuran penuh
- 🗑️ **Hapus chat** — reset percakapan dengan satu klik
- ⌨️ **Shortcut keyboard** — `Enter` kirim, `Shift+Enter` baris baru
- 📱 **Responsive** — tampilan optimal di mobile & desktop

---

## 🛠️ Tech Stack

| Layer    | Teknologi                                 |
| -------- | ----------------------------------------- |
| Frontend | HTML, CSS, JS                             |
| Backend  | Node.js, Express.js                       |
| AI       | Google Gemini 2.5 Flash (`@google/genai`) |
| Upload   | Multer                                    |
| Font     | Syne + DM Sans (Google Fonts)             |

---

## 📁 Struktur Folder

```
project/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── uploads/          # file gambar sementara (auto terhapus)
├── .env
├── .gitignore
├── package.json
└── index.js
```

---

## 🚀 Instalasi & Menjalankan

### 1. Clone repository

```bash
git clone https://github.com/IrsyadHaniff/project-Hactiv8-geminiAPI.git
cd project-Hactiv8-geminiAPI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

```env
GEMINI_API_KEY=your_api_key_here
```

> Dapatkan API key gratis di [Google AI Studio](https://aistudio.google.com/app/apikey)

### 4. Jalankan server

```bash
node index.js
```

### 5. Buka browser

```
http://localhost:3000
```

---

## 📦 Dependencies

```json
{
  "@google/genai": "^2.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "multer": "latest"
}
```

---

## 🔒 .gitignore

Pastikan file `.env` dan folder `uploads/` tidak ikut ter-push:

```
.env
node_modules/
uploads/
```

---

<div align="center">
  <p>Dibuat dengan Google Gemini API & dikembangkan oleh <a href="https://www.instagram.com/monxyzvi/" target="_blank"> Irsyadhaniff</a></p>
</div>
