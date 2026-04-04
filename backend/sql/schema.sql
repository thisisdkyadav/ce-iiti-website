CREATE DATABASE IF NOT EXISTS cewebsite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cewebsite;

CREATE TABLE IF NOT EXISTS site_settings (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  site_name VARCHAR(120) NOT NULL,
  department_name VARCHAR(160) NOT NULL,
  logo_url VARCHAR(512) NOT NULL,
  navbar_title VARCHAR(160) NOT NULL,
  navbar_subtitle VARCHAR(160) NOT NULL,
  footer_description TEXT NOT NULL,
  contact_address_lines JSON NULL,
  contact_phone VARCHAR(64) NULL,
  contact_email VARCHAR(190) NULL,
  map_embed_url VARCHAR(1024) NULL,
  copyright_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(120) NOT NULL,
  href VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_links (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(80) NOT NULL,
  icon VARCHAR(80) NOT NULL,
  url VARCHAR(512) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS footer_links (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  section ENUM('quick', 'important') NOT NULL,
  label VARCHAR(120) NOT NULL,
  href VARCHAR(512) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  welcome_title VARCHAR(255) NOT NULL,
  welcome_paragraph_1 TEXT NOT NULL,
  welcome_paragraph_2 TEXT NOT NULL,
  welcome_image_url VARCHAR(512) NOT NULL,
  cta_title VARCHAR(255) NOT NULL,
  cta_description TEXT NOT NULL,
  cta_primary_text VARCHAR(120) NOT NULL,
  cta_primary_link VARCHAR(255) NOT NULL,
  cta_secondary_text VARCHAR(120) NOT NULL,
  cta_secondary_link VARCHAR(255) NOT NULL,
  cta_tertiary_text VARCHAR(120) NOT NULL,
  cta_tertiary_link VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  story_title VARCHAR(255) NOT NULL,
  story_paragraph_1 TEXT NOT NULL,
  story_paragraph_2 TEXT NOT NULL,
  story_paragraph_3 TEXT NOT NULL,
  story_image_url VARCHAR(512) NOT NULL,
  mission_title VARCHAR(160) NOT NULL,
  mission_description TEXT NOT NULL,
  vision_title VARCHAR(160) NOT NULL,
  vision_description TEXT NOT NULL,
  values_title VARCHAR(255) NOT NULL,
  values_subtitle TEXT NOT NULL,
  values_items JSON NOT NULL,
  milestones_title VARCHAR(255) NOT NULL,
  milestones_subtitle TEXT NOT NULL,
  milestones JSON NOT NULL,
  stats_title VARCHAR(255) NOT NULL,
  stats_subtitle TEXT NOT NULL,
  stats_items JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academics_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  programs_title VARCHAR(255) NOT NULL,
  programs_subtitle TEXT NOT NULL,
  programs JSON NOT NULL,
  curriculum_title VARCHAR(255) NOT NULL,
  curriculum_subtitle TEXT NOT NULL,
  curriculum_semesters JSON NOT NULL,
  facilities_title VARCHAR(255) NOT NULL,
  facilities_subtitle TEXT NOT NULL,
  facilities_items JSON NOT NULL,
  admission_title VARCHAR(255) NOT NULL,
  admission_subtitle TEXT NOT NULL,
  admission_primary_text VARCHAR(120) NOT NULL,
  admission_primary_link VARCHAR(512) NOT NULL,
  admission_secondary_text VARCHAR(120) NOT NULL,
  admission_secondary_link VARCHAR(512) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS specializations_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  specializations_tab_label VARCHAR(120) NOT NULL,
  laboratories_tab_label VARCHAR(120) NOT NULL,
  specializations_title VARCHAR(255) NOT NULL,
  specializations_subtitle TEXT NOT NULL,
  specializations JSON NOT NULL,
  laboratories_title VARCHAR(255) NOT NULL,
  laboratory_rows JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  search_placeholder VARCHAR(255) NOT NULL,
  tab_news_label VARCHAR(120) NOT NULL,
  tab_upcoming_label VARCHAR(120) NOT NULL,
  tab_past_label VARCHAR(120) NOT NULL,
  no_news_message VARCHAR(255) NOT NULL,
  no_upcoming_message VARCHAR(255) NOT NULL,
  no_past_message VARCHAR(255) NOT NULL,
  upcoming_events JSON NOT NULL,
  past_events JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_content (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  hero_title VARCHAR(255) NOT NULL,
  hero_subtitle TEXT NOT NULL,
  info_section_title VARCHAR(255) NOT NULL,
  info_section_subtitle TEXT NOT NULL,
  contact_info_cards JSON NOT NULL,
  form_title VARCHAR(255) NOT NULL,
  form_submit_message VARCHAR(255) NOT NULL,
  form_categories JSON NOT NULL,
  key_contacts_title VARCHAR(255) NOT NULL,
  key_contacts_subtitle TEXT NOT NULL,
  key_contacts JSON NOT NULL,
  quick_links_title VARCHAR(255) NOT NULL,
  quick_links_subtitle TEXT NOT NULL,
  quick_links JSON NOT NULL,
  stay_connected_title VARCHAR(255) NOT NULL,
  stay_connected_subtitle TEXT NOT NULL,
  stay_connected_links JSON NOT NULL,
  footer_cards JSON NOT NULL,
  map_embed_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_hero_slides (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(512) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT NOT NULL,
  cta_text VARCHAR(120) NOT NULL,
  cta_link VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS home_stats (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(160) NOT NULL,
  value INT NOT NULL,
  suffix VARCHAR(16) NOT NULL DEFAULT '',
  icon_name VARCHAR(80) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  category VARCHAR(120) NOT NULL DEFAULT 'News',
  image_url VARCHAR(512) NULL,
  external_link VARCHAR(1024) NULL,
  publish_date DATETIME NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS people_entries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  category ENUM('faculty', 'staff', 'phd', 'mtech', 'btech') NOT NULL,
  name VARCHAR(190) NULL,
  designation VARCHAR(190) NULL,
  specialization VARCHAR(190) NULL,
  department VARCHAR(190) NULL,
  year_label VARCHAR(120) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(120) NULL,
  room VARCHAR(120) NULL,
  profile_url VARCHAR(1024) NULL,
  image_url VARCHAR(512) NULL,
  resource_link VARCHAR(1024) NULL,
  research_interests JSON NULL,
  responsibilities JSON NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_people_entries_category_sort (category, sort_order, id),
  INDEX idx_people_entries_active (is_active)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_sessions_user_id (user_id),
  INDEX idx_admin_sessions_expires_at (expires_at),
  CONSTRAINT fk_admin_sessions_user
    FOREIGN KEY (user_id)
    REFERENCES admin_users(id)
    ON DELETE CASCADE
);
