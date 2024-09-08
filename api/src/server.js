const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
require("dotenv").config();

// Vérification de la présence de JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in the environment variables.");
  process.exit(1);
}

console.log("JWT_SECRET is set:", !!process.env.JWT_SECRET);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SQLite database connection
let db;
async function setupDatabase() {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      email TEXT UNIQUE,
      password TEXT,
      publicKey TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS attestations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     json_data TEXT,  
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Check if publicKey column exists, if not, add it
  const tableInfo = await db.all("PRAGMA table_info(users)");
  const publicKeyColumnExists = tableInfo.some(
    (column) => column.name === "publicKey"
  );

  if (!publicKeyColumnExists) {
    await db.exec(`ALTER TABLE users ADD COLUMN publicKey TEXT`);
    console.log("Added publicKey column to users table");
  }
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, publicKey } = req.body;
    console.log("Received registration request body:", req.body);

    console.log("Received registration request:", {
      firstName,
      lastName,
      email,
      publicKey,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO users (firstName, lastName, email, password, publicKey) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, publicKey]
    );

    const user = await db.get("SELECT id FROM users WHERE email = ?", [email]);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ token, user: { firstName, lastName, email, hasWallet: true } });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "User already exists" });
    }
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasWallet: !!user.publicKey,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

app.post("/api/associate-wallet", async (req, res) => {
  try {
    const { publicKey } = req.body;
    await db.run("UPDATE users SET publicKey = ? WHERE id = ?", [
      publicKey,
      req.user.userId,
    ]);
    res.json({ message: "Wallet associated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to associate wallet", error: error.message });
  }
});

app.get("/api/user", async (req, res) => {
  try {
    const user = await db.get(
      "SELECT id, firstName, lastName, email, publicKey FROM users WHERE id = ?",
      [req.user.userId]
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      ...user,
      hasWallet: !!user.publicKey,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});

async function getSignerInfo(address) {
  try {
    const user = await db.get("SELECT email FROM users WHERE publicKey = ?", [
      address,
    ]);
    return user ? user.email : null;
  } catch (error) {
    console.error("Error fetching signer info:", error);
    return null;
  }
}

app.post("/api/notify-signers", async (req, res) => {
  try {
    const { attestationId, signerAddresses } = req.body;

    console.log("we are in the notification", attestationId);
    console.log("we are in the notification", signerAddresses);

    for (const address of signerAddresses) {
      const signerEmail = await getSignerInfo(address);
      if (signerEmail) {
        console.log(
          `Notification sent to ${signerEmail} for attestation ${attestationId}`
        );
      }
    }

    res.json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res
      .status(500)
      .json({ message: "Failed to send notifications", error: error.message });
  }
});

app.post("/api/attestationJson", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const attestationJson = req.body;
    const jsonString = JSON.stringify(attestationJson);
    await db.run("INSERT INTO attestations (user_Id,json_data) VALUES (?,?)", [
      userId,
      jsonString,
    ]);
    res.json({
      message: "Attestation JSON saved successfully",
      attestationId: result.lastID,
    });
  } catch (error) {
    console.error("Error saving attestation JSON:", error);
    res.status(500).json({
      message: "Failed to save attestation JSON",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
setupDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Failed to set up database:", error);
    process.exit(1);
  });
