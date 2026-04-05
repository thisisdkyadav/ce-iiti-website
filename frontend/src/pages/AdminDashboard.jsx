import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminLogout,
  createPeopleEntry,
  createFooterLink,
  createHeroSlide,
  createHomeStat,
  createNavigationItem,
  createNewsItem,
  createSocialLink,
  deleteFooterLink,
  deleteHeroSlide,
  deleteHomeStat,
  deleteNavigationItem as deleteNavigationItemApi,
  deleteNewsItem,
  deletePeopleEntry,
  deleteSocialLink,
  fetchAdminContent,
  fetchContactSubmissions,
  fetchAdminSession,
  resolveMediaUrl,
  updatePeopleEntry,
  updateFooterLink,
  updateHeroSlide,
  updateAcademicsContent,
  updateAboutContent,
  updateContactContent,
  updateEventsContent,
  updateSpecializationsContent,
  updateHomeContent,
  updateHomeStat,
  updateNavigationItem,
  updateNewsItem,
  updateSiteSettings,
  updateSocialLink,
  uploadAdminImage,
} from '../lib/contentApi';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AdminModal, AdminButton, AdminInput, AdminTextarea, AdminCard, AdminTable, ConfirmationModal } from '../components/admin';
import './admin.css';

// ============================================
// DEFAULT VALUES AND CONSTANTS (unchanged)
// ============================================

const defaultSiteSettings = {
  site_name: '',
  department_name: '',
  logo_url: '',
  navbar_title: '',
  navbar_subtitle: '',
  footer_description: '',
  contact_address_lines_text: '',
  contact_phone: '',
  contact_email: '',
  map_embed_url: '',
  copyright_text: '',
};

const defaultHomeContent = {
  welcome_title: '',
  welcome_paragraph_1: '',
  welcome_paragraph_2: '',
  welcome_image_url: '',
  cta_title: '',
  cta_description: '',
  cta_primary_text: '',
  cta_primary_link: '',
  cta_secondary_text: '',
  cta_secondary_link: '',
  cta_tertiary_text: '',
  cta_tertiary_link: '',
};

const defaultAboutContent = {
  hero_title: '',
  hero_subtitle: '',
  story_title: '',
  story_paragraph_1: '',
  story_paragraph_2: '',
  story_paragraph_3: '',
  story_image_url: '',
  mission_title: '',
  mission_description: '',
  vision_title: '',
  vision_description: '',
  values_title: '',
  values_subtitle: '',
  values_items: [],
  milestones_title: '',
  milestones_subtitle: '',
  milestones: [],
  stats_title: '',
  stats_subtitle: '',
  stats_items: [],
};

const defaultAboutValueItem = {
  icon_name: 'Award',
  title: '',
  description: '',
};

const defaultAboutMilestoneItem = {
  year: '',
  event: '',
};

const defaultAboutStatItem = {
  label: '',
  value: 0,
  suffix: '',
};

const aboutValueIconOptions = ['Award', 'Users', 'Target', 'BookOpen'];

const defaultAcademicsProgram = {
  title: '',
  link_url: '',
  link_target: '_blank',
  duration: '',
  intake: '',
  description: '',
  highlights: [],
  courses: [],
};

const defaultAcademicsSemester = {
  semester_label: '',
  courses: [],
};

const defaultAcademicsContent = {
  hero_title: '',
  hero_subtitle: '',
  programs_title: '',
  programs_subtitle: '',
  programs: [],
  curriculum_title: '',
  curriculum_subtitle: '',
  curriculum_semesters: [],
  facilities_title: '',
  facilities_subtitle: '',
  facilities_items: [],
  admission_title: '',
  admission_subtitle: '',
  admission_primary_text: '',
  admission_primary_link: '',
  admission_secondary_text: '',
  admission_secondary_link: '',
};

const defaultSpecializationFaculty = {
  name: '',
  url: '',
};

const defaultSpecializationEquipment = {
  name: '',
  image_url: '',
};

const defaultSpecializationLab = {
  name: '',
  equipments: [],
};

const defaultSpecializationItem = {
  key: '',
  title: '',
  description: '',
  color: 'blue',
  icon_name: 'Building',
  image_url: '',
  faculty: [],
  labs: [],
};

const defaultSpecializationRow = {
  name: '',
  location: '',
};

const defaultSpecializationsContent = {
  hero_title: '',
  hero_subtitle: '',
  specializations_tab_label: 'Specializations',
  laboratories_tab_label: 'Laboratories',
  specializations_title: '',
  specializations_subtitle: '',
  specializations: [],
  laboratories_title: 'Department Laboratories',
  laboratory_rows: [],
};

const defaultEventsItem = {
  date: '',
  title: '',
  description: '',
  time: '',
  venue: '',
  category: 'Seminar',
  image_url: '',
  registration_link: '',
};

const defaultEventsContent = {
  hero_title: '',
  hero_subtitle: '',
  search_placeholder: 'Search events by title, description, or category...',
  tab_news_label: 'News & Updates',
  tab_upcoming_label: 'Upcoming Events',
  tab_past_label: 'Past Events',
  no_news_message: 'No news found matching your criteria.',
  no_upcoming_message: 'No upcoming events at the moment.',
  no_past_message: 'No past events recorded recently.',
  upcoming_events: [],
  past_events: [],
};

const defaultContactInfoCard = {
  icon_name: 'MapPin',
  title: '',
  details: [],
};

const defaultKeyContact = {
  name: '',
  designation: '',
  email: '',
  phone: '',
  office: '',
};

const defaultQuickLinkItem = {
  title: '',
  description: '',
  url: '',
};

const defaultStayConnectedLink = {
  icon_name: 'Globe',
  label: '',
  url: '',
};

const defaultFooterCard = {
  title: '',
  description: '',
};

const defaultContactContent = {
  hero_title: '',
  hero_subtitle: '',
  info_section_title: '',
  info_section_subtitle: '',
  contact_info_cards: [],
  form_title: '',
  form_submit_message: '',
  form_categories: [],
  key_contacts_title: '',
  key_contacts_subtitle: '',
  key_contacts: [],
  quick_links_title: '',
  quick_links_subtitle: '',
  quick_links: [],
  stay_connected_title: '',
  stay_connected_subtitle: '',
  stay_connected_links: [],
  footer_cards: [],
  map_embed_url: '',
};

const contactInfoIconOptions = ['MapPin', 'Phone', 'Mail', 'Clock', 'Building', 'Globe', 'Users'];

const specializationColorOptions = ['blue', 'amber', 'green', 'cyan', 'emerald'];
const specializationIconOptions = ['Building', 'Microscope', 'Target', 'FlaskConical', 'Award'];

const defaultNavigationItem = {
  label: '',
  href: '',
  sort_order: 0,
  is_active: 1,
};

const defaultSocialLink = {
  platform: '',
  icon: 'Linkedin',
  url: '',
  sort_order: 0,
  is_active: 1,
};

const defaultFooterLink = {
  section: 'quick',
  label: '',
  href: '',
  sort_order: 0,
  is_active: 1,
};

const defaultSlide = {
  image_url: '',
  title: '',
  subtitle: '',
  cta_text: '',
  cta_link: '',
  sort_order: 0,
  is_active: 1,
};

const defaultStat = {
  label: '',
  value: 0,
  suffix: '',
  icon_name: 'Users',
  sort_order: 0,
  is_active: 1,
};

const defaultNewsItem = {
  title: '',
  excerpt: '',
  category: 'News',
  image_url: '',
  external_link: '',
  publish_date: '',
  is_active: 1,
};

const defaultPeopleEntry = {
  category: 'faculty',
  name: '',
  designation: '',
  specialization: '',
  department: '',
  year_label: '',
  email: '',
  phone: '',
  room: '',
  profile_url: '',
  image_url: '',
  resource_link: '',
  research_interests_text: '',
  responsibilities_text: '',
  sort_order: 0,
  is_active: 1,
};

const defaultProgramStudentDraft = {
  name: '',
  email: '',
  phone: '',
  image_url: '',
  sort_order: 0,
  is_active: 1,
};

const peopleCategoryOptions = [
  { value: 'faculty', label: 'Faculty' },
  { value: 'staff', label: 'Staff' },
  { value: 'phd', label: 'Ph.D. Student' },
  { value: 'mtech', label: 'M.Tech' },
  { value: 'btech', label: 'B.Tech' },
];

const programCategorySet = new Set(['mtech', 'btech']);

function isProgramCategory(category) {
  return programCategorySet.has(String(category || '').toLowerCase());
}

function isProgramStudentEntry(entry) {
  return isProgramCategory(entry?.category) && String(entry?.name || '').trim().length > 0;
}

function isProgramYearEntry(entry) {
  return isProgramCategory(entry?.category) && String(entry?.name || '').trim().length === 0;
}

function normalizeBatchLabel(value) {
  return String(value || '').trim();
}

function getProgramEntryMode(entry) {
  return String(entry?.resource_link || '').trim().length > 0 ? 'resource' : 'individual';
}

function getPeopleDisplayName(entry) {
  if (isProgramYearEntry(entry)) {
    return normalizeBatchLabel(entry.year_label) || 'Untitled Batch';
  }

  return String(entry?.name || '').trim() || 'Unnamed';
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === ',' && !insideQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvText(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((header) =>
    String(header || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
  );

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      if (!header) {
        return;
      }

      row[header] = values[index] ?? '';
    });

    return row;
  });
}

function parseBooleanFlag(value, fallback = 1) {
  const normalized = String(value ?? '').trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (['1', 'true', 'yes', 'y'].includes(normalized)) {
    return 1;
  }

  if (['0', 'false', 'no', 'n'].includes(normalized)) {
    return 0;
  }

  return fallback;
}

const adminSectionGroups = [
  {
    label: 'Global',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    sections: [
      { key: 'site-settings', label: 'Site Settings', icon: 'settings' },
      { key: 'home-content', label: 'Home Content', icon: 'home' },
      { key: 'about-content', label: 'About Content', icon: 'info' },
      { key: 'academics-content', label: 'Academics Content', icon: 'book' },
      { key: 'contact-content', label: 'Contact Content', icon: 'mail' },
      { key: 'contact-submissions', label: 'Contact Responses', icon: 'mail' },
      { key: 'events-content', label: 'Events Content', icon: 'calendar' },
      { key: 'specializations-content', label: 'Specializations Content', icon: 'star' },
    ],
  },
  {
    label: 'Header & Footer',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    sections: [
      { key: 'navigation', label: 'Navigation Items', icon: 'menu' },
      { key: 'social', label: 'Social Links', icon: 'share' },
      { key: 'footer', label: 'Footer Links', icon: 'link' },
    ],
  },
  {
    label: 'Homepage Modules',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    sections: [
      { key: 'slides', label: 'Hero Slides', icon: 'image' },
      { key: 'stats', label: 'Home Stats', icon: 'chart' },
      { key: 'news', label: 'News Items', icon: 'newspaper' },
    ],
  },
  {
    label: 'People',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    sections: [{ key: 'people', label: 'People Directory', icon: 'users' }],
  },
];

const sectionDetails = {
  'site-settings': {
    title: 'Site Settings',
    description: 'Branding, contact info, and shared site metadata.',
  },
  'home-content': {
    title: 'Home Content',
    description: 'Welcome block and CTA text shown on homepage.',
  },
  'about-content': {
    title: 'About Content',
    description: 'Hero, story, mission/vision, values, milestones, and stats for About page.',
  },
  'academics-content': {
    title: 'Academics Content',
    description: 'Programs, curriculum, facilities, and admission section for Academics page.',
  },
  'contact-content': {
    title: 'Contact Content',
    description: 'Contact page sections, cards, categories, and key contact details.',
  },
  'contact-submissions': {
    title: 'Contact Responses',
    description: 'View submitted contact form responses from website visitors.',
  },
  'specializations-content': {
    title: 'Specializations Content',
    description: 'Specialization cards, faculty, lab equipment, and laboratories table.',
  },
  'events-content': {
    title: 'Events Content',
    description: 'Events page text plus upcoming and past event cards.',
  },
  navigation: {
    title: 'Navigation Items',
    description: 'Manage top menu labels, links, order, and visibility.',
  },
  social: {
    title: 'Social Links',
    description: 'Manage footer social profiles and icons.',
  },
  footer: {
    title: 'Footer Links',
    description: 'Manage quick and important footer link groups.',
  },
  slides: {
    title: 'Hero Slides',
    description: 'Homepage carousel slides with CTA buttons.',
  },
  stats: {
    title: 'Home Stats',
    description: 'Counter cards shown in the homepage stats strip.',
  },
  news: {
    title: 'News Items',
    description: 'News cards and update feed entries.',
  },
  people: {
    title: 'People Directory',
    description: 'Manage faculty, staff, students, and student list links.',
  },
};

// ============================================
// UTILITY FUNCTIONS (unchanged)
// ============================================

function formatDateTimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function formatReadableDateTime(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString();
}

function toIsoDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function toInteger(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.trunc(parsed);
}

function toNullableString(value) {
  const nextValue = String(value || '').trim();
  return nextValue.length > 0 ? nextValue : null;
}

function toStringArrayFromText(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizePeopleEntryForUi(entry) {
  const researchInterests = Array.isArray(entry?.research_interests)
    ? entry.research_interests
    : [];
  const responsibilities = Array.isArray(entry?.responsibilities)
    ? entry.responsibilities
    : [];

  return {
    ...entry,
    research_interests_text: researchInterests.join('\n'),
    responsibilities_text: responsibilities.join('\n'),
  };
}

function toPeopleDraft(entry) {
  const normalized = normalizePeopleEntryForUi(entry || {});

  return {
    ...defaultPeopleEntry,
    category: normalized.category || 'faculty',
    name: normalized.name || '',
    designation: normalized.designation || '',
    specialization: normalized.specialization || '',
    department: normalized.department || '',
    year_label: normalized.year_label || '',
    email: normalized.email || '',
    phone: normalized.phone || '',
    room: normalized.room || '',
    profile_url: normalized.profile_url || '',
    image_url: normalized.image_url || '',
    resource_link: normalized.resource_link || '',
    research_interests_text: normalized.research_interests_text || '',
    responsibilities_text: normalized.responsibilities_text || '',
    sort_order: toInteger(normalized.sort_order, 0),
    is_active: normalized.is_active ? 1 : 0,
  };
}

// ============================================
// ICONS COMPONENT
// ============================================

const SectionIcon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    settings: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    home: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    info: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    book: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    mail: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    calendar: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    star: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    share: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    link: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    image: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    chart: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    newspaper: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };
  
  return icons[name] || icons.settings;
};

// ============================================
// ADMIN DASHBOARD CONTENT COMPONENT
// ============================================

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Helper for theme-based styling
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState('site-settings');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Site Settings Modal
  const [siteSettingsModalOpen, setSiteSettingsModalOpen] = useState(false);
  const [siteSettingsEditMode, setSiteSettingsEditMode] = useState(false);
  const [siteSettingsConfirmSave, setSiteSettingsConfirmSave] = useState(false);

  // Navigation Items Modal
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [navEditMode, setNavEditMode] = useState(false);
  const [navSelectedItem, setNavSelectedItem] = useState(null);
  const [navDraft, setNavDraft] = useState(defaultNavigationItem);
  const [navConfirmSave, setNavConfirmSave] = useState(false);
  const [navConfirmDelete, setNavConfirmDelete] = useState(false);

  // Social Links Modal
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialEditMode, setSocialEditMode] = useState(false);
  const [socialSelectedItem, setSocialSelectedItem] = useState(null);
  const [socialDraft, setSocialDraft] = useState(defaultSocialLink);
  const [socialConfirmSave, setSocialConfirmSave] = useState(false);
  const [socialConfirmDelete, setSocialConfirmDelete] = useState(false);

  // Footer Links Modal
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const [footerEditMode, setFooterEditMode] = useState(false);
  const [footerSelectedItem, setFooterSelectedItem] = useState(null);
  const [footerDraft, setFooterDraft] = useState(defaultFooterLink);
  const [footerConfirmSave, setFooterConfirmSave] = useState(false);
  const [footerConfirmDelete, setFooterConfirmDelete] = useState(false);

  // Hero Slides Modal
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [slideEditMode, setSlideEditMode] = useState(false);
  const [slideSelectedItem, setSlideSelectedItem] = useState(null);
  const [slideDraft, setSlideDraft] = useState(defaultSlide);
  const [slideConfirmSave, setSlideConfirmSave] = useState(false);
  const [slideConfirmDelete, setSlideConfirmDelete] = useState(false);

  // Home Stats Modal
  const [statModalOpen, setStatModalOpen] = useState(false);
  const [statEditMode, setStatEditMode] = useState(false);
  const [statSelectedItem, setStatSelectedItem] = useState(null);
  const [statDraft, setStatDraft] = useState(defaultStat);
  const [statConfirmSave, setStatConfirmSave] = useState(false);
  const [statConfirmDelete, setStatConfirmDelete] = useState(false);

  // News Items Modal
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newsEditMode, setNewsEditMode] = useState(false);
  const [newsSelectedItem, setNewsSelectedItem] = useState(null);
  const [newsDraft, setNewsDraft] = useState(defaultNewsItem);
  const [newsConfirmSave, setNewsConfirmSave] = useState(false);
  const [newsConfirmDelete, setNewsConfirmDelete] = useState(false);

  // Home Content Modal
  const [homeContentEditMode, setHomeContentEditMode] = useState(false);
  const [homeContentConfirmSave, setHomeContentConfirmSave] = useState(false);

  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [homeContent, setHomeContent] = useState(defaultHomeContent);
  const [aboutContent, setAboutContent] = useState(defaultAboutContent);
  const [academicsContent, setAcademicsContent] = useState(defaultAcademicsContent);
  const [contactContent, setContactContent] = useState(defaultContactContent);
  const [eventsContent, setEventsContent] = useState(defaultEventsContent);
  const [specializationsContent, setSpecializationsContent] = useState(defaultSpecializationsContent);
  const [navigationItems, setNavigationItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [slides, setSlides] = useState([]);
  const [stats, setStats] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [peopleEntries, setPeopleEntries] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  
  // People Directory Modal
  const [peopleModalOpen, setPeopleModalOpen] = useState(false);
  const [peopleEditMode, setPeopleEditMode] = useState(false);
  const [peopleSelectedItem, setPeopleSelectedItem] = useState(null);
  const [peopleDraft, setPeopleDraft] = useState(defaultPeopleEntry);
  const [peopleProgramMode, setPeopleProgramMode] = useState('resource');
  const [peopleConfirmSave, setPeopleConfirmSave] = useState(false);
  const [peopleConfirmDelete, setPeopleConfirmDelete] = useState(false);
  const [peopleFilterCategory, setPeopleFilterCategory] = useState('all');
  const [programStudentModalOpen, setProgramStudentModalOpen] = useState(false);
  const [programStudentSelectedItem, setProgramStudentSelectedItem] = useState(null);
  const [programStudentDraft, setProgramStudentDraft] = useState(defaultProgramStudentDraft);
  const [programStudentConfirmDelete, setProgramStudentConfirmDelete] = useState(false);
  const [programStudentCsvInputKey, setProgramStudentCsvInputKey] = useState(0);

  // Contact Form Responses Modal
  const [contactSubmissionModalOpen, setContactSubmissionModalOpen] = useState(false);
  const [contactSubmissionSelectedItem, setContactSubmissionSelectedItem] = useState(null);

  // About Content editing
  const [aboutEditMode, setAboutEditMode] = useState(false);
  const [aboutConfirmSave, setAboutConfirmSave] = useState(false);

  // Academics Content editing
  const [academicsEditMode, setAcademicsEditMode] = useState(false);
  const [academicsConfirmSave, setAcademicsConfirmSave] = useState(false);

  // Contact Content editing
  const [contactEditMode, setContactEditMode] = useState(false);
  const [contactConfirmSave, setContactConfirmSave] = useState(false);

  // Events Content editing
  const [eventsEditMode, setEventsEditMode] = useState(false);
  const [eventsConfirmSave, setEventsConfirmSave] = useState(false);

  // Specializations Content editing
  const [specializationsEditMode, setSpecializationsEditMode] = useState(false);
  const [specializationsConfirmSave, setSpecializationsConfirmSave] = useState(false);

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const loadContactSubmissions = async ({ showError = false } = {}) => {
    try {
      const submissionsResponse = await fetchContactSubmissions();
      setContactSubmissions(
        Array.isArray(submissionsResponse?.submissions)
          ? submissionsResponse.submissions
          : []
      );
      return true;
    } catch (submissionError) {
      setContactSubmissions([]);
      if (showError) {
        setError(submissionError?.message || 'Failed to load contact submissions.');
        setSuccessMessage('');
      }
      return false;
    }
  };

  const refreshContactSubmissions = async () => {
    clearMessages();
    const success = await loadContactSubmissions({ showError: true });
    if (success) {
      setSuccessMessage('Contact submissions refreshed.');
    }
  };

  const loadContent = async () => {
    const data = await fetchAdminContent();

    const loadedSiteSettings = data?.siteSettings || {};
    const loadedHomeContent = data?.homeContent || {};
    const loadedAboutContent = data?.aboutContent || {};
    const loadedAcademicsContent = data?.academicsContent || {};
    const loadedContactContent = data?.contactContent || {};
    const loadedEventsContent = data?.eventsContent || {};
    const loadedSpecializationsContent = data?.specializationsContent || {};

    setSiteSettings({
      ...defaultSiteSettings,
      ...loadedSiteSettings,
      contact_address_lines_text: Array.isArray(loadedSiteSettings.contact_address_lines)
        ? loadedSiteSettings.contact_address_lines.join('\n')
        : '',
    });

    setHomeContent({
      ...defaultHomeContent,
      ...loadedHomeContent,
    });

    setAboutContent({
      ...defaultAboutContent,
      ...loadedAboutContent,
      values_items: Array.isArray(loadedAboutContent.values_items)
        ? loadedAboutContent.values_items
        : [],
      milestones: Array.isArray(loadedAboutContent.milestones)
        ? loadedAboutContent.milestones
        : [],
      stats_items: Array.isArray(loadedAboutContent.stats_items)
        ? loadedAboutContent.stats_items
        : [],
    });

    setAcademicsContent({
      ...defaultAcademicsContent,
      ...loadedAcademicsContent,
      programs: Array.isArray(loadedAcademicsContent.programs)
        ? loadedAcademicsContent.programs
        : [],
      curriculum_semesters: Array.isArray(loadedAcademicsContent.curriculum_semesters)
        ? loadedAcademicsContent.curriculum_semesters
        : [],
      facilities_items: Array.isArray(loadedAcademicsContent.facilities_items)
        ? loadedAcademicsContent.facilities_items
        : [],
    });

    setSpecializationsContent({
      ...defaultSpecializationsContent,
      ...loadedSpecializationsContent,
      specializations: Array.isArray(loadedSpecializationsContent.specializations)
        ? loadedSpecializationsContent.specializations
        : [],
      laboratory_rows: Array.isArray(loadedSpecializationsContent.laboratory_rows)
        ? loadedSpecializationsContent.laboratory_rows
        : [],
    });

    setContactContent({
      ...defaultContactContent,
      ...loadedContactContent,
      contact_info_cards: Array.isArray(loadedContactContent.contact_info_cards)
        ? loadedContactContent.contact_info_cards
        : [],
      form_categories: Array.isArray(loadedContactContent.form_categories)
        ? loadedContactContent.form_categories
        : [],
      key_contacts: Array.isArray(loadedContactContent.key_contacts)
        ? loadedContactContent.key_contacts
        : [],
      quick_links: Array.isArray(loadedContactContent.quick_links)
        ? loadedContactContent.quick_links
        : [],
      stay_connected_links: Array.isArray(loadedContactContent.stay_connected_links)
        ? loadedContactContent.stay_connected_links
        : [],
      footer_cards: Array.isArray(loadedContactContent.footer_cards)
        ? loadedContactContent.footer_cards
        : [],
    });

    setEventsContent({
      ...defaultEventsContent,
      ...loadedEventsContent,
      upcoming_events: Array.isArray(loadedEventsContent.upcoming_events)
        ? loadedEventsContent.upcoming_events
        : [],
      past_events: Array.isArray(loadedEventsContent.past_events)
        ? loadedEventsContent.past_events
        : [],
    });

    setNavigationItems(Array.isArray(data?.navigation) ? data.navigation : []);
    setSocialLinks(Array.isArray(data?.socialLinks) ? data.socialLinks : []);
    setFooterLinks(Array.isArray(data?.footerLinks) ? data.footerLinks : []);
    setSlides(Array.isArray(data?.slides) ? data.slides : []);
    setStats(Array.isArray(data?.stats) ? data.stats : []);

    setNewsItems(
      Array.isArray(data?.news)
        ? data.news.map((item) => ({
            ...item,
            publish_date: formatDateTimeLocal(item.publish_date),
          }))
        : []
    );

    setPeopleEntries(
      Array.isArray(data?.peopleEntries)
        ? data.peopleEntries.map(normalizePeopleEntryForUi)
        : []
    );

    await loadContactSubmissions();
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAdminPage = async () => {
      try {
        const sessionData = await fetchAdminSession();
        if (!isMounted) {
          return;
        }

        setAdminUser(sessionData.user || null);
        await loadContent();
      } catch (_error) {
        if (isMounted) {
          navigate('/admin/login', { replace: true });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAdminPage();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const runAction = async (action, message) => {
    clearMessages();
    setIsWorking(true);

    try {
      await action();
      await loadContent();
      setSuccessMessage(message);
      return true;
    } catch (actionError) {
      setError(actionError.message || 'Request failed.');
      return false;
    } finally {
      setIsWorking(false);
    }
  };

  const uploadImage = async (file, category, updater) => {
    if (!file) {
      return;
    }

    clearMessages();
    setIsWorking(true);

    try {
      const response = await uploadAdminImage(file, category);
      updater(response.relativeUrl || response.url);
      setSuccessMessage('Image uploaded successfully. Save to publish this image URL.');
    } catch (uploadError) {
      setError(uploadError.message || 'Image upload failed.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleLogout = async () => {
    clearMessages();
    setIsWorking(true);

    try {
      await adminLogout();
      navigate('/admin/login', { replace: true });
    } catch (logoutError) {
      setError(logoutError.message || 'Failed to logout.');
    } finally {
      setIsWorking(false);
    }
  };

  const saveSiteSettings = () => {
    const payload = {
      ...siteSettings,
      contact_address_lines: siteSettings.contact_address_lines_text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    };

    delete payload.contact_address_lines_text;
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    runAction(
      () => updateSiteSettings(payload),
      'Site settings updated successfully.'
    ).then((success) => {
      if (success) {
        setSiteSettingsEditMode(false);
        setSiteSettingsModalOpen(false);
        setSiteSettingsConfirmSave(false);
      }
    });
  };

  const saveHomeContent = () => {
    const payload = {
      ...homeContent,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    runAction(
      () => updateHomeContent(payload),
      'Home content updated successfully.'
    );
  };

  const saveAboutContent = async () => {
    const valuesItems = (Array.isArray(aboutContent.values_items) ? aboutContent.values_items : [])
      .map((item) => ({
        icon_name: item?.icon_name || 'Award',
        title: String(item?.title || '').trim(),
        description: String(item?.description || '').trim(),
      }))
      .filter((item) => item.title || item.description);

    if (valuesItems.some((item) => !item.title || !item.description)) {
      setError('Each core value item must include both title and description, or be removed.');
      return;
    }

    const milestones = (Array.isArray(aboutContent.milestones) ? aboutContent.milestones : [])
      .map((item) => ({
        year: String(item?.year || '').trim(),
        event: String(item?.event || '').trim(),
      }))
      .filter((item) => item.year || item.event);

    if (milestones.some((item) => !item.year || !item.event)) {
      setError('Each milestone must include both year and event, or be removed.');
      return;
    }

    const statsItems = (Array.isArray(aboutContent.stats_items) ? aboutContent.stats_items : [])
      .map((item) => ({
        label: String(item?.label || '').trim(),
        value: toInteger(item?.value, 0),
        suffix: String(item?.suffix || '').trim(),
      }))
      .filter((item) => item.label || item.value || item.suffix);

    if (statsItems.some((item) => !item.label)) {
      setError('Each stat item must include a label, or be removed.');
      return;
    }

    const payload = {
      ...aboutContent,
      values_items: valuesItems,
      milestones,
      stats_items: statsItems,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    const success = await runAction(
      () => updateAboutContent(payload),
      'About content updated successfully.'
    );

    if (success) {
      setAboutConfirmSave(false);
      setAboutEditMode(false);
    }
  };

  const addAboutListItem = (field, itemTemplate) => {
    setAboutContent((previous) => ({
      ...previous,
      [field]: [...(Array.isArray(previous[field]) ? previous[field] : []), { ...itemTemplate }],
    }));
  };

  const updateAboutListItem = (field, index, nextItem) => {
    setAboutContent((previous) => ({
      ...previous,
      [field]: (Array.isArray(previous[field]) ? previous[field] : []).map((item, currentIndex) =>
        currentIndex === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeAboutListItem = (field, index) => {
    setAboutContent((previous) => ({
      ...previous,
      [field]: (Array.isArray(previous[field]) ? previous[field] : []).filter(
        (_item, currentIndex) => currentIndex !== index
      ),
    }));
  };

  const parseMultilineList = (value) =>
    String(value || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

  const formatMultilineList = (list) =>
    (Array.isArray(list) ? list : []).map((item) => String(item || '').trim()).filter(Boolean).join('\n');

  const saveAcademicsContent = async () => {
    const programs = (Array.isArray(academicsContent.programs) ? academicsContent.programs : [])
      .map((program) => ({
        title: String(program?.title || '').trim(),
        link_url: String(program?.link_url || '').trim() || null,
        link_target: String(program?.link_target || '_blank').trim() || '_blank',
        duration: String(program?.duration || '').trim(),
        intake: String(program?.intake || '').trim() || null,
        description: String(program?.description || '').trim(),
        highlights: Array.isArray(program?.highlights)
          ? program.highlights.map((item) => String(item || '').trim()).filter(Boolean)
          : [],
        courses: Array.isArray(program?.courses)
          ? program.courses.map((item) => String(item || '').trim()).filter(Boolean)
          : [],
      }))
      .filter((program) => program.title || program.description);

    if (programs.some((program) => !program.title || !program.duration || !program.description)) {
      setError('Each program needs title, duration, and description, or remove the incomplete row.');
      return;
    }

    const curriculumSemesters = (
      Array.isArray(academicsContent.curriculum_semesters)
        ? academicsContent.curriculum_semesters
        : []
    )
      .map((semester) => ({
        semester_label: String(semester?.semester_label || '').trim(),
        courses: Array.isArray(semester?.courses)
          ? semester.courses.map((item) => String(item || '').trim()).filter(Boolean)
          : [],
      }))
      .filter((semester) => semester.semester_label || semester.courses.length > 0);

    if (curriculumSemesters.some((semester) => !semester.semester_label || semester.courses.length === 0)) {
      setError('Each curriculum semester needs a label and at least one course.');
      return;
    }

    const facilitiesItems = (Array.isArray(academicsContent.facilities_items)
      ? academicsContent.facilities_items
      : []
    )
      .map((item) => String(item || '').trim())
      .filter(Boolean);

    const payload = {
      ...academicsContent,
      programs,
      curriculum_semesters: curriculumSemesters,
      facilities_items: facilitiesItems,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    const success = await runAction(
      () => updateAcademicsContent(payload),
      'Academics content updated successfully.'
    );

    if (success) {
      setAcademicsConfirmSave(false);
      setAcademicsEditMode(false);
    }
  };

  const addAcademicsProgram = () => {
    setAcademicsContent((previous) => ({
      ...previous,
      programs: [...(Array.isArray(previous.programs) ? previous.programs : []), { ...defaultAcademicsProgram }],
    }));
  };

  const updateAcademicsProgram = (index, nextItem) => {
    setAcademicsContent((previous) => ({
      ...previous,
      programs: (Array.isArray(previous.programs) ? previous.programs : []).map((item, currentIndex) =>
        currentIndex === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeAcademicsProgram = (index) => {
    setAcademicsContent((previous) => ({
      ...previous,
      programs: (Array.isArray(previous.programs) ? previous.programs : []).filter(
        (_item, currentIndex) => currentIndex !== index
      ),
    }));
  };

  const addAcademicsSemester = () => {
    setAcademicsContent((previous) => ({
      ...previous,
      curriculum_semesters: [
        ...(Array.isArray(previous.curriculum_semesters) ? previous.curriculum_semesters : []),
        { ...defaultAcademicsSemester },
      ],
    }));
  };

  const updateAcademicsSemester = (index, nextItem) => {
    setAcademicsContent((previous) => ({
      ...previous,
      curriculum_semesters: (
        Array.isArray(previous.curriculum_semesters) ? previous.curriculum_semesters : []
      ).map((item, currentIndex) =>
        currentIndex === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeAcademicsSemester = (index) => {
    setAcademicsContent((previous) => ({
      ...previous,
      curriculum_semesters: (
        Array.isArray(previous.curriculum_semesters) ? previous.curriculum_semesters : []
      ).filter((_item, currentIndex) => currentIndex !== index),
    }));
  };

  // ============================================
  // NAVIGATION ITEMS HANDLERS
  // ============================================

  const openNavView = (item) => {
    setNavSelectedItem(item);
    setNavDraft({ ...item });
    setNavEditMode(false);
    setNavModalOpen(true);
  };

  const openNavCreate = () => {
    setNavSelectedItem(null);
    setNavDraft({ ...defaultNavigationItem, sort_order: navigationItems.length });
    setNavEditMode(true);
    setNavModalOpen(true);
  };

  const closeNavModal = () => {
    setNavModalOpen(false);
    setNavSelectedItem(null);
    setNavEditMode(false);
  };

  const saveNavigationItem = async () => {
    const payload = {
      label: navDraft.label,
      href: navDraft.href,
      sort_order: toInteger(navDraft.sort_order, 0),
      is_active: navDraft.is_active ? 1 : 0,
    };

    let success;
    if (navSelectedItem?.id) {
      success = await runAction(
        () => updateNavigationItem(navSelectedItem.id, payload),
        'Navigation item updated successfully.'
      );
    } else {
      success = await runAction(
        () => createNavigationItem(payload),
        'Navigation item created successfully.'
      );
    }

    if (success) {
      setNavConfirmSave(false);
      closeNavModal();
    }
  };

  const deleteNavigationItemHandler = async () => {
    if (!navSelectedItem?.id) return;
    
    const success = await runAction(
      () => deleteNavigationItemApi(navSelectedItem.id),
      'Navigation item deleted successfully.'
    );

    if (success) {
      setNavConfirmDelete(false);
      closeNavModal();
    }
  };

  // ============================================
  // SOCIAL LINKS HANDLERS
  // ============================================

  const openSocialView = (item) => {
    setSocialSelectedItem(item);
    setSocialDraft({ ...item });
    setSocialEditMode(false);
    setSocialModalOpen(true);
  };

  const openSocialCreate = () => {
    setSocialSelectedItem(null);
    setSocialDraft({ ...defaultSocialLink, sort_order: socialLinks.length });
    setSocialEditMode(true);
    setSocialModalOpen(true);
  };

  const closeSocialModal = () => {
    setSocialModalOpen(false);
    setSocialSelectedItem(null);
    setSocialEditMode(false);
  };

  const saveSocialLinkItem = async () => {
    const payload = {
      platform: socialDraft.platform,
      icon: socialDraft.icon,
      url: socialDraft.url,
      sort_order: toInteger(socialDraft.sort_order, 0),
      is_active: socialDraft.is_active ? 1 : 0,
    };

    let success;
    if (socialSelectedItem?.id) {
      success = await runAction(
        () => updateSocialLink(socialSelectedItem.id, payload),
        'Social link updated successfully.'
      );
    } else {
      success = await runAction(
        () => createSocialLink(payload),
        'Social link created successfully.'
      );
    }

    if (success) {
      setSocialConfirmSave(false);
      closeSocialModal();
    }
  };

  const deleteSocialLinkItem = async () => {
    if (!socialSelectedItem?.id) return;
    
    const success = await runAction(
      () => deleteSocialLink(socialSelectedItem.id),
      'Social link deleted successfully.'
    );

    if (success) {
      setSocialConfirmDelete(false);
      closeSocialModal();
    }
  };

  // ============================================
  // FOOTER LINKS HANDLERS
  // ============================================

  const openFooterView = (item) => {
    setFooterSelectedItem(item);
    setFooterDraft({ ...item });
    setFooterEditMode(false);
    setFooterModalOpen(true);
  };

  const openFooterCreate = () => {
    setFooterSelectedItem(null);
    setFooterDraft({ ...defaultFooterLink, sort_order: footerLinks.length });
    setFooterEditMode(true);
    setFooterModalOpen(true);
  };

  const closeFooterModal = () => {
    setFooterModalOpen(false);
    setFooterSelectedItem(null);
    setFooterEditMode(false);
  };

  const saveFooterLinkItem = async () => {
    const payload = {
      section: footerDraft.section,
      label: footerDraft.label,
      href: footerDraft.href,
      sort_order: toInteger(footerDraft.sort_order, 0),
      is_active: footerDraft.is_active ? 1 : 0,
    };

    let success;
    if (footerSelectedItem?.id) {
      success = await runAction(
        () => updateFooterLink(footerSelectedItem.id, payload),
        'Footer link updated successfully.'
      );
    } else {
      success = await runAction(
        () => createFooterLink(payload),
        'Footer link created successfully.'
      );
    }

    if (success) {
      setFooterConfirmSave(false);
      closeFooterModal();
    }
  };

  const deleteFooterLinkItem = async () => {
    if (!footerSelectedItem?.id) return;
    
    const success = await runAction(
      () => deleteFooterLink(footerSelectedItem.id),
      'Footer link deleted successfully.'
    );

    if (success) {
      setFooterConfirmDelete(false);
      closeFooterModal();
    }
  };

  // ============================================
  // HERO SLIDES HANDLERS
  // ============================================

  const openSlideView = (item) => {
    setSlideSelectedItem(item);
    setSlideDraft({ ...item });
    setSlideEditMode(false);
    setSlideModalOpen(true);
  };

  const openSlideCreate = () => {
    setSlideSelectedItem(null);
    setSlideDraft({ ...defaultSlide, sort_order: slides.length });
    setSlideEditMode(true);
    setSlideModalOpen(true);
  };

  const closeSlideModal = () => {
    setSlideModalOpen(false);
    setSlideSelectedItem(null);
    setSlideEditMode(false);
  };

  const saveSlideItem = async () => {
    const payload = {
      image_url: slideDraft.image_url,
      title: slideDraft.title,
      subtitle: slideDraft.subtitle,
      cta_text: slideDraft.cta_text,
      cta_link: slideDraft.cta_link,
      sort_order: toInteger(slideDraft.sort_order, 0),
      is_active: slideDraft.is_active ? 1 : 0,
    };

    let success;
    if (slideSelectedItem?.id) {
      success = await runAction(
        () => updateHeroSlide(slideSelectedItem.id, payload),
        'Hero slide updated successfully.'
      );
    } else {
      success = await runAction(
        () => createHeroSlide(payload),
        'Hero slide created successfully.'
      );
    }

    if (success) {
      setSlideConfirmSave(false);
      closeSlideModal();
    }
  };

  const deleteSlideItem = async () => {
    if (!slideSelectedItem?.id) return;
    
    const success = await runAction(
      () => deleteHeroSlide(slideSelectedItem.id),
      'Hero slide deleted successfully.'
    );

    if (success) {
      setSlideConfirmDelete(false);
      closeSlideModal();
    }
  };

  // ============================================
  // HOME STATS HANDLERS
  // ============================================

  const openStatView = (item) => {
    setStatSelectedItem(item);
    setStatDraft({ ...item });
    setStatEditMode(false);
    setStatModalOpen(true);
  };

  const openStatCreate = () => {
    setStatSelectedItem(null);
    setStatDraft({ ...defaultStat, sort_order: stats.length });
    setStatEditMode(true);
    setStatModalOpen(true);
  };

  const closeStatModal = () => {
    setStatModalOpen(false);
    setStatSelectedItem(null);
    setStatEditMode(false);
  };

  const saveStatItem = async () => {
    const payload = {
      label: statDraft.label,
      value: toInteger(statDraft.value, 0),
      suffix: statDraft.suffix,
      icon_name: statDraft.icon_name,
      sort_order: toInteger(statDraft.sort_order, 0),
      is_active: statDraft.is_active ? 1 : 0,
    };

    let success;
    if (statSelectedItem?.id) {
      success = await runAction(
        () => updateHomeStat(statSelectedItem.id, payload),
        'Home stat updated successfully.'
      );
    } else {
      success = await runAction(
        () => createHomeStat(payload),
        'Home stat created successfully.'
      );
    }

    if (success) {
      setStatConfirmSave(false);
      closeStatModal();
    }
  };

  const deleteStatItem = async () => {
    if (!statSelectedItem?.id) return;
    
    const success = await runAction(
      () => deleteHomeStat(statSelectedItem.id),
      'Home stat deleted successfully.'
    );

    if (success) {
      setStatConfirmDelete(false);
      closeStatModal();
    }
  };

  // ============================================
  // NEWS ITEMS HANDLERS
  // ============================================

  const openNewsView = (item) => {
    setNewsSelectedItem(item);
    setNewsDraft({ ...item, publish_date: formatDateTimeLocal(item?.publish_date) });
    setNewsEditMode(false);
    setNewsModalOpen(true);
  };

  const openNewsCreate = () => {
    setNewsSelectedItem(null);
    setNewsDraft({ ...defaultNewsItem, publish_date: formatDateTimeLocal(new Date()) });
    setNewsEditMode(true);
    setNewsModalOpen(true);
  };

  const closeNewsModal = () => {
    setNewsModalOpen(false);
    setNewsSelectedItem(null);
    setNewsEditMode(false);
    setNewsConfirmSave(false);
    setNewsConfirmDelete(false);
  };

  const getNewsValidationError = (draft) => {
    const title = String(draft?.title || '').trim();
    const excerpt = String(draft?.excerpt || '').trim();
    const imageUrl = String(draft?.image_url || '').trim();
    const publishDateIso = toIsoDateTime(draft?.publish_date);

    if (!title) {
      return 'News title is required.';
    }

    if (!excerpt) {
      return 'News excerpt is required.';
    }

    if (!publishDateIso) {
      return 'Please provide a valid publish date and time.';
    }

    if (!imageUrl) {
      return 'News image is required. Please upload an image or add an image URL.';
    }

    return '';
  };

  const newsDraftValidationError = getNewsValidationError(newsDraft);

  const saveNewsItemEntry = async () => {
    setNewsConfirmSave(false);

    const validationError = getNewsValidationError(newsDraft);
    if (validationError) {
      setError(validationError);
      setSuccessMessage('');
      return;
    }

    const title = String(newsDraft.title || '').trim();
    const excerpt = String(newsDraft.excerpt || '').trim();
    const category = String(newsDraft.category || 'News').trim() || 'News';
    const publishDateIso = toIsoDateTime(newsDraft.publish_date);

    const payload = {
      title,
      excerpt,
      category,
      image_url: toNullableString(newsDraft.image_url),
      external_link: toNullableString(newsDraft.external_link),
      publish_date: publishDateIso,
      is_active: newsDraft.is_active ? 1 : 0,
    };

    let success;
    if (newsSelectedItem?.id) {
      success = await runAction(
        () => updateNewsItem(newsSelectedItem.id, payload),
        'News item updated successfully.'
      );
    } else {
      success = await runAction(
        () => createNewsItem(payload),
        'News item created successfully.'
      );
    }

    if (success) {
      setNewsConfirmSave(false);
      closeNewsModal();
    }
  };

  const deleteNewsItemEntry = async () => {
    if (!newsSelectedItem?.id) return;
    
    const success = await runAction(
      () => deleteNewsItem(newsSelectedItem.id),
      'News item deleted successfully.'
    );

    if (success) {
      setNewsConfirmDelete(false);
      closeNewsModal();
    }
  };

  // ============================================
  // PEOPLE DIRECTORY HANDLERS
  // ============================================

  const openPeopleView = (item) => {
    const normalized = normalizePeopleEntryForUi(item);
    setPeopleSelectedItem(normalized);
    setPeopleDraft(toPeopleDraft(normalized));
    setPeopleProgramMode(getProgramEntryMode(normalized));
    setProgramStudentModalOpen(false);
    setProgramStudentSelectedItem(null);
    setProgramStudentDraft(defaultProgramStudentDraft);
    setPeopleEditMode(false);
    setPeopleModalOpen(true);
  };

  const openPeopleCreate = () => {
    const mainEntries = peopleEntries.filter((entry) => !isProgramStudentEntry(entry));

    setPeopleSelectedItem(null);
    setPeopleDraft({ ...defaultPeopleEntry, sort_order: mainEntries.length });
    setPeopleProgramMode('resource');
    setProgramStudentModalOpen(false);
    setProgramStudentSelectedItem(null);
    setProgramStudentDraft(defaultProgramStudentDraft);
    setPeopleEditMode(true);
    setPeopleModalOpen(true);
  };

  const getProgramStudentsForEntry = (entry) => {
    if (!isProgramYearEntry(entry)) {
      return [];
    }

    const category = String(entry.category || '').toLowerCase();
    const yearLabel = normalizeBatchLabel(entry.year_label).toLowerCase();

    return peopleEntries
      .filter((item) => {
        if (!isProgramStudentEntry(item)) {
          return false;
        }

        return (
          String(item.category || '').toLowerCase() === category &&
          normalizeBatchLabel(item.year_label).toLowerCase() === yearLabel
        );
      })
      .sort((left, right) => {
        const sortDiff = toInteger(left.sort_order, 0) - toInteger(right.sort_order, 0);
        if (sortDiff !== 0) {
          return sortDiff;
        }

        return String(left.name || '').localeCompare(String(right.name || ''));
      });
  };

  const getNextProgramStudentSortOrder = (entry) => {
    const studentRows = getProgramStudentsForEntry(entry);
    if (studentRows.length === 0) {
      return 0;
    }

    return Math.max(...studentRows.map((student) => toInteger(student.sort_order, 0))) + 1;
  };

  const closePeopleModal = () => {
    setPeopleModalOpen(false);
    setPeopleSelectedItem(null);
    setPeopleEditMode(false);
    setPeopleConfirmSave(false);
    setPeopleConfirmDelete(false);
    setProgramStudentModalOpen(false);
    setProgramStudentSelectedItem(null);
    setProgramStudentDraft(defaultProgramStudentDraft);
    setProgramStudentConfirmDelete(false);
    setProgramStudentCsvInputKey((prev) => prev + 1);
  };

  const savePeopleEntry = async () => {
    const category = String(peopleDraft.category || '').trim();

    if (!category) {
      setError('Please select a people category.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      category,
      name: toNullableString(peopleDraft.name),
      designation: toNullableString(peopleDraft.designation),
      specialization: toNullableString(peopleDraft.specialization),
      department: toNullableString(peopleDraft.department),
      year_label: toNullableString(peopleDraft.year_label),
      email: toNullableString(peopleDraft.email),
      phone: toNullableString(peopleDraft.phone),
      room: toNullableString(peopleDraft.room),
      profile_url: toNullableString(peopleDraft.profile_url),
      image_url: toNullableString(peopleDraft.image_url),
      resource_link: toNullableString(peopleDraft.resource_link),
      research_interests: toStringArrayFromText(peopleDraft.research_interests_text),
      responsibilities: toStringArrayFromText(peopleDraft.responsibilities_text),
      sort_order: toInteger(peopleDraft.sort_order, 0),
      is_active: peopleDraft.is_active ? 1 : 0,
    };

    const isProgram = isProgramCategory(category);

    if (isProgram) {
      const normalizedYear = normalizeBatchLabel(peopleDraft.year_label);

      if (!normalizedYear) {
        setError('Year/Batch label is required for M.Tech and B.Tech entries.');
        setSuccessMessage('');
        return;
      }

      const duplicateYearEntry = peopleEntries.find((entry) =>
        isProgramYearEntry(entry) &&
        String(entry.category || '').toLowerCase() === category.toLowerCase() &&
        normalizeBatchLabel(entry.year_label).toLowerCase() === normalizedYear.toLowerCase() &&
        Number(entry.id) !== Number(peopleSelectedItem?.id)
      );

      if (duplicateYearEntry) {
        setError('A batch entry for this year already exists in the selected category.');
        setSuccessMessage('');
        return;
      }

      payload.name = null;
      payload.designation = null;
      payload.specialization = null;
      payload.image_url = null;
      payload.department = null;
      payload.email = null;
      payload.phone = null;
      payload.room = null;
      payload.profile_url = null;
      payload.research_interests = [];
      payload.responsibilities = [];
      payload.year_label = normalizedYear;
      payload.resource_link = peopleProgramMode === 'resource'
        ? toNullableString(peopleDraft.resource_link)
        : null;

      if (peopleProgramMode === 'resource' && !payload.resource_link) {
        setError('Resource link is required for "Upload list" mode.');
        setSuccessMessage('');
        return;
      }
    } else if (!payload.name) {
      setError('Name is required for this category.');
      setSuccessMessage('');
      return;
    }

    if (category === 'phd') {
      payload.designation = null;
      payload.specialization = null;
      payload.department = null;
      payload.year_label = null;
      payload.resource_link = null;
      payload.room = null;
      payload.profile_url = null;
      payload.research_interests = [];
      payload.responsibilities = [];
    }

    if (category === 'staff') {
      payload.specialization = null;
      payload.year_label = null;
      payload.resource_link = null;
      payload.research_interests = [];
    }

    if (category === 'faculty') {
      payload.department = null;
      payload.year_label = null;
      payload.resource_link = null;
      payload.responsibilities = [];
    }

    let success;
    if (peopleSelectedItem?.id) {
      success = await runAction(
        () => updatePeopleEntry(peopleSelectedItem.id, payload),
        'People entry updated successfully.'
      );
    } else {
      success = await runAction(
        () => createPeopleEntry(payload),
        'People entry created successfully.'
      );
    }

    if (success) {
      setPeopleConfirmSave(false);
      closePeopleModal();
    }
  };

  const deletePeopleEntryItem = async () => {
    if (!peopleSelectedItem?.id) return;

    const selectedProgramStudents = getProgramStudentsForEntry(peopleSelectedItem);
    
    const success = await runAction(
      async () => {
        if (isProgramYearEntry(peopleSelectedItem)) {
          for (const student of selectedProgramStudents) {
            await deletePeopleEntry(student.id);
          }
        }

        await deletePeopleEntry(peopleSelectedItem.id);
      },
      isProgramYearEntry(peopleSelectedItem) && selectedProgramStudents.length > 0
        ? `Batch and ${selectedProgramStudents.length} linked students deleted successfully.`
        : 'People entry deleted successfully.'
    );

    if (success) {
      setPeopleConfirmDelete(false);
      closePeopleModal();
    }
  };

  const openProgramStudentCreate = () => {
    if (!isProgramYearEntry(peopleSelectedItem)) {
      return;
    }

    setProgramStudentSelectedItem(null);
    setProgramStudentDraft({
      ...defaultProgramStudentDraft,
      sort_order: getNextProgramStudentSortOrder(peopleSelectedItem),
    });
    setProgramStudentModalOpen(true);
  };

  const openProgramStudentEdit = (student) => {
    setProgramStudentSelectedItem(student);
    setProgramStudentDraft({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      image_url: student.image_url || '',
      sort_order: toInteger(student.sort_order, 0),
      is_active: student.is_active ? 1 : 0,
    });
    setProgramStudentModalOpen(true);
  };

  const closeProgramStudentModal = () => {
    setProgramStudentModalOpen(false);
    setProgramStudentSelectedItem(null);
    setProgramStudentDraft(defaultProgramStudentDraft);
  };

  const saveProgramStudentEntry = async () => {
    if (!isProgramYearEntry(peopleSelectedItem)) {
      setError('Select a valid M.Tech/B.Tech batch first.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      category: peopleSelectedItem.category,
      year_label: normalizeBatchLabel(peopleSelectedItem.year_label),
      name: toNullableString(programStudentDraft.name),
      designation: null,
      specialization: null,
      department: null,
      email: toNullableString(programStudentDraft.email),
      phone: toNullableString(programStudentDraft.phone),
      room: null,
      profile_url: null,
      image_url: toNullableString(programStudentDraft.image_url),
      resource_link: null,
      research_interests: [],
      responsibilities: [],
      sort_order: toInteger(programStudentDraft.sort_order, 0),
      is_active: programStudentDraft.is_active ? 1 : 0,
    };

    if (!payload.name) {
      setError('Student name is required.');
      setSuccessMessage('');
      return;
    }

    let success;
    if (programStudentSelectedItem?.id) {
      success = await runAction(
        () => updatePeopleEntry(programStudentSelectedItem.id, payload),
        'Student entry updated successfully.'
      );
    } else {
      success = await runAction(
        () => createPeopleEntry(payload),
        'Student entry created successfully.'
      );
    }

    if (success) {
      closeProgramStudentModal();
    }
  };

  const deleteProgramStudentEntry = async () => {
    if (!programStudentSelectedItem?.id) {
      return;
    }

    const success = await runAction(
      () => deletePeopleEntry(programStudentSelectedItem.id),
      'Student entry deleted successfully.'
    );

    if (success) {
      setProgramStudentConfirmDelete(false);
      closeProgramStudentModal();
    }
  };

  const importProgramStudentsFromCsv = async (file) => {
    if (!file) {
      return;
    }

    if (!isProgramYearEntry(peopleSelectedItem)) {
      setError('Open an M.Tech/B.Tech batch entry to import students.');
      setSuccessMessage('');
      return;
    }

    try {
      const csvText = await file.text();
      const rows = parseCsvText(csvText);

      if (rows.length === 0) {
        setError('CSV is empty or invalid. Add header row and at least one student row.');
        setSuccessMessage('');
        return;
      }

      const existingStudents = getProgramStudentsForEntry(peopleSelectedItem);
      let nextSortOrder = existingStudents.length > 0
        ? Math.max(...existingStudents.map((student) => toInteger(student.sort_order, 0))) + 1
        : 0;

      const payloads = rows
        .map((row) => {
          const name = toNullableString(row.name || row.student_name || row.full_name);

          if (!name) {
            return null;
          }

          const explicitSortOrder = toNullableString(row.sort_order);
          const resolvedSortOrder = explicitSortOrder != null
            ? toInteger(explicitSortOrder, nextSortOrder)
            : nextSortOrder;

          nextSortOrder = resolvedSortOrder + 1;

          return {
            category: peopleSelectedItem.category,
            year_label: normalizeBatchLabel(peopleSelectedItem.year_label),
            name,
            designation: null,
            specialization: null,
            department: null,
            email: toNullableString(row.email),
            phone: toNullableString(row.phone),
            room: null,
            profile_url: null,
            image_url: null,
            resource_link: null,
            research_interests: [],
            responsibilities: [],
            sort_order: resolvedSortOrder,
            is_active: parseBooleanFlag(row.is_active, 1),
          };
        })
        .filter(Boolean);

      if (payloads.length === 0) {
        setError('No valid student rows found. Ensure CSV has at least a name column.');
        setSuccessMessage('');
        return;
      }

      const success = await runAction(
        async () => {
          for (const payload of payloads) {
            await createPeopleEntry(payload);
          }
        },
        `${payloads.length} students imported successfully.`
      );

      if (success) {
        setProgramStudentCsvInputKey((prev) => prev + 1);
      }
    } catch (csvError) {
      setError(csvError.message || 'Failed to import CSV file.');
      setSuccessMessage('');
    }
  };

  // Get filtered people entries
  const mainPeopleEntries = peopleEntries.filter((entry) => !isProgramStudentEntry(entry));
  const filteredPeopleEntries = peopleFilterCategory === 'all' 
    ? mainPeopleEntries 
    : mainPeopleEntries.filter(p => p.category === peopleFilterCategory);

  const selectedProgramStudents = getProgramStudentsForEntry(peopleSelectedItem);
  const selectedPeopleIsProgramBatch = isProgramYearEntry(peopleSelectedItem);
  const selectedPeopleProgramMode = getProgramEntryMode(peopleSelectedItem);
  const draftPeopleIsProgram = isProgramCategory(peopleDraft.category);

  // ============================================
  // CONTACT CONTENT HANDLERS
  // ============================================

  const saveContactContentHandler = async () => {
    const contactInfoCards = (Array.isArray(contactContent.contact_info_cards) ? contactContent.contact_info_cards : [])
      .map((card) => ({
        icon_name: card?.icon_name || 'MapPin',
        title: String(card?.title || '').trim(),
        details: Array.isArray(card?.details) ? card.details.map(d => String(d || '').trim()).filter(Boolean) : [],
      }))
      .filter((card) => card.title || card.details.length > 0);

    if (contactInfoCards.some((card) => !card.title || card.details.length === 0)) {
      setError('Each contact info card needs title and at least one detail line.');
      setSuccessMessage('');
      return;
    }

    const formCategories = (Array.isArray(contactContent.form_categories) ? contactContent.form_categories : [])
      .map((cat) => String(cat || '').trim())
      .filter(Boolean);

    const keyContacts = (Array.isArray(contactContent.key_contacts) ? contactContent.key_contacts : [])
      .map((contact) => ({
        name: String(contact?.name || '').trim(),
        designation: String(contact?.designation || '').trim(),
        email: String(contact?.email || '').trim(),
        phone: String(contact?.phone || '').trim(),
        office: String(contact?.office || '').trim(),
      }))
      .filter((contact) => contact.name || contact.designation || contact.email || contact.phone || contact.office);

    if (
      keyContacts.some(
        (contact) =>
          !contact.name ||
          !contact.designation ||
          !contact.email ||
          !contact.phone ||
          !contact.office,
      )
    ) {
      setError('Each key contact needs name, designation, email, phone, and office.');
      setSuccessMessage('');
      return;
    }

    const quickLinks = (Array.isArray(contactContent.quick_links) ? contactContent.quick_links : [])
      .map((link) => ({
        title: String(link?.title || '').trim(),
        description: String(link?.description || '').trim(),
        url: toNullableString(link?.url),
      }))
      .filter((link) => link.title || link.description || link.url);

    if (quickLinks.some((link) => !link.title || !link.description)) {
      setError('Each quick link needs title and description.');
      setSuccessMessage('');
      return;
    }

    const stayConnectedLinks = (Array.isArray(contactContent.stay_connected_links) ? contactContent.stay_connected_links : [])
      .map((link) => ({
        icon_name: link?.icon_name || 'Globe',
        label: String(link?.label || '').trim(),
        url: toNullableString(link?.url),
      }))
      .filter((link) => link.label || link.url);

    if (stayConnectedLinks.some((link) => !link.label)) {
      setError('Each stay connected link needs a label.');
      setSuccessMessage('');
      return;
    }

    const footerCards = (Array.isArray(contactContent.footer_cards) ? contactContent.footer_cards : [])
      .map((card) => ({
        title: String(card?.title || '').trim(),
        description: String(card?.description || '').trim(),
      }))
      .filter((card) => card.title || card.description);

    if (footerCards.some((card) => !card.title || !card.description)) {
      setError('Each footer card needs title and description.');
      setSuccessMessage('');
      return;
    }

    const mapEmbedUrl = String(contactContent.map_embed_url || '').trim();
    if (!mapEmbedUrl) {
      setError('Map embed URL is required.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      ...contactContent,
      contact_info_cards: contactInfoCards,
      form_categories: formCategories,
      key_contacts: keyContacts,
      quick_links: quickLinks,
      stay_connected_links: stayConnectedLinks,
      footer_cards: footerCards,
      map_embed_url: mapEmbedUrl,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    const success = await runAction(
      () => updateContactContent(payload),
      'Contact content updated successfully.'
    );

    if (success) {
      setContactConfirmSave(false);
      setContactEditMode(false);
    }
  };

  const addContactListItem = (field, itemTemplate) => {
    setContactContent((prev) => ({
      ...prev,
      [field]: [...(Array.isArray(prev[field]) ? prev[field] : []), { ...itemTemplate }],
    }));
  };

  const updateContactListItem = (field, index, nextItem) => {
    setContactContent((prev) => ({
      ...prev,
      [field]: (Array.isArray(prev[field]) ? prev[field] : []).map((item, i) =>
        i === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeContactListItem = (field, index) => {
    setContactContent((prev) => ({
      ...prev,
      [field]: (Array.isArray(prev[field]) ? prev[field] : []).filter((_, i) => i !== index),
    }));
  };

  const openContactSubmissionModal = (item) => {
    setContactSubmissionSelectedItem(item);
    setContactSubmissionModalOpen(true);
  };

  const closeContactSubmissionModal = () => {
    setContactSubmissionModalOpen(false);
    setContactSubmissionSelectedItem(null);
  };

  // ============================================
  // EVENTS CONTENT HANDLERS
  // ============================================

  const saveEventsContentHandler = async () => {
    const upcomingEvents = (Array.isArray(eventsContent.upcoming_events) ? eventsContent.upcoming_events : [])
      .map((event) => ({
        date: String(event?.date || '').trim(),
        title: String(event?.title || '').trim(),
        description: String(event?.description || '').trim(),
        time: toNullableString(event?.time),
        venue: toNullableString(event?.venue),
        category: String(event?.category || 'Seminar').trim(),
        image_url: toNullableString(event?.image_url),
        registration_link: toNullableString(event?.registration_link),
      }))
      .filter((event) => event.date || event.title || event.description);

    const pastEvents = (Array.isArray(eventsContent.past_events) ? eventsContent.past_events : [])
      .map((event) => ({
        date: String(event?.date || '').trim(),
        title: String(event?.title || '').trim(),
        description: String(event?.description || '').trim(),
        time: toNullableString(event?.time),
        venue: toNullableString(event?.venue),
        category: String(event?.category || 'Seminar').trim(),
        image_url: toNullableString(event?.image_url),
        registration_link: toNullableString(event?.registration_link),
      }))
      .filter((event) => event.date || event.title || event.description);

    if (
      [...upcomingEvents, ...pastEvents].some(
        (event) => !event.date || !event.title || !event.description,
      )
    ) {
      setError('Each event requires date, title, and description, or remove the incomplete row.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      ...eventsContent,
      upcoming_events: upcomingEvents,
      past_events: pastEvents,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    const success = await runAction(
      () => updateEventsContent(payload),
      'Events content updated successfully.'
    );

    if (success) {
      setEventsConfirmSave(false);
      setEventsEditMode(false);
    }
  };

  const addEventItem = (field) => {
    setEventsContent((prev) => ({
      ...prev,
      [field]: [...(Array.isArray(prev[field]) ? prev[field] : []), { ...defaultEventsItem }],
    }));
  };

  const updateEventItem = (field, index, nextItem) => {
    setEventsContent((prev) => ({
      ...prev,
      [field]: (Array.isArray(prev[field]) ? prev[field] : []).map((item, i) =>
        i === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeEventItem = (field, index) => {
    setEventsContent((prev) => ({
      ...prev,
      [field]: (Array.isArray(prev[field]) ? prev[field] : []).filter((_, i) => i !== index),
    }));
  };

  const getEventTableRows = (field) =>
    (Array.isArray(eventsContent[field]) ? eventsContent[field] : []).map((event, index) => ({
      ...event,
      __rowIndex: index,
      __rowId: `${field}-${index}`,
    }));

  const eventTableColumns = [
    {
      key: 'title',
      label: 'Title',
      render: (value) => (
        <span className="font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => value || '-',
    },
    {
      key: 'venue',
      label: 'Venue',
      render: (value) => value || '-',
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', color: isDark ? '#93c5fd' : '#1d4ed8' }}>
          {value || 'General'}
        </span>
      ),
    },
    {
      key: 'image_url',
      label: 'Image',
      render: (value) =>
        value ? (
          <img
            src={resolveMediaUrl(value)}
            alt=""
            className="h-10 w-16 object-cover rounded"
            style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
          />
        ) : (
          '-'
        ),
    },
  ];

  const saveEventRowItem = async (field, draft) => {
    const rowIndex = toInteger(draft?.__rowIndex, -1);

    if (rowIndex < 0) {
      return false;
    }

    const nextEvent = {
      ...defaultEventsItem,
      date: draft?.date || '',
      title: draft?.title || '',
      description: draft?.description || '',
      time: draft?.time || '',
      venue: draft?.venue || '',
      category: draft?.category || 'Seminar',
      image_url: draft?.image_url || '',
      registration_link: draft?.registration_link || '',
    };

    updateEventItem(field, rowIndex, nextEvent);
    return true;
  };

  const deleteEventRowItem = async (field, row) => {
    const rowIndex = toInteger(row?.__rowIndex, -1);

    if (rowIndex < 0) {
      return false;
    }

    removeEventItem(field, rowIndex);
    return true;
  };

  const renderEventViewContent = (event) => (
    <div className="space-y-4">
      {event?.image_url && (
        <img
          src={resolveMediaUrl(event.image_url)}
          alt={event?.title || 'Event image'}
          className="w-full h-52 object-cover rounded-lg"
          style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
        />
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Title</p>
          <p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{event?.title || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Date</p>
          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{event?.date || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Time</p>
          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{event?.time || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Venue</p>
          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{event?.venue || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</p>
          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{event?.category || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Registration Link</p>
          {event?.registration_link ? (
            <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>
              {event.registration_link}
            </a>
          ) : (
            <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>-</p>
          )}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Description</p>
        <p className="text-sm whitespace-pre-wrap" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{event?.description || '-'}</p>
      </div>
    </div>
  );

  const renderEventEditContent = (field, draft, updateDraft) => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <AdminInput label="Title" value={draft?.title || ''} onChange={(e) => updateDraft('title', e.target.value)} placeholder="Event title" />
        <AdminInput label="Date" value={draft?.date || ''} onChange={(e) => updateDraft('date', e.target.value)} placeholder="e.g., 2024-06-15" />
        <AdminInput label="Time" value={draft?.time || ''} onChange={(e) => updateDraft('time', e.target.value)} placeholder="e.g., 10:30 AM" />
        <AdminInput label="Venue" value={draft?.venue || ''} onChange={(e) => updateDraft('venue', e.target.value)} placeholder="Event venue" />
        <AdminInput label="Category" value={draft?.category || ''} onChange={(e) => updateDraft('category', e.target.value)} placeholder="Seminar" />
        <AdminInput label="Registration Link" value={draft?.registration_link || ''} onChange={(e) => updateDraft('registration_link', e.target.value)} placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <AdminInput label="Event Image URL" value={draft?.image_url || ''} onChange={(e) => updateDraft('image_url', e.target.value)} placeholder="Image URL" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files?.[0], 'events', (url) => updateDraft('image_url', url))}
          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
          style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
        />
        {draft?.image_url && (
          <img
            src={resolveMediaUrl(draft.image_url)}
            alt="Preview"
            className="h-28 w-auto rounded-lg"
            style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
          />
        )}
      </div>

      <AdminTextarea label="Description" value={draft?.description || ''} onChange={(e) => updateDraft('description', e.target.value)} placeholder="Event description" rows={4} />

      {field === 'past_events' && (
        <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          Tip: upload event photos for better past-events cards on the public page.
        </p>
      )}
    </div>
  );

  // ============================================
  // SPECIALIZATIONS CONTENT HANDLERS
  // ============================================

  const saveSpecializationsContentHandler = async () => {
    const specializations = (Array.isArray(specializationsContent.specializations) ? specializationsContent.specializations : [])
      .map((spec) => ({
        key: String(spec?.key || '').trim(),
        title: String(spec?.title || '').trim(),
        description: String(spec?.description || '').trim(),
        color: spec?.color || 'blue',
        icon_name: spec?.icon_name || 'Building',
        image_url: String(spec?.image_url || '').trim(),
        faculty: Array.isArray(spec?.faculty) ? spec.faculty.map(f => ({
          name: String(f?.name || '').trim(),
          url: toNullableString(f?.url),
        })).filter(f => f.name) : [],
        labs: Array.isArray(spec?.labs) ? spec.labs.map(l => ({
          name: String(l?.name || '').trim(),
          equipments: Array.isArray(l?.equipments) ? l.equipments.map(e => ({
            name: String(e?.name || '').trim(),
            image_url: toNullableString(e?.image_url),
          })).filter(e => e.name) : [],
        })).filter(l => l.name) : [],
      }))
      .filter((spec) => spec.key || spec.title || spec.description);

    if (
      specializations.some(
        (spec) =>
          !spec.key ||
          !spec.title ||
          !spec.description ||
          !spec.color ||
          !spec.icon_name ||
          !spec.image_url,
      )
    ) {
      setError('Each specialization needs key, title, description, color, icon, and image URL, or remove the incomplete row.');
      setSuccessMessage('');
      return;
    }

    if (
      specializations.some((spec) =>
        spec.labs.some((lab) => !lab.name || lab.equipments.some((equipment) => !equipment.name)),
      )
    ) {
      setError('Each lab needs a name and each listed equipment needs a name.');
      setSuccessMessage('');
      return;
    }

    const laboratoryRows = (Array.isArray(specializationsContent.laboratory_rows) ? specializationsContent.laboratory_rows : [])
      .map((row) => ({
        name: String(row?.name || '').trim(),
        location: String(row?.location || '').trim(),
      }))
      .filter((row) => row.name || row.location);

    if (laboratoryRows.some((row) => !row.name || !row.location)) {
      setError('Each laboratory row needs both name and location, or remove the incomplete row.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      ...specializationsContent,
      specializations,
      laboratory_rows: laboratoryRows,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;

    const success = await runAction(
      () => updateSpecializationsContent(payload),
      'Specializations content updated successfully.'
    );

    if (success) {
      setSpecializationsConfirmSave(false);
      setSpecializationsEditMode(false);
    }
  };

  const addSpecialization = () => {
    setSpecializationsContent((prev) => ({
      ...prev,
      specializations: [...(Array.isArray(prev.specializations) ? prev.specializations : []), { ...defaultSpecializationItem }],
    }));
  };

  const updateSpecialization = (index, nextItem) => {
    setSpecializationsContent((prev) => ({
      ...prev,
      specializations: (Array.isArray(prev.specializations) ? prev.specializations : []).map((item, i) =>
        i === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeSpecialization = (index) => {
    setSpecializationsContent((prev) => ({
      ...prev,
      specializations: (Array.isArray(prev.specializations) ? prev.specializations : []).filter((_, i) => i !== index),
    }));
  };

  const addLabRow = () => {
    setSpecializationsContent((prev) => ({
      ...prev,
      laboratory_rows: [...(Array.isArray(prev.laboratory_rows) ? prev.laboratory_rows : []), { ...defaultSpecializationRow }],
    }));
  };

  const updateLabRow = (index, nextItem) => {
    setSpecializationsContent((prev) => ({
      ...prev,
      laboratory_rows: (Array.isArray(prev.laboratory_rows) ? prev.laboratory_rows : []).map((item, i) =>
        i === index ? { ...item, ...nextItem } : item
      ),
    }));
  };

  const removeLabRow = (index) => {
    setSpecializationsContent((prev) => ({
      ...prev,
      laboratory_rows: (Array.isArray(prev.laboratory_rows) ? prev.laboratory_rows : []).filter((_, i) => i !== index),
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: isDark ? '#111827' : '#f8fafc'
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p style={{ color: isDark ? '#9ca3af' : '#4b5563' }} className="text-sm font-medium">
            Loading admin content...
          </p>
        </div>
      </div>
    );
  }

  // Site Settings Table Data
  const siteSettingsTableData = [
    { key: 'site_name', label: 'Site Name', value: siteSettings.site_name, type: 'text' },
    { key: 'department_name', label: 'Department Name', value: siteSettings.department_name, type: 'text' },
    { key: 'logo_url', label: 'Logo URL', value: siteSettings.logo_url, type: 'image' },
    { key: 'navbar_title', label: 'Navbar Title', value: siteSettings.navbar_title, type: 'text' },
    { key: 'navbar_subtitle', label: 'Navbar Subtitle', value: siteSettings.navbar_subtitle, type: 'text' },
    { key: 'footer_description', label: 'Footer Description', value: siteSettings.footer_description, type: 'textarea' },
    { key: 'contact_address_lines_text', label: 'Contact Address', value: siteSettings.contact_address_lines_text, type: 'textarea' },
    { key: 'contact_phone', label: 'Contact Phone', value: siteSettings.contact_phone, type: 'text' },
    { key: 'contact_email', label: 'Contact Email', value: siteSettings.contact_email, type: 'text' },
    { key: 'map_embed_url', label: 'Map Embed URL', value: siteSettings.map_embed_url, type: 'text' },
    { key: 'copyright_text', label: 'Copyright Text', value: siteSettings.copyright_text, type: 'text' },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: isDark ? '#111827' : '#f8fafc'
      }}
    >
      {/* Header - Fixed at top */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg"
        style={{
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          height: '64px'
        }}
      >
        <div className="h-full px-6">
          <div className="flex items-center justify-between h-full">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg"
                style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
            {/* Logo */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2563eb' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="hidden sm:block">
                    <h1 
                      className="text-lg font-bold"
                      style={{ color: isDark ? '#ffffff' : '#111827' }}
                    >
                      Admin Panel
                    </h1>
                    <p 
                      className="text-xs"
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      Content Management
                    </p>
                  </div>
                </div>
              </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl"
                style={{
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  color: isDark ? '#9ca3af' : '#4b5563'
                }}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* User info */}
              <div 
                className="hidden sm:flex items-center gap-3 pl-3"
                style={{ borderLeft: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#2563eb' }}>
                  {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span 
                  className="text-sm font-medium"
                  style={{ color: isDark ? '#d1d5db' : '#374151' }}
                >
                  {adminUser?.username || 'Admin'}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                disabled={isWorking}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: isDark ? '#374151' : '#111827' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main container with sidebar and content */}
      <div className="flex flex-1" style={{ marginTop: '64px' }}>
        {/* Sidebar Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed on left */}
        <aside
          className={`
            fixed lg:fixed top-16 left-0 bottom-0 z-40
            w-64 overflow-y-auto
            transform lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderRight: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
          }}
        >
          {/* Mobile close button */}
          <div 
            className="lg:hidden flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
          >
            <span 
              className="font-semibold text-sm"
              style={{ color: isDark ? '#ffffff' : '#111827' }}
            >
              Menu
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-3 space-y-4">
            {adminSectionGroups.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <span style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>{group.icon}</span>
                  <span 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                  >
                    {group.label}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {group.sections.map((section) => {
                    const isActive = activeSection === section.key;
                    return (
                      <button
                        key={section.key}
                        onClick={() => {
                          clearMessages();
                          setActiveSection(section.key);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: isActive 
                            ? '#2563eb' 
                            : 'transparent',
                          color: isActive 
                            ? '#ffffff' 
                            : (isDark ? '#9ca3af' : '#4b5563'),
                        }}
                      >
                        <SectionIcon name={section.icon} className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content - Takes remaining space */}
        <main 
          className="flex-1 lg:ml-64 min-w-0 p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 64px)' }}
        >
          <div className="space-y-6">
            {/* Messages */}
            {error && (
              <div 
                className="flex items-center gap-3 p-4 rounded-xl animate-slideDown"
                style={{
                  backgroundColor: isDark ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2',
                  border: `1px solid ${isDark ? 'rgba(127, 29, 29, 0.5)' : '#fecaca'}`,
                  color: isDark ? '#f87171' : '#dc2626'
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
                <button 
                  onClick={() => setError('')} 
                  className="ml-auto p-1 rounded"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(127, 29, 29, 0.3)' : '#fee2e2'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {successMessage && (
              <div 
                className="flex items-center gap-3 p-4 rounded-xl animate-slideDown"
                style={{
                  backgroundColor: isDark ? 'rgba(6, 78, 59, 0.2)' : '#f0fdf4',
                  border: `1px solid ${isDark ? 'rgba(6, 78, 59, 0.5)' : '#bbf7d0'}`,
                  color: isDark ? '#4ade80' : '#16a34a'
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{successMessage}</span>
                <button 
                  onClick={() => setSuccessMessage('')} 
                  className="ml-auto p-1 rounded"
                  style={{
                    backgroundColor: isDark ? 'rgba(6, 78, 59, 0.3)' : '#dcfce7'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Mobile section selector */}
            <div className="lg:hidden mb-6">
              <select
                value={activeSection}
                onChange={(e) => {
                  clearMessages();
                  setActiveSection(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{
                  backgroundColor: isDark ? '#374151' : '#f9fafb',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  color: isDark ? '#ffffff' : '#111827'
                }}
              >
                {adminSectionGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.sections.map((section) => (
                      <option key={section.key} value={section.key}>
                        {section.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Site Settings Section */}
            {activeSection === 'site-settings' && (
              <AdminCard
                title="Site Settings"
                subtitle="View and manage site-wide configuration"
                actions={
                  <AdminButton
                    variant="primary"
                    onClick={() => setSiteSettingsEditMode(true)}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  >
                    Edit Settings
                  </AdminButton>
                }
                noPadding
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                        >
                          Setting
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                        >
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteSettingsTableData.map((item, index) => (
                        <tr
                          key={item.key}
                          className="cursor-pointer"
                          style={{ 
                            borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none'
                          }}
                          onClick={() => setSiteSettingsModalOpen(true)}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="text-sm font-medium"
                              style={{ color: isDark ? '#ffffff' : '#111827' }}
                            >
                              {item.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {item.type === 'image' && item.value ? (
                              <img
                                src={resolveMediaUrl(item.value)}
                                alt={item.label}
                                className="h-10 w-auto object-contain rounded"
                                style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
                              />
                            ) : item.type === 'textarea' ? (
                              <span 
                                className="text-sm line-clamp-2"
                                style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
                              >
                                {item.value || '-'}
                              </span>
                            ) : (
                              <span 
                                className="text-sm"
                                style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
                              >
                                {item.value || '-'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AdminCard>
            )}

            {/* Site Settings View Modal */}
            <AdminModal
              isOpen={siteSettingsModalOpen && !siteSettingsEditMode}
              onClose={() => setSiteSettingsModalOpen(false)}
              title="Site Settings Details"
              size="lg"
              footer={
                <div className="flex justify-end gap-3">
                  <AdminButton
                    variant="warning"
                    onClick={() => setSiteSettingsEditMode(true)}
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    }
                  >
                    Edit
                  </AdminButton>
                  <AdminButton variant="secondary" onClick={() => setSiteSettingsModalOpen(false)}>
                    Close
                  </AdminButton>
                </div>
              }
            >
              <div className="space-y-6">
                {siteSettingsTableData.map((item) => (
                  <div key={item.key} className="space-y-1">
                    <label 
                      className="text-sm font-medium"
                      style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                      {item.label}
                    </label>
                    {item.type === 'image' && item.value ? (
                      <div>
                        <img
                          src={resolveMediaUrl(item.value)}
                          alt={item.label}
                          className="h-16 w-auto object-contain rounded-lg"
                          style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
                        />
                        <p 
                          className="text-xs mt-1"
                          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                        >
                          {item.value}
                        </p>
                      </div>
                    ) : item.type === 'textarea' ? (
                      <p 
                        className="text-sm whitespace-pre-wrap p-3 rounded-lg"
                        style={{ 
                          color: isDark ? '#ffffff' : '#111827',
                          backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb'
                        }}
                      >
                        {item.value || '-'}
                      </p>
                    ) : (
                      <p 
                        className="text-sm"
                        style={{ color: isDark ? '#ffffff' : '#111827' }}
                      >
                        {item.value || '-'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </AdminModal>

            {/* Site Settings Edit Modal */}
            <AdminModal
              isOpen={siteSettingsEditMode}
              onClose={() => setSiteSettingsEditMode(false)}
              title="Edit Site Settings"
              size="lg"
              footer={
                <div className="flex justify-end gap-3">
                  <AdminButton
                    variant="secondary"
                    onClick={() => setSiteSettingsEditMode(false)}
                    disabled={isWorking}
                  >
                    Cancel
                  </AdminButton>
                  <AdminButton
                    variant="primary"
                    onClick={() => setSiteSettingsConfirmSave(true)}
                    loading={isWorking}
                  >
                    Save Changes
                  </AdminButton>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Site Name"
                    value={siteSettings.site_name}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, site_name: e.target.value }))}
                    placeholder="Enter site name"
                  />
                  <AdminInput
                    label="Department Name"
                    value={siteSettings.department_name}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, department_name: e.target.value }))}
                    placeholder="Enter department name"
                  />
                </div>

                <div className="space-y-2">
                  <AdminInput
                    label="Logo URL"
                    value={siteSettings.logo_url}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="Enter logo URL or upload below"
                  />
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        uploadImage(e.target.files?.[0], 'ce', (url) =>
                          setSiteSettings((prev) => ({ ...prev, logo_url: url }))
                        )
                      }
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                      style={{
                        color: isDark ? '#9ca3af' : '#4b5563'
                      }}
                    />
                    {siteSettings.logo_url && (
                      <img
                        src={resolveMediaUrl(siteSettings.logo_url)}
                        alt="Logo preview"
                        className="h-12 w-auto object-contain rounded"
                        style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
                      />
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Navbar Title"
                    value={siteSettings.navbar_title}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, navbar_title: e.target.value }))}
                    placeholder="Enter navbar title"
                  />
                  <AdminInput
                    label="Navbar Subtitle"
                    value={siteSettings.navbar_subtitle}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, navbar_subtitle: e.target.value }))}
                    placeholder="Enter navbar subtitle"
                  />
                </div>

                <AdminTextarea
                  label="Footer Description"
                  value={siteSettings.footer_description}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, footer_description: e.target.value }))}
                  placeholder="Enter footer description"
                  rows={3}
                />

                <AdminTextarea
                  label="Contact Address (one line per row)"
                  value={siteSettings.contact_address_lines_text}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, contact_address_lines_text: e.target.value }))}
                  placeholder="Enter address lines"
                  rows={3}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <AdminInput
                    label="Contact Phone"
                    value={siteSettings.contact_phone}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="Enter contact phone"
                  />
                  <AdminInput
                    label="Contact Email"
                    value={siteSettings.contact_email}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="Enter contact email"
                  />
                </div>

                <AdminInput
                  label="Google Map Embed URL"
                  value={siteSettings.map_embed_url}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, map_embed_url: e.target.value }))}
                  placeholder="Enter map embed URL"
                />

                <AdminInput
                  label="Copyright Text"
                  value={siteSettings.copyright_text}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, copyright_text: e.target.value }))}
                  placeholder="Enter copyright text"
                />
              </div>
            </AdminModal>

            {/* Save Confirmation Modal */}
            <ConfirmationModal
              isOpen={siteSettingsConfirmSave}
              onClose={() => setSiteSettingsConfirmSave(false)}
              onConfirm={saveSiteSettings}
              title="Confirm Save"
              message="Are you sure you want to save these changes to site settings?"
              confirmText="Save Changes"
              variant="info"
              isLoading={isWorking}
            />

            {/* ============================================ */}
            {/* HOME CONTENT SECTION */}
            {/* ============================================ */}
            {activeSection === 'home-content' && (
              <>
                <AdminCard
                  title="Home Content"
                  subtitle="Welcome block and CTA text for the homepage"
                  actions={
                    <AdminButton
                      variant="primary"
                      onClick={() => setHomeContentEditMode(true)}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      }
                    >
                      Edit Content
                    </AdminButton>
                  }
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Welcome Title</p>
                        <p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{homeContent.welcome_title || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Welcome Paragraph 1</p>
                        <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{homeContent.welcome_paragraph_1 || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Welcome Paragraph 2</p>
                        <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{homeContent.welcome_paragraph_2 || '-'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>CTA Title</p>
                        <p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{homeContent.cta_title || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>CTA Description</p>
                        <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{homeContent.cta_description || '-'}</p>
                      </div>
                      {homeContent.welcome_image_url && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Welcome Image</p>
                          <img 
                            src={resolveMediaUrl(homeContent.welcome_image_url)} 
                            alt="Welcome" 
                            className="h-24 w-auto rounded-lg object-cover"
                            style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AdminCard>

                {/* Home Content Edit Modal */}
                <AdminModal
                  isOpen={homeContentEditMode}
                  onClose={() => setHomeContentEditMode(false)}
                  title="Edit Home Content"
                  size="lg"
                  footer={
                    <div className="flex justify-end gap-3">
                      <AdminButton variant="secondary" onClick={() => setHomeContentEditMode(false)} disabled={isWorking}>
                        Cancel
                      </AdminButton>
                      <AdminButton variant="primary" onClick={() => setHomeContentConfirmSave(true)} loading={isWorking}>
                        Save Changes
                      </AdminButton>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <AdminInput
                      label="Welcome Title"
                      value={homeContent.welcome_title}
                      onChange={(e) => setHomeContent((prev) => ({ ...prev, welcome_title: e.target.value }))}
                      placeholder="Enter welcome title"
                    />
                    <AdminTextarea
                      label="Welcome Paragraph 1"
                      value={homeContent.welcome_paragraph_1}
                      onChange={(e) => setHomeContent((prev) => ({ ...prev, welcome_paragraph_1: e.target.value }))}
                      placeholder="Enter first paragraph"
                      rows={3}
                    />
                    <AdminTextarea
                      label="Welcome Paragraph 2"
                      value={homeContent.welcome_paragraph_2}
                      onChange={(e) => setHomeContent((prev) => ({ ...prev, welcome_paragraph_2: e.target.value }))}
                      placeholder="Enter second paragraph"
                      rows={3}
                    />
                    <div className="space-y-2">
                      <AdminInput
                        label="Welcome Image URL"
                        value={homeContent.welcome_image_url}
                        onChange={(e) => setHomeContent((prev) => ({ ...prev, welcome_image_url: e.target.value }))}
                        placeholder="Enter image URL or upload"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => uploadImage(e.target.files?.[0], 'home', (url) => setHomeContent((prev) => ({ ...prev, welcome_image_url: url })))}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
                        style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
                      />
                    </div>
                    <div className="pt-4" style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h4 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Call to Action</h4>
                      <div className="space-y-4">
                        <AdminInput
                          label="CTA Title"
                          value={homeContent.cta_title}
                          onChange={(e) => setHomeContent((prev) => ({ ...prev, cta_title: e.target.value }))}
                          placeholder="Enter CTA title"
                        />
                        <AdminTextarea
                          label="CTA Description"
                          value={homeContent.cta_description}
                          onChange={(e) => setHomeContent((prev) => ({ ...prev, cta_description: e.target.value }))}
                          placeholder="Enter CTA description"
                          rows={2}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <AdminInput
                            label="Primary Button Text"
                            value={homeContent.cta_primary_text}
                            onChange={(e) => setHomeContent((prev) => ({ ...prev, cta_primary_text: e.target.value }))}
                          />
                          <AdminInput
                            label="Primary Button Link"
                            value={homeContent.cta_primary_link}
                            onChange={(e) => setHomeContent((prev) => ({ ...prev, cta_primary_link: e.target.value }))}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <AdminInput
                            label="Secondary Button Text"
                            value={homeContent.cta_secondary_text}
                            onChange={(e) => setHomeContent((prev) => ({ ...prev, cta_secondary_text: e.target.value }))}
                          />
                          <AdminInput
                            label="Secondary Button Link"
                            value={homeContent.cta_secondary_link}
                            onChange={(e) => setHomeContent((prev) => ({ ...prev, cta_secondary_link: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AdminModal>

                <ConfirmationModal
                  isOpen={homeContentConfirmSave}
                  onClose={() => setHomeContentConfirmSave(false)}
                  onConfirm={() => {
                    saveHomeContent();
                    setHomeContentConfirmSave(false);
                    setHomeContentEditMode(false);
                  }}
                  title="Confirm Save"
                  message="Are you sure you want to save these changes to home content?"
                  confirmText="Save Changes"
                  variant="info"
                  isLoading={isWorking}
                />
              </>
            )}

            {/* ============================================ */}
            {/* NAVIGATION ITEMS SECTION */}
            {/* ============================================ */}
            {activeSection === 'navigation' && (
              <>
                <AdminCard
                  title="Navigation Items"
                  subtitle={`${navigationItems.length} items configured`}
                  actions={
                    <AdminButton variant="primary" onClick={openNavCreate} icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      Add Item
                    </AdminButton>
                  }
                  noPadding
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Label</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Link</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Order</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {navigationItems.map((item, index) => (
                          <tr
                            key={item.id}
                            className="cursor-pointer"
                            style={{ borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none' }}
                            onClick={() => openNavView(item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{item.label}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.href}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.sort_order}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span 
                                className="px-2 py-1 text-xs font-medium rounded-full"
                                style={{
                                  backgroundColor: item.is_active ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'),
                                  color: item.is_active ? (isDark ? '#34d399' : '#059669') : (isDark ? '#9ca3af' : '#6b7280')
                                }}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {navigationItems.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center">
                              <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No navigation items yet. Click "Add Item" to create one.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                {/* Navigation View/Edit Modal */}
                <AdminModal
                  isOpen={navModalOpen}
                  onClose={closeNavModal}
                  title={navEditMode ? (navSelectedItem ? 'Edit Navigation Item' : 'Add Navigation Item') : 'Navigation Item Details'}
                  size="md"
                  footer={
                    <div className="flex justify-between">
                      <div>
                        {navSelectedItem && !navEditMode && (
                          <AdminButton variant="danger" onClick={() => setNavConfirmDelete(true)}>Delete</AdminButton>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {navEditMode ? (
                          <>
                            <AdminButton variant="secondary" onClick={closeNavModal} disabled={isWorking}>Cancel</AdminButton>
                            <AdminButton variant="primary" onClick={() => setNavConfirmSave(true)} loading={isWorking}>Save</AdminButton>
                          </>
                        ) : (
                          <>
                            <AdminButton variant="warning" onClick={() => setNavEditMode(true)}>Edit</AdminButton>
                            <AdminButton variant="secondary" onClick={closeNavModal}>Close</AdminButton>
                          </>
                        )}
                      </div>
                    </div>
                  }
                >
                  {navEditMode ? (
                    <div className="space-y-4">
                      <AdminInput label="Label" value={navDraft.label} onChange={(e) => setNavDraft((prev) => ({ ...prev, label: e.target.value }))} placeholder="e.g., About Us" />
                      <AdminInput label="Link (href)" value={navDraft.href} onChange={(e) => setNavDraft((prev) => ({ ...prev, href: e.target.value }))} placeholder="e.g., /about" />
                      <AdminInput label="Sort Order" type="number" value={navDraft.sort_order} onChange={(e) => setNavDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="nav-active"
                          checked={navDraft.is_active}
                          onChange={(e) => setNavDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                          className="w-4 h-4 rounded"
                        />
                        <label htmlFor="nav-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Label</p><p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{navSelectedItem?.label}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Link</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{navSelectedItem?.href}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Sort Order</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{navSelectedItem?.sort_order}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</p><p className="text-sm" style={{ color: navSelectedItem?.is_active ? '#10b981' : '#6b7280' }}>{navSelectedItem?.is_active ? 'Active' : 'Inactive'}</p></div>
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={navConfirmSave} onClose={() => setNavConfirmSave(false)} onConfirm={saveNavigationItem} title="Confirm Save" message="Save this navigation item?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={navConfirmDelete} onClose={() => setNavConfirmDelete(false)} onConfirm={deleteNavigationItemHandler} title="Confirm Delete" message="Are you sure you want to delete this navigation item? This cannot be undone." confirmText="Delete" variant="danger" isLoading={isWorking} />
              </>
            )}

            {/* ============================================ */}
            {/* SOCIAL LINKS SECTION */}
            {/* ============================================ */}
            {activeSection === 'social' && (
              <>
                <AdminCard
                  title="Social Links"
                  subtitle={`${socialLinks.length} links configured`}
                  actions={
                    <AdminButton variant="primary" onClick={openSocialCreate} icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      Add Link
                    </AdminButton>
                  }
                  noPadding
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Platform</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Icon</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>URL</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {socialLinks.map((item, index) => (
                          <tr
                            key={item.id}
                            className="cursor-pointer"
                            style={{ borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none' }}
                            onClick={() => openSocialView(item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4"><span className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{item.platform}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.icon}</span></td>
                            <td className="px-6 py-4"><span className="text-sm truncate max-w-xs block" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.url}</span></td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: item.is_active ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'), color: item.is_active ? (isDark ? '#34d399' : '#059669') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {socialLinks.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center"><p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No social links yet.</p></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                <AdminModal isOpen={socialModalOpen} onClose={closeSocialModal} title={socialEditMode ? (socialSelectedItem ? 'Edit Social Link' : 'Add Social Link') : 'Social Link Details'} size="md"
                  footer={
                    <div className="flex justify-between">
                      <div>{socialSelectedItem && !socialEditMode && <AdminButton variant="danger" onClick={() => setSocialConfirmDelete(true)}>Delete</AdminButton>}</div>
                      <div className="flex gap-3">
                        {socialEditMode ? (
                          <><AdminButton variant="secondary" onClick={closeSocialModal} disabled={isWorking}>Cancel</AdminButton><AdminButton variant="primary" onClick={() => setSocialConfirmSave(true)} loading={isWorking}>Save</AdminButton></>
                        ) : (
                          <><AdminButton variant="warning" onClick={() => setSocialEditMode(true)}>Edit</AdminButton><AdminButton variant="secondary" onClick={closeSocialModal}>Close</AdminButton></>
                        )}
                      </div>
                    </div>
                  }
                >
                  {socialEditMode ? (
                    <div className="space-y-4">
                      <AdminInput label="Platform" value={socialDraft.platform} onChange={(e) => setSocialDraft((prev) => ({ ...prev, platform: e.target.value }))} placeholder="e.g., LinkedIn" />
                      <AdminInput label="Icon" value={socialDraft.icon} onChange={(e) => setSocialDraft((prev) => ({ ...prev, icon: e.target.value }))} placeholder="e.g., Linkedin" />
                      <AdminInput label="URL" value={socialDraft.url} onChange={(e) => setSocialDraft((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://..." />
                      <AdminInput label="Sort Order" type="number" value={socialDraft.sort_order} onChange={(e) => setSocialDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="social-active" checked={socialDraft.is_active} onChange={(e) => setSocialDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
                        <label htmlFor="social-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Platform</p><p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{socialSelectedItem?.platform}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Icon</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{socialSelectedItem?.icon}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>URL</p><p className="text-sm break-all" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{socialSelectedItem?.url}</p></div>
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={socialConfirmSave} onClose={() => setSocialConfirmSave(false)} onConfirm={saveSocialLinkItem} title="Confirm Save" message="Save this social link?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={socialConfirmDelete} onClose={() => setSocialConfirmDelete(false)} onConfirm={deleteSocialLinkItem} title="Confirm Delete" message="Delete this social link?" confirmText="Delete" variant="danger" isLoading={isWorking} />
              </>
            )}

            {/* ============================================ */}
            {/* FOOTER LINKS SECTION */}
            {/* ============================================ */}
            {activeSection === 'footer' && (
              <>
                <AdminCard
                  title="Footer Links"
                  subtitle={`${footerLinks.length} links configured`}
                  actions={
                    <AdminButton variant="primary" onClick={openFooterCreate} icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      Add Link
                    </AdminButton>
                  }
                  noPadding
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Section</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Label</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Link</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {footerLinks.map((item, index) => (
                          <tr
                            key={item.id}
                            className="cursor-pointer"
                            style={{ borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none' }}
                            onClick={() => openFooterView(item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded" style={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', color: isDark ? '#60a5fa' : '#2563eb' }}>{item.section}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{item.label}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.href}</span></td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: item.is_active ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'), color: item.is_active ? (isDark ? '#34d399' : '#059669') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {footerLinks.length === 0 && (
                          <tr><td colSpan={4} className="px-6 py-8 text-center"><p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No footer links yet.</p></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                <AdminModal isOpen={footerModalOpen} onClose={closeFooterModal} title={footerEditMode ? (footerSelectedItem ? 'Edit Footer Link' : 'Add Footer Link') : 'Footer Link Details'} size="md"
                  footer={
                    <div className="flex justify-between">
                      <div>{footerSelectedItem && !footerEditMode && <AdminButton variant="danger" onClick={() => setFooterConfirmDelete(true)}>Delete</AdminButton>}</div>
                      <div className="flex gap-3">
                        {footerEditMode ? (
                          <><AdminButton variant="secondary" onClick={closeFooterModal} disabled={isWorking}>Cancel</AdminButton><AdminButton variant="primary" onClick={() => setFooterConfirmSave(true)} loading={isWorking}>Save</AdminButton></>
                        ) : (
                          <><AdminButton variant="warning" onClick={() => setFooterEditMode(true)}>Edit</AdminButton><AdminButton variant="secondary" onClick={closeFooterModal}>Close</AdminButton></>
                        )}
                      </div>
                    </div>
                  }
                >
                  {footerEditMode ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Section</label>
                        <select
                          value={footerDraft.section}
                          onChange={(e) => setFooterDraft((prev) => ({ ...prev, section: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`, color: isDark ? '#ffffff' : '#111827' }}
                        >
                          <option value="quick">Quick Links</option>
                          <option value="important">Important Links</option>
                        </select>
                      </div>
                      <AdminInput label="Label" value={footerDraft.label} onChange={(e) => setFooterDraft((prev) => ({ ...prev, label: e.target.value }))} placeholder="Link text" />
                      <AdminInput label="Link (href)" value={footerDraft.href} onChange={(e) => setFooterDraft((prev) => ({ ...prev, href: e.target.value }))} placeholder="/page or https://..." />
                      <AdminInput label="Sort Order" type="number" value={footerDraft.sort_order} onChange={(e) => setFooterDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="footer-active" checked={footerDraft.is_active} onChange={(e) => setFooterDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
                        <label htmlFor="footer-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Section</p><p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{footerSelectedItem?.section}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Label</p><p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{footerSelectedItem?.label}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Link</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{footerSelectedItem?.href}</p></div>
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={footerConfirmSave} onClose={() => setFooterConfirmSave(false)} onConfirm={saveFooterLinkItem} title="Confirm Save" message="Save this footer link?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={footerConfirmDelete} onClose={() => setFooterConfirmDelete(false)} onConfirm={deleteFooterLinkItem} title="Confirm Delete" message="Delete this footer link?" confirmText="Delete" variant="danger" isLoading={isWorking} />
              </>
            )}

            {/* ============================================ */}
            {/* HERO SLIDES SECTION */}
            {/* ============================================ */}
            {activeSection === 'slides' && (
              <>
                <AdminCard
                  title="Hero Slides"
                  subtitle={`${slides.length} slides configured`}
                  actions={
                    <AdminButton variant="primary" onClick={openSlideCreate} icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      Add Slide
                    </AdminButton>
                  }
                  noPadding
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Image</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Title</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>CTA</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Order</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slides.map((item, index) => (
                          <tr
                            key={item.id}
                            className="cursor-pointer"
                            style={{ borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none' }}
                            onClick={() => openSlideView(item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4">
                              {item.image_url ? (
                                <img src={resolveMediaUrl(item.image_url)} alt="" className="h-12 w-20 object-cover rounded" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />
                              ) : (
                                <div className="h-12 w-20 rounded flex items-center justify-center" style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}>
                                  <span className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No image</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4"><span className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{item.title || '-'}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.cta_text || '-'}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.sort_order}</span></td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: item.is_active ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'), color: item.is_active ? (isDark ? '#34d399' : '#059669') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {slides.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center"><p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No hero slides yet.</p></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                <AdminModal isOpen={slideModalOpen} onClose={closeSlideModal} title={slideEditMode ? (slideSelectedItem ? 'Edit Hero Slide' : 'Add Hero Slide') : 'Hero Slide Details'} size="lg"
                  footer={
                    <div className="flex justify-between">
                      <div>{slideSelectedItem && !slideEditMode && <AdminButton variant="danger" onClick={() => setSlideConfirmDelete(true)}>Delete</AdminButton>}</div>
                      <div className="flex gap-3">
                        {slideEditMode ? (
                          <><AdminButton variant="secondary" onClick={closeSlideModal} disabled={isWorking}>Cancel</AdminButton><AdminButton variant="primary" onClick={() => setSlideConfirmSave(true)} loading={isWorking}>Save</AdminButton></>
                        ) : (
                          <><AdminButton variant="warning" onClick={() => setSlideEditMode(true)}>Edit</AdminButton><AdminButton variant="secondary" onClick={closeSlideModal}>Close</AdminButton></>
                        )}
                      </div>
                    </div>
                  }
                >
                  {slideEditMode ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <AdminInput label="Image URL" value={slideDraft.image_url} onChange={(e) => setSlideDraft((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="Image URL" />
                        <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], 'slides', (url) => setSlideDraft((prev) => ({ ...prev, image_url: url })))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer" style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />
                        {slideDraft.image_url && <img src={resolveMediaUrl(slideDraft.image_url)} alt="" className="h-24 w-auto rounded mt-2" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />}
                      </div>
                      <AdminInput label="Title" value={slideDraft.title} onChange={(e) => setSlideDraft((prev) => ({ ...prev, title: e.target.value }))} placeholder="Slide title" />
                      <AdminInput label="Subtitle" value={slideDraft.subtitle} onChange={(e) => setSlideDraft((prev) => ({ ...prev, subtitle: e.target.value }))} placeholder="Slide subtitle" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="CTA Text" value={slideDraft.cta_text} onChange={(e) => setSlideDraft((prev) => ({ ...prev, cta_text: e.target.value }))} placeholder="Button text" />
                        <AdminInput label="CTA Link" value={slideDraft.cta_link} onChange={(e) => setSlideDraft((prev) => ({ ...prev, cta_link: e.target.value }))} placeholder="/page" />
                      </div>
                      <AdminInput label="Sort Order" type="number" value={slideDraft.sort_order} onChange={(e) => setSlideDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="slide-active" checked={slideDraft.is_active} onChange={(e) => setSlideDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
                        <label htmlFor="slide-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {slideSelectedItem?.image_url && <img src={resolveMediaUrl(slideSelectedItem.image_url)} alt="" className="w-full h-48 object-cover rounded-lg" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Title</p><p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{slideSelectedItem?.title || '-'}</p></div>
                        <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Subtitle</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{slideSelectedItem?.subtitle || '-'}</p></div>
                        <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>CTA Text</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{slideSelectedItem?.cta_text || '-'}</p></div>
                        <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>CTA Link</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{slideSelectedItem?.cta_link || '-'}</p></div>
                      </div>
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={slideConfirmSave} onClose={() => setSlideConfirmSave(false)} onConfirm={saveSlideItem} title="Confirm Save" message="Save this hero slide?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={slideConfirmDelete} onClose={() => setSlideConfirmDelete(false)} onConfirm={deleteSlideItem} title="Confirm Delete" message="Delete this hero slide?" confirmText="Delete" variant="danger" isLoading={isWorking} />
              </>
            )}

            {/* ============================================ */}
            {/* HOME STATS SECTION */}
            {/* ============================================ */}
            {activeSection === 'stats' && (
              <>
                <AdminCard
                  title="Home Stats"
                  subtitle={`${stats.length} stats configured`}
                  actions={
                    <AdminButton variant="primary" onClick={openStatCreate} icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      Add Stat
                    </AdminButton>
                  }
                  noPadding
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Label</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Value</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Icon</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Order</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((item, index) => (
                          <tr
                            key={item.id}
                            className="cursor-pointer"
                            style={{ borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none' }}
                            onClick={() => openStatView(item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4"><span className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{item.label}</span></td>
                            <td className="px-6 py-4"><span className="text-sm font-bold" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{item.value}{item.suffix}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.icon_name}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.sort_order}</span></td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: item.is_active ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'), color: item.is_active ? (isDark ? '#34d399' : '#059669') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {stats.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center"><p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No stats yet.</p></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                <AdminModal isOpen={statModalOpen} onClose={closeStatModal} title={statEditMode ? (statSelectedItem ? 'Edit Stat' : 'Add Stat') : 'Stat Details'} size="md"
                  footer={
                    <div className="flex justify-between">
                      <div>{statSelectedItem && !statEditMode && <AdminButton variant="danger" onClick={() => setStatConfirmDelete(true)}>Delete</AdminButton>}</div>
                      <div className="flex gap-3">
                        {statEditMode ? (
                          <><AdminButton variant="secondary" onClick={closeStatModal} disabled={isWorking}>Cancel</AdminButton><AdminButton variant="primary" onClick={() => setStatConfirmSave(true)} loading={isWorking}>Save</AdminButton></>
                        ) : (
                          <><AdminButton variant="warning" onClick={() => setStatEditMode(true)}>Edit</AdminButton><AdminButton variant="secondary" onClick={closeStatModal}>Close</AdminButton></>
                        )}
                      </div>
                    </div>
                  }
                >
                  {statEditMode ? (
                    <div className="space-y-4">
                      <AdminInput label="Label" value={statDraft.label} onChange={(e) => setStatDraft((prev) => ({ ...prev, label: e.target.value }))} placeholder="e.g., Students" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Value" type="number" value={statDraft.value} onChange={(e) => setStatDraft((prev) => ({ ...prev, value: e.target.value }))} placeholder="e.g., 500" />
                        <AdminInput label="Suffix" value={statDraft.suffix} onChange={(e) => setStatDraft((prev) => ({ ...prev, suffix: e.target.value }))} placeholder="e.g., +" />
                      </div>
                      <AdminInput label="Icon Name" value={statDraft.icon_name} onChange={(e) => setStatDraft((prev) => ({ ...prev, icon_name: e.target.value }))} placeholder="e.g., Users" />
                      <AdminInput label="Sort Order" type="number" value={statDraft.sort_order} onChange={(e) => setStatDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="stat-active" checked={statDraft.is_active} onChange={(e) => setStatDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
                        <label htmlFor="stat-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Label</p><p className="text-sm" style={{ color: isDark ? '#ffffff' : '#111827' }}>{statSelectedItem?.label}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Value</p><p className="text-lg font-bold" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{statSelectedItem?.value}{statSelectedItem?.suffix}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Icon</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{statSelectedItem?.icon_name}</p></div>
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={statConfirmSave} onClose={() => setStatConfirmSave(false)} onConfirm={saveStatItem} title="Confirm Save" message="Save this stat?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={statConfirmDelete} onClose={() => setStatConfirmDelete(false)} onConfirm={deleteStatItem} title="Confirm Delete" message="Delete this stat?" confirmText="Delete" variant="danger" isLoading={isWorking} />
              </>
            )}

            {/* ============================================ */}
            {/* NEWS ITEMS SECTION */}
            {/* ============================================ */}
            {activeSection === 'news' && (
              <>
                <AdminCard
                  title="News Items"
                  subtitle={`${newsItems.length} news items`}
                  actions={
                    <AdminButton variant="primary" onClick={openNewsCreate} icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }>
                      Add News
                    </AdminButton>
                  }
                  noPadding
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb' }}>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Image</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Title</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Date</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsItems.map((item, index) => (
                          <tr
                            key={item.id}
                            className="cursor-pointer"
                            style={{ borderTop: index > 0 ? `1px solid ${isDark ? '#374151' : '#e5e7eb'}` : 'none' }}
                            onClick={() => openNewsView(item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? 'rgba(55, 65, 81, 0.3)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td className="px-6 py-4">
                              {item.image_url ? (
                                <img src={resolveMediaUrl(item.image_url)} alt="" className="h-10 w-16 object-cover rounded" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />
                              ) : (
                                <div className="h-10 w-16 rounded flex items-center justify-center" style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}>
                                  <span className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>-</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4"><span className="text-sm font-medium line-clamp-1" style={{ color: isDark ? '#ffffff' : '#111827' }}>{item.title}</span></td>
                            <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#ede9fe', color: isDark ? '#a78bfa' : '#7c3aed' }}>{item.category}</span></td>
                            <td className="px-6 py-4"><span className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{item.publish_date ? new Date(item.publish_date).toLocaleDateString() : '-'}</span></td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: item.is_active ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5') : (isDark ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6'), color: item.is_active ? (isDark ? '#34d399' : '#059669') : (isDark ? '#9ca3af' : '#6b7280') }}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {newsItems.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center"><p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>No news items yet.</p></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                <AdminModal isOpen={newsModalOpen} onClose={closeNewsModal} title={newsEditMode ? (newsSelectedItem ? 'Edit News Item' : 'Add News Item') : 'News Item Details'} size="lg"
                  footer={
                    <div className="flex justify-between">
                      <div>{newsSelectedItem && !newsEditMode && <AdminButton variant="danger" onClick={() => setNewsConfirmDelete(true)}>Delete</AdminButton>}</div>
                      <div className="flex gap-3">
                        {newsEditMode ? (
                          <><AdminButton variant="secondary" onClick={closeNewsModal} disabled={isWorking}>Cancel</AdminButton><AdminButton variant="primary" onClick={() => {
                            if (newsDraftValidationError) {
                              setError(newsDraftValidationError);
                              setSuccessMessage('');
                              return;
                            }

                            setNewsConfirmSave(true);
                          }} loading={isWorking} disabled={isWorking || Boolean(newsDraftValidationError)}>Save</AdminButton></>
                        ) : (
                          <><AdminButton variant="warning" onClick={() => setNewsEditMode(true)}>Edit</AdminButton><AdminButton variant="secondary" onClick={closeNewsModal}>Close</AdminButton></>
                        )}
                      </div>
                    </div>
                  }
                >
                  {newsEditMode ? (
                    <div className="space-y-4">
                      <AdminInput label="Title" required value={newsDraft.title} onChange={(e) => setNewsDraft((prev) => ({ ...prev, title: e.target.value }))} placeholder="News title" />
                      <AdminTextarea label="Excerpt" required value={newsDraft.excerpt} onChange={(e) => setNewsDraft((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Brief description" rows={3} />
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Category" value={newsDraft.category} onChange={(e) => setNewsDraft((prev) => ({ ...prev, category: e.target.value }))} placeholder="e.g., News, Event" />
                        <AdminInput label="Publish Date" required type="datetime-local" value={newsDraft.publish_date} onChange={(e) => setNewsDraft((prev) => ({ ...prev, publish_date: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <AdminInput label="Image URL" required value={newsDraft.image_url} onChange={(e) => setNewsDraft((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="Image URL" helpText="Required: this item will not save without an image." />
                        <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], 'news', (url) => setNewsDraft((prev) => ({ ...prev, image_url: url })))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer" style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />
                      </div>
                      <AdminInput label="External Link" value={newsDraft.external_link} onChange={(e) => setNewsDraft((prev) => ({ ...prev, external_link: e.target.value }))} placeholder="https://..." />
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="news-active" checked={newsDraft.is_active} onChange={(e) => setNewsDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
                        <label htmlFor="news-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {newsSelectedItem?.image_url && <img src={resolveMediaUrl(newsSelectedItem.image_url)} alt="" className="w-full h-48 object-cover rounded-lg" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />}
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Title</p><p className="text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{newsSelectedItem?.title}</p></div>
                      <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Excerpt</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{newsSelectedItem?.excerpt || '-'}</p></div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{newsSelectedItem?.category}</p></div>
                        <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Publish Date</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{newsSelectedItem?.publish_date ? new Date(newsSelectedItem.publish_date).toLocaleString() : '-'}</p></div>
                      </div>
                      {newsSelectedItem?.external_link && <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>External Link</p><a href={newsSelectedItem.external_link} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{newsSelectedItem.external_link}</a></div>}
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={newsConfirmSave} onClose={() => setNewsConfirmSave(false)} onConfirm={saveNewsItemEntry} title="Confirm Save" message="Save this news item?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={newsConfirmDelete} onClose={() => setNewsConfirmDelete(false)} onConfirm={deleteNewsItemEntry} title="Confirm Delete" message="Delete this news item?" confirmText="Delete" variant="danger" isLoading={isWorking} />
              </>
            )}

            {/* People Directory Section */}
            {activeSection === 'people' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        People Directory
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Manage faculty, staff, and students
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={peopleFilterCategory}
                        onChange={(e) => setPeopleFilterCategory(e.target.value)}
                        className="px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{
                          backgroundColor: isDark ? '#374151' : '#ffffff',
                          borderColor: isDark ? '#4b5563' : '#d1d5db',
                          color: isDark ? '#ffffff' : '#111827'
                        }}
                      >
                        <option value="all">All Categories</option>
                        {peopleCategoryOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <AdminButton onClick={openPeopleCreate} disabled={isWorking}>
                        + Add Entry
                      </AdminButton>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Photo</th>
                          <th className="text-left py-3 px-4 font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Name</th>
                          <th className="text-left py-3 px-4 font-medium hidden md:table-cell" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</th>
                          <th className="text-left py-3 px-4 font-medium hidden lg:table-cell" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Designation</th>
                          <th className="text-left py-3 px-4 font-medium hidden xl:table-cell" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Email</th>
                          <th className="text-center py-3 px-4 font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPeopleEntries.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
                              No people entries found
                            </td>
                          </tr>
                        ) : (
                          filteredPeopleEntries.map((person) => {
                            const isProgramBatch = isProgramYearEntry(person);
                            const linkedStudentCount = isProgramBatch
                              ? getProgramStudentsForEntry(person).length
                              : 0;

                            return (
                            <tr
                              key={person.id}
                              onClick={() => openPeopleView(person)}
                              className="cursor-pointer"
                              style={{ 
                                borderBottom: `1px solid ${isDark ? '#374151' : '#f3f4f6'}`,
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f9fafb'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <td className="py-3 px-4">
                                {person.image_url && !isProgramBatch ? (
                                  <img src={resolveMediaUrl(person.image_url)} alt="" className="w-10 h-10 rounded-full object-cover" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />
                                ) : (
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                    {isProgramBatch ? 'Y' : (person.name?.charAt(0).toUpperCase() || '?')}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4 font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                                {getPeopleDisplayName(person)}
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#d1d5db' : '#374151' }}>
                                  {peopleCategoryOptions.find(c => c.value === person.category)?.label || person.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 hidden lg:table-cell" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                                {isProgramBatch
                                  ? (getProgramEntryMode(person) === 'resource' ? 'Upload list mode' : `${linkedStudentCount} student(s)`)
                                  : (person.designation || '-')}
                              </td>
                              <td className="py-3 px-4 hidden xl:table-cell" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                                {isProgramBatch ? (person.resource_link || '-') : (person.email || '-')}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block w-2 h-2 rounded-full ${person.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                              </td>
                            </tr>
                          )})
                        )}
                      </tbody>
                    </table>
                  </div>
                </AdminCard>

                {/* People Modal */}
                <AdminModal
                  isOpen={peopleModalOpen}
                  onClose={closePeopleModal}
                  title={peopleSelectedItem ? (
                    peopleEditMode ? 'Edit Entry' : (
                      selectedPeopleIsProgramBatch ? (
                        <div className="flex items-center gap-3">
                          <span>View Batch Entry</span>
                          {selectedPeopleProgramMode === 'individual' && (
                            <label
                              htmlFor="program-student-csv-input"
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-pointer"
                              style={{
                                backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
                                color: isDark ? '#f9fafb' : '#111827',
                              }}
                            >
                              Import CSV
                            </label>
                          )}
                        </div>
                      ) : 'View Person'
                    )
                  ) : 'Add Entry'}
                  size="lg"
                  footer={
                    peopleEditMode ? (
                      <div className="flex justify-end gap-3">
                        <AdminButton variant="secondary" onClick={closePeopleModal}>Cancel</AdminButton>
                        <AdminButton onClick={() => setPeopleConfirmSave(true)} disabled={isWorking}>Save</AdminButton>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <AdminButton variant="danger" onClick={() => setPeopleConfirmDelete(true)} disabled={isWorking}>Delete</AdminButton>
                        <div className="flex gap-3">
                          <AdminButton variant="secondary" onClick={closePeopleModal}>Close</AdminButton>
                          <AdminButton onClick={() => setPeopleEditMode(true)}>Edit</AdminButton>
                        </div>
                      </div>
                    )
                  }
                >
                  {peopleEditMode ? (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Category</label>
                        <select
                          value={peopleDraft.category}
                          onChange={(e) => {
                            const nextCategory = e.target.value;
                            setPeopleDraft((prev) => ({ ...prev, category: nextCategory }));
                            if (isProgramCategory(nextCategory)) {
                              setPeopleProgramMode('resource');
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            backgroundColor: isDark ? '#374151' : '#ffffff',
                            borderColor: isDark ? '#4b5563' : '#d1d5db',
                            color: isDark ? '#ffffff' : '#111827'
                          }}
                        >
                          {peopleCategoryOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      {draftPeopleIsProgram ? (
                        <>
                          <AdminInput
                            label="Year/Batch Label"
                            value={peopleDraft.year_label}
                            onChange={(e) => setPeopleDraft((prev) => ({ ...prev, year_label: e.target.value }))}
                            placeholder="e.g., 2024 Batch"
                          />

                          <div className="space-y-2">
                            <label className="block text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Entry Type</label>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setPeopleProgramMode('resource')}
                                className="px-4 py-3 rounded-lg text-sm font-medium border text-left"
                                style={{
                                  borderColor: peopleProgramMode === 'resource' ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#4b5563' : '#d1d5db'),
                                  backgroundColor: peopleProgramMode === 'resource' ? (isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe') : (isDark ? '#1f2937' : '#ffffff'),
                                  color: isDark ? '#e5e7eb' : '#111827',
                                }}
                              >
                                1. Upload List Link
                              </button>
                              <button
                                type="button"
                                onClick={() => setPeopleProgramMode('individual')}
                                className="px-4 py-3 rounded-lg text-sm font-medium border text-left"
                                style={{
                                  borderColor: peopleProgramMode === 'individual' ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#4b5563' : '#d1d5db'),
                                  backgroundColor: peopleProgramMode === 'individual' ? (isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe') : (isDark ? '#1f2937' : '#ffffff'),
                                  color: isDark ? '#e5e7eb' : '#111827',
                                }}
                              >
                                2. Individual Students
                              </button>
                            </div>
                          </div>

                          {peopleProgramMode === 'resource' && (
                            <AdminInput
                              label="Resource Link"
                              value={peopleDraft.resource_link}
                              onChange={(e) => setPeopleDraft((prev) => ({ ...prev, resource_link: e.target.value }))}
                              placeholder="https://..."
                            />
                          )}

                          {peopleProgramMode === 'individual' && (
                            <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#9ca3af' : '#4b5563' }}>
                              Save this batch first. Then open it to add/edit students in a nested table and import CSV.
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <AdminInput label="Name" value={peopleDraft.name} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" />

                          {peopleDraft.category !== 'phd' && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <AdminInput label="Designation" value={peopleDraft.designation} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, designation: e.target.value }))} placeholder="e.g., Professor, Lab Assistant" />
                              {peopleDraft.category === 'staff'
                                ? <AdminInput label="Department" value={peopleDraft.department} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, department: e.target.value }))} placeholder="Department name" />
                                : <AdminInput label="Specialization" value={peopleDraft.specialization} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, specialization: e.target.value }))} placeholder="Area of expertise" />}
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-4">
                            <AdminInput label="Email" type="email" value={peopleDraft.email} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, email: e.target.value }))} placeholder="email@example.com" />
                            <AdminInput label="Phone" value={peopleDraft.phone} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+91..." />
                          </div>

                          {peopleDraft.category === 'faculty' && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <AdminInput label="Room/Office" value={peopleDraft.room} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, room: e.target.value }))} placeholder="e.g., Room 101" />
                              <AdminInput label="Profile URL" value={peopleDraft.profile_url} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, profile_url: e.target.value }))} placeholder="https://..." />
                            </div>
                          )}

                          <div className="space-y-2">
                            <AdminInput label="Image URL" value={peopleDraft.image_url} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="Image URL" />
                            <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], 'people', (url) => setPeopleDraft((prev) => ({ ...prev, image_url: url })))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer" style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />
                          </div>

                          {peopleDraft.category === 'faculty' && (
                            <AdminTextarea label="Research Interests" value={peopleDraft.research_interests_text} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, research_interests_text: e.target.value }))} placeholder="Research interests, one per line" rows={3} />
                          )}

                          {peopleDraft.category === 'staff' && (
                            <AdminTextarea label="Responsibilities" value={peopleDraft.responsibilities_text} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, responsibilities_text: e.target.value }))} placeholder="Key responsibilities, one per line" rows={3} />
                          )}
                        </>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Sort Order" type="number" value={peopleDraft.sort_order} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                        <div className="flex items-center gap-3 pt-6">
                          <input type="checkbox" id="people-active" checked={peopleDraft.is_active} onChange={(e) => setPeopleDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
                          <label htmlFor="people-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>Active</label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {selectedPeopleIsProgramBatch ? (
                        <>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</p>
                              <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                                {peopleCategoryOptions.find(c => c.value === peopleSelectedItem?.category)?.label || peopleSelectedItem?.category}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Year/Batch</p>
                              <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.year_label || '-'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Mode</p>
                            <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                              {selectedPeopleProgramMode === 'resource' ? 'Upload list' : 'Individual students'}
                            </p>
                          </div>

                          {selectedPeopleProgramMode === 'resource' ? (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Resource Link</p>
                              {peopleSelectedItem?.resource_link ? (
                                <a href={peopleSelectedItem.resource_link} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>
                                  {peopleSelectedItem.resource_link}
                                </a>
                              ) : (
                                <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>-</p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                                    Students in {peopleSelectedItem?.year_label || 'Batch'}
                                  </h3>
                                  <p className="text-xs" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                                    Manage individual students for this batch.
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <input
                                    key={programStudentCsvInputKey}
                                    id="program-student-csv-input"
                                    type="file"
                                    accept=".csv,text/csv"
                                    className="hidden"
                                    onChange={(event) => importProgramStudentsFromCsv(event.target.files?.[0])}
                                  />
                                  <AdminButton onClick={openProgramStudentCreate} disabled={isWorking}>+ Add Student</AdminButton>
                                </div>
                              </div>

                              <div className="rounded-xl border overflow-x-auto" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                                <table className="w-full text-sm">
                                  <thead style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb' }}>
                                    <tr>
                                      <th className="text-left px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Name</th>
                                      <th className="text-left px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Email</th>
                                      <th className="text-left px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Phone</th>
                                      <th className="text-left px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Status</th>
                                      <th className="text-right px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedProgramStudents.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="px-3 py-4 text-center" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                                          No students added yet.
                                        </td>
                                      </tr>
                                    ) : (
                                      selectedProgramStudents.map((student) => (
                                        <tr key={student.id} style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                                          <td className="px-3 py-2" style={{ color: isDark ? '#d1d5db' : '#111827' }}>{student.name || '-'}</td>
                                          <td className="px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>{student.email || '-'}</td>
                                          <td className="px-3 py-2" style={{ color: isDark ? '#9ca3af' : '#4b5563' }}>{student.phone || '-'}</td>
                                          <td className="px-3 py-2" style={{ color: student.is_active ? '#10b981' : '#9ca3af' }}>{student.is_active ? 'Active' : 'Inactive'}</td>
                                          <td className="px-3 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                              <button
                                                type="button"
                                                onClick={() => openProgramStudentEdit(student)}
                                                className="px-2 py-1 text-xs rounded-lg"
                                                style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#e5e7eb' : '#111827' }}
                                              >
                                                Edit
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setProgramStudentSelectedItem(student);
                                                  setProgramStudentConfirmDelete(true);
                                                }}
                                                className="px-2 py-1 text-xs rounded-lg"
                                                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-4">
                            {peopleSelectedItem?.image_url ? (
                              <img src={resolveMediaUrl(peopleSelectedItem.image_url)} alt="" className="w-20 h-20 rounded-xl object-cover" style={{ border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }} />
                            ) : (
                              <div className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-medium" style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                {peopleSelectedItem?.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>{peopleSelectedItem?.name}</h3>
                              <p className="text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{peopleSelectedItem?.designation || 'No designation'}</p>
                              <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: isDark ? '#374151' : '#e5e7eb', color: isDark ? '#d1d5db' : '#374151' }}>
                                {peopleCategoryOptions.find(c => c.value === peopleSelectedItem?.category)?.label || peopleSelectedItem?.category}
                              </span>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Specialization</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.specialization || '-'}</p></div>
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Department</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.department || '-'}</p></div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Email</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.email || '-'}</p></div>
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Phone</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.phone || '-'}</p></div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Room/Office</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.room || '-'}</p></div>
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Year/Batch</p><p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem?.year_label || '-'}</p></div>
                          </div>
                          {peopleSelectedItem?.profile_url && (
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Profile URL</p><a href={peopleSelectedItem.profile_url} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{peopleSelectedItem.profile_url}</a></div>
                          )}
                          {peopleSelectedItem?.resource_link && (
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Resource Link</p><a href={peopleSelectedItem.resource_link} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{peopleSelectedItem.resource_link}</a></div>
                          )}
                          {peopleSelectedItem?.research_interests_text && (
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Research Interests</p><p className="text-sm whitespace-pre-line" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem.research_interests_text}</p></div>
                          )}
                          {peopleSelectedItem?.responsibilities_text && (
                            <div><p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Responsibilities</p><p className="text-sm whitespace-pre-line" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{peopleSelectedItem.responsibilities_text}</p></div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </AdminModal>

                <ConfirmationModal isOpen={peopleConfirmSave} onClose={() => setPeopleConfirmSave(false)} onConfirm={savePeopleEntry} title="Confirm Save" message="Save this people entry?" confirmText="Save" variant="info" isLoading={isWorking} />
                <ConfirmationModal isOpen={peopleConfirmDelete} onClose={() => setPeopleConfirmDelete(false)} onConfirm={deletePeopleEntryItem} title="Confirm Delete" message="Delete this people entry?" confirmText="Delete" variant="danger" isLoading={isWorking} />

                <AdminModal
                  isOpen={programStudentModalOpen}
                  onClose={closeProgramStudentModal}
                  title={programStudentSelectedItem ? 'Edit Student' : 'Add Student'}
                  size="md"
                  footer={
                    <div className="flex justify-between gap-3">
                      {programStudentSelectedItem ? (
                        <AdminButton
                          variant="danger"
                          onClick={() => setProgramStudentConfirmDelete(true)}
                          disabled={isWorking}
                        >
                          Delete
                        </AdminButton>
                      ) : <div />}
                      <div className="flex gap-3">
                        <AdminButton variant="secondary" onClick={closeProgramStudentModal} disabled={isWorking}>Cancel</AdminButton>
                        <AdminButton onClick={saveProgramStudentEntry} disabled={isWorking}>Save</AdminButton>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <AdminInput label="Name" value={programStudentDraft.name} onChange={(e) => setProgramStudentDraft((prev) => ({ ...prev, name: e.target.value }))} placeholder="Student full name" />
                      <AdminInput label="Email" type="email" value={programStudentDraft.email} onChange={(e) => setProgramStudentDraft((prev) => ({ ...prev, email: e.target.value }))} placeholder="student@iiti.ac.in" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <AdminInput label="Phone" value={programStudentDraft.phone} onChange={(e) => setProgramStudentDraft((prev) => ({ ...prev, phone: e.target.value }))} placeholder="+91..." />
                      <AdminInput label="Sort Order" type="number" value={programStudentDraft.sort_order} onChange={(e) => setProgramStudentDraft((prev) => ({ ...prev, sort_order: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <AdminInput label="Image URL" value={programStudentDraft.image_url} onChange={(e) => setProgramStudentDraft((prev) => ({ ...prev, image_url: e.target.value }))} placeholder="Image URL" />
                      <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], 'people', (url) => setProgramStudentDraft((prev) => ({ ...prev, image_url: url })))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer" style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="program-student-active"
                        checked={Boolean(programStudentDraft.is_active)}
                        onChange={(e) => setProgramStudentDraft((prev) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor="program-student-active" className="text-sm font-medium" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                        Active
                      </label>
                    </div>
                  </div>
                </AdminModal>

                <ConfirmationModal
                  isOpen={programStudentConfirmDelete}
                  onClose={() => setProgramStudentConfirmDelete(false)}
                  onConfirm={deleteProgramStudentEntry}
                  title="Confirm Delete"
                  message="Delete this student entry?"
                  confirmText="Delete"
                  variant="danger"
                  isLoading={isWorking}
                />
              </>
            )}

            {/* About Content Section */}
            {activeSection === 'about-content' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        About Page Content
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Hero, story, mission/vision, values, milestones, and stats
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {aboutEditMode ? (
                        <>
                          <AdminButton variant="secondary" onClick={() => setAboutEditMode(false)}>Cancel</AdminButton>
                          <AdminButton onClick={() => setAboutConfirmSave(true)} disabled={isWorking}>Save Changes</AdminButton>
                        </>
                      ) : (
                        <AdminButton onClick={() => setAboutEditMode(true)}>Edit Content</AdminButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Hero Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Hero Section</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Hero Title" value={aboutContent.hero_title} onChange={(e) => setAboutContent(prev => ({ ...prev, hero_title: e.target.value }))} disabled={!aboutEditMode} />
                        <AdminInput label="Hero Subtitle" value={aboutContent.hero_subtitle} onChange={(e) => setAboutContent(prev => ({ ...prev, hero_subtitle: e.target.value }))} disabled={!aboutEditMode} />
                      </div>
                    </div>

                    {/* Story Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Story Section</h3>
                      <AdminInput label="Story Title" value={aboutContent.story_title} onChange={(e) => setAboutContent(prev => ({ ...prev, story_title: e.target.value }))} disabled={!aboutEditMode} />
                      <div className="mt-4 space-y-4">
                        <AdminTextarea label="Story Paragraph 1" value={aboutContent.story_paragraph_1} onChange={(e) => setAboutContent(prev => ({ ...prev, story_paragraph_1: e.target.value }))} disabled={!aboutEditMode} rows={3} />
                        <AdminTextarea label="Story Paragraph 2" value={aboutContent.story_paragraph_2} onChange={(e) => setAboutContent(prev => ({ ...prev, story_paragraph_2: e.target.value }))} disabled={!aboutEditMode} rows={3} />
                        <AdminTextarea label="Story Paragraph 3" value={aboutContent.story_paragraph_3} onChange={(e) => setAboutContent(prev => ({ ...prev, story_paragraph_3: e.target.value }))} disabled={!aboutEditMode} rows={3} />
                      </div>
                      <div className="mt-4 space-y-2">
                        <AdminInput label="Story Image URL" value={aboutContent.story_image_url} onChange={(e) => setAboutContent(prev => ({ ...prev, story_image_url: e.target.value }))} disabled={!aboutEditMode} />
                        {aboutEditMode && <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0], 'about', (url) => setAboutContent(prev => ({ ...prev, story_image_url: url })))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer" style={{ color: isDark ? '#9ca3af' : '#4b5563' }} />}
                      </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Mission & Vision</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <AdminInput label="Mission Title" value={aboutContent.mission_title} onChange={(e) => setAboutContent(prev => ({ ...prev, mission_title: e.target.value }))} disabled={!aboutEditMode} />
                          <AdminTextarea label="Mission Description" value={aboutContent.mission_description} onChange={(e) => setAboutContent(prev => ({ ...prev, mission_description: e.target.value }))} disabled={!aboutEditMode} rows={3} />
                        </div>
                        <div className="space-y-4">
                          <AdminInput label="Vision Title" value={aboutContent.vision_title} onChange={(e) => setAboutContent(prev => ({ ...prev, vision_title: e.target.value }))} disabled={!aboutEditMode} />
                          <AdminTextarea label="Vision Description" value={aboutContent.vision_description} onChange={(e) => setAboutContent(prev => ({ ...prev, vision_description: e.target.value }))} disabled={!aboutEditMode} rows={3} />
                        </div>
                      </div>
                    </div>

                    {/* Core Values */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Core Values</h3>
                        {aboutEditMode && <AdminButton size="sm" onClick={() => addAboutListItem('values_items', defaultAboutValueItem)}>+ Add Value</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Values Title" value={aboutContent.values_title} onChange={(e) => setAboutContent(prev => ({ ...prev, values_title: e.target.value }))} disabled={!aboutEditMode} />
                        <AdminInput label="Values Subtitle" value={aboutContent.values_subtitle} onChange={(e) => setAboutContent(prev => ({ ...prev, values_subtitle: e.target.value }))} disabled={!aboutEditMode} />
                      </div>
                      <div className="space-y-3">
                        {(aboutContent.values_items || []).map((item, idx) => (
                          <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <div className="flex items-start gap-3">
                              <div className="flex-1 grid md:grid-cols-3 gap-3">
                                <select value={item.icon_name} onChange={(e) => updateAboutListItem('values_items', idx, { icon_name: e.target.value })} disabled={!aboutEditMode} className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }}>
                                  {aboutValueIconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                </select>
                                <input type="text" value={item.title} onChange={(e) => updateAboutListItem('values_items', idx, { title: e.target.value })} disabled={!aboutEditMode} placeholder="Title" className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                                <input type="text" value={item.description} onChange={(e) => updateAboutListItem('values_items', idx, { description: e.target.value })} disabled={!aboutEditMode} placeholder="Description" className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              </div>
                              {aboutEditMode && <button onClick={() => removeAboutListItem('values_items', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" style={{ backgroundColor: 'transparent' }}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                            </div>
                          </div>
                        ))}
                        {(aboutContent.values_items || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No values added yet</p>}
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Milestones</h3>
                        {aboutEditMode && <AdminButton size="sm" onClick={() => addAboutListItem('milestones', defaultAboutMilestoneItem)}>+ Add Milestone</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Milestones Title" value={aboutContent.milestones_title} onChange={(e) => setAboutContent(prev => ({ ...prev, milestones_title: e.target.value }))} disabled={!aboutEditMode} />
                        <AdminInput label="Milestones Subtitle" value={aboutContent.milestones_subtitle} onChange={(e) => setAboutContent(prev => ({ ...prev, milestones_subtitle: e.target.value }))} disabled={!aboutEditMode} />
                      </div>
                      <div className="space-y-2">
                        {(aboutContent.milestones || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <input type="text" value={item.year} onChange={(e) => updateAboutListItem('milestones', idx, { year: e.target.value })} disabled={!aboutEditMode} placeholder="Year" className="w-24 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="text" value={item.event} onChange={(e) => updateAboutListItem('milestones', idx, { event: e.target.value })} disabled={!aboutEditMode} placeholder="Event description" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            {aboutEditMode && <button onClick={() => removeAboutListItem('milestones', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                          </div>
                        ))}
                        {(aboutContent.milestones || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No milestones added yet</p>}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>About Stats</h3>
                        {aboutEditMode && <AdminButton size="sm" onClick={() => addAboutListItem('stats_items', defaultAboutStatItem)}>+ Add Stat</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Stats Title" value={aboutContent.stats_title} onChange={(e) => setAboutContent(prev => ({ ...prev, stats_title: e.target.value }))} disabled={!aboutEditMode} />
                        <AdminInput label="Stats Subtitle" value={aboutContent.stats_subtitle} onChange={(e) => setAboutContent(prev => ({ ...prev, stats_subtitle: e.target.value }))} disabled={!aboutEditMode} />
                      </div>
                      <div className="space-y-2">
                        {(aboutContent.stats_items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <input type="text" value={item.label} onChange={(e) => updateAboutListItem('stats_items', idx, { label: e.target.value })} disabled={!aboutEditMode} placeholder="Label" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="number" value={item.value} onChange={(e) => updateAboutListItem('stats_items', idx, { value: e.target.value })} disabled={!aboutEditMode} placeholder="Value" className="w-24 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="text" value={item.suffix} onChange={(e) => updateAboutListItem('stats_items', idx, { suffix: e.target.value })} disabled={!aboutEditMode} placeholder="Suffix" className="w-20 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            {aboutEditMode && <button onClick={() => removeAboutListItem('stats_items', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                          </div>
                        ))}
                        {(aboutContent.stats_items || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No stats added yet</p>}
                      </div>
                    </div>
                  </div>
                </AdminCard>

                <ConfirmationModal isOpen={aboutConfirmSave} onClose={() => setAboutConfirmSave(false)} onConfirm={saveAboutContent} title="Confirm Save" message="Save about page content?" confirmText="Save" variant="info" isLoading={isWorking} />
              </>
            )}

            {/* Academics Content Section */}
            {activeSection === 'academics-content' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        Academics Page Content
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Programs, curriculum, facilities, and admission info
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {academicsEditMode ? (
                        <>
                          <AdminButton variant="secondary" onClick={() => setAcademicsEditMode(false)}>Cancel</AdminButton>
                          <AdminButton onClick={() => setAcademicsConfirmSave(true)} disabled={isWorking}>Save Changes</AdminButton>
                        </>
                      ) : (
                        <AdminButton onClick={() => setAcademicsEditMode(true)}>Edit Content</AdminButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Hero Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Hero Section</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Hero Title" value={academicsContent.hero_title} onChange={(e) => setAcademicsContent(prev => ({ ...prev, hero_title: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Hero Subtitle" value={academicsContent.hero_subtitle} onChange={(e) => setAcademicsContent(prev => ({ ...prev, hero_subtitle: e.target.value }))} disabled={!academicsEditMode} />
                      </div>
                    </div>

                    {/* Programs */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Programs</h3>
                        {academicsEditMode && <AdminButton size="sm" onClick={addAcademicsProgram}>+ Add Program</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Programs Title" value={academicsContent.programs_title} onChange={(e) => setAcademicsContent(prev => ({ ...prev, programs_title: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Programs Subtitle" value={academicsContent.programs_subtitle} onChange={(e) => setAcademicsContent(prev => ({ ...prev, programs_subtitle: e.target.value }))} disabled={!academicsEditMode} />
                      </div>
                      <div className="space-y-4">
                        {(academicsContent.programs || []).map((program, idx) => (
                          <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: isDark ? '#1f2937' : '#e5e7eb', color: isDark ? '#9ca3af' : '#6b7280' }}>Program {idx + 1}</span>
                              {academicsEditMode && <button onClick={() => removeAcademicsProgram(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <input type="text" value={program.title} onChange={(e) => updateAcademicsProgram(idx, { title: e.target.value })} disabled={!academicsEditMode} placeholder="Program Title" className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={program.duration} onChange={(e) => updateAcademicsProgram(idx, { duration: e.target.value })} disabled={!academicsEditMode} placeholder="Duration (e.g., 4 years)" className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={program.intake} onChange={(e) => updateAcademicsProgram(idx, { intake: e.target.value })} disabled={!academicsEditMode} placeholder="Intake (e.g., 60 seats)" className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={program.link_url} onChange={(e) => updateAcademicsProgram(idx, { link_url: e.target.value })} disabled={!academicsEditMode} placeholder="Link URL" className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            </div>
                            <textarea value={program.description} onChange={(e) => updateAcademicsProgram(idx, { description: e.target.value })} disabled={!academicsEditMode} placeholder="Description" rows={2} className="mt-3 px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <div className="grid md:grid-cols-2 gap-3 mt-3">
                              <textarea value={formatMultilineList(program.highlights)} onChange={(e) => updateAcademicsProgram(idx, { highlights: parseMultilineList(e.target.value) })} disabled={!academicsEditMode} placeholder="Highlights (one per line)" rows={2} className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <textarea value={formatMultilineList(program.courses)} onChange={(e) => updateAcademicsProgram(idx, { courses: parseMultilineList(e.target.value) })} disabled={!academicsEditMode} placeholder="Courses (one per line)" rows={2} className="px-3 py-2 rounded-lg text-sm border w-full" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            </div>
                          </div>
                        ))}
                        {(academicsContent.programs || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No programs added yet</p>}
                      </div>
                    </div>

                    {/* Curriculum */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Curriculum Semesters</h3>
                        {academicsEditMode && <AdminButton size="sm" onClick={addAcademicsSemester}>+ Add Semester</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Curriculum Title" value={academicsContent.curriculum_title} onChange={(e) => setAcademicsContent(prev => ({ ...prev, curriculum_title: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Curriculum Subtitle" value={academicsContent.curriculum_subtitle} onChange={(e) => setAcademicsContent(prev => ({ ...prev, curriculum_subtitle: e.target.value }))} disabled={!academicsEditMode} />
                      </div>
                      <div className="space-y-3">
                        {(academicsContent.curriculum_semesters || []).map((semester, idx) => (
                          <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <div className="flex items-start gap-3">
                              <input type="text" value={semester.semester_label} onChange={(e) => updateAcademicsSemester(idx, { semester_label: e.target.value })} disabled={!academicsEditMode} placeholder="Semester Label" className="w-40 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <textarea value={formatMultilineList(semester.courses)} onChange={(e) => updateAcademicsSemester(idx, { courses: parseMultilineList(e.target.value) })} disabled={!academicsEditMode} placeholder="Courses (one per line)" rows={2} className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              {academicsEditMode && <button onClick={() => removeAcademicsSemester(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                            </div>
                          </div>
                        ))}
                        {(academicsContent.curriculum_semesters || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No semesters added yet</p>}
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Facilities</h3>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Facilities Title" value={academicsContent.facilities_title} onChange={(e) => setAcademicsContent(prev => ({ ...prev, facilities_title: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Facilities Subtitle" value={academicsContent.facilities_subtitle} onChange={(e) => setAcademicsContent(prev => ({ ...prev, facilities_subtitle: e.target.value }))} disabled={!academicsEditMode} />
                      </div>
                      <AdminTextarea label="Facilities List (one per line)" value={formatMultilineList(academicsContent.facilities_items)} onChange={(e) => setAcademicsContent(prev => ({ ...prev, facilities_items: parseMultilineList(e.target.value) }))} disabled={!academicsEditMode} rows={4} />
                    </div>

                    {/* Admission */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Admission Section</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Admission Title" value={academicsContent.admission_title} onChange={(e) => setAcademicsContent(prev => ({ ...prev, admission_title: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Admission Subtitle" value={academicsContent.admission_subtitle} onChange={(e) => setAcademicsContent(prev => ({ ...prev, admission_subtitle: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Primary Button Text" value={academicsContent.admission_primary_text} onChange={(e) => setAcademicsContent(prev => ({ ...prev, admission_primary_text: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Primary Button Link" value={academicsContent.admission_primary_link} onChange={(e) => setAcademicsContent(prev => ({ ...prev, admission_primary_link: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Secondary Button Text" value={academicsContent.admission_secondary_text} onChange={(e) => setAcademicsContent(prev => ({ ...prev, admission_secondary_text: e.target.value }))} disabled={!academicsEditMode} />
                        <AdminInput label="Secondary Button Link" value={academicsContent.admission_secondary_link} onChange={(e) => setAcademicsContent(prev => ({ ...prev, admission_secondary_link: e.target.value }))} disabled={!academicsEditMode} />
                      </div>
                    </div>
                  </div>
                </AdminCard>

                <ConfirmationModal isOpen={academicsConfirmSave} onClose={() => setAcademicsConfirmSave(false)} onConfirm={saveAcademicsContent} title="Confirm Save" message="Save academics page content?" confirmText="Save" variant="info" isLoading={isWorking} />
              </>
            )}

            {/* Contact Responses Section */}
            {activeSection === 'contact-submissions' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        Contact Form Responses
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Click any row to view full response details.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <AdminButton variant="secondary" onClick={refreshContactSubmissions} disabled={isWorking}>
                        Refresh
                      </AdminButton>
                    </div>
                  </div>

                  <div
                    className="overflow-hidden rounded-lg"
                    style={{ border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr
                            style={{
                              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                              borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                            }}
                          >
                            <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Name</th>
                            <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Email</th>
                            <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</th>
                            <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Subject</th>
                            <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Received</th>
                          </tr>
                        </thead>
                        <tbody style={{ backgroundColor: isDark ? '#111827' : '#ffffff' }}>
                          {contactSubmissions.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-10 text-center text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                                No contact responses submitted yet.
                              </td>
                            </tr>
                          ) : (
                            contactSubmissions.map((submission) => (
                              <tr
                                key={submission.id}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer transition-colors"
                                style={{ borderTop: `1px solid ${isDark ? '#1f2937' : '#f3f4f6'}` }}
                                onClick={() => openContactSubmissionModal(submission)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openContactSubmissionModal(submission);
                                  }
                                }}
                                onMouseEnter={(event) => {
                                  event.currentTarget.style.backgroundColor = isDark ? '#1f2937' : '#f9fafb';
                                }}
                                onMouseLeave={(event) => {
                                  event.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <td className="py-3 px-4 text-sm font-medium" style={{ color: isDark ? '#ffffff' : '#111827' }}>{submission.full_name || '-'}</td>
                                <td className="py-3 px-4 text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{submission.email || '-'}</td>
                                <td className="py-3 px-4 text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{submission.category || '-'}</td>
                                <td className="py-3 px-4 text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{submission.subject || '-'}</td>
                                <td className="py-3 px-4 text-sm" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>{formatReadableDateTime(submission.created_at)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AdminCard>

                <AdminModal
                  isOpen={contactSubmissionModalOpen}
                  onClose={closeContactSubmissionModal}
                  title="Contact Response Details"
                  size="lg"
                  footer={
                    <div className="flex justify-end gap-3">
                      <AdminButton variant="secondary" onClick={closeContactSubmissionModal}>Close</AdminButton>
                    </div>
                  }
                >
                  {contactSubmissionSelectedItem && (
                    <div className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Name</p>
                          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{contactSubmissionSelectedItem.full_name || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Email</p>
                          <p className="text-sm break-all" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{contactSubmissionSelectedItem.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Category</p>
                          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{contactSubmissionSelectedItem.category || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Received</p>
                          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{formatReadableDateTime(contactSubmissionSelectedItem.created_at)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Subject</p>
                        <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{contactSubmissionSelectedItem.subject || '-'}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Message</p>
                        <div className="p-3 rounded-lg text-sm whitespace-pre-wrap" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, color: isDark ? '#d1d5db' : '#374151' }}>
                          {contactSubmissionSelectedItem.message || '-'}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>IP Address</p>
                          <p className="text-sm" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{contactSubmissionSelectedItem.ip_address || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>User Agent</p>
                          <p className="text-sm break-words" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{contactSubmissionSelectedItem.user_agent || '-'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </AdminModal>
              </>
            )}

            {/* Contact Content Section */}
            {activeSection === 'contact-content' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        Contact Page Content
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Contact info, key contacts, quick links, and form settings
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {contactEditMode ? (
                        <>
                          <AdminButton variant="secondary" onClick={() => setContactEditMode(false)}>Cancel</AdminButton>
                          <AdminButton onClick={() => setContactConfirmSave(true)} disabled={isWorking}>Save Changes</AdminButton>
                        </>
                      ) : (
                        <AdminButton onClick={() => setContactEditMode(true)}>Edit Content</AdminButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Hero Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Hero Section</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Hero Title" value={contactContent.hero_title} onChange={(e) => setContactContent(prev => ({ ...prev, hero_title: e.target.value }))} disabled={!contactEditMode} />
                        <AdminInput label="Hero Subtitle" value={contactContent.hero_subtitle} onChange={(e) => setContactContent(prev => ({ ...prev, hero_subtitle: e.target.value }))} disabled={!contactEditMode} />
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Contact Info Cards</h3>
                        {contactEditMode && <AdminButton size="sm" onClick={() => addContactListItem('contact_info_cards', defaultContactInfoCard)}>+ Add Card</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Info Section Title" value={contactContent.info_section_title} onChange={(e) => setContactContent(prev => ({ ...prev, info_section_title: e.target.value }))} disabled={!contactEditMode} />
                        <AdminInput label="Info Section Subtitle" value={contactContent.info_section_subtitle} onChange={(e) => setContactContent(prev => ({ ...prev, info_section_subtitle: e.target.value }))} disabled={!contactEditMode} />
                      </div>
                      <div className="space-y-3">
                        {(contactContent.contact_info_cards || []).map((card, idx) => (
                          <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <div className="flex items-start gap-3">
                              <select value={card.icon_name} onChange={(e) => updateContactListItem('contact_info_cards', idx, { icon_name: e.target.value })} disabled={!contactEditMode} className="w-32 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }}>
                                {contactInfoIconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                              </select>
                              <input type="text" value={card.title} onChange={(e) => updateContactListItem('contact_info_cards', idx, { title: e.target.value })} disabled={!contactEditMode} placeholder="Card Title" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              {contactEditMode && <button onClick={() => removeContactListItem('contact_info_cards', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                            </div>
                            <textarea value={(card.details || []).join('\n')} onChange={(e) => updateContactListItem('contact_info_cards', idx, { details: e.target.value.split('\n') })} disabled={!contactEditMode} placeholder="Details (one per line)" rows={2} className="mt-2 w-full px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                          </div>
                        ))}
                        {(contactContent.contact_info_cards || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No info cards added yet</p>}
                      </div>
                    </div>

                    {/* Form Settings */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Contact Form</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Form Title" value={contactContent.form_title} onChange={(e) => setContactContent(prev => ({ ...prev, form_title: e.target.value }))} disabled={!contactEditMode} />
                        <AdminInput label="Submit Message" value={contactContent.form_submit_message} onChange={(e) => setContactContent(prev => ({ ...prev, form_submit_message: e.target.value }))} disabled={!contactEditMode} />
                      </div>
                      <AdminTextarea label="Form Categories (one per line)" value={(contactContent.form_categories || []).join('\n')} onChange={(e) => setContactContent(prev => ({ ...prev, form_categories: e.target.value.split('\n').filter(Boolean) }))} disabled={!contactEditMode} rows={3} />
                    </div>

                    {/* Key Contacts */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Key Contacts</h3>
                        {contactEditMode && <AdminButton size="sm" onClick={() => addContactListItem('key_contacts', defaultKeyContact)}>+ Add Contact</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Key Contacts Title" value={contactContent.key_contacts_title} onChange={(e) => setContactContent(prev => ({ ...prev, key_contacts_title: e.target.value }))} disabled={!contactEditMode} />
                        <AdminInput label="Key Contacts Subtitle" value={contactContent.key_contacts_subtitle} onChange={(e) => setContactContent(prev => ({ ...prev, key_contacts_subtitle: e.target.value }))} disabled={!contactEditMode} />
                      </div>
                      <div className="space-y-3">
                        {(contactContent.key_contacts || []).map((contact, idx) => (
                          <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-xs font-medium" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Contact {idx + 1}</span>
                              {contactEditMode && <button onClick={() => removeContactListItem('key_contacts', idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                            </div>
                            <div className="grid md:grid-cols-2 gap-2">
                              <input type="text" value={contact.name} onChange={(e) => updateContactListItem('key_contacts', idx, { name: e.target.value })} disabled={!contactEditMode} placeholder="Name" className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={contact.designation} onChange={(e) => updateContactListItem('key_contacts', idx, { designation: e.target.value })} disabled={!contactEditMode} placeholder="Designation" className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="email" value={contact.email} onChange={(e) => updateContactListItem('key_contacts', idx, { email: e.target.value })} disabled={!contactEditMode} placeholder="Email" className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={contact.phone} onChange={(e) => updateContactListItem('key_contacts', idx, { phone: e.target.value })} disabled={!contactEditMode} placeholder="Phone" className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={contact.office} onChange={(e) => updateContactListItem('key_contacts', idx, { office: e.target.value })} disabled={!contactEditMode} placeholder="Office" className="px-3 py-2 rounded-lg text-sm border md:col-span-2" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            </div>
                          </div>
                        ))}
                        {(contactContent.key_contacts || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No key contacts added yet</p>}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Quick Links</h3>
                        {contactEditMode && <AdminButton size="sm" onClick={() => addContactListItem('quick_links', defaultQuickLinkItem)}>+ Add Link</AdminButton>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <AdminInput label="Quick Links Title" value={contactContent.quick_links_title} onChange={(e) => setContactContent(prev => ({ ...prev, quick_links_title: e.target.value }))} disabled={!contactEditMode} />
                        <AdminInput label="Quick Links Subtitle" value={contactContent.quick_links_subtitle} onChange={(e) => setContactContent(prev => ({ ...prev, quick_links_subtitle: e.target.value }))} disabled={!contactEditMode} />
                      </div>
                      <div className="space-y-2">
                        {(contactContent.quick_links || []).map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <input type="text" value={link.title} onChange={(e) => updateContactListItem('quick_links', idx, { title: e.target.value })} disabled={!contactEditMode} placeholder="Title" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="text" value={link.description} onChange={(e) => updateContactListItem('quick_links', idx, { description: e.target.value })} disabled={!contactEditMode} placeholder="Description" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="text" value={link.url} onChange={(e) => updateContactListItem('quick_links', idx, { url: e.target.value })} disabled={!contactEditMode} placeholder="URL" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            {contactEditMode && <button onClick={() => removeContactListItem('quick_links', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                          </div>
                        ))}
                        {(contactContent.quick_links || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No quick links added yet</p>}
                      </div>
                    </div>

                    {/* Map URL */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Map Embed</h3>
                      <AdminInput label="Map Embed URL" value={contactContent.map_embed_url} onChange={(e) => setContactContent(prev => ({ ...prev, map_embed_url: e.target.value }))} disabled={!contactEditMode} placeholder="Google Maps embed URL" />
                    </div>
                  </div>
                </AdminCard>

                <ConfirmationModal isOpen={contactConfirmSave} onClose={() => setContactConfirmSave(false)} onConfirm={saveContactContentHandler} title="Confirm Save" message="Save contact page content?" confirmText="Save" variant="info" isLoading={isWorking} />
              </>
            )}

            {/* Events Content Section */}
            {activeSection === 'events-content' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        Events Page Content
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Hero content, upcoming and past events
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {eventsEditMode ? (
                        <>
                          <AdminButton variant="secondary" onClick={() => setEventsEditMode(false)}>Cancel</AdminButton>
                          <AdminButton onClick={() => setEventsConfirmSave(true)} disabled={isWorking}>Save Changes</AdminButton>
                        </>
                      ) : (
                        <AdminButton onClick={() => setEventsEditMode(true)}>Edit Content</AdminButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Hero Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Hero Section & Labels</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Hero Title" value={eventsContent.hero_title} onChange={(e) => setEventsContent(prev => ({ ...prev, hero_title: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="Hero Subtitle" value={eventsContent.hero_subtitle} onChange={(e) => setEventsContent(prev => ({ ...prev, hero_subtitle: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="Search Placeholder" value={eventsContent.search_placeholder} onChange={(e) => setEventsContent(prev => ({ ...prev, search_placeholder: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="News Tab Label" value={eventsContent.tab_news_label} onChange={(e) => setEventsContent(prev => ({ ...prev, tab_news_label: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="Upcoming Tab Label" value={eventsContent.tab_upcoming_label} onChange={(e) => setEventsContent(prev => ({ ...prev, tab_upcoming_label: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="Past Tab Label" value={eventsContent.tab_past_label} onChange={(e) => setEventsContent(prev => ({ ...prev, tab_past_label: e.target.value }))} disabled={!eventsEditMode} />
                      </div>
                    </div>

                    {/* Empty State Messages */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Empty State Messages</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <AdminInput label="No News Message" value={eventsContent.no_news_message} onChange={(e) => setEventsContent(prev => ({ ...prev, no_news_message: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="No Upcoming Message" value={eventsContent.no_upcoming_message} onChange={(e) => setEventsContent(prev => ({ ...prev, no_upcoming_message: e.target.value }))} disabled={!eventsEditMode} />
                        <AdminInput label="No Past Message" value={eventsContent.no_past_message} onChange={(e) => setEventsContent(prev => ({ ...prev, no_past_message: e.target.value }))} disabled={!eventsEditMode} />
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Upcoming Events</h3>
                        {eventsEditMode && <AdminButton size="sm" onClick={() => addEventItem('upcoming_events')}>+ Add Event</AdminButton>}
                      </div>
                      <AdminTable
                        columns={eventTableColumns}
                        data={getEventTableRows('upcoming_events')}
                        getRowId={(row) => row.__rowId}
                        showActions={false}
                        onEdit={eventsEditMode ? (draft) => saveEventRowItem('upcoming_events', draft) : undefined}
                        onDelete={eventsEditMode ? (row) => deleteEventRowItem('upcoming_events', row) : undefined}
                        renderViewContent={renderEventViewContent}
                        renderEditContent={(draft, updateDraft) => renderEventEditContent('upcoming_events', draft, updateDraft)}
                        viewTitle="Upcoming Event Details"
                        editTitle="Edit Upcoming Event"
                        deleteTitle="Delete Upcoming Event"
                        emptyMessage={eventsContent.no_upcoming_message || 'No upcoming events'}
                        isWorking={isWorking}
                      />
                    </div>

                    {/* Past Events */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Past Events</h3>
                        {eventsEditMode && <AdminButton size="sm" onClick={() => addEventItem('past_events')}>+ Add Event</AdminButton>}
                      </div>
                      <AdminTable
                        columns={eventTableColumns}
                        data={getEventTableRows('past_events')}
                        getRowId={(row) => row.__rowId}
                        showActions={false}
                        onEdit={eventsEditMode ? (draft) => saveEventRowItem('past_events', draft) : undefined}
                        onDelete={eventsEditMode ? (row) => deleteEventRowItem('past_events', row) : undefined}
                        renderViewContent={renderEventViewContent}
                        renderEditContent={(draft, updateDraft) => renderEventEditContent('past_events', draft, updateDraft)}
                        viewTitle="Past Event Details"
                        editTitle="Edit Past Event"
                        deleteTitle="Delete Past Event"
                        emptyMessage={eventsContent.no_past_message || 'No past events'}
                        isWorking={isWorking}
                      />
                    </div>
                  </div>
                </AdminCard>

                <ConfirmationModal isOpen={eventsConfirmSave} onClose={() => setEventsConfirmSave(false)} onConfirm={saveEventsContentHandler} title="Confirm Save" message="Save events page content?" confirmText="Save" variant="info" isLoading={isWorking} />
              </>
            )}

            {/* Specializations Content Section */}
            {activeSection === 'specializations-content' && (
              <>
                <AdminCard>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                        Specializations Page Content
                      </h2>
                      <p className="text-sm mt-1" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                        Research areas, specializations, and laboratories
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {specializationsEditMode ? (
                        <>
                          <AdminButton variant="secondary" onClick={() => setSpecializationsEditMode(false)}>Cancel</AdminButton>
                          <AdminButton onClick={() => setSpecializationsConfirmSave(true)} disabled={isWorking}>Save Changes</AdminButton>
                        </>
                      ) : (
                        <AdminButton onClick={() => setSpecializationsEditMode(true)}>Edit Content</AdminButton>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Hero Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: isDark ? '#ffffff' : '#111827' }}>Hero Section & Labels</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <AdminInput label="Hero Title" value={specializationsContent.hero_title} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, hero_title: e.target.value }))} disabled={!specializationsEditMode} />
                        <AdminInput label="Hero Subtitle" value={specializationsContent.hero_subtitle} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, hero_subtitle: e.target.value }))} disabled={!specializationsEditMode} />
                        <AdminInput label="Specializations Tab Label" value={specializationsContent.specializations_tab_label} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, specializations_tab_label: e.target.value }))} disabled={!specializationsEditMode} />
                        <AdminInput label="Laboratories Tab Label" value={specializationsContent.laboratories_tab_label} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, laboratories_tab_label: e.target.value }))} disabled={!specializationsEditMode} />
                        <AdminInput label="Specializations Title" value={specializationsContent.specializations_title} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, specializations_title: e.target.value }))} disabled={!specializationsEditMode} />
                        <AdminInput label="Specializations Subtitle" value={specializationsContent.specializations_subtitle} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, specializations_subtitle: e.target.value }))} disabled={!specializationsEditMode} />
                      </div>
                    </div>

                    {/* Specializations List */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Specializations</h3>
                        {specializationsEditMode && <AdminButton size="sm" onClick={addSpecialization}>+ Add Specialization</AdminButton>}
                      </div>
                      <div className="space-y-4">
                        {(specializationsContent.specializations || []).map((spec, idx) => (
                          <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: isDark ? '#1f2937' : '#e5e7eb', color: isDark ? '#9ca3af' : '#6b7280' }}>Specialization {idx + 1}</span>
                              {specializationsEditMode && <button onClick={() => removeSpecialization(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <input type="text" value={spec.key} onChange={(e) => updateSpecialization(idx, { key: e.target.value })} disabled={!specializationsEditMode} placeholder="Key (e.g., materials)" className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <input type="text" value={spec.title} onChange={(e) => updateSpecialization(idx, { title: e.target.value })} disabled={!specializationsEditMode} placeholder="Title" className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                              <select value={spec.color} onChange={(e) => updateSpecialization(idx, { color: e.target.value })} disabled={!specializationsEditMode} className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }}>
                                {specializationColorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                              <select value={spec.icon_name} onChange={(e) => updateSpecialization(idx, { icon_name: e.target.value })} disabled={!specializationsEditMode} className="px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }}>
                                {specializationIconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                              </select>
                            </div>
                            <textarea value={spec.description} onChange={(e) => updateSpecialization(idx, { description: e.target.value })} disabled={!specializationsEditMode} placeholder="Description" rows={2} className="mt-3 w-full px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="text" value={spec.image_url} onChange={(e) => updateSpecialization(idx, { image_url: e.target.value })} disabled={!specializationsEditMode} placeholder="Image URL" className="mt-3 w-full px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                          </div>
                        ))}
                        {(specializationsContent.specializations || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No specializations added yet</p>}
                      </div>
                    </div>

                    {/* Laboratory Rows */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: isDark ? '#1f2937' : '#f9fafb', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold" style={{ color: isDark ? '#ffffff' : '#111827' }}>Laboratory Directory</h3>
                        {specializationsEditMode && <AdminButton size="sm" onClick={addLabRow}>+ Add Lab</AdminButton>}
                      </div>
                      <AdminInput label="Laboratories Title" value={specializationsContent.laboratories_title} onChange={(e) => setSpecializationsContent(prev => ({ ...prev, laboratories_title: e.target.value }))} disabled={!specializationsEditMode} />
                      <div className="mt-4 space-y-2">
                        {(specializationsContent.laboratory_rows || []).map((row, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: isDark ? '#374151' : '#ffffff', border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}` }}>
                            <input type="text" value={row.name} onChange={(e) => updateLabRow(idx, { name: e.target.value })} disabled={!specializationsEditMode} placeholder="Lab Name" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            <input type="text" value={row.location} onChange={(e) => updateLabRow(idx, { location: e.target.value })} disabled={!specializationsEditMode} placeholder="Location" className="flex-1 px-3 py-2 rounded-lg text-sm border" style={{ backgroundColor: isDark ? '#1f2937' : '#ffffff', borderColor: isDark ? '#4b5563' : '#d1d5db', color: isDark ? '#ffffff' : '#111827' }} />
                            {specializationsEditMode && <button onClick={() => removeLabRow(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
                          </div>
                        ))}
                        {(specializationsContent.laboratory_rows || []).length === 0 && <p className="text-sm text-center py-4" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>No laboratories added yet</p>}
                      </div>
                    </div>
                  </div>
                </AdminCard>

                <ConfirmationModal isOpen={specializationsConfirmSave} onClose={() => setSpecializationsConfirmSave(false)} onConfirm={saveSpecializationsContentHandler} title="Confirm Save" message="Save specializations page content?" confirmText="Save" variant="info" isLoading={isWorking} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// ============================================
// MAIN EXPORT WITH THEME PROVIDER
// ============================================

const AdminDashboard = () => {
  return (
    <ThemeProvider>
      <AdminDashboardContent />
    </ThemeProvider>
  );
};

export default AdminDashboard;
