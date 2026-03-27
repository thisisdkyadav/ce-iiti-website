const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
};

const sqlDir = path.resolve(__dirname, "../sql");
const schemaSqlPath = path.join(sqlDir, "schema.sql");
const seedSqlPath = path.join(sqlDir, "seed.sql");

async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  await connection.query(sql);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const runSchemaOnly = args.has("--schema");
  const runSeedOnly = args.has("--seed");

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    if (!runSeedOnly) {
      await runSqlFile(connection, schemaSqlPath);
      // eslint-disable-next-line no-console
      console.log("Schema applied successfully.");
    }

    if (!runSchemaOnly) {
      await runSqlFile(connection, seedSqlPath);
      // eslint-disable-next-line no-console
      console.log("Seed data applied successfully.");
    }

    // eslint-disable-next-line no-console
    console.log("Database setup complete.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
