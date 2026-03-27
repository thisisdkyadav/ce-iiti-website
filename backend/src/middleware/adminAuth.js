const {
  SESSION_COOKIE_NAME,
  getAdminSessionByToken,
  clearAdminSessionCookie,
} = require("../services/adminAuth");

async function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const cookieToken = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : null;
  const adminToken = cookieToken || bearerToken;

  if (!adminToken) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing admin session",
    });
  }

  try {
    const session = await getAdminSessionByToken(adminToken);

    if (!session) {
      clearAdminSessionCookie(res);
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired admin session",
      });
    }

    req.adminUser = {
      id: session.user_id,
      username: session.username,
    };

    req.adminSession = {
      id: session.id,
      expiresAt: session.expires_at,
      token: adminToken,
    };

    return next();
  } catch (error) {
    return res.status(500).json({
      error: "Failed to validate admin session",
      message: error.message,
    });
  }
}

module.exports = {
  requireAdminAuth,
};
