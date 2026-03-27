const { config } = require("../config");
const { query } = require("../db");
const {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
} = require("../utils/security");

const SESSION_COOKIE_NAME = config.admin.sessionCookieName;

function getSessionTtlMs() {
  return config.admin.sessionTtlDays * 24 * 60 * 60 * 1000;
}

async function ensureDefaultAdminUser() {
  const rows = await query(
    "SELECT id FROM admin_users WHERE username = ? LIMIT 1",
    [config.admin.defaultUsername]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  const password = hashPassword(config.admin.defaultPassword);

  await query(
    "INSERT INTO admin_users (username, password_hash, password_salt, is_active) VALUES (?, ?, ?, 1)",
    [config.admin.defaultUsername, password.hash, password.salt]
  );

  const [insertedUser] = await query(
    "SELECT id FROM admin_users WHERE username = ? LIMIT 1",
    [config.admin.defaultUsername]
  );

  return insertedUser;
}

async function validateAdminCredentials(username, plainPassword) {
  const users = await query(
    "SELECT id, username, password_hash, password_salt, is_active FROM admin_users WHERE username = ? LIMIT 1",
    [username]
  );

  const user = users[0];
  if (!user || user.is_active !== 1) {
    return null;
  }

  const isValid = verifyPassword(
    plainPassword,
    user.password_salt,
    user.password_hash
  );

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
  };
}

async function createAdminSession(userId) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + getSessionTtlMs());

  await query(
    "INSERT INTO admin_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [userId, tokenHash, expiresAt]
  );

  return {
    token,
    expiresAt,
  };
}

async function getAdminSessionByToken(token) {
  const tokenHash = hashSessionToken(token);
  const sessions = await query(
    `
      SELECT
        s.id,
        s.user_id,
        s.expires_at,
        u.username
      FROM admin_sessions s
      INNER JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.expires_at > NOW()
        AND u.is_active = 1
      LIMIT 1
    `,
    [tokenHash]
  );

  return sessions[0] || null;
}

async function revokeAdminSession(token) {
  const tokenHash = hashSessionToken(token);
  await query("DELETE FROM admin_sessions WHERE token_hash = ?", [tokenHash]);
}

async function purgeExpiredSessions() {
  await query("DELETE FROM admin_sessions WHERE expires_at <= NOW()");
}

function setAdminSessionCookie(res, token, expiresAt) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

function clearAdminSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
  });
}

module.exports = {
  SESSION_COOKIE_NAME,
  ensureDefaultAdminUser,
  validateAdminCredentials,
  createAdminSession,
  getAdminSessionByToken,
  revokeAdminSession,
  purgeExpiredSessions,
  setAdminSessionCookie,
  clearAdminSessionCookie,
};