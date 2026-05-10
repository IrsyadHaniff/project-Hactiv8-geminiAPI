const form          = document.getElementById("chat-form");
const input         = document.getElementById("user-input");
const chatBox       = document.getElementById("chat-box");
const clearBtn      = document.getElementById("clear-btn");
const sendBtn       = form.querySelector(".send-btn");
const fileInput     = document.getElementById("file-input");
const uploadBtn     = document.getElementById("upload-btn");
const previewBar    = document.getElementById("img-preview-bar");
const previewThumb  = document.getElementById("img-preview-thumb");
const previewName   = document.getElementById("img-preview-name");
const imgRemoveBtn  = document.getElementById("img-remove-btn");

const conversation = [];
let pendingImageBase64 = null;   // base64 string of staged image
let pendingImageName   = "";

/* ── Lightbox ─────────────────────────────── */
const lightbox = document.createElement("div");
lightbox.className = "lightbox hidden";
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Tutup">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
  <img src="" alt="Full image" />
`;
document.body.appendChild(lightbox);

const lbImg = lightbox.querySelector("img");
const lbClose = lightbox.querySelector(".lightbox-close");

function openLightbox(src) {
  lbImg.src = src;
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.add("hidden");
  lbImg.src = "";
  document.body.style.overflow = "";
}

lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target === lbClose || lbClose.contains(e.target)) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* ── Helpers ──────────────────────────────── */

function getTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function removeWelcome() {
  const el = chatBox.querySelector(".welcome");
  if (el) el.remove();
}

function scrollBottom() {
  chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
}

function setLoading(on) {
  sendBtn.disabled   = on;
  input.disabled     = on;
  uploadBtn.disabled = on;
}

/* ── Auto-resize textarea ─────────────────── */
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 120) + "px";
});

/* ── Image staging ────────────────────────── */

function stageImage(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    pendingImageBase64 = e.target.result; // full data URL
    pendingImageName   = file.name;

    previewThumb.src = pendingImageBase64;
    previewName.textContent = file.name;
    previewBar.classList.remove("hidden");
    uploadBtn.classList.add("has-image");
    input.focus();
  };
  reader.readAsDataURL(file);
}

function clearStagedImage() {
  pendingImageBase64 = null;
  pendingImageName   = "";
  previewBar.classList.add("hidden");
  previewThumb.src = "";
  previewName.textContent = "";
  uploadBtn.classList.remove("has-image");
  fileInput.value = "";
}

// Click upload button → open file picker
uploadBtn.addEventListener("click", () => fileInput.click());

// File selected via picker
fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) stageImage(fileInput.files[0]);
});

// Remove staged image
imgRemoveBtn.addEventListener("click", clearStagedImage);

// Drag-and-drop onto chatbox
chatBox.addEventListener("dragover", (e) => { e.preventDefault(); chatBox.style.outline = "2px dashed rgba(99,179,237,0.4)"; });
chatBox.addEventListener("dragleave", () => { chatBox.style.outline = ""; });
chatBox.addEventListener("drop", (e) => {
  e.preventDefault();
  chatBox.style.outline = "";
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) stageImage(file);
});

// Paste image from clipboard
document.addEventListener("paste", (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      stageImage(item.getAsFile());
      break;
    }
  }
});

/* ── Render message rows ──────────────────── */

const BOT_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
  <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
</svg>`;

function createRow(role) {
  const row = document.createElement("div");
  row.classList.add("message-row", role);

  if (role === "bot") {
    const av = document.createElement("div");
    av.className = "msg-avatar";
    av.innerHTML = BOT_ICON;
    row.appendChild(av);
  }

  const col = document.createElement("div");
  col.className = "msg-col";

  const bubble = document.createElement("div");
  bubble.className = "message";

  const time = document.createElement("span");
  time.className = "msg-time";
  time.textContent = getTime();

  col.appendChild(bubble);
  col.appendChild(time);
  row.appendChild(col);
  chatBox.appendChild(row);

  return bubble;
}

function appendMessage(role, text, imageSrc = null) {
  removeWelcome();
  const bubble = createRow(role);

  if (imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.className = "msg-image";
    img.alt = "Gambar";
    img.addEventListener("click", () => openLightbox(imageSrc));
    bubble.appendChild(img);
  }

  if (text) {
    const span = document.createElement("span");
    span.textContent = text;
    bubble.appendChild(span);
  }

  scrollBottom();
  return bubble;
}

function appendThinking() {
  removeWelcome();
  const bubble = createRow("bot");
  bubble.innerHTML = `<div class="dots"><span></span><span></span><span></span></div>`;
  scrollBottom();
  return bubble;
}

/* ── Submit ───────────────────────────────── */

async function handleSubmit() {
  const userMessage = input.value.trim();
  const hasImage    = !!pendingImageBase64;

  if (!userMessage && !hasImage) return;

  // Snapshot pending image before clearing
  const imageSnapshot = pendingImageBase64;

  // Render user bubble (image + text)
  appendMessage("user", userMessage || null, imageSnapshot || null);

  // Build conversation entry
  const entry = { role: "user", text: userMessage };
  if (imageSnapshot) entry.image = imageSnapshot; // base64 data URL
  conversation.push(entry);

  // Reset inputs
  input.value = "";
  input.style.height = "auto";
  clearStagedImage();
  setLoading(true);

  const thinkingBubble = appendThinking();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation }),
    });

    const data = await response.json();

    if (data.result) {
      thinkingBubble.innerHTML = "";
      const span = document.createElement("span");
      span.textContent = data.result;
      thinkingBubble.appendChild(span);
      conversation.push({ role: "model", text: data.result });
    } else {
      thinkingBubble.textContent = "Maaf, tidak ada respons yang diterima.";
    }
  } catch {
    thinkingBubble.textContent = "Gagal terhubung ke server.";
  } finally {
    setLoading(false);
    scrollBottom();
    input.focus();
  }
}

form.addEventListener("submit", (e) => { e.preventDefault(); handleSubmit(); });

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
});

/* ── Clear chat ───────────────────────────── */
clearBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  conversation.length = 0;
  clearStagedImage();

  const welcome = document.createElement("div");
  welcome.className = "welcome";
  welcome.innerHTML = `
    <div class="welcome-icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
    <p>Halo! Saya <strong>MonXbot</strong>.<br/>Ada yang bisa saya bantu hari ini?</p>
  `;
  chatBox.appendChild(welcome);
  input.focus();
});

document.addEventListener("contextmenu", (e) => e.preventDefault());