const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const port = Number(process.env.PORT || 4000);

const config = {
  port,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://localhost:${port}`,
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cewebsite",
  },
  admin: {
    defaultUsername: process.env.ADMIN_DEFAULT_USERNAME || "admin",
    defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || "admin123",
    sessionTtlDays: Number(process.env.ADMIN_SESSION_TTL_DAYS || 7),
    sessionCookieName: process.env.ADMIN_SESSION_COOKIE_NAME || "ce_admin_session",
  },
  uploads: {
    publicPath: "/uploads",
    directoryPath: path.resolve(
      __dirname,
      process.env.UPLOADS_DIRECTORY_PATH || "../public/uploads"
    ),
    maxImageSizeBytes: Number(process.env.UPLOADS_MAX_IMAGE_SIZE_BYTES || 5242880),
  },
};

module.exports = { config };
