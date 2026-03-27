const express = require("express");
const { query } = require("../db");
const { parseMaybeJson } = require("../utils/sql");

const router = express.Router();

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

module.exports = {
  publicRouter: router,
};
