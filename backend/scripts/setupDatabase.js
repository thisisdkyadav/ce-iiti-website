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
const databaseName = (() => {
  const configured = process.env.DB_NAME || "cewebsite";
  const cleaned = configured.replace(/[^a-zA-Z0-9_]/g, "");
  return cleaned || "cewebsite";
})();

async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  await connection.query(sql);
}

async function hasExistingSeedData(connection) {
  const [tableRows] = await connection.query(
    "SELECT COUNT(*) AS total FROM information_schema.tables WHERE table_schema = ? AND table_name = 'site_settings'",
    [databaseName],
  );

  if (Number(tableRows?.[0]?.total || 0) === 0) {
    return false;
  }

  const [dataRows] = await connection.query(
    `SELECT COUNT(*) AS total FROM \`${databaseName}\`.\`site_settings\``,
  );

  return Number(dataRows?.[0]?.total || 0) > 0;
}

function extractInsertStatement(seedSql, tableName) {
  const statementPattern = new RegExp(
    `INSERT INTO\\s+${tableName}\\s*\\([\\s\\S]*?;`,
    "i",
  );
  const match = seedSql.match(statementPattern);
  return match ? match[0] : null;
}

async function hasSingletonRow(connection, tableName) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total FROM \`${databaseName}\`.\`${tableName}\` WHERE id = 1`,
  );

  return Number(rows?.[0]?.total || 0) > 0;
}

async function seedMissingSingletonRows(connection) {
  const singletonTables = [
    "specializations_content",
    "events_content",
    "contact_content",
  ];
  const seedSql = fs.readFileSync(seedSqlPath, "utf8");
  const backfilledTables = [];

  for (const tableName of singletonTables) {
    const alreadyExists = await hasSingletonRow(connection, tableName);

    if (alreadyExists) {
      continue;
    }

    const insertStatement = extractInsertStatement(seedSql, tableName);

    if (!insertStatement) {
      throw new Error(
        `Could not find seed INSERT statement for table: ${tableName}`,
      );
    }

    await connection.query(`USE \`${databaseName}\`; ${insertStatement}`);
    backfilledTables.push(tableName);
  }

  return backfilledTables;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const runSchemaOnly = args.has("--schema");
  const runSeedOnly = args.has("--seed");
  const forceSeed = args.has("--force-seed");

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    if (!runSeedOnly) {
      await runSqlFile(connection, schemaSqlPath);
      // eslint-disable-next-line no-console
      console.log("Schema applied successfully.");
    }

    if (!runSchemaOnly) {
      const skipSeed = !forceSeed && (await hasExistingSeedData(connection));

      if (skipSeed) {
        // eslint-disable-next-line no-console
        console.log(
          "Seed skipped to preserve existing data. Use --force-seed to overwrite with defaults.",
        );

        const backfilledTables = await seedMissingSingletonRows(connection);

        if (backfilledTables.length > 0) {
          // eslint-disable-next-line no-console
          console.log(
            `Backfilled missing singleton defaults for: ${backfilledTables.join(", ")}.`,
          );
        } else {
          // eslint-disable-next-line no-console
          console.log("No missing singleton content rows required backfill.");
        }
      } else {
        await runSqlFile(connection, seedSqlPath);
        // eslint-disable-next-line no-console
        console.log("Seed data applied successfully.");
      }
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
