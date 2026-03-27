const express = require("express");
const cors = require("cors");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const { config } = require("./config");
const { testConnection } = require("./db");
const { publicRouter } = require("./routes/public");
const { adminRouter } = require("./routes/admin");
const {
  ensureDefaultAdminUser,
  purgeExpiredSessions,
} = require("./services/adminAuth");

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(config.uploads.publicPath, express.static(config.uploads.directoryPath));

app.get("/api/health", (_req, res) => {
  return res.json({
    ok: true,
    service: "cewebsite-backend",
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/public", publicRouter);
app.use("/api/admin", adminRouter);

app.use((err, _req, res, _next) => {
  return res.status(500).json({
    error: "Unhandled server error",
    message: err.message,
  });
});

async function start() {
  try {
    fs.mkdirSync(config.uploads.directoryPath, { recursive: true });
    await testConnection();
    await ensureDefaultAdminUser();
    await purgeExpiredSessions();

    app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on http://localhost:${config.port}`);
      // eslint-disable-next-line no-console
      console.log(`Uploads served from ${config.uploads.publicPath}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

start();
