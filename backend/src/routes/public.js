const express = require("express");
const { query } = require("../db");
const { parseMaybeJson } = require("../utils/sql");

const router = express.Router();

const STUDENT_PLACEHOLDER_IMAGE_URL =
  "/uploads/people/placeholders/student-default.jpg";
const STUDENT_PLACEHOLDER_SVG_URL =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23f3f4f6'/%3E%3Cstop offset='100%25' stop-color='%23e5e7eb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='480' height='480' fill='url(%23g)'/%3E%3Ccircle cx='240' cy='180' r='80' fill='%23cbd5e1'/%3E%3Cpath d='M100 420c20-90 80-140 140-140s120 50 140 140' fill='%23cbd5e1'/%3E%3C/svg%3E";
const LEGACY_DEFAULT_STUDENT_IMAGE_URLS = new Set([
  "/uploads/people/phd/aadarsh singh.jpg",
  "/assets/stu_images/phd/aadarsh singh.jpg",
]);

function normalizeStudentImageUrl(category, name, imageUrl) {
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

  return String(trimmedImageUrl).toLowerCase() ===
    STUDENT_PLACEHOLDER_IMAGE_URL.toLowerCase()
    ? STUDENT_PLACEHOLDER_SVG_URL
    : trimmedImageUrl;
}

function parseStringList(value) {
  const parsed = parseMaybeJson(value);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function normalizeYearLabel(value) {
  return String(value || "").trim();
}

function getProgramGroupKey(category, yearLabel) {
  return `${category}::${yearLabel.toLowerCase()}`;
}

function ensureProgramGroup(groupsMap, entry) {
  const year = normalizeYearLabel(entry.year_label);
  if (!year) {
    return null;
  }

  const key = getProgramGroupKey(entry.category, year);

  if (!groupsMap.has(key)) {
    groupsMap.set(key, {
      id: entry.id,
      year,
      link: null,
      mode: "individual",
      students: [],
      sort_order: Number.isFinite(Number(entry.sort_order))
        ? Number(entry.sort_order)
        : 0,
    });
  }

  return groupsMap.get(key);
}

router.get("/bootstrap", async (_req, res) => {
  try {
    const [siteSettings] = await query(
      "SELECT * FROM site_settings WHERE id = 1 LIMIT 1"
    );

    const navigation = await query(
      "SELECT id, label, href, sort_order FROM navigation_items WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );

    const socialLinks = await query(
      "SELECT id, platform, icon, url, sort_order FROM social_links WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );

    const quickLinks = await query(
      "SELECT id, section, label, href, sort_order FROM footer_links WHERE is_active = 1 ORDER BY section ASC, sort_order ASC, id ASC"
    );

    return res.json({
      siteSettings: siteSettings
        ? {
            ...siteSettings,
            contact_address_lines: parseMaybeJson(siteSettings.contact_address_lines) || [],
          }
        : null,
      navigation,
      socialLinks,
      quickLinks: {
        quick: quickLinks.filter((item) => item.section === "quick"),
        important: quickLinks.filter((item) => item.section === "important"),
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch bootstrap content",
      message: error.message,
    });
  }
});

router.get("/home", async (_req, res) => {
  try {
    const [homeContent] = await query(
      "SELECT * FROM home_content WHERE id = 1 LIMIT 1"
    );

    const slides = await query(
      "SELECT id, image_url, title, subtitle, cta_text, cta_link, sort_order FROM home_hero_slides WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );

    const stats = await query(
      "SELECT id, label, value, suffix, icon_name, sort_order FROM home_stats WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );

    const news = await query(
      "SELECT id, title, excerpt, category, image_url, external_link, publish_date FROM news_items WHERE is_active = 1 ORDER BY publish_date DESC, id DESC LIMIT 20"
    );

    return res.json({
      homeContent: homeContent || null,
      slides,
      stats,
      news,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch home content",
      message: error.message,
    });
  }
});

router.get("/about", async (_req, res) => {
  try {
    const [aboutContent] = await query(
      "SELECT * FROM about_content WHERE id = 1 LIMIT 1"
    );

    if (!aboutContent) {
      return res.json({ aboutContent: null });
    }

    return res.json({
      aboutContent: {
        ...aboutContent,
        values_items: parseMaybeJson(aboutContent.values_items) || [],
        milestones: parseMaybeJson(aboutContent.milestones) || [],
        stats_items: parseMaybeJson(aboutContent.stats_items) || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch about content",
      message: error.message,
    });
  }
});

router.get("/academics", async (_req, res) => {
  try {
    const [academicsContent] = await query(
      "SELECT * FROM academics_content WHERE id = 1 LIMIT 1"
    );

    if (!academicsContent) {
      return res.json({ academicsContent: null });
    }

    return res.json({
      academicsContent: {
        ...academicsContent,
        programs: parseMaybeJson(academicsContent.programs) || [],
        curriculum_semesters:
          parseMaybeJson(academicsContent.curriculum_semesters) || [],
        facilities_items: parseMaybeJson(academicsContent.facilities_items) || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch academics content",
      message: error.message,
    });
  }
});

router.get("/specializations", async (_req, res) => {
  try {
    const [specializationsContent] = await query(
      "SELECT * FROM specializations_content WHERE id = 1 LIMIT 1"
    );

    if (!specializationsContent) {
      return res.json({ specializationsContent: null });
    }

    return res.json({
      specializationsContent: {
        ...specializationsContent,
        specializations: parseMaybeJson(specializationsContent.specializations) || [],
        laboratory_rows: parseMaybeJson(specializationsContent.laboratory_rows) || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch specializations content",
      message: error.message,
    });
  }
});

router.get("/events", async (_req, res) => {
  try {
    const [eventsContent] = await query(
      "SELECT * FROM events_content WHERE id = 1 LIMIT 1"
    );

    const news = await query(
      "SELECT id, title, excerpt, category, image_url, external_link, publish_date FROM news_items WHERE is_active = 1 ORDER BY publish_date DESC, id DESC LIMIT 100"
    );

    return res.json({
      eventsContent: eventsContent
        ? {
            ...eventsContent,
            upcoming_events: parseMaybeJson(eventsContent.upcoming_events) || [],
            past_events: parseMaybeJson(eventsContent.past_events) || [],
          }
        : null,
      news,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch events content",
      message: error.message,
    });
  }
});

router.get("/contact", async (_req, res) => {
  try {
    const [contactContent] = await query(
      "SELECT * FROM contact_content WHERE id = 1 LIMIT 1"
    );

    if (!contactContent) {
      return res.json({ contactContent: null });
    }

    return res.json({
      contactContent: {
        ...contactContent,
        contact_info_cards: parseMaybeJson(contactContent.contact_info_cards) || [],
        form_categories: parseMaybeJson(contactContent.form_categories) || [],
        key_contacts: parseMaybeJson(contactContent.key_contacts) || [],
        quick_links: parseMaybeJson(contactContent.quick_links) || [],
        stay_connected_links:
          parseMaybeJson(contactContent.stay_connected_links) || [],
        footer_cards: parseMaybeJson(contactContent.footer_cards) || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch contact content",
      message: error.message,
    });
  }
});

router.get("/people", async (_req, res) => {
  try {
    const entries = await query(
      "SELECT id, category, name, designation, specialization, department, year_label, email, phone, room, profile_url, image_url, resource_link, research_interests, responsibilities, sort_order FROM people_entries WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );

    const regularFaculty = [];
    const staff = [];
    const phdStudents = [];
    const mtechGroups = new Map();
    const btechGroups = new Map();

    entries.forEach((entry) => {
      if (entry.category === "faculty") {
        regularFaculty.push({
          id: entry.id,
          name: entry.name,
          designation: entry.designation,
          specialization: entry.specialization,
          email: entry.email,
          phone: entry.phone,
          room: entry.room,
          image: entry.image_url,
          url: entry.profile_url,
          research: parseStringList(entry.research_interests),
          sort_order: entry.sort_order,
        });
        return;
      }

      if (entry.category === "staff") {
        staff.push({
          id: entry.id,
          name: entry.name,
          designation: entry.designation,
          department: entry.department,
          email: entry.email,
          phone: entry.phone,
          image: entry.image_url,
          url: entry.profile_url,
          responsibilities: parseStringList(entry.responsibilities),
          sort_order: entry.sort_order,
        });
        return;
      }

      if (entry.category === "phd") {
        phdStudents.push({
          id: entry.id,
          name: entry.name,
          email: entry.email,
          image: normalizeStudentImageUrl(
            entry.category,
            entry.name,
            entry.image_url
          ),
          sort_order: entry.sort_order,
        });
        return;
      }

      if (entry.category === "mtech" || entry.category === "btech") {
        const targetGroups = entry.category === "mtech" ? mtechGroups : btechGroups;
        const group = ensureProgramGroup(targetGroups, entry);

        if (!group) {
          return;
        }

        const hasName = String(entry.name || "").trim().length > 0;

        if (hasName) {
          group.students.push({
            id: entry.id,
            name: entry.name,
            email: entry.email,
            phone: entry.phone,
            image: normalizeStudentImageUrl(entry.category, entry.name, entry.image_url),
            sort_order: entry.sort_order,
          });
          return;
        }

        group.id = entry.id;
        group.link = entry.resource_link || null;
        group.mode = entry.resource_link ? "resource" : "individual";
        group.sort_order = Number.isFinite(Number(entry.sort_order))
          ? Number(entry.sort_order)
          : group.sort_order;
        return;
      }
    });

    const sortProgramGroups = (groupsMap) =>
      Array.from(groupsMap.values())
        .map((group) => ({
          ...group,
          students: [...group.students].sort((a, b) => {
            const sortDiff = (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0);
            if (sortDiff !== 0) {
              return sortDiff;
            }

            return String(a.name || "").localeCompare(String(b.name || ""));
          }),
        }))
        .sort((a, b) => {
          const sortDiff = (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0);
          if (sortDiff !== 0) {
            return sortDiff;
          }

          return String(a.year || "").localeCompare(String(b.year || ""));
        });

    const mtechStudents = sortProgramGroups(mtechGroups);
    const btechStudents = sortProgramGroups(btechGroups);

    return res.json({
      regularFaculty,
      staff,
      phdStudents,
      mtechStudents,
      btechStudents,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch people content",
      message: error.message,
    });
  }
});

module.exports = {
  publicRouter: router,
};
