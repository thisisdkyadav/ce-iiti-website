const { config } = require("../config");
const { query } = require("../db");
const {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
} = require("../utils/security");

const SESSION_COOKIE_NAME = config.admin.sessionCookieName;
const DEFAULT_BOOTSTRAP_ADMIN_USERNAME = "admin";
const ADMIN_ROLES = Object.freeze({
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
});
const SUPER_ADMIN_ONLY_SECTION_KEYS = new Set(["user-access"]);
const ADMIN_SECTION_KEYS = Object.freeze([
  "site-settings",
  "home-content",
  "about-content",
  "academics-content",
  "contact-content",
  "contact-submissions",
  "events-content",
  "specializations-content",
  "navigation",
  "social",
  "footer",
  "slides",
  "stats",
  "news",
  "people",
  "user-access",
]);

function safeParseJsonArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function normalizeAllowedSections(inputSections, { includeSuperAdminOnly = false } = {}) {
  const allowedUniverse = new Set(
    includeSuperAdminOnly
      ? ADMIN_SECTION_KEYS
      : ADMIN_SECTION_KEYS.filter(
          (sectionKey) => !SUPER_ADMIN_ONLY_SECTION_KEYS.has(sectionKey)
        )
  );

  const uniqueSections = [];
  const seen = new Set();

  for (const rawSection of safeParseJsonArray(inputSections)) {
    const section = String(rawSection || "").trim();
    if (!section || !allowedUniverse.has(section) || seen.has(section)) {
      continue;
    }

    seen.add(section);
    uniqueSections.push(section);
  }

  return uniqueSections;
}

function toSerializableAdminUser(row) {
  const role = row?.role === ADMIN_ROLES.SUPER_ADMIN
    ? ADMIN_ROLES.SUPER_ADMIN
    : ADMIN_ROLES.ADMIN;

  return {
    id: row.id,
    username: row.username,
    full_name: row.full_name || null,
    google_email: row.google_email || null,
    role,
    is_active: row.is_active,
    allowed_sections:
      role === ADMIN_ROLES.SUPER_ADMIN
        ? ADMIN_SECTION_KEYS.filter(
            (sectionKey) => !SUPER_ADMIN_ONLY_SECTION_KEYS.has(sectionKey)
          )
        : normalizeAllowedSections(row.allowed_sections),
  };
}

function getSessionTtlMs() {
  return config.admin.sessionTtlDays * 24 * 60 * 60 * 1000;
}

async function ensureAdminAuthSchema() {
  const alterStatements = [
    "ALTER TABLE admin_users ADD COLUMN full_name VARCHAR(190) NULL AFTER username",
    "ALTER TABLE admin_users ADD COLUMN google_email VARCHAR(190) NULL AFTER full_name",
    "ALTER TABLE admin_users ADD COLUMN role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'super_admin' AFTER password_salt",
    "ALTER TABLE admin_users ADD COLUMN allowed_sections JSON NULL AFTER role",
    "ALTER TABLE admin_users ADD UNIQUE INDEX uq_admin_users_google_email (google_email)",
  ];

  for (const statement of alterStatements) {
    try {
      await query(statement);
    } catch (error) {
      if (["ER_DUP_FIELDNAME", "ER_DUP_KEYNAME", "ER_MULTIPLE_PRI_KEY"].includes(error.code)) {
        continue;
      }

      throw error;
    }
  }

  await query(
    "UPDATE admin_users SET role = ? WHERE role IS NULL OR role = ''",
    [ADMIN_ROLES.SUPER_ADMIN]
  );
}

async function ensureDefaultAdminUser() {
  await ensureAdminAuthSchema();

  const [summary] = await query(
    "SELECT COUNT(*) AS total FROM admin_users"
  );
  const totalUsers = Number(summary?.total || 0);

  if (totalUsers > 0) {
    const [existingUser] = await query(
      "SELECT id FROM admin_users ORDER BY id ASC LIMIT 1"
    );
    return existingUser || null;
  }

  const password = hashPassword(config.admin.bootstrapPassword);

  await query(
    `INSERT INTO admin_users (
      username,
      full_name,
      password_hash,
      password_salt,
      role,
      allowed_sections,
      is_active
    ) VALUES (?, ?, ?, ?, ?, NULL, 1)`,
    [
      DEFAULT_BOOTSTRAP_ADMIN_USERNAME,
      "Default Super Admin",
      password.hash,
      password.salt,
      ADMIN_ROLES.SUPER_ADMIN,
    ]
  );

  const [insertedUser] = await query(
    "SELECT id FROM admin_users WHERE username = ? LIMIT 1",
    [DEFAULT_BOOTSTRAP_ADMIN_USERNAME]
  );

  return insertedUser;
}

async function validateAdminCredentials(username, plainPassword) {
  const users = await query(
    `SELECT
      id,
      username,
      full_name,
      google_email,
      role,
      allowed_sections,
      password_hash,
      password_salt,
      is_active
    FROM admin_users
    WHERE username = ?
    LIMIT 1`,
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

  return toSerializableAdminUser(user);
}

async function getActiveAdminByGoogleEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  const users = await query(
    `SELECT
      id,
      username,
      full_name,
      google_email,
      role,
      allowed_sections,
      is_active
    FROM admin_users
    WHERE google_email = ?
      AND is_active = 1
    LIMIT 1`,
    [normalizedEmail]
  );

  if (users.length === 0) {
    return null;
  }

  return toSerializableAdminUser(users[0]);
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
        u.username,
        u.full_name,
        u.google_email,
        u.role,
        u.allowed_sections
      FROM admin_sessions s
      INNER JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.expires_at > NOW()
        AND u.is_active = 1
      LIMIT 1
    `,
    [tokenHash]
  );

  if (sessions.length === 0) {
    return null;
  }

  const session = sessions[0];
  const user = toSerializableAdminUser({
    ...session,
    id: session.user_id,
    is_active: 1,
  });

  return {
    id: session.id,
    user_id: user.id,
    username: user.username,
    full_name: user.full_name,
    google_email: user.google_email,
    role: user.role,
    allowed_sections: user.allowed_sections,
    expires_at: session.expires_at,
  };
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

function hasAdminSectionAccess(adminUser, sectionKey) {
  if (!adminUser || !sectionKey) {
    return false;
  }

  if (adminUser.role === ADMIN_ROLES.SUPER_ADMIN) {
    return true;
  }

  if (SUPER_ADMIN_ONLY_SECTION_KEYS.has(sectionKey)) {
    return false;
  }

  const allowedSections = Array.isArray(adminUser.allowedSections)
    ? adminUser.allowedSections
    : [];

  return allowedSections.includes(sectionKey);
}

module.exports = {
  ADMIN_ROLES,
  ADMIN_SECTION_KEYS,
  SESSION_COOKIE_NAME,
  normalizeAllowedSections,
  ensureDefaultAdminUser,
  validateAdminCredentials,
  getActiveAdminByGoogleEmail,
  createAdminSession,
  getAdminSessionByToken,
  revokeAdminSession,
  purgeExpiredSessions,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  hasAdminSectionAccess,
};