function buildUpdateClause(payload, allowedFields) {
  const fields = allowedFields.filter((field) => payload[field] !== undefined);

  if (fields.length === 0) {
    return null;
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => payload[field]);

  return { setClause, values };
}

function parseMaybeJson(value) {
  if (value == null) {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_err) {
    return value;
  }
}

module.exports = {
  buildUpdateClause,
  parseMaybeJson,
};
