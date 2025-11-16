const { Sequelize } = require("sequelize");
require("dotenv").config();

// PostgreSQL connection using Sequelize
const databaseUrl = process.env.DATABASE_URL;
const useLocalDb = true;

if (!databaseUrl && !useLocalDb) {
  console.error("✗ DATABASE_URL environment variable is not set!");
  console.error("  Either set DATABASE_URL or USE_LOCAL_DB=true in .env");
  process.exit(1);
}

let sequelize;

if (useLocalDb) {
  console.log("Using local SQLite database for development...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/hackagra.db",
    logging: (msg) => {
      if (process.env.DEBUG_SQL) console.log("[SQL]", msg);
    },
  });
} else {
  // Log connection attempt (hide password)
  const displayUrl = databaseUrl.replace(/:[^@]+@/, ":***@");
  console.log("Connecting to:", displayUrl);

  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    dialectModule: require("pg"),
    logging: (msg) => {
      if (process.env.DEBUG_SQL) console.log("[SQL]", msg);
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    retry: {
      match: [/ETIMEDOUT/, /EHOSTUNREACH/, /ECONNREFUSED/],
      max: 3,
    },
    connect_timeout: 5000,
  });
}

const connectDB = async () => {
  try {
    console.log("Attempting to authenticate with database...");
    await sequelize.authenticate();
    console.log("✓ Database connected successfully");

    // Import models AFTER sequelize is authenticated
    console.log("Loading models...");
    const { User, File } = require("../models/index");
    console.log("✓ Models loaded");

    // Sync models with database
    console.log("Synchronizing database models...");
    await sequelize.sync({ alter: true });
    console.log("✓ Database models synchronized");

    if (useLocalDb) {
      console.log("ℹ️  Using SQLite: ./data/hackagra.db (Development only)");
    } else {
      console.log("Connected to Neon PostgreSQL database");
    }

    return sequelize;
  } catch (err) {
    console.error("✗ DB connection error:", err.message);

    // Show more detailed error info
    if (err.parent) {
      console.error("  Underlying error:", err.parent.message);
      if (err.parent.code) {
        console.error("  Error code:", err.parent.code);
      }
    }

    if (!useLocalDb) {
      console.error("\n⚠️  PostgreSQL Connection Issue");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("Unable to connect to PostgreSQL database.");
      console.error("\nPossible causes:");
      console.error("1. DATABASE_URL is set incorrectly in .env");
      console.error("2. Neon database is not active (suspended?)");
      console.error("3. Connection credentials (username/password) are wrong");
      console.error("4. Network connectivity issue");
      console.error("5. Neon IP whitelist doesn't include your IP");
      console.error(
        "\n💡 Tip: Set USE_LOCAL_DB=true in .env to use SQLite for development"
      );
      console.error("📖 See: POSTGRESQL_TROUBLESHOOTING.md");
    } else {
      console.error("Unable to connect to SQLite database.");
      console.error("Make sure the ./data directory is writable.");
    }

    console.error();
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
