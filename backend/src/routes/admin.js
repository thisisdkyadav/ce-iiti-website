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

const STUDENT_PLACEHOLDER_IMAGE_URL =
  "/uploads/people/placeholders/student-default.jpg";
const STUDENT_PLACEHOLDER_SVG_URL =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23f3f4f6'/%3E%3Cstop offset='100%25' stop-color='%23e5e7eb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='480' height='480' fill='url(%23g)'/%3E%3Ccircle cx='240' cy='180' r='80' fill='%23cbd5e1'/%3E%3Cpath d='M100 420c20-90 80-140 140-140s120 50 140 140' fill='%23cbd5e1'/%3E%3C/svg%3E";
const LEGACY_DEFAULT_STUDENT_IMAGE_URLS = new Set([
  "/uploads/people/phd/aadarsh singh.jpg",
  "/assets/stu_images/phd/aadarsh singh.jpg",
]);

function normalizeStudentImageUrlForStorage(category, name, imageUrl) {
  if (category !== "phd") {
    return imageUrl;
  }

  if (imageUrl == null) {
    return STUDENT_PLACEHOLDER_IMAGE_URL;
  }

  const trimmedImageUrl = String(imageUrl).trim();
  if (!trimmedImageUrl) {
    return STUDENT_PLACEHOLDER_IMAGE_URL;
  }

  const normalizedImageUrl = trimmedImageUrl.toLowerCase();
  const normalizedName = String(name || "").trim().toLowerCase();

  if (
    LEGACY_DEFAULT_STUDENT_IMAGE_URLS.has(normalizedImageUrl) &&
    normalizedName !== "aadarsh singh"
  ) {
    return STUDENT_PLACEHOLDER_IMAGE_URL;
  }

  return trimmedImageUrl;
}

function normalizeStudentImageUrlForResponse(category, name, imageUrl) {
  const normalizedImageUrl = normalizeStudentImageUrlForStorage(
    category,
    name,
    imageUrl
  );

  if (category !== "phd") {
    return normalizedImageUrl;
  }

  return String(normalizedImageUrl).toLowerCase() ===
    STUDENT_PLACEHOLDER_IMAGE_URL.toLowerCase()
    ? STUDENT_PLACEHOLDER_SVG_URL
    : normalizedImageUrl;
}

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

const academicsProgramSchema = z.object({
  title: z.string().min(1),
  link_url: z.string().nullable().optional(),
  link_target: z.string().optional(),
  duration: z.string().min(1),
  intake: z.string().nullable().optional(),
  description: z.string().min(1),
  highlights: z.array(z.string()),
  courses: z.array(z.string()),
});

const academicsSemesterSchema = z.object({
  semester_label: z.string().min(1),
  courses: z.array(z.string()),
});

const academicsContentPatchSchema = nonEmptyPatch({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  programs_title: z.string().min(1),
  programs_subtitle: z.string().min(1),
  programs: z.array(academicsProgramSchema),
  curriculum_title: z.string().min(1),
  curriculum_subtitle: z.string().min(1),
  curriculum_semesters: z.array(academicsSemesterSchema),
  facilities_title: z.string().min(1),
  facilities_subtitle: z.string().min(1),
  facilities_items: z.array(z.string()),
  admission_title: z.string().min(1),
  admission_subtitle: z.string().min(1),
  admission_primary_text: z.string().min(1),
  admission_primary_link: z.string().min(1),
  admission_secondary_text: z.string().min(1),
  admission_secondary_link: z.string().min(1),
});

const specializationFacultySchema = z.object({
  name: z.string().min(1),
  url: z.string().nullable().optional(),
});

const specializationEquipmentSchema = z.object({
  name: z.string().min(1),
  image_url: z.string().nullable().optional(),
});

const specializationLabSchema = z.object({
  name: z.string().min(1),
  equipments: z.array(specializationEquipmentSchema),
});

const specializationItemSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  color: z.string().min(1),
  icon_name: z.string().min(1),
  image_url: z.string().min(1),
  faculty: z.array(specializationFacultySchema),
  labs: z.array(specializationLabSchema),
});

const laboratoryRowSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
});

const specializationsContentPatchSchema = nonEmptyPatch({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  specializations_tab_label: z.string().min(1),
  laboratories_tab_label: z.string().min(1),
  specializations_title: z.string().min(1),
  specializations_subtitle: z.string().min(1),
  specializations: z.array(specializationItemSchema),
  laboratories_title: z.string().min(1),
  laboratory_rows: z.array(laboratoryRowSchema),
});

const eventsItemSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  time: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  category: z.string().min(1),
  image_url: z.string().nullable().optional(),
  registration_link: z.string().nullable().optional(),
});

const eventsContentPatchSchema = nonEmptyPatch({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  search_placeholder: z.string().min(1),
  tab_news_label: z.string().min(1),
  tab_upcoming_label: z.string().min(1),
  tab_past_label: z.string().min(1),
  no_news_message: z.string().min(1),
  no_upcoming_message: z.string().min(1),
  no_past_message: z.string().min(1),
  upcoming_events: z.array(eventsItemSchema),
  past_events: z.array(eventsItemSchema),
});

const contactInfoCardSchema = z.object({
  icon_name: z.string().min(1),
  title: z.string().min(1),
  details: z.array(z.string()),
});

const keyContactSchema = z.object({
  name: z.string().min(1),
  designation: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  office: z.string().min(1),
});

const quickLinkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().nullable().optional(),
});

const stayConnectedLinkSchema = z.object({
  icon_name: z.string().min(1),
  label: z.string().min(1),
  url: z.string().nullable().optional(),
});

const footerCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const contactContentPatchSchema = nonEmptyPatch({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  info_section_title: z.string().min(1),
  info_section_subtitle: z.string().min(1),
  contact_info_cards: z.array(contactInfoCardSchema),
  form_title: z.string().min(1),
  form_submit_message: z.string().min(1),
  form_categories: z.array(z.string()),
  key_contacts_title: z.string().min(1),
  key_contacts_subtitle: z.string().min(1),
  key_contacts: z.array(keyContactSchema),
  quick_links_title: z.string().min(1),
  quick_links_subtitle: z.string().min(1),
  quick_links: z.array(quickLinkSchema),
  stay_connected_title: z.string().min(1),
  stay_connected_subtitle: z.string().min(1),
  stay_connected_links: z.array(stayConnectedLinkSchema),
  footer_cards: z.array(footerCardSchema),
  map_embed_url: z.string().min(1),
});

function toMySqlDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const pad = (num) => String(num).padStart(2, "0");

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds()
  )}`;
}

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
  const imageUrl = normalizeStudentImageUrlForResponse(
    entry.category,
    entry.name,
    entry.image_url
  );

  return {
    ...entry,
    image_url: imageUrl,
    research_interests: parseStringList(entry.research_interests),
    responsibilities: parseStringList(entry.responsibilities),
  };
}

function normalizePeoplePayload(payload, existingCategory) {
  const nextPayload = { ...payload };
  const hasImageField = Object.prototype.hasOwnProperty.call(
    nextPayload,
    "image_url"
  );
  const effectiveCategory = nextPayload.category ?? existingCategory;

  if (
    effectiveCategory === "phd" &&
    (nextPayload.category === "phd" || hasImageField || !existingCategory)
  ) {
    nextPayload.image_url = normalizeStudentImageUrlForStorage(
      "phd",
      nextPayload.name,
      nextPayload.image_url
    );
  }

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

function serializeAcademicsContent(academicsContent) {
  if (!academicsContent) {
    return null;
  }

  return {
    ...academicsContent,
    programs: parseMaybeJson(academicsContent.programs) || [],
    curriculum_semesters: parseMaybeJson(academicsContent.curriculum_semesters) || [],
    facilities_items: parseMaybeJson(academicsContent.facilities_items) || [],
  };
}

function normalizeAcademicsPayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.programs !== undefined) {
    nextPayload.programs = JSON.stringify(nextPayload.programs || []);
  }

  if (nextPayload.curriculum_semesters !== undefined) {
    nextPayload.curriculum_semesters = JSON.stringify(
      nextPayload.curriculum_semesters || []
    );
  }

  if (nextPayload.facilities_items !== undefined) {
    nextPayload.facilities_items = JSON.stringify(nextPayload.facilities_items || []);
  }

  return nextPayload;
}

function serializeSpecializationsContent(specializationsContent) {
  if (!specializationsContent) {
    return null;
  }

  return {
    ...specializationsContent,
    specializations: parseMaybeJson(specializationsContent.specializations) || [],
    laboratory_rows: parseMaybeJson(specializationsContent.laboratory_rows) || [],
  };
}

function normalizeSpecializationsPayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.specializations !== undefined) {
    nextPayload.specializations = JSON.stringify(nextPayload.specializations || []);
  }

  if (nextPayload.laboratory_rows !== undefined) {
    nextPayload.laboratory_rows = JSON.stringify(nextPayload.laboratory_rows || []);
  }

  return nextPayload;
}

function serializeEventsContent(eventsContent) {
  if (!eventsContent) {
    return null;
  }

  return {
    ...eventsContent,
    upcoming_events: parseMaybeJson(eventsContent.upcoming_events) || [],
    past_events: parseMaybeJson(eventsContent.past_events) || [],
  };
}

function normalizeEventsPayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.upcoming_events !== undefined) {
    nextPayload.upcoming_events = JSON.stringify(nextPayload.upcoming_events || []);
  }

  if (nextPayload.past_events !== undefined) {
    nextPayload.past_events = JSON.stringify(nextPayload.past_events || []);
  }

  return nextPayload;
}

function serializeContactContent(contactContent) {
  if (!contactContent) {
    return null;
  }

  return {
    ...contactContent,
    contact_info_cards: parseMaybeJson(contactContent.contact_info_cards) || [],
    form_categories: parseMaybeJson(contactContent.form_categories) || [],
    key_contacts: parseMaybeJson(contactContent.key_contacts) || [],
    quick_links: parseMaybeJson(contactContent.quick_links) || [],
    stay_connected_links: parseMaybeJson(contactContent.stay_connected_links) || [],
    footer_cards: parseMaybeJson(contactContent.footer_cards) || [],
  };
}

function normalizeContactPayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.contact_info_cards !== undefined) {
    nextPayload.contact_info_cards = JSON.stringify(nextPayload.contact_info_cards || []);
  }

  if (nextPayload.form_categories !== undefined) {
    nextPayload.form_categories = JSON.stringify(nextPayload.form_categories || []);
  }

  if (nextPayload.key_contacts !== undefined) {
    nextPayload.key_contacts = JSON.stringify(nextPayload.key_contacts || []);
  }

  if (nextPayload.quick_links !== undefined) {
    nextPayload.quick_links = JSON.stringify(nextPayload.quick_links || []);
  }

  if (nextPayload.stay_connected_links !== undefined) {
    nextPayload.stay_connected_links = JSON.stringify(
      nextPayload.stay_connected_links || []
    );
  }

  if (nextPayload.footer_cards !== undefined) {
    nextPayload.footer_cards = JSON.stringify(nextPayload.footer_cards || []);
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

    const [academicsContent] = await query(
      "SELECT * FROM academics_content WHERE id = 1 LIMIT 1"
    );

    const [specializationsContent] = await query(
      "SELECT * FROM specializations_content WHERE id = 1 LIMIT 1"
    );

    const [eventsContent] = await query(
      "SELECT * FROM events_content WHERE id = 1 LIMIT 1"
    );

    const [contactContent] = await query(
      "SELECT * FROM contact_content WHERE id = 1 LIMIT 1"
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
      academicsContent: serializeAcademicsContent(academicsContent),
      specializationsContent: serializeSpecializationsContent(specializationsContent),
      eventsContent: serializeEventsContent(eventsContent),
      contactContent: serializeContactContent(contactContent),
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

router.put("/academics-content", async (req, res) => {
  const parsed = academicsContentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const allowedFields = [
    "hero_title",
    "hero_subtitle",
    "programs_title",
    "programs_subtitle",
    "programs",
    "curriculum_title",
    "curriculum_subtitle",
    "curriculum_semesters",
    "facilities_title",
    "facilities_subtitle",
    "facilities_items",
    "admission_title",
    "admission_subtitle",
    "admission_primary_text",
    "admission_primary_link",
    "admission_secondary_text",
    "admission_secondary_link",
  ];

  try {
    const payload = normalizeAcademicsPayload(parsed.data);
    const update = buildUpdateClause(payload, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    await query(
      `UPDATE academics_content SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
      update.values
    );

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/specializations-content", async (req, res) => {
  const parsed = specializationsContentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const allowedFields = [
    "hero_title",
    "hero_subtitle",
    "specializations_tab_label",
    "laboratories_tab_label",
    "specializations_title",
    "specializations_subtitle",
    "specializations",
    "laboratories_title",
    "laboratory_rows",
  ];

  try {
    const payload = normalizeSpecializationsPayload(parsed.data);
    const update = buildUpdateClause(payload, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [existingRow] = await query(
      "SELECT id FROM specializations_content WHERE id = 1 LIMIT 1"
    );

    if (existingRow) {
      await query(
        `UPDATE specializations_content SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
        update.values
      );
    } else {
      const insertPayload = {
        hero_title: "Our Specializations",
        hero_subtitle:
          "Explore our five core areas of expertise and state-of-the-art laboratory facilities that drive innovation in civil engineering",
        specializations_tab_label: "Specializations",
        laboratories_tab_label: "Laboratories",
        specializations_title: "Areas of Expertise",
        specializations_subtitle:
          "Each specialization offers unique opportunities for advanced learning and cutting-edge research",
        specializations: "[]",
        laboratories_title: "Laboratory Facilities",
        laboratory_rows: "[]",
        ...payload,
      };

      await query(
        `INSERT INTO specializations_content (
          id,
          hero_title,
          hero_subtitle,
          specializations_tab_label,
          laboratories_tab_label,
          specializations_title,
          specializations_subtitle,
          specializations,
          laboratories_title,
          laboratory_rows
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          insertPayload.hero_title,
          insertPayload.hero_subtitle,
          insertPayload.specializations_tab_label,
          insertPayload.laboratories_tab_label,
          insertPayload.specializations_title,
          insertPayload.specializations_subtitle,
          insertPayload.specializations,
          insertPayload.laboratories_title,
          insertPayload.laboratory_rows,
        ]
      );
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/events-content", async (req, res) => {
  const parsed = eventsContentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const allowedFields = [
    "hero_title",
    "hero_subtitle",
    "search_placeholder",
    "tab_news_label",
    "tab_upcoming_label",
    "tab_past_label",
    "no_news_message",
    "no_upcoming_message",
    "no_past_message",
    "upcoming_events",
    "past_events",
  ];

  try {
    const payload = normalizeEventsPayload(parsed.data);
    const update = buildUpdateClause(payload, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [existingRow] = await query(
      "SELECT id FROM events_content WHERE id = 1 LIMIT 1"
    );

    if (existingRow) {
      await query(
        `UPDATE events_content SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
        update.values
      );
    } else {
      const insertPayload = {
        hero_title: "Events & Activities",
        hero_subtitle:
          "Stay connected with our academic events, workshops, conferences, and departmental activities",
        search_placeholder: "Search events by title, description, or category...",
        tab_news_label: "News & Updates",
        tab_upcoming_label: "Upcoming Events",
        tab_past_label: "Past Events",
        no_news_message: "No news found matching your criteria.",
        no_upcoming_message: "No upcoming events at the moment.",
        no_past_message: "No past events recorded recently.",
        upcoming_events: "[]",
        past_events: "[]",
        ...payload,
      };

      await query(
        `INSERT INTO events_content (
          id,
          hero_title,
          hero_subtitle,
          search_placeholder,
          tab_news_label,
          tab_upcoming_label,
          tab_past_label,
          no_news_message,
          no_upcoming_message,
          no_past_message,
          upcoming_events,
          past_events
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          insertPayload.hero_title,
          insertPayload.hero_subtitle,
          insertPayload.search_placeholder,
          insertPayload.tab_news_label,
          insertPayload.tab_upcoming_label,
          insertPayload.tab_past_label,
          insertPayload.no_news_message,
          insertPayload.no_upcoming_message,
          insertPayload.no_past_message,
          insertPayload.upcoming_events,
          insertPayload.past_events,
        ]
      );
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/contact-content", async (req, res) => {
  const parsed = contactContentPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const allowedFields = [
    "hero_title",
    "hero_subtitle",
    "info_section_title",
    "info_section_subtitle",
    "contact_info_cards",
    "form_title",
    "form_submit_message",
    "form_categories",
    "key_contacts_title",
    "key_contacts_subtitle",
    "key_contacts",
    "quick_links_title",
    "quick_links_subtitle",
    "quick_links",
    "stay_connected_title",
    "stay_connected_subtitle",
    "stay_connected_links",
    "footer_cards",
    "map_embed_url",
  ];

  try {
    const payload = normalizeContactPayload(parsed.data);
    const update = buildUpdateClause(payload, allowedFields);
    if (!update) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [existingRow] = await query(
      "SELECT id FROM contact_content WHERE id = 1 LIMIT 1"
    );

    if (existingRow) {
      await query(
        `UPDATE contact_content SET ${update.setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
        update.values
      );
    } else {
      const insertPayload = {
        hero_title: "Contact Us",
        hero_subtitle:
          "Get in touch with us for admissions, research opportunities, collaborations, or any other inquiries",
        info_section_title: "Get in Touch",
        info_section_subtitle:
          "We are here to help and answer any questions you might have",
        contact_info_cards: "[]",
        form_title: "Send us a Message",
        form_submit_message:
          "Thank you for your message! We will get back to you soon.",
        form_categories: "[]",
        key_contacts_title: "Key Contacts",
        key_contacts_subtitle:
          "Direct contacts for specific departments and services",
        key_contacts: "[]",
        quick_links_title: "Quick Links",
        quick_links_subtitle: "Find specific information quickly",
        quick_links: "[]",
        stay_connected_title: "Stay Connected",
        stay_connected_subtitle:
          "Follow us on social media for the latest updates, news, and events",
        stay_connected_links: "[]",
        footer_cards: "[]",
        map_embed_url:
          "https://www.google.com/maps?q=IIT+Indore+Pod+1C&output=embed",
        ...payload,
      };

      await query(
        `INSERT INTO contact_content (
          id,
          hero_title,
          hero_subtitle,
          info_section_title,
          info_section_subtitle,
          contact_info_cards,
          form_title,
          form_submit_message,
          form_categories,
          key_contacts_title,
          key_contacts_subtitle,
          key_contacts,
          quick_links_title,
          quick_links_subtitle,
          quick_links,
          stay_connected_title,
          stay_connected_subtitle,
          stay_connected_links,
          footer_cards,
          map_embed_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          insertPayload.hero_title,
          insertPayload.hero_subtitle,
          insertPayload.info_section_title,
          insertPayload.info_section_subtitle,
          insertPayload.contact_info_cards,
          insertPayload.form_title,
          insertPayload.form_submit_message,
          insertPayload.form_categories,
          insertPayload.key_contacts_title,
          insertPayload.key_contacts_subtitle,
          insertPayload.key_contacts,
          insertPayload.quick_links_title,
          insertPayload.quick_links_subtitle,
          insertPayload.quick_links,
          insertPayload.stay_connected_title,
          insertPayload.stay_connected_subtitle,
          insertPayload.stay_connected_links,
          insertPayload.footer_cards,
          insertPayload.map_embed_url,
        ]
      );
    }

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

  const payload = {
    ...parsed.data,
    publish_date: toMySqlDateTime(parsed.data.publish_date),
  };

  if (!payload.publish_date) {
    return res.status(400).json({ error: "Invalid publish date" });
  }

  try {
    const id = await insertRecord("news_items", payload, [
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

  const payload = { ...parsed.data };
  if (Object.prototype.hasOwnProperty.call(payload, "publish_date")) {
    const normalizedPublishDate = toMySqlDateTime(payload.publish_date);
    if (!normalizedPublishDate) {
      return res.status(400).json({ error: "Invalid publish date" });
    }

    payload.publish_date = normalizedPublishDate;
  }

  try {
    await patchRecordById("news_items", id, payload, [
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

router.get("/contact-submissions", async (_req, res) => {
  try {
    const submissions = await query(
      `SELECT
        id,
        full_name,
        email,
        subject,
        category,
        message,
        ip_address,
        user_agent,
        created_at
      FROM contact_form_submissions
      ORDER BY created_at DESC, id DESC`
    );

    return res.json({ submissions });
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
    const [existingEntry] = await query(
      "SELECT category FROM people_entries WHERE id = ? LIMIT 1",
      [id]
    );

    if (!existingEntry) {
      return res.status(404).json({ error: "People entry not found" });
    }

    const payload = normalizePeoplePayload(parsed.data, existingEntry.category);
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
