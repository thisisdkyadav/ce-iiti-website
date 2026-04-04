const express = require("express");
const { query } = require("../db");
const { parseMaybeJson } = require("../utils/sql");

const router = express.Router();

function parseStringList(value) {
  const parsed = parseMaybeJson(value);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .map((item) => String(item || "").trim())
    .filter(Boolean);
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

router.get("/people", async (_req, res) => {
  try {
    const entries = await query(
      "SELECT id, category, name, designation, specialization, department, year_label, email, phone, room, profile_url, image_url, resource_link, research_interests, responsibilities, sort_order FROM people_entries WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );

    const regularFaculty = [];
    const staff = [];
    const phdStudents = [];
    const mtechStudents = [];
    const btechStudents = [];

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
          image: entry.image_url,
          sort_order: entry.sort_order,
        });
        return;
      }

      if (entry.category === "mtech") {
        mtechStudents.push({
          id: entry.id,
          year: entry.year_label,
          link: entry.resource_link,
          sort_order: entry.sort_order,
        });
        return;
      }

      if (entry.category === "btech") {
        btechStudents.push({
          id: entry.id,
          year: entry.year_label,
          link: entry.resource_link,
          sort_order: entry.sort_order,
        });
      }
    });

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
