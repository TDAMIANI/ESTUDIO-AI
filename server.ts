import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Google OAuth Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/auth/google/callback`
);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "accounting-ai-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: true, 
      sameSite: "none",
      httpOnly: true 
    },
  })
);

// API Routes
app.get("/api/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    prompt: "consent",
  });
  res.json({ url });
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    // In a real app, store this in a DB. For this demo, we'll use session.
    (req.session as any).tokens = tokens;
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Autenticación exitosa. Esta ventana se cerrará automáticamente.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/drive/files", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  oauth2Client.setCredentials(tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    const response = await drive.files.list({
      pageSize: 20,
      fields: "nextPageToken, files(id, name, mimeType, iconLink)",
      q: "mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.document' or name contains 'AFIP' or name contains 'Ley'",
    });
    res.json(response.data.files);
  } catch (error) {
    console.error("Error listing Drive files:", error);
    res.status(500).json({ error: "Failed to list files" });
  }
});

app.get("/api/drive/file/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const tokens = (req.session as any).tokens;
  if (!tokens) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  oauth2Client.setCredentials(tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  try {
    const fileMetadata = await drive.files.get({ fileId, fields: "name, mimeType" });
    const mimeType = fileMetadata.data.mimeType;

    let content = "";
    if (mimeType === "application/vnd.google-apps.document") {
      const exportRes = await drive.files.export({
        fileId,
        mimeType: "text/plain",
      });
      content = exportRes.data as string;
    } else if (mimeType === "application/pdf") {
      // For PDFs, we'd ideally extract text. 
      // For simplicity in this demo, we'll just return a message or try to get metadata.
      // In a real app, you'd use a PDF parser or Gemini Vision on the PDF pages.
      content = `[Contenido de PDF: ${fileMetadata.data.name}]. (En una implementación real, aquí se procesaría el texto del PDF para el Segundo Cerebro).`;
    } else {
      const getRes = await drive.files.get({
        fileId,
        alt: "media",
      });
      content = getRes.data as string;
    }

    res.json({ name: fileMetadata.data.name, content });
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Failed to fetch file content" });
  }
});

app.get("/api/auth/status", (req, res) => {
  res.json({ isAuthenticated: !!(req.session as any).tokens });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
