USE cewebsite;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE admin_sessions;
TRUNCATE TABLE news_items;
TRUNCATE TABLE home_stats;
TRUNCATE TABLE home_hero_slides;
TRUNCATE TABLE footer_links;
TRUNCATE TABLE social_links;
TRUNCATE TABLE navigation_items;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO site_settings (
  id,
  site_name,
  department_name,
  logo_url,
  navbar_title,
  navbar_subtitle,
  footer_description,
  contact_address_lines,
  contact_phone,
  contact_email,
  map_embed_url,
  copyright_text
)
VALUES (
  1,
  'IIT Indore',
  'Civil Engineering',
  '/uploads/ce/logo.png',
  'IIT Indore',
  'Civil Engineering',
  'Building tomorrow''s infrastructure today. Excellence in education, research, and innovation in civil engineering.',
  JSON_ARRAY('403, POD 1C', 'Indian Institute of Technology Indore', 'Khandwa Road, Simrol', 'Indore 453552, Madhya Pradesh'),
  '0731-660 3477',
  'ceoffice@iiti.ac.in',
  'https://www.google.com/maps?q=IIT+Indore+Pod+1C&output=embed',
  'IIT Indore Civil Engineering Department. All rights reserved.'
)
ON DUPLICATE KEY UPDATE
  site_name = VALUES(site_name),
  department_name = VALUES(department_name),
  logo_url = VALUES(logo_url),
  navbar_title = VALUES(navbar_title),
  navbar_subtitle = VALUES(navbar_subtitle),
  footer_description = VALUES(footer_description),
  contact_address_lines = VALUES(contact_address_lines),
  contact_phone = VALUES(contact_phone),
  contact_email = VALUES(contact_email),
  map_embed_url = VALUES(map_embed_url),
  copyright_text = VALUES(copyright_text);

INSERT INTO navigation_items (label, href, sort_order, is_active)
VALUES
  ('Home', '/', 1, 1),
  ('About', '/about', 2, 1),
  ('Academics', '/academics', 3, 1),
  ('People', '/people', 4, 1),
  ('Specializations', '/specializations', 5, 1),
  ('Events', '/events', 6, 1),
  ('Contact', '/contact', 7, 1);

INSERT INTO social_links (platform, icon, url, sort_order, is_active)
VALUES
  ('Twitter', 'Twitter', 'https://www.linkedin.com/in/ced-outreach-iit-indore-a51575390/', 1, 1),
  ('LinkedIn', 'Linkedin', 'https://www.linkedin.com/in/ced-outreach-iit-indore-a51575390/', 2, 1),
  ('Facebook', 'Facebook', 'https://www.linkedin.com/in/ced-outreach-iit-indore-a51575390/', 3, 1);

INSERT INTO footer_links (section, label, href, sort_order, is_active)
VALUES
  ('quick', 'About Us', '/about', 1, 1),
  ('quick', 'Academic Programs', '/academics', 2, 1),
  ('quick', 'People', '/people', 3, 1),
  ('quick', 'Specializations', '/specializations', 4, 1),
  ('quick', 'Events', '/events', 5, 1),
  ('quick', 'Contact', '/contact', 6, 1),
  ('important', 'Admission Portal', '#', 1, 1),
  ('important', 'Student Portal', '#', 2, 1),
  ('important', 'Faculty Portal', '#', 3, 1),
  ('important', 'Alumni Network', 'https://alumni.iiti.ac.in/', 4, 1),
  ('important', 'Research Portal', '#', 5, 1);

INSERT INTO home_content (
  id,
  welcome_title,
  welcome_paragraph_1,
  welcome_paragraph_2,
  welcome_image_url,
  cta_title,
  cta_description,
  cta_primary_text,
  cta_primary_link,
  cta_secondary_text,
  cta_secondary_link,
  cta_tertiary_text,
  cta_tertiary_link
)
VALUES (
  1,
  'Welcome to Civil Engineering Department',
  'The Department of Civil Engineering at IIT Indore is committed to excellence in education, research, and service. We offer comprehensive programs that prepare students for leadership roles in the rapidly evolving field of civil engineering.',
  'Our department focuses on sustainable infrastructure development, advanced construction technologies, and innovative solutions for modern engineering challenges. With state-of-the-art facilities and renowned faculty, we provide an environment that fosters learning, research, and innovation.',
  '/uploads/home/welcome.jpeg',
  'Ready to Build Your Future?',
  'Join us in shaping the infrastructure of tomorrow. Explore our programs, research opportunities, and become part of the IIT Indore Civil Engineering legacy.',
  'Explore Programs',
  '/academics',
  'View Specializations',
  '/specializations',
  'Get in Touch',
  '/contact'
)
ON DUPLICATE KEY UPDATE
  welcome_title = VALUES(welcome_title),
  welcome_paragraph_1 = VALUES(welcome_paragraph_1),
  welcome_paragraph_2 = VALUES(welcome_paragraph_2),
  welcome_image_url = VALUES(welcome_image_url),
  cta_title = VALUES(cta_title),
  cta_description = VALUES(cta_description),
  cta_primary_text = VALUES(cta_primary_text),
  cta_primary_link = VALUES(cta_primary_link),
  cta_secondary_text = VALUES(cta_secondary_text),
  cta_secondary_link = VALUES(cta_secondary_link),
  cta_tertiary_text = VALUES(cta_tertiary_text),
  cta_tertiary_link = VALUES(cta_tertiary_link);

INSERT INTO home_hero_slides (image_url, title, subtitle, cta_text, cta_link, sort_order, is_active)
VALUES
  ('/uploads/home/groupphoto2.jpeg', 'Excellence in Civil Engineering Education', 'Shaping the future of infrastructure and sustainable development', 'Explore Programs', '/academics', 1, 1),
  ('/uploads/home/groupphoto.jpeg', 'Specialized Engineering Areas', 'Five core specializations with advanced facilities and research', 'View Specializations', '/specializations', 2, 1),
  ('/uploads/home/departmentoffice.jpeg', 'Our Academic Community', 'Meet our faculty, staff, and students who make up our vibrant community', 'Meet Our People', '/people', 3, 1);

INSERT INTO home_stats (label, value, suffix, icon_name, sort_order, is_active)
VALUES
  ('Faculty Members', 17, '', 'Users', 1, 1),
  ('Research Projects', 200, '+', 'BookOpen', 2, 1),
  ('Publications', 1000, '+', 'Award', 3, 1),
  ('Years of Excellence', 10, '+', 'Calendar', 4, 1);

INSERT INTO news_items (title, excerpt, category, image_url, external_link, publish_date, is_active)
VALUES
  ('ANRF Financial Assistance for International Symposium', 'Mr. Vikas Rawat receives financial assistance from ANRF for participating in the International Symposium on Land Reclamation in Singapore.', 'Achievement', NULL, NULL, '2025-11-26 09:00:00', 1),
  ('Inauguration of the BIS Student Chapter', 'IIT Indore announced the inauguration of the Bureau of Indian Standards student chapter in the Department of Civil Engineering.', 'Seminar', '/uploads/events/BIS_Inaugration.jpeg', 'https://www.linkedin.com/posts/ced-outreach-iit-indore-a51575390_civilengineering-bis-bureauofindianstandards-activity-7402743045588279296-oVRU', '2025-12-06 09:00:00', 1),
  ('Himalayan Glaciology Research Featured in Mongabay', 'Research on western Himalayan glaciers reacting to climate change by Dr. Mohd Farooq Azam''s team featured in Mongabay magazine.', 'Research', NULL, NULL, '2024-03-15 09:00:00', 1),
  ('Research Featured in Media: Soil and Rocks of MP', 'Research work of Dr. Lalit Borana and his group on Soil and Rocks of Madhyapradesh has been featured in Hindi and English media.', 'Research', NULL, NULL, '2024-02-20 09:00:00', 1),
  ('Editor''s Choice Papers Award-2020', 'Mr. M. Johnson Singh received the prestigious Editor''s Choice Papers Award from the International Journal of Geosynthetics and Ground Engineering.', 'Award', NULL, NULL, '2020-12-15 09:00:00', 1);
