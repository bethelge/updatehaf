/**
 * Production HTTP server for Render/Docker.
 * Serves static client assets and forwards other requests to the TanStack Start worker bundle.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const clientDir = path.join(root, "dist", "client");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function tryReadStatic(urlPath) {
  const pathname = (urlPath || "/").split("?")[0];
  const rel = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  if (!rel || rel.includes("..")) return null;

  const candidates = [
    path.join(clientDir, rel),
    path.join(clientDir, "assets", rel.replace(/^assets\//, "")),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return { file, data: fs.readFileSync(file) };
    }
  }
  return null;
}

function nodeRequestToWeb(req, body) {
  const url = `http://${req.headers.host || "localhost"}${req.url || "/"}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : String(value));
  }
  const init = { method: req.method || "GET", headers };
  if (body && body.length && req.method !== "GET" && req.method !== "HEAD") {
    init.body = body;
  }
  return new Request(url, init);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function writeWebResponse(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    res.setHeader(key, value);
  });
  const buf = Buffer.from(await response.arrayBuffer());
  res.end(buf);
}

const entry = pathToFileURL(path.join(root, "dist/server/index.js")).href;
const handler = (await import(entry)).default;

const server = http.createServer(async (req, res) => {
  try {
    const staticHit = tryReadStatic(req.url);
    if (staticHit) {
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType(staticHit.file));
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.end(staticHit.data);
      return;
    }

    const body = await readBody(req);
    const request = nodeRequestToWeb(req, body);
    const response = await handler.fetch(request, {}, {});
    await writeWebResponse(res, response);
  } catch (err) {
    console.error("[render-server]", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`HAF frontend listening on http://${HOST}:${PORT}`);
});
