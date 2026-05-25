const db = require('./server/trade-backend/config/db');

async function migrate() {
  try {
    console.log("Checking if youtube_link column exists...");
    db.query("ALTER TABLE media_coverage ADD COLUMN youtube_link VARCHAR(255)", (err) => {
      if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
           console.log("Column already exists.");
        } else {
           console.error("Migration failed:", err);
        }
      } else {
        console.log("Successfully added youtube_link column.");
      }
      process.exit(0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
