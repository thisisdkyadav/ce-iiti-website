const crypto = require("crypto");

const SCRYPT_KEYLEN = 64;

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto
    .scryptSync(password, salt, SCRYPT_KEYLEN)
    .toString("hex");

  return {
    salt,
    hash: passwordHash,
  };
}

function verifyPassword(password, salt, expectedHash) {
  const actualHash = crypto
    .scryptSync(password, salt, SCRYPT_KEYLEN)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(actualHash, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

function generateSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
};