USE cewebsite;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE admin_sessions;
TRUNCATE TABLE news_items;
TRUNCATE TABLE people_entries;
TRUNCATE TABLE events_content;
TRUNCATE TABLE specializations_content;
TRUNCATE TABLE academics_content;
TRUNCATE TABLE about_content;
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

INSERT INTO about_content (
  id,
  hero_title,
  hero_subtitle,
  story_title,
  story_paragraph_1,
  story_paragraph_2,
  story_paragraph_3,
  story_image_url,
  mission_title,
  mission_description,
  vision_title,
  vision_description,
  values_title,
  values_subtitle,
  values_items,
  milestones_title,
  milestones_subtitle,
  milestones,
  stats_title,
  stats_subtitle,
  stats_items
)
VALUES (
  1,
  'About Our Department',
  'Excellence in civil engineering education, research, and innovation',
  'Our Story',
  'The Department of Civil Engineering at IIT Indore has grown rapidly to become a center for academic and research excellence. We are dedicated to creating world-class engineers who contribute to the sustainable development of global infrastructure.',
  'Since our inception, we have evolved into a thriving academic community with distinguished faculty, state-of-the-art facilities, and a strong network of alumni working in leading organizations worldwide.',
  'Our department is committed to addressing the challenges of modern infrastructure through innovative research, comprehensive education programs, and strong industry partnerships.',
  '/uploads/home/groupphoto2.jpeg',
  'Our Mission',
  'To provide world-class education in civil engineering, conduct cutting-edge research that addresses societal needs, and develop leaders who will shape the future of sustainable infrastructure development in India and beyond.',
  'Our Vision',
  'To be recognized as a premier department of civil engineering that contributes significantly to technological advancement, sustainable development, and the creation of innovative solutions for complex engineering challenges.',
  'Our Core Values',
  'The principles that guide our approach to education, research, and service',
  '[{"icon_name":"Award","title":"Excellence","description":"Striving for the highest standards in education, research, and innovation in civil engineering."},{"icon_name":"Users","title":"Collaboration","description":"Fostering teamwork, partnerships, and knowledge sharing within our academic community."},{"icon_name":"Target","title":"Innovation","description":"Pioneering cutting-edge research and sustainable solutions for modern infrastructure challenges."},{"icon_name":"BookOpen","title":"Knowledge","description":"Committed to advancing the frontiers of civil engineering through continuous learning and discovery."}]',
  'Our Journey',
  'Key milestones in the development of our department',
  '[{"year":"2009","event":"Foundation of IIT Indore"},{"year":"2016","event":"Department of Civil Engineering established & First B.Tech batch admitted"},{"year":"2020","event":"Reached milestone of 200+ alumni"},{"year":"2023","event":"First M.Tech batch admitted"},{"year":"2025","event":"Celebrating 10+ years of excellence"}]',
  'Department at a Glance',
  'Numbers that reflect our growth and impact over the years',
  '[{"label":"Faculty Members","value":17,"suffix":""},{"label":"Alumni","value":500,"suffix":"+"},{"label":"Research Papers","value":1000,"suffix":"+"},{"label":"Active Projects","value":50,"suffix":"+"}]'
)
ON DUPLICATE KEY UPDATE
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  story_title = VALUES(story_title),
  story_paragraph_1 = VALUES(story_paragraph_1),
  story_paragraph_2 = VALUES(story_paragraph_2),
  story_paragraph_3 = VALUES(story_paragraph_3),
  story_image_url = VALUES(story_image_url),
  mission_title = VALUES(mission_title),
  mission_description = VALUES(mission_description),
  vision_title = VALUES(vision_title),
  vision_description = VALUES(vision_description),
  values_title = VALUES(values_title),
  values_subtitle = VALUES(values_subtitle),
  values_items = VALUES(values_items),
  milestones_title = VALUES(milestones_title),
  milestones_subtitle = VALUES(milestones_subtitle),
  milestones = VALUES(milestones),
  stats_title = VALUES(stats_title),
  stats_subtitle = VALUES(stats_subtitle),
  stats_items = VALUES(stats_items);

INSERT INTO academics_content (
  id,
  hero_title,
  hero_subtitle,
  programs_title,
  programs_subtitle,
  programs,
  curriculum_title,
  curriculum_subtitle,
  curriculum_semesters,
  facilities_title,
  facilities_subtitle,
  facilities_items,
  admission_title,
  admission_subtitle,
  admission_primary_text,
  admission_primary_link,
  admission_secondary_text,
  admission_secondary_link
)
VALUES (
  1,
  'Academic Programs',
  'Comprehensive education programs designed to shape the next generation of civil engineers',
  'Our Programs',
  'From undergraduate to doctoral levels, we offer comprehensive programs that combine theoretical knowledge with practical application',
  '[{"title":"B.Tech in Civil Engineering","link_url":"https://academic.iiti.ac.in/app/storage/app/coursecurriculum/9NVdg9JRdMxVbWQmnp0vHGM10r2lwjBN8Oy4aSP6.pdf","link_target":"_blank","duration":"4 Years","intake":"Intake: 53","description":"Comprehensive undergraduate program covering all major areas of civil engineering with strong emphasis on practical learning and industry exposure.","highlights":["Strong foundation in mathematics, physics, and engineering sciences","Hands-on laboratory experience in all core subjects","Industry internships and live projects","Professional development and communication skills"],"courses":["Engineering Mechanics","Structural Analysis","RCC and Steel Design","Geotechnical Engineering","Transportation Systems Engineering","Water Resources Engineering"]},{"title":"M.Tech in Structural Engineering","link_url":"https://academic.iiti.ac.in/app/storage/app/coursecurriculum/7xAINJWsbYbISP5Lk9PSY2VJU5daoGrnm2lbjilf.pdf","link_target":"_blank","duration":"2 Years","intake":"Intake: 10 (TA Category)","description":"Advanced program focusing on design, analysis, and behavior of structures with emphasis on modern computational methods and sustainable construction.","highlights":["Advanced structural analysis and design","Research-oriented curriculum","Access to state-of-the-art laboratories","Thesis work with industry collaboration"],"courses":["Advanced Structural Analysis","Earthquake Engineering","Bridge Engineering","High-rise Building Design","Finite Element Methods","Steel and Concrete Structures"]},{"title":"M.Tech in Water, Climate & Sustainability","link_url":"https://academic.iiti.ac.in/app/storage/app/coursecurriculum/7xAINJWsbYbISP5Lk9PSY2VJU5daoGrnm2lbjilf.pdf","link_target":"_blank","duration":"2 Years","intake":"Intake: 10 (TA Category)","description":"Interdisciplinary program focusing on water resources, climate resilience, and sustainable environmental systems to address emerging global challenges.","highlights":["Advanced hydrology and climate modelling","Sustainable water resource management","Hands-on training with environmental simulation tools","Research and field-based projects in climate resilience"],"courses":["Advanced Hydrology","Water Resources Systems Engineering","Climate Change Impact Assessment","Environmental Data Analytics","Sustainable Water Infrastructure","Hydraulic Modelling & Simulation"]},{"title":"M.Tech in Transportation Systems Engineering (Upcoming)","link_url":"/programs/mtech-transportation-systems-engineering.html","link_target":"_blank","duration":"2 Years","intake":"Intake: 10 (TA Category)","description":"Program dedicated to planning, design, and optimization of modern transportation networks with a focus on smart mobility and sustainable infrastructure.","highlights":["Advanced traffic engineering and transport planning","Exposure to intelligent transportation systems (ITS)","Laboratory and software training in transport simulation","Industry-linked projects on mobility and infrastructure"],"courses":["Traffic Engineering & Management","Transportation Planning","Pavement Design & Materials","Public Transport Systems","Intelligent Transportation Systems (ITS)","Transport Modelling & Simulation"]},{"title":"M.Tech in Geotechnical Engineering (Upcoming)","link_url":null,"link_target":"_blank","duration":"2 Years","intake":"Intake: 10 (TA Category)","description":"Specialized program in soil mechanics, foundation engineering, and geoenvironmental engineering with modern testing and analysis techniques.","highlights":["Comprehensive soil and rock mechanics","Foundation design for complex structures","Geoenvironmental engineering applications","Field investigation techniques"],"courses":["Advanced Soil Mechanics","Foundation Engineering","Slope Stability","Ground Improvement","Rock Mechanics","Geosynthetics"]},{"title":"Ph.D. in Civil Engineering","link_url":"https://academic.iiti.ac.in/app/storage/app/coursecurriculum/7xAINJWsbYbISP5Lk9PSY2VJU5daoGrnm2lbjilf.pdf","link_target":"_blank","duration":"3-6 Years","intake":null,"description":"Research-intensive doctoral program aimed at producing independent researchers and academics in various specializations of civil engineering.","highlights":["Independent research under expert supervision","Interdisciplinary research opportunities","Teaching assistantship opportunities","International collaboration programs"],"courses":["Research Methodology","Advanced Mathematics","Specialized Courses","Dissertation Research","Seminar Presentations","Professional Development"]}]',
  'B.Tech Curriculum Structure',
  'Detailed semester-wise breakdown of the undergraduate program',
  '[{"semester_label":"Semester 1","courses":["Basic Electrical Engineering","Engineering Mechanics","Basics of Physics","Physics Lab- I","Calculus","Language and Composition","Makerspace","Computer Programming","Computer Programming Lab"]},{"semester_label":"Semester 2","courses":["Biosciences","Linear Algebra","Differential Equations-I","Environmental Studies","Fundamentals of Economics","Chemistry","Chemistry Lab","Flexible Elective","Flexible Elective (HSS)"]},{"semester_label":"Semester 3","courses":["Complex Analysis","Differential Equations-II","Strength of Materials","Fluid Mechanics","Surveying","Building Materials","Surveying","Department Elective I"]},{"semester_label":"Semester 4","courses":["Numerical Methods","Structural Analysis-I","Soil Mechanics-I","Engineering Geology","Environmental Engineering","Department Elective II","Institute Elective I"]},{"semester_label":"Semester 5","courses":["Structural Analysis-II","Soil Mechanics-II","Transportation Engineering","Design of Reinforced Concrete Structures","Department Elective III","Institute Elective II"]},{"semester_label":"Semester 6","courses":["Design of steel structures","Engineering Hydrology","Computer Aided Design Lab","Introduction to Finite Element Methods","Department Elective IV","Department Elective IV","Institute Elective III"]},{"semester_label":"Semester 7","courses":["B Tech Project (BTP)","Internship"]},{"semester_label":"Semester 8","courses":["Water Resources Engineering","Design of Structures-III","Transportation Engineering-II","Foundation Engineering","Department Elective V","Institute Elective IV","Institute Elective V"]}]',
  'Laboratory Facilities',
  'State-of-the-art laboratories supporting hands-on learning and research',
  '["Computational Laboratory","Engineering Geology Laboratory","Environmental Engineering Laboratory","Fluid Mechanics Laboratory","Geotechnical Engineering Laboratory- 01","Geotechnical Engineering Laboratory- 02","Geodesy & Surveying Laboratory","Hydraulics and Hydrology Laboratory","Materials Engineering Laboratory","Solid Mechanics Laboratory","Transportation Engineering Laboratory","Structure Engineering Laboratory"]',
  'Ready to Join Us?',
  'Take the first step towards a rewarding career in civil engineering. Learn about our admission process and requirements.',
  'Admission Guidelines',
  '/contact',
  'Download Brochure',
  '#'
)
ON DUPLICATE KEY UPDATE
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  programs_title = VALUES(programs_title),
  programs_subtitle = VALUES(programs_subtitle),
  programs = VALUES(programs),
  curriculum_title = VALUES(curriculum_title),
  curriculum_subtitle = VALUES(curriculum_subtitle),
  curriculum_semesters = VALUES(curriculum_semesters),
  facilities_title = VALUES(facilities_title),
  facilities_subtitle = VALUES(facilities_subtitle),
  facilities_items = VALUES(facilities_items),
  admission_title = VALUES(admission_title),
  admission_subtitle = VALUES(admission_subtitle),
  admission_primary_text = VALUES(admission_primary_text),
  admission_primary_link = VALUES(admission_primary_link),
  admission_secondary_text = VALUES(admission_secondary_text),
  admission_secondary_link = VALUES(admission_secondary_link);

INSERT INTO specializations_content (
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
)
VALUES (
  1,
  'Our Specializations',
  'Explore our five core areas of expertise and state-of-the-art laboratory facilities that drive innovation in civil engineering',
  'Specializations',
  'Laboratories',
  'Areas of Expertise',
  'Each specialization offers unique opportunities for advanced learning and cutting-edge research',
  '[]',
  'Laboratory Facilities',
  '[{"name":"Computational Laboratory","location":"POD 1C"},{"name":"Engineering Geology Laboratory","location":"POD 1C"},{"name":"Environmental Engineering Laboratory","location":"POD 1C"},{"name":"Fluid Mechanics Laboratory","location":"POD 1C"},{"name":"Geotechnical Engineering Laboratory- 01","location":"POD 1C"},{"name":"Geotechnical Engineering Laboratory- 02","location":"POD 1C"},{"name":"Geodesy & Surveying Laboratory","location":"POD 1C"},{"name":"Hydraulics and Hydrology Laboratory","location":"POD 1C"},{"name":"Materials Engineering Laboratory","location":"POD 1C"},{"name":"Solid Mechanics Laboratory","location":"POD 1C"},{"name":"Transportation Engineering Laboratory","location":"POD 1C"},{"name":"Structure Engineering Laboratory","location":"POD 1C"}]'
)
ON DUPLICATE KEY UPDATE
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  specializations_tab_label = VALUES(specializations_tab_label),
  laboratories_tab_label = VALUES(laboratories_tab_label),
  specializations_title = VALUES(specializations_title),
  specializations_subtitle = VALUES(specializations_subtitle),
  specializations = VALUES(specializations),
  laboratories_title = VALUES(laboratories_title),
  laboratory_rows = VALUES(laboratory_rows);

INSERT INTO events_content (
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
)
VALUES (
  1,
  'Events & Activities',
  'Stay connected with our academic events, workshops, conferences, and departmental activities',
  'Search events by title, description, or category...',
  'News & Updates',
  'Upcoming Events',
  'Past Events',
  'No news found matching your criteria.',
  'No upcoming events at the moment.',
  'No past events recorded recently.',
  '[]',
  '[{"date":"2026-01-22","title":"REIMAGINING CONSTRUCTION PARADIGMS: STEEL FOR THE NEXT GENERATION","description":"The Indian Institute of Technology Indore (IITI), in association with the Institute for Steel Development and Growth (INSDAG), is pleased to invite students, researchers, faculty members, and industry professionals to a one-day Technical Seminar on REIMAGINING CONSTRUCTION PARADIGMS: STEEL FOR THE NEXT GENERATION.","time":"09:00 AM - 05:00 PM","venue":"1D-105, IIT Indore Campus","category":"Seminar","image_url":"/assets/Events/steel.jpg","registration_link":"https://docs.google.com/forms/d/1oTXpXYolZUIVl8vKsj0q_HRgBIjvkn-NXKQ5Nc4qKCQ/edit?ts=69390ad1&pli=1"}]'
)
ON DUPLICATE KEY UPDATE
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  search_placeholder = VALUES(search_placeholder),
  tab_news_label = VALUES(tab_news_label),
  tab_upcoming_label = VALUES(tab_upcoming_label),
  tab_past_label = VALUES(tab_past_label),
  no_news_message = VALUES(no_news_message),
  no_upcoming_message = VALUES(no_upcoming_message),
  no_past_message = VALUES(no_past_message),
  upcoming_events = VALUES(upcoming_events),
  past_events = VALUES(past_events);

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

INSERT INTO people_entries (
  category, name, designation, specialization, department, year_label, email, phone, room, profile_url, image_url, resource_link, research_interests, responsibilities, sort_order, is_active
)
VALUES
  ('faculty', 'Dr. Gourab Sil', 'Assistant Professor & Head of Department', 'Transportation Systems Engineering', NULL, NULL, 'hodce@iiti.ac.in , gourabsil@iiti.ac.in', '0731-660 3360 , +91 8268364346', '405, POD 1D', 'https://gourabsil.profiles.iiti.ac.in/', '/uploads/people/faculty/Gourab.jpg', NULL, '["Performance Based Geometric Design of Highways","Safety of Roadway Infrastructure","Effects of Highway Infrastructure on Driver Behavior","Applications of Statistical Analysis in Transportation Engineering","Traffic Engineering"]', NULL, 1, 1),
  ('faculty', 'Dr. Sandeep Chaudhary', 'Professor (HAG)', 'Structural Engineering', NULL, NULL, 'schaudhary@iiti.ac.in', '0731-660 3256/3469 , +91 9414475375 , +91 9549654195', '403, POD 1D', 'https://sustainableconstructionlab.com/', '/uploads/people/faculty/Sandeep.jpeg', NULL, '["Structural Engineering","Sustainable Construction Practices","Composite Bridges","Novel Bricks and Blocks","Microstructure and Durability of Concrete","Advanced Characterisation Techniques"]', NULL, 2, 1),
  ('faculty', 'Dr. Neelima Satyam D', 'Professor (Institute Chair Professor)', 'Geotechnical Engineering', NULL, NULL, 'neelima.satyam@iiti.ac.in', '0731-660 3290 , +91 9440488034', '418, POD 1D', 'https://people.iiti.ac.in/~neelima.satyam/', '/uploads/people/faculty/neelime.jpeg', NULL, '["Geotechnical Earthquake Engineering","Dynamic Soil Structure Interaction Analysis","Liquefaction Hazard and Mitigation","Environmental Geotechnics","Landslide Research","Rock Mechanics and Underground Structures"]', NULL, 3, 1),
  ('faculty', 'Dr. Manish Kumar Goyal', 'Professor (Chair Professor- BIS Standardization)', 'Water Resources Engineering', NULL, NULL, 'mkgoyal@iiti.ac.in', '0731-660 3288', '209, POD 1A', 'https://sites.google.com/view/mkg1/home', '/uploads/people/faculty/mkgoyal.jpg', NULL, '["Resilience of River Basins and Hydrological Modeling","Hydro-climatology and Statistical Downscaling","Irrigation Management and Crop Modeling Applications","Multivariate Statistical Analysis, Machine Learning Models and Data Mining"]', NULL, 4, 1),
  ('faculty', 'Dr. Mohd. Farooq Azam', 'Associate Professor', 'Water Resources Engineering', NULL, NULL, 'farooqazam@iiti.ac.in', '0731-660 3289 , +91 84760 85786', '310, POD 1D', 'https://sites.google.com/view/mohdfarooqazam/home', '/uploads/people/faculty/Photo-Farooq.jpg', NULL, '["Hydro-Meteorological monitoring","Glacier Mass and Dynamic studies","Energy Balance of Glacier and Snow Cover","Hydrological modelling of Himalayan Watersheds","Climate Change impacts on Himalayan Water Resources"]', NULL, 5, 1),
  ('faculty', 'Dr. Lalit Borana', 'Associate Professor', 'Geotechnical Engineering', NULL, NULL, 'lalitborana@iiti.ac.in', '0731-660 3332', '407, POD 1D', 'https://sites.google.com/site/lalitborana/', '/uploads/people/faculty/Lalit_Borana.jpg', NULL, '["Unsaturated Soil Mechanics","Geotechnical health monitoring","Soil-Structure Interaction","Soft Soil and Creep","Ground Improvement Technics","Environmental Geotechnics"]', NULL, 6, 1),
  ('faculty', 'Dr. Abhishek Rajput', 'Associate Professor', 'Structural Engineering', NULL, NULL, 'abhishekrajput@iiti.ac.in', '0731-660 3310', '616, POD 1D', 'https://people.iiti.ac.in/~abhishekrajput/', '/uploads/people/faculty/abhishekrajput.jpg', NULL, '["Behavior of concrete and metals under projectile impact and blast loading","Finite element modelling and simulations","Large deformations of concrete at low, medium and high strain rates","Structural crash-worthiness","Influence of corrosion on the mechanical properties of structural steel"]', NULL, 7, 1),
  ('faculty', 'Dr. Kaustav Bakshi', 'Assistant Professor , DUGC', 'Structural Engineering', NULL, NULL, 'kaustav.bakshi@iiti.ac.in', '0731-660 3233', '314, POD 1D', 'https://sites.google.com/view/kaustavbakshi/home', '/uploads/people/faculty/Kaustav.png', NULL, '["Static and dynamic studies on laminated composite shell roofs","First and progressive ply failure studies","Finite element method; Geometric nonlinearity","Hygrothermal analysis of laminated composites","Shear deformations in laminated composites","Nonlinear buckling analysis"]', NULL, 8, 1),
  ('faculty', 'Dr. Guru Prakash', 'Assistant Professor', 'Structural Engineering', NULL, NULL, 'guruprakash@iiti.ac.in', '0731-660 3215', '313, POD 1D', 'https://sites.google.com/view/guruprakash/home?authuser=0', '/uploads/people/faculty/GuruFinal.jpg', NULL, '["Stochastic degradation modeling using condition monitoring data","Bayesian reliability assessment","Damage detection and prognosis","Fatigue reliability"]', NULL, 9, 1),
  ('faculty', 'Dr. Priyansh Singh', 'Assistant Professor', 'Transportation Systems Engineering', NULL, NULL, 'priyansh@iiti.ac.in', '0731-660 3362', '311, POD 1D', 'https://priyanshsingh.com/', '/uploads/people/faculty/Priyansh.jpg', NULL, '["Pavement Materials Characterization and Modeling","Pavement Design, Construction and Evaluation","Pavement Recycling","Innovative Materials and Technologies in Pavement Engineering","Rheology","Maintenance and Rehabilitation of Pavements"]', NULL, 10, 1),
  ('faculty', 'Dr. Ashootosh Mandpe', 'Assistant Professor', 'Environmental Engineering', NULL, NULL, 'as_mandpe@iiti.ac.in', '0731-660 3257', '316, POD 1D', 'https://ashootoshmandpe.profiles.iiti.ac.in/', '/uploads/people/faculty/Ashootosh Passport_Dark Background.JPG', NULL, '["Bio-valorization of solid wastes","Municipal landfill remediation through biomining approaches","Advanced wastewater treatment technologies","Circular economy practices","Lifecycle and Social lifecycle assessment of environmental systems","Geospatial technologies for integrated waste management","Remediation of persistent organic pollutants"]', NULL, 11, 1),
  ('faculty', 'Dr. Priyank J. Sharma', 'Assistant Professor , DPGC', 'Water Resources Engineering', NULL, NULL, 'priyanksharma@iiti.ac.in', '0731-660 3382', '422, POD-1D', 'https://sites.google.com/view/priyank2306', '/uploads/people/faculty/Dr. Priyank J Sharma.jpg', NULL, '["Hydroclimatology and Climate Extremes","Climate Change Impact on Water Resources","Hydroinformatics","Improving Hydrologic Predictions using AI/ML","Hydrological and Flood Modelling"]', NULL, 12, 1),
  ('faculty', 'Dr. Mayur Shirish Jain', 'Assistant Professor', 'Environmental Engineering', NULL, NULL, 'mayur.jain@iiti.ac.in', '0731-660 3384', '605, POD 1A', 'https://sites.google.com/view/mayur-shirish-jain', '/uploads/people/faculty/M S JAIN.jpg', NULL, '["Rapid Composting Techniques","Kinetic modelling of Bio-waste degradation","Circular economy in environmental engineering","Soil Revitalization via waste utilization","C&D Waste quantification and environmental risks","Techno-economic and sustainability assessment"]', NULL, 13, 1),
  ('faculty', 'Dr. Akshay Pratap Singh', 'Assistant Professor', 'Geotechnical Engineering', NULL, NULL, 'apsingh@iiti.ac.in', '0731-660 5171 , +91-9454208610', 'Lab Complex Room No. 18', 'https://sites.google.com/view/apsingh/bio?authuser=0', '/uploads/people/faculty/Dr. Akshay Photo.JPG', NULL, '["Numerical Modeling in Geomechanics","Analysis of Slopes, Retaining walls, Sheet Piles, Shallow Foundations, Pile Foundations","Lower and Upper Bound Methods in Limit Analysis","Geotechnical Earthquake Engineering","Liquefaction"]', NULL, 14, 1),
  ('faculty', 'Dr. Baadiga Ramu', 'Assistant Professor', 'Geotechnical Engineering', NULL, NULL, 'baadigaramu@iiti.ac.in', '0731-660 5170 , +91-7675015763', 'Lab Complex Room No. 16', 'https://sites.google.com/view/ramubaadiga/', '/uploads/people/faculty/Dr Baadiga Ramu.jpg', NULL, '["Geosynthetic Engineering","Pavement Geotechnics","Ground Improvement","Geotechnical Engineering","AI-ML for Geotechnical Engineering","Nature Inspired Geotechnics"]', NULL, 15, 1),
  ('faculty', 'Dr. Ravinder', 'Assistant Professor', 'Structural Engineering', NULL, NULL, 'ravinder@iiti.ac.in', '0731-660 5279', 'Lab Complex Room No. 17', 'https://ravinderbhattoo.github.io/', '/uploads/people/faculty/ravinder.png', NULL, '["Structural Health Monitoring","Ballistic Impact and Fracture Simulations","Finite Element Modelling and Simulations","Generative Structural Design Using ML","System Identification","ML/AI for Structural Engineering"]', NULL, 16, 1),
  ('faculty', 'Dr. Pushpa Choudhary', 'Assistant Professor', 'Transportation Systems Engineering', NULL, NULL, 'pushpa@iiti.ac.in', '0731-660 5172', '402, POD-1C', 'https://choudharypushpa.github.io/HumanFRSTLab/pages/team/faculty/pushpa.html', '/uploads/people/faculty/Pushpa.jpg', NULL, '["Human factors in road safety","Vulnerable road users'' behaviour and safety","Intelligent transportation systems","Naturalistic and VR studies","Risk assessment and statistical modelling"]', NULL, 17, 1),
  ('staff', 'Ms. Rinki Seth', 'Senior Assistant', NULL, 'Administration', NULL, 'ceoffice@iiti.ac.in  ,   rinki@iiti.ac.in', '0731-660 3477', NULL, NULL, '/uploads/people/staff/Rinki.jpg', NULL, NULL, NULL, 1, 1),
  ('staff', 'Ms. Divya Bangar', 'Junior Superintendent', NULL, 'Administration', NULL, 'ceoffice@iiti.ac.in  ,   divya@iiti.ac.in', '0731-660 3477', NULL, NULL, '/uploads/people/staff/Divya.jpeg', NULL, NULL, NULL, 2, 1),
  ('staff', 'Mr. Amit Jadhav', 'Junior Technical Superintendent', NULL, 'Laboratory Management', NULL, 'jadhavamit@iiti.ac.in', '0731-660 3411', NULL, NULL, '/uploads/people/staff/Amit.jpg', NULL, NULL, NULL, 3, 1),
  ('staff', 'Mr. Ajay Malviya', 'Junior Assistant (Lab)', NULL, 'Laboratory Management', NULL, 'amalviya@iiti.ac.in', '0731-660 3412', NULL, NULL, '/uploads/people/staff/Ajay.jpg', NULL, NULL, NULL, 4, 1),
  ('staff', 'Mr. Pankaj Sankhla', 'Junior Assistant (Lab)', NULL, 'Laboratory Management', NULL, 'sankhlapankaj@iiti.ac.in', '0731-660 5590', NULL, NULL, '/uploads/people/staff/Pankaj.jpg', NULL, NULL, NULL, 5, 1),
  ('staff', 'Mr. Ghanshyam Kachneriya', 'Junior Assistant (Lab)', NULL, 'Laboratory Management', NULL, 'gkachneriya@iiti.ac.in', '0731-660 5591', NULL, NULL, '/uploads/people/staff/Ghanshyam.jpg', NULL, NULL, NULL, 6, 1),
  ('staff', 'Mr. Awadhesh Verma', 'Office Attendant', NULL, 'Administration', NULL, 'avadeshv@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/staff/Awadhesh.jpg', NULL, NULL, NULL, 7, 1),
  ('phd', 'Aadarsh Singh', NULL, NULL, NULL, NULL, 'phd2401104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Aadarsh Singh.jpg', NULL, NULL, NULL, 1, 1),
  ('phd', 'Achala Singh', NULL, NULL, NULL, NULL, 'phd2201104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Achala Singh (PhD).jpg', NULL, NULL, NULL, 2, 1),
  ('phd', 'Ajay Kumar Mishra', NULL, NULL, NULL, NULL, 'phd2501104001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 3, 1),
  ('phd', 'Akash Paradkar', NULL, NULL, NULL, NULL, 'phd2401104001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Akash Paradkar(PhD).jpg', NULL, NULL, NULL, 4, 1),
  ('phd', 'Akshay', NULL, NULL, NULL, NULL, 'phd2301204011@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Akshay.jpg', NULL, NULL, NULL, 5, 1),
  ('phd', 'Alok Sharma', NULL, NULL, NULL, NULL, 'phd2401104003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Alok Sharma (PhD).jpg', NULL, NULL, NULL, 6, 1),
  ('phd', 'Anish Chandra', NULL, NULL, NULL, NULL, 'phd2401204001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 7, 1),
  ('phd', 'Ankit Kumar Kumawat', NULL, NULL, NULL, NULL, 'phd2301104003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 8, 1),
  ('phd', 'Anshul', NULL, NULL, NULL, NULL, 'phd2101204010@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Anshul.jpg', NULL, NULL, NULL, 9, 1),
  ('phd', 'Arpita', NULL, NULL, NULL, NULL, 'phd2301104003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Arpita.jpg', NULL, NULL, NULL, 10, 1),
  ('phd', 'Ashish Giri', NULL, NULL, NULL, NULL, 'phd2201204001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 11, 1),
  ('phd', 'Ashok Kumar', NULL, NULL, NULL, NULL, 'phd2501104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 12, 1),
  ('phd', 'ASTHA SHARMA', NULL, NULL, NULL, NULL, 'phd2301204008@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/astha.jpg', NULL, NULL, NULL, 13, 1),
  ('phd', 'Bodhanam S Praveen', NULL, NULL, NULL, NULL, 'phd2401104005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Bodhanam.jpg', NULL, NULL, NULL, 14, 1),
  ('phd', 'Deepak Mishra', NULL, NULL, NULL, NULL, 'phd2301104004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Deepak Mishra (PhD).jpg', NULL, NULL, NULL, 15, 1),
  ('phd', 'Denis Jangeed', NULL, NULL, NULL, NULL, 'phd2501104016@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 16, 1),
  ('phd', 'Devendra Dohare', NULL, NULL, NULL, NULL, 'phd2501104003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 17, 1),
  ('phd', 'Gaurav Pandey', NULL, NULL, NULL, NULL, 'phd2501104005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 18, 1),
  ('phd', 'Gaurav Sharma', NULL, NULL, NULL, NULL, 'phd2301204001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Gaurav Sharma(PhD).jpg', NULL, NULL, NULL, 19, 1),
  ('phd', 'Gaurav Yadav', NULL, NULL, NULL, NULL, 'phd2401204005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 20, 1),
  ('phd', 'Ghulam Hussain', NULL, NULL, NULL, NULL, 'phd2401104007@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Ghulam Hussain (PhD).jpg', NULL, NULL, NULL, 21, 1),
  ('phd', 'Gourav Agrawal', NULL, NULL, NULL, NULL, 'phd2401104006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Gourav Agrawal (PhD).jpg', NULL, NULL, NULL, 22, 1),
  ('phd', 'Govind Kumar Bharti', NULL, NULL, NULL, NULL, 'phd2501104004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 23, 1),
  ('phd', 'Gyanesh', NULL, NULL, NULL, NULL, 'phd2101104007@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Gyanesh.jpg', NULL, NULL, NULL, 24, 1),
  ('phd', 'Harshvardhan Solanki', NULL, NULL, NULL, NULL, 'phd2301104009@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Harshvardhan Solanki (PhD).jpg', NULL, NULL, NULL, 25, 1),
  ('phd', 'Himanshu', NULL, NULL, NULL, NULL, 'phd2301104004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Himanshu.jpg', NULL, NULL, NULL, 26, 1),
  ('phd', 'Himanshu Kaushik', NULL, NULL, NULL, NULL, 'phd2101104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 27, 1),
  ('phd', 'Himanshu Soni', NULL, NULL, NULL, NULL, 'phd2501104006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 28, 1),
  ('phd', 'Hussain', NULL, NULL, NULL, NULL, 'phd2301204005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Hussain.jpg', NULL, NULL, NULL, 29, 1),
  ('phd', 'Jatin Garhekar', NULL, NULL, NULL, NULL, 'phd2401104009@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Jatin Garhekar (PhD).jpg', NULL, NULL, NULL, 30, 1),
  ('phd', 'Jitendra Wamanrao Mathankar', NULL, NULL, NULL, NULL, 'phd2401104022@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Jitendra Mathankar (PhD).jpg', NULL, NULL, NULL, 31, 1),
  ('phd', 'Kajol Kankane', NULL, NULL, NULL, NULL, 'phd2201104007@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Kajol Kankane (PhD).jpg', NULL, NULL, NULL, 32, 1),
  ('phd', 'Kameshwar Singh Nim', NULL, NULL, NULL, NULL, 'phd2301104005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 33, 1),
  ('phd', 'Karnati', NULL, NULL, NULL, NULL, 'phd2201104005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Karnati.jpg', NULL, NULL, NULL, 34, 1),
  ('phd', 'Kuldeep', NULL, NULL, NULL, NULL, 'phd2301204003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Kuldeep.jpg', NULL, NULL, NULL, 35, 1),
  ('phd', 'Kunal', NULL, NULL, NULL, NULL, 'phd2101204011@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Kunal.jpg', NULL, NULL, NULL, 36, 1),
  ('phd', 'Kushal Jagdish Patil', NULL, NULL, NULL, NULL, 'phd2401104010@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Kushal Patil.jpg', NULL, NULL, NULL, 37, 1),
  ('phd', 'Mahaveer Singh Dangi ', NULL, NULL, NULL, NULL, 'phd2401104011@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Mahaveer Singh Dangi (PhD).jpg', NULL, NULL, NULL, 38, 1),
  ('phd', 'Manish Yadav ', NULL, NULL, NULL, NULL, 'phd2201204003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Manish Yadav (PhD).jpg', NULL, NULL, NULL, 39, 1),
  ('phd', 'Mayank Upadhyay', NULL, NULL, NULL, NULL, 'phd2401104012@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Mayank Upadhyay.jpg', NULL, NULL, NULL, 40, 1),
  ('phd', 'Md Arif Hussain', NULL, NULL, NULL, NULL, 'phd2001104001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 41, 1),
  ('phd', 'Meghna', NULL, NULL, NULL, NULL, 'phd2101104006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Meghna.jpg', NULL, NULL, NULL, 42, 1),
  ('phd', 'Minu', NULL, NULL, NULL, NULL, 'phd2101204004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Minu.jpg', NULL, NULL, NULL, 43, 1),
  ('phd', 'Mohd', NULL, NULL, NULL, NULL, 'phd2101104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Mohd.jpg', NULL, NULL, NULL, 44, 1),
  ('phd', 'Mohd Atif', NULL, NULL, NULL, NULL, 'phd2001104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 45, 1),
  ('phd', 'Moirangthem', NULL, NULL, NULL, NULL, 'phd2101204009@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Moirangthem.jpg', NULL, NULL, NULL, 46, 1),
  ('phd', 'KMonika', NULL, NULL, NULL, NULL, 'phd2301204009@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Monika.jpg', NULL, NULL, NULL, 47, 1),
  ('phd', 'MUKUL', NULL, NULL, NULL, NULL, 'phd2301104005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/MUKUL.jpg', NULL, NULL, NULL, 48, 1),
  ('phd', 'Naveen Kumar', NULL, NULL, NULL, NULL, 'phd2001104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Naveen Kumar (PhD).jpg', NULL, NULL, NULL, 49, 1),
  ('phd', 'Nikhil Kumar Pandey', NULL, NULL, NULL, NULL, 'phd2301104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Nikhil Pandey (PhD).jpg', NULL, NULL, NULL, 50, 1),
  ('phd', 'Nikhil', NULL, NULL, NULL, NULL, 'phd2201104004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Nikhil.jpg', NULL, NULL, NULL, 51, 1),
  ('phd', 'Nitin', NULL, NULL, NULL, NULL, 'phd2101104001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Nitin.jpg', NULL, NULL, NULL, 52, 1),
  ('phd', 'Parul', NULL, NULL, NULL, NULL, 'phd2101204006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Parul.jpg', NULL, NULL, NULL, 53, 1),
  ('phd', 'Pradip Kailas Gopal', NULL, NULL, NULL, NULL, 'phd2401204006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 54, 1),
  ('phd', 'Priyank Agrawal', NULL, NULL, NULL, NULL, 'phd2501104008@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 55, 1),
  ('phd', 'Revanth', NULL, NULL, NULL, NULL, 'phd2301104008@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Revanth.jpg', NULL, NULL, NULL, 56, 1),
  ('phd', 'Rohit Vyas', NULL, NULL, NULL, NULL, 'phd2401104014@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Rohit Vyas(PhD).jpg', NULL, NULL, NULL, 57, 1),
  ('phd', 'Rosa', NULL, NULL, NULL, NULL, 'phd2101204002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Rosa.jpg', NULL, NULL, NULL, 58, 1),
  ('phd', 'Sachin', NULL, NULL, NULL, NULL, 'phd2101204005@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Sachin.jpg', NULL, NULL, NULL, 59, 1),
  ('phd', 'Sanchit', NULL, NULL, NULL, NULL, 'phd2301104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Sanchit.jpg', NULL, NULL, NULL, 60, 1),
  ('phd', 'Sarvjeet Singh', NULL, NULL, NULL, NULL, 'phd2401104015@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Sarvjeet Singh (PhD).jpg', NULL, NULL, NULL, 61, 1),
  ('phd', 'Sayak Chakravorty', NULL, NULL, NULL, NULL, 'phd2301104006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Sayak Chakravorty (PhD).jpg', NULL, NULL, NULL, 62, 1),
  ('phd', 'Shashank Agrawal', NULL, NULL, NULL, NULL, 'phd2401204003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 63, 1),
  ('phd', 'Shivam Singh', NULL, NULL, NULL, NULL, 'phd2401204008@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Shivam.jpg', NULL, NULL, NULL, 64, 1),
  ('phd', 'Shivukumar', NULL, NULL, NULL, NULL, 'phd2101204007@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Shivukumar.jpg', NULL, NULL, NULL, 65, 1),
  ('phd', 'Shreya Dixit', NULL, NULL, NULL, NULL, 'phd2401204004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 66, 1),
  ('phd', 'Shubham Ramesh More', NULL, NULL, NULL, NULL, 'phd2401104018@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Shubham More (PhD).jpg', NULL, NULL, NULL, 67, 1),
  ('phd', 'Shuddhashil Ghosh', NULL, NULL, NULL, NULL, 'phd2001104003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Shuddhashil.jpg', NULL, NULL, NULL, 68, 1),
  ('phd', 'Smriti', NULL, NULL, NULL, NULL, 'phd2301104006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Smriti.jpg', NULL, NULL, NULL, 69, 1),
  ('phd', 'Srinidhi', NULL, NULL, NULL, NULL, 'phd2201104002@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Srinidhi.jpg', NULL, NULL, NULL, 70, 1),
  ('phd', 'Sugato Panda', NULL, NULL, NULL, NULL, 'phd2201104004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Sugato Panda (PhD).jpg', NULL, NULL, NULL, 71, 1),
  ('phd', 'Sumedh Kishor Limaye', NULL, NULL, NULL, NULL, 'phd2301104007@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Sumedh Kishor Limaye (PhD).jpg', NULL, NULL, NULL, 72, 1),
  ('phd', 'Tarun Kumar Narnaure', NULL, NULL, NULL, NULL, 'phd2401104016@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 73, 1),
  ('phd', 'Uday Chand Saket', NULL, NULL, NULL, NULL, 'phd2501104011@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/SAKET.jpg', NULL, NULL, NULL, 74, 1),
  ('phd', 'Upasana Ratre', NULL, NULL, NULL, NULL, 'phd2501104010@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 75, 1),
  ('phd', 'Utkarsh Baranwal', NULL, NULL, NULL, NULL, 'phd2201204006@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Utkarsh Baranwal (PhD).jpg', NULL, NULL, NULL, 76, 1),
  ('phd', 'Veena N Bhajantri', NULL, NULL, NULL, NULL, 'phd2301204004@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Veena N Bhajantri (PhD).jpg', NULL, NULL, NULL, 77, 1),
  ('phd', 'Venkatesh', NULL, NULL, NULL, NULL, 'phd2301204010@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Venkatesh.jpg', NULL, NULL, NULL, 78, 1),
  ('phd', 'Vijay', NULL, NULL, NULL, NULL, 'phd2101204003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Vijay.jpg', NULL, NULL, NULL, 79, 1),
  ('phd', 'Vikas', NULL, NULL, NULL, NULL, 'phd2201104003@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Vikas.jpg', NULL, NULL, NULL, 80, 1),
  ('phd', 'Vikas Rawat', NULL, NULL, NULL, NULL, 'phd2301104008@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Vikas Rawat(PhD).jpg', NULL, NULL, NULL, 81, 1),
  ('phd', 'Vikas Sudam Gore', NULL, NULL, NULL, NULL, 'phd2401104017@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Vikas Sudam Gore (PhD).jpg', NULL, NULL, NULL, 82, 1),
  ('phd', 'Vinay Kumar Sharma', NULL, NULL, NULL, NULL, 'phd2201104001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/VINAY SHARMA (PhD).jpg', NULL, NULL, NULL, 83, 1),
  ('phd', 'Vishal Gautam', NULL, NULL, NULL, NULL, 'phd2501104012@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 84, 1),
  ('phd', 'Vivek', NULL, NULL, NULL, NULL, 'phd2301204001@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Vivek.jpg', NULL, NULL, NULL, 85, 1),
  ('phd', 'Waqar', NULL, NULL, NULL, NULL, 'phd2301204007@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/phd/Waqar.jpg', NULL, NULL, NULL, 86, 1),
  ('phd', 'Yogendra Bihare', NULL, NULL, NULL, NULL, 'phd2501104013@iiti.ac.in', NULL, NULL, NULL, '/uploads/people/placeholders/student-default.jpg', NULL, NULL, NULL, 87, 1),
  ('mtech', NULL, NULL, NULL, NULL, '2025 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/M.tech Student List 2025.pdf', NULL, NULL, 1, 1),
  ('mtech', NULL, NULL, NULL, NULL, '2024 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/M.tech Student List 2024.pdf', NULL, NULL, 2, 1),
  ('btech', NULL, NULL, NULL, NULL, '2025 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/B.tech Student List 2025.pdf', NULL, NULL, 1, 1),
  ('btech', NULL, NULL, NULL, NULL, '2024 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/B.tech Student List 2024.pdf', NULL, NULL, 2, 1),
  ('btech', NULL, NULL, NULL, NULL, '2023 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/B.tech Student List 2023.pdf', NULL, NULL, 3, 1),
  ('btech', NULL, NULL, NULL, NULL, '2022 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/B.tech Student List 2022.pdf', NULL, NULL, 4, 1),
  ('btech', NULL, NULL, NULL, NULL, '2021 Batch', NULL, NULL, NULL, NULL, NULL, '/uploads/people/student_lists/B.tech Student List 2021.pdf', NULL, NULL, 5, 1);
