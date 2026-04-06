const {
  ADMIN_ROLES,
  SESSION_COOKIE_NAME,
  getAdminSessionByToken,
  clearAdminSessionCookie,
  hasAdminSectionAccess,
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
      fullName: session.full_name || null,
      googleEmail: session.google_email || null,
      role: session.role || ADMIN_ROLES.ADMIN,
      allowedSections: Array.isArray(session.allowed_sections)
        ? session.allowed_sections
        : [],
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

function requireSuperAdmin(req, res, next) {
  if (req.adminUser?.role !== ADMIN_ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Super admin access is required.",
    });
  }

  return next();
}

function requireAdminSection(sectionKey) {
  return function sectionGuard(req, res, next) {
    if (hasAdminSectionAccess(req.adminUser, sectionKey)) {
      return next();
    }

    return res.status(403).json({
      error: "Forbidden",
      message: "You do not have access to this section.",
    });
  };
}

module.exports = {
  requireAdminAuth,
  requireSuperAdmin,
  requireAdminSection,
};
