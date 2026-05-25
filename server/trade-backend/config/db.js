const mysql = require("mysql2");
require("dotenv").config();

const required = ["DB_HOST", "DB_USER", "DB_NAME"];
const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === "");
if (missing.length) {
  console.error(
    "\n[trade-backend] Missing database env vars: " +
      missing.join(", ") +
      "\nCreate server/trade-backend/.env (see .env.example) and set MySQL credentials.\n"
  );
  process.exit(1);
}

const dbPort = Number(process.env.DB_PORT) || 3306;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: dbPort,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Pool behavior
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT || 8),
  maxIdle: Number(process.env.DB_MAX_IDLE || 5), // keep few idles
  idleTimeout: Number(process.env.DB_IDLE_TIMEOUT || 60000), // recycle before host kills (60s)
  queueLimit: 0,

  // Keep TCP alive so NAT/firewalls don’t drop it
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,

  // Encoding & dates: safer on shared hosts
  dateStrings: true,
  charset: "utf8mb4_general_ci",
});

function queryPromise(sql) {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function ensureSchema() {
  const createAdminsTable = `
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(120) NOT NULL,
      image LONGTEXT NOT NULL,
      explore_images LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createMediaCoverageTable = `
    CREATE TABLE IF NOT EXISTS media_coverage (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      media_type VARCHAR(50) NOT NULL,
      media_url TEXT NOT NULL,
      youtube_link VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await queryPromise(createAdminsTable);
  await queryPromise(createProductsTable);
  await queryPromise(createMediaCoverageTable);
  await migrateMediaCoverageColumns();
  console.log("Database schema verified.");
}

/** Existing DBs may use ENUM('image','video') — allow 'link' and long URLs. */
async function migrateMediaCoverageColumns() {
  const schema = process.env.DB_NAME;
  if (!schema) return;

  const rows = await queryPromise(
    `SELECT COLUMN_NAME, COLUMN_TYPE, CHARACTER_MAXIMUM_LENGTH
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = '${schema.replace(/'/g, "''")}'
       AND TABLE_NAME = 'media_coverage'
       AND COLUMN_NAME IN ('media_type', 'youtube_link', 'media_url')`,
  );

  const colMap = {};
  for (const row of Array.isArray(rows) ? rows : []) {
    const name = String(row.COLUMN_NAME ?? row.column_name ?? "").toLowerCase();
    if (name) colMap[name] = row;
  }

  const mediaType = colMap.media_type;
  if (mediaType) {
    const type = String(mediaType.COLUMN_TYPE ?? mediaType.column_type ?? "").toLowerCase();
    if (type.startsWith("enum") || !type.includes("varchar")) {
      await queryPromise(
        "ALTER TABLE media_coverage MODIFY media_type VARCHAR(50) NOT NULL",
      );
      console.log("[schema] media_type → VARCHAR(50) (supports image, video, link)");
    }
  }

  const yt = colMap.youtube_link;
  if (yt) {
    const len = yt.CHARACTER_MAXIMUM_LENGTH ?? yt.character_maximum_length;
    if (len != null && Number(len) < 512) {
      await queryPromise(
        "ALTER TABLE media_coverage MODIFY youtube_link VARCHAR(512) NULL",
      );
      console.log("[schema] youtube_link widened to VARCHAR(512)");
    }
  }

  const mediaUrl = colMap.media_url;
  if (mediaUrl) {
    const type = String(mediaUrl.COLUMN_TYPE ?? mediaUrl.column_type ?? "").toLowerCase();
    if (type.startsWith("varchar")) {
      await queryPromise(
        "ALTER TABLE media_coverage MODIFY media_url TEXT NOT NULL",
      );
      console.log("[schema] media_url → TEXT");
    }
  }
}

module.exports = db;
module.exports.ensureSchema = ensureSchema;
