const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { z } = require("zod");
const { config } = require("../config");
const { query } = require("../db");
const { requireAdminAuth } = require("../middleware/adminAuth");
const {
  SESSION_COOKIE_NAME,
  validateAdminCredentials,
  createAdminSession,
  getAdminSessionByToken,
  revokeAdminSession,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} = require("../services/adminAuth");
const { buildUpdateClause, parseMaybeJson } = require("../utils/sql");

const router = express.Router();

const nonEmptyPatch = (shape) =>
  z
    .object(shape)
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    });

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const siteSettingsPatchSchema = nonEmptyPatch({
  site_name: z.string().min(1),
  department_name: z.string().min(1),
  logo_url: z.string().min(1),
  navbar_title: z.string().min(1),
  navbar_subtitle: z.string().min(1),
  footer_description: z.string().min(1),
  contact_address_lines: z.array(z.string()),
  contact_phone: z.string().min(1),
  contact_email: z.string().email(),
  map_embed_url: z.string().min(1),
  copyright_text: z.string().min(1),
});

const homeContentPatchSchema = nonEmptyPatch({
  welcome_title: z.string().min(1),
  welcome_paragraph_1: z.string().min(1),
  welcome_paragraph_2: z.string().min(1),
  welcome_image_url: z.string().min(1),
  cta_title: z.string().min(1),
  cta_description: z.string().min(1),
  cta_primary_text: z.string().min(1),
  cta_primary_link: z.string().min(1),
  cta_secondary_text: z.string().min(1),
  cta_secondary_link: z.string().min(1),
  cta_tertiary_text: z.string().min(1),
  cta_tertiary_link: z.string().min(1),
});

const aboutValueItemSchema = z.object({
  icon_name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const aboutMilestoneItemSchema = z.object({
  year: z.string().min(1),
  event: z.string().min(1),
});

const aboutStatItemSchema = z.object({
  label: z.string().min(1),
  value: z.number().int().nonnegative(),
  suffix: z.string(),
});

const aboutContentPatchSchema = nonEmptyPatch({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  story_title: z.string().min(1),
  story_paragraph_1: z.string().min(1),
  story_paragraph_2: z.string().min(1),
  story_paragraph_3: z.string().min(1),
  story_image_url: z.string().min(1),
  mission_title: z.string().min(1),
  mission_description: z.string().min(1),
  vision_title: z.string().min(1),
  vision_description: z.string().min(1),
  values_title: z.string().min(1),
  values_subtitle: z.string().min(1),
  values_items: z.array(aboutValueItemSchema),
  milestones_title: z.string().min(1),
  milestones_subtitle: z.string().min(1),
  milestones: z.array(aboutMilestoneItemSchema),
  stats_title: z.string().min(1),
  stats_subtitle: z.string().min(1),
  stats_items: z.array(aboutStatItemSchema),
});

const navigationItemCreateSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

const navigationItemPatchSchema = nonEmptyPatch({
  label: z.string().min(1),
  href: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_active: z.number().int().min(0).max(1),
});

const socialLinkCreateSchema = z.object({
  platform: z.string().min(1),
  icon: z.string().min(1),
  url: z.string().min(1),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

const socialLinkPatchSchema = nonEmptyPatch({
  platform: z.string().min(1),
  icon: z.string().min(1),
  url: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_active: z.number().int().min(0).max(1),
});

const footerLinkCreateSchema = z.object({
  section: z.enum(["quick", "important"]),
  label: z.string().min(1),
  href: z.string().min(1),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

const footerLinkPatchSchema = nonEmptyPatch({
  section: z.enum(["quick", "important"]),
  label: z.string().min(1),
  href: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_active: z.number().int().min(0).max(1),
});

const heroSlideCreateSchema = z.object({
  image_url: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  cta_text: z.string().min(1),
  cta_link: z.string().min(1),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

const heroSlidePatchSchema = nonEmptyPatch({
  image_url: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  cta_text: z.string().min(1),
  cta_link: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_active: z.number().int().min(0).max(1),
});

const homeStatCreateSchema = z.object({
  label: z.string().min(1),
  value: z.number().int().nonnegative(),
  suffix: z.string().default(""),
  icon_name: z.string().min(1),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

const homeStatPatchSchema = nonEmptyPatch({
  label: z.string().min(1),
  value: z.number().int().nonnegative(),
  suffix: z.string(),
  icon_name: z.string().min(1),
  sort_order: z.number().int().nonnegative(),
  is_active: z.number().int().min(0).max(1),
});

const newsCreateSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.string().default("News"),
  image_url: z.string().optional(),
  external_link: z.string().optional(),
  publish_date: z.string().datetime(),
  is_active: z.number().int().min(0).max(1).default(1),
});

const newsPatchSchema = nonEmptyPatch({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.string(),
  image_url: z.string(),
  external_link: z.string(),
  publish_date: z.string().datetime(),
  is_active: z.number().int().min(0).max(1),
});

const nullableStringField = z.union([z.string().min(1), z.null()]);
const nullableStringListField = z.union([z.array(z.string()), z.null()]);
const peopleCategorySchema = z.enum(["faculty", "staff", "phd", "mtech", "btech"]);

const peopleEntryCreateSchema = z.object({
  category: peopleCategorySchema,
  name: nullableStringField.optional(),
  designation: nullableStringField.optional(),
  specialization: nullableStringField.optional(),
  department: nullableStringField.optional(),
  year_label: nullableStringField.optional(),
  email: nullableStringField.optional(),
  phone: nullableStringField.optional(),
  room: nullableStringField.optional(),
  profile_url: nullableStringField.optional(),
  image_url: nullableStringField.optional(),
  resource_link: nullableStringField.optional(),
  research_interests: nullableStringListField.optional(),
  responsibilities: nullableStringListField.optional(),
  sort_order: z.number().int().nonnegative().default(0),
  is_active: z.number().int().min(0).max(1).default(1),
});

const peopleEntryPatchSchema = nonEmptyPatch({
  category: peopleCategorySchema,
  name: nullableStringField,
  designation: nullableStringField,
  specialization: nullableStringField,
  department: nullableStringField,
  year_label: nullableStringField,
  email: nullableStringField,
  phone: nullableStringField,
  room: nullableStringField,
  profile_url: nullableStringField,
  image_url: nullableStringField,
  resource_link: nullableStringField,
  research_interests: nullableStringListField,
  responsibilities: nullableStringListField,
  sort_order: z.number().int().nonnegative(),
  is_active: z.number().int().min(0).max(1),
});

const peopleEntryFields = [
  "category",
  "name",
  "designation",
  "specialization",
  "department",
  "year_label",
  "email",
  "phone",
  "room",
  "profile_url",
  "image_url",
  "resource_link",
  "research_interests",
  "responsibilities",
  "sort_order",
  "is_active",
];

const allowedImageMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

function parseStringList(value) {
  const parsed = parseMaybeJson(value);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function serializePeopleEntry(entry) {
  return {
    ...entry,
    research_interests: parseStringList(entry.research_interests),
    responsibilities: parseStringList(entry.responsibilities),
  };
}

function normalizePeoplePayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.research_interests !== undefined) {
    nextPayload.research_interests =
      Array.isArray(nextPayload.research_interests) && nextPayload.research_interests.length > 0
        ? JSON.stringify(nextPayload.research_interests)
        : null;
  }

  if (nextPayload.responsibilities !== undefined) {
    nextPayload.responsibilities =
      Array.isArray(nextPayload.responsibilities) && nextPayload.responsibilities.length > 0
        ? JSON.stringify(nextPayload.responsibilities)
        : null;
  }

  return nextPayload;
}

function serializeAboutContent(aboutContent) {
  if (!aboutContent) {
    return null;
  }

  return {
    ...aboutContent,
    values_items: parseMaybeJson(aboutContent.values_items) || [],
    milestones: parseMaybeJson(aboutContent.milestones) || [],
    stats_items: parseMaybeJson(aboutContent.stats_items) || [],
  };
}

function normalizeAboutPayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.values_items !== undefined) {
    nextPayload.values_items = JSON.stringify(nextPayload.values_items || []);
  }

  if (nextPayload.milestones !== undefined) {
    nextPayload.milestones = JSON.stringify(nextPayload.milestones || []);
  }

  if (nextPayload.stats_items !== undefined) {
    nextPayload.stats_items = JSON.stringify(nextPayload.stats_items || []);
  }

  return nextPayload;
}

function sanitizeUploadCategory(rawCategory) {
  const normalized = String(rawCategory || "general")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "general";
}

const uploadStorage = multer.diskStorage({
  destination(req, _file, callback) {
    const category = sanitizeUploadCategory(req.body.category);
    const destination = path.join(config.uploads.directoryPath, category);

    fs.mkdirSync(destination, { recursive: true });
    req.uploadCategory = category;

    callback(null, destination);
  },
  filename(_req, file, callback) {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname || "").toLowerCase();
    callback(null, `${timestamp}-${randomSuffix}${extension || ".jpg"}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: config.uploads.maxImageSizeBytes,
  },
  fileFilter(_req, file, callback) {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      callback(new Error("Unsupported file type. Upload a valid image."));
      return;
    }

    callback(null, true);
  },
});

function getIdFromParams(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  return id;
}

async function insertRecord(table, payload, allowedFields) {
  const fields = allowedFields.filter((field) => payload[field] !== undefined);
  const values = fields.map((field) => payload[field]);

  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`;
  const result = await query(sql, values);
  return result.insertId;
}

async function patchRecordById(table, id, payload, allowedFields) {
  const update = buildUpdateClause(payload, allowedFields);
  if (!update) {
    return false;
  }

  const sql = `UPDATE ${table} SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  await query(sql, [...update.values, id]);
  return true;
}

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const username = parsed.data.username.trim();
  const password = parsed.data.password;

  try {
    const adminUser = await validateAdminCredentials(username, password);

    if (!adminUser) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    const session = await createAdminSession(adminUser.id);
    setAdminSessionCookie(res, session.token, session.expiresAt);

    return res.json({
      ok: true,
      user: adminUser,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to login",
      message: error.message,
    });
  }
});

router.post("/auth/logout", async (req, res) => {
  const sessionToken = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : null;

  try {
    if (sessionToken) {
      await revokeAdminSession(sessionToken);
    }

    clearAdminSessionCookie(res);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to logout",
      message: error.message,
    });
  }
});

router.get("/auth/session", async (req, res) => {
  const sessionToken = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : null;

  if (!sessionToken) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No active admin session",
    });
  }

  try {
    const session = await getAdminSessionByToken(sessionToken);

    if (!session) {
      clearAdminSessionCookie(res);
      return res.status(401).json({
        error: "Unauthorized",
        message: "Admin session expired",
      });
    }

    return res.json({
      ok: true,
      user: {
        id: session.user_id,
        username: session.username,
      },
      expiresAt: session.expires_at,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch admin session",
      message: error.message,
    });
  }
});

router.use(requireAdminAuth);

router.get("/content", async (_req, res) => {
  try {
    const [siteSettings] = await query(
      "SELECT * FROM site_settings WHERE id = 1 LIMIT 1"
    );

    const [homeContent] = await query(
      "SELECT * FROM home_content WHERE id = 1 LIMIT 1"
    );

    const [aboutContent] = await query(
      "SELECT * FROM about_content WHERE id = 1 LIMIT 1"
    );

    const navigation = await query(
      "SELECT id, label, href, sort_order, is_active FROM navigation_items ORDER BY sort_order ASC, id ASC"
    );

    const socialLinks = await query(
      "SELECT id, platform, icon, url, sort_order, is_active FROM social_links ORDER BY sort_order ASC, id ASC"
    );

    const footerLinks = await query(
      "SELECT id, section, label, href, sort_order, is_active FROM footer_links ORDER BY section ASC, sort_order ASC, id ASC"
    );

    const slides = await query(
      "SELECT id, image_url, title, subtitle, cta_text, cta_link, sort_order, is_active FROM home_hero_slides ORDER BY sort_order ASC, id ASC"
    );

    const stats = await query(
      "SELECT id, label, value, suffix, icon_name, sort_order, is_active FROM home_stats ORDER BY sort_order ASC, id ASC"
    );

    const news = await query(
      "SELECT id, title, excerpt, category, image_url, external_link, publish_date, is_active FROM news_items ORDER BY publish_date DESC, id DESC"
    );

    const peopleEntries = await query(
      "SELECT id, category, name, designation, specialization, department, year_label, email, phone, room, profile_url, image_url, resource_link, research_interests, responsibilities, sort_order, is_active FROM people_entries ORDER BY category ASC, sort_order ASC, id ASC"
    );

    return res.json({
      siteSettings: siteSettings
        ? {
            ...siteSettings,
            contact_address_lines: parseMaybeJson(siteSettings.contact_address_lines) || [],
          }
        : null,
      homeContent: homeContent || null,
      aboutContent: serializeAboutContent(aboutContent),
      navigation,
      socialLinks,
      footerLinks,
      slides,
      stats,
      news,
      peopleEntries: peopleEntries.map(serializePeopleEntry),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch admin content",
      message: error.message,
    });
  }
});

router.post("/uploads/image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  const category = req.uploadCategory || "general";
  const relativeUrl = `${config.uploads.publicPath}/${category}/${req.file.filename}`;

  return res.status(201).json({
    ok: true,
    relativeUrl,
    url: `${config.publicBaseUrl}${relativeUrl}`,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });
});

router.put("/site-settings", async (req, res) => {
  const parsed = siteSettingsPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const payload = { ...parsed.data };
  if (payload.contact_address_lines) {
    payload.contact_address_lines = JSON.stringify(payload.contact_address_lines);
  }

  const allowedFields = [
    "site_name",
    "department_name",
    "logo_url",
    "navbar_title",
    "navbar_subtitle",
    "footer_description",
    "contact_address_lines",
    "contact_phone",
    "contact_email",
    "map_embed_url",
    "copyright_text",
  ];

  try {
    const update = buildUpdateClause(payload, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    await query(
      `UPDATE site_settings SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
      update.values
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/navigation-items", async (req, res) => {
  const parsed = navigationItemCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const id = await insertRecord("navigation_items", parsed.data, [
      "label",
      "href",
      "sort_order",
      "is_active",
    ]);

    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/navigation-items/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = navigationItemPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    await patchRecordById("navigation_items", id, parsed.data, [
      "label",
      "href",
      "sort_order",
      "is_active",
    ]);

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/navigation-items/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM navigation_items WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/social-links", async (req, res) => {
  const parsed = socialLinkCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const id = await insertRecord("social_links", parsed.data, [
      "platform",
      "icon",
      "url",
      "sort_order",
      "is_active",
    ]);

    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/social-links/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = socialLinkPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    await patchRecordById("social_links", id, parsed.data, [
      "platform",
      "icon",
      "url",
      "sort_order",
      "is_active",
    ]);

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/social-links/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM social_links WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/footer-links", async (req, res) => {
  const parsed = footerLinkCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const id = await insertRecord("footer_links", parsed.data, [
      "section",
      "label",
      "href",
      "sort_order",
      "is_active",
    ]);

    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/footer-links/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = footerLinkPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    await patchRecordById("footer_links", id, parsed.data, [
      "section",
      "label",
      "href",
      "sort_order",
      "is_active",
    ]);

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/footer-links/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM footer_links WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/home-content", async (req, res) => {
  const parsed = homeContentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const allowedFields = [
    "welcome_title",
    "welcome_paragraph_1",
    "welcome_paragraph_2",
    "welcome_image_url",
    "cta_title",
    "cta_description",
    "cta_primary_text",
    "cta_primary_link",
    "cta_secondary_text",
    "cta_secondary_link",
    "cta_tertiary_text",
    "cta_tertiary_link",
  ];

  try {
    const update = buildUpdateClause(parsed.data, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    await query(
      `UPDATE home_content SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
      update.values
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/about-content", async (req, res) => {
  const parsed = aboutContentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const allowedFields = [
    "hero_title",
    "hero_subtitle",
    "story_title",
    "story_paragraph_1",
    "story_paragraph_2",
    "story_paragraph_3",
    "story_image_url",
    "mission_title",
    "mission_description",
    "vision_title",
    "vision_description",
    "values_title",
    "values_subtitle",
    "values_items",
    "milestones_title",
    "milestones_subtitle",
    "milestones",
    "stats_title",
    "stats_subtitle",
    "stats_items",
  ];

  try {
    const payload = normalizeAboutPayload(parsed.data);
    const update = buildUpdateClause(payload, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    await query(
      `UPDATE about_content SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
      update.values
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/home/hero-slides", async (req, res) => {
  const parsed = heroSlideCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const id = await insertRecord("home_hero_slides", parsed.data, [
      "image_url",
      "title",
      "subtitle",
      "cta_text",
      "cta_link",
      "sort_order",
      "is_active",
    ]);
    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/home/hero-slides/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = heroSlidePatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    await patchRecordById("home_hero_slides", id, parsed.data, [
      "image_url",
      "title",
      "subtitle",
      "cta_text",
      "cta_link",
      "sort_order",
      "is_active",
    ]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/home/hero-slides/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM home_hero_slides WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/home/stats", async (req, res) => {
  const parsed = homeStatCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const id = await insertRecord("home_stats", parsed.data, [
      "label",
      "value",
      "suffix",
      "icon_name",
      "sort_order",
      "is_active",
    ]);
    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/home/stats/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = homeStatPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    await patchRecordById("home_stats", id, parsed.data, [
      "label",
      "value",
      "suffix",
      "icon_name",
      "sort_order",
      "is_active",
    ]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/home/stats/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM home_stats WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/news", async (req, res) => {
  const parsed = newsCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const id = await insertRecord("news_items", parsed.data, [
      "title",
      "excerpt",
      "category",
      "image_url",
      "external_link",
      "publish_date",
      "is_active",
    ]);
    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/news/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = newsPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    await patchRecordById("news_items", id, parsed.data, [
      "title",
      "excerpt",
      "category",
      "image_url",
      "external_link",
      "publish_date",
      "is_active",
    ]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/news/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM news_items WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/people", async (_req, res) => {
  try {
    const peopleEntries = await query(
      "SELECT id, category, name, designation, specialization, department, year_label, email, phone, room, profile_url, image_url, resource_link, research_interests, responsibilities, sort_order, is_active FROM people_entries ORDER BY category ASC, sort_order ASC, id ASC"
    );

    return res.json({
      peopleEntries: peopleEntries.map(serializePeopleEntry),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/people", async (req, res) => {
  const parsed = peopleEntryCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const payload = normalizePeoplePayload(parsed.data);
    const id = await insertRecord("people_entries", payload, peopleEntryFields);
    return res.status(201).json({ id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/people/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  const parsed = peopleEntryPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const payload = normalizePeoplePayload(parsed.data);
    await patchRecordById("people_entries", id, payload, peopleEntryFields);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/people/:id", async (req, res) => {
  const id = getIdFromParams(req, res);
  if (!id) {
    return;
  }

  try {
    await query("DELETE FROM people_entries WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: "Upload failed",
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      error: "Upload failed",
      message: error.message,
    });
  }

  return next();
});

module.exports = {
  adminRouter: router,
};
