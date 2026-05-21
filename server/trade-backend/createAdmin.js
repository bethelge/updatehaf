const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password",
  database: "trade_db",
});

async function createAdmin(username, plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  connection.query(
    "INSERT INTO admins (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, results) => {
      if (err) {
        console.error("Error inserting admin:", err);
      } else {
        console.log("Admin user created successfully!");
      }
      connection.end();
    }
  );
}


