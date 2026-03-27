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
  deleteNavigationItem,
  deleteNewsItem,
  deletePeopleEntry,
  deleteSocialLink,
  fetchAdminContent,
  fetchAdminSession,
  resolveMediaUrl,
  updatePeopleEntry,
  updateFooterLink,
  updateHeroSlide,
  updateHomeContent,
  updateHomeStat,
  updateNavigationItem,
  updateNewsItem,
  updateSiteSettings,
  updateSocialLink,
  uploadAdminImage,
} from '../lib/contentApi';
import './admin.css';

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

const peopleCategoryOptions = [
  { value: 'faculty', label: 'Faculty' },
  { value: 'staff', label: 'Staff' },
  { value: 'phd', label: 'Ph.D. Student' },
  { value: 'mtech', label: 'M.Tech Student List' },
  { value: 'btech', label: 'B.Tech Student List' },
];

const adminSectionGroups = [
  {
    label: 'Global',
    sections: [
      { key: 'site-settings', label: 'Site Settings' },
      { key: 'home-content', label: 'Home Content' },
    ],
  },
  {
    label: 'Header & Footer',
    sections: [
      { key: 'navigation', label: 'Navigation Items' },
      { key: 'social', label: 'Social Links' },
      { key: 'footer', label: 'Footer Links' },
    ],
  },
  {
    label: 'Homepage Modules',
    sections: [
      { key: 'slides', label: 'Hero Slides' },
      { key: 'stats', label: 'Home Stats' },
      { key: 'news', label: 'News Items' },
    ],
  },
  {
    label: 'People',
    sections: [{ key: 'people', label: 'People Directory' }],
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

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState('site-settings');

  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [homeContent, setHomeContent] = useState(defaultHomeContent);
  const [navigationItems, setNavigationItems] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [slides, setSlides] = useState([]);
  const [stats, setStats] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [peopleEntries, setPeopleEntries] = useState([]);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [editingPeopleId, setEditingPeopleId] = useState(null);
  const [peopleDraft, setPeopleDraft] = useState(defaultPeopleEntry);

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const loadContent = async () => {
    const data = await fetchAdminContent();

    const loadedSiteSettings = data?.siteSettings || {};
    const loadedHomeContent = data?.homeContent || {};

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

    setPeopleEntries(Array.isArray(data?.peopleEntries) ? data.peopleEntries : []);
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
    );
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

  const saveNavigationItem = (item) => {
    const payload = {
      label: item.label,
      href: item.href,
      sort_order: toInteger(item.sort_order),
      is_active: item.is_active ? 1 : 0,
    };

    runAction(
      () =>
        item.id
          ? updateNavigationItem(item.id, payload)
          : createNavigationItem(payload),
      'Navigation saved successfully.'
    );
  };

  const removeNavigationItem = (item) => {
    if (!item.id) {
      setNavigationItems((previous) => previous.filter((entry) => entry !== item));
      return;
    }

    runAction(
      () => deleteNavigationItem(item.id),
      'Navigation item deleted.'
    );
  };

  const saveSocialLink = (item) => {
    const payload = {
      platform: item.platform,
      icon: item.icon,
      url: item.url,
      sort_order: toInteger(item.sort_order),
      is_active: item.is_active ? 1 : 0,
    };

    runAction(
      () =>
        item.id
          ? updateSocialLink(item.id, payload)
          : createSocialLink(payload),
      'Social link saved successfully.'
    );
  };

  const removeSocialLink = (item) => {
    if (!item.id) {
      setSocialLinks((previous) => previous.filter((entry) => entry !== item));
      return;
    }

    runAction(
      () => deleteSocialLink(item.id),
      'Social link deleted.'
    );
  };

  const saveFooterLink = (item) => {
    const payload = {
      section: item.section,
      label: item.label,
      href: item.href,
      sort_order: toInteger(item.sort_order),
      is_active: item.is_active ? 1 : 0,
    };

    runAction(
      () =>
        item.id
          ? updateFooterLink(item.id, payload)
          : createFooterLink(payload),
      'Footer link saved successfully.'
    );
  };

  const removeFooterLink = (item) => {
    if (!item.id) {
      setFooterLinks((previous) => previous.filter((entry) => entry !== item));
      return;
    }

    runAction(
      () => deleteFooterLink(item.id),
      'Footer link deleted.'
    );
  };

  const saveSlide = (item) => {
    const payload = {
      image_url: item.image_url,
      title: item.title,
      subtitle: item.subtitle,
      cta_text: item.cta_text,
      cta_link: item.cta_link,
      sort_order: toInteger(item.sort_order),
      is_active: item.is_active ? 1 : 0,
    };

    runAction(
      () =>
        item.id
          ? updateHeroSlide(item.id, payload)
          : createHeroSlide(payload),
      'Hero slide saved successfully.'
    );
  };

  const removeSlide = (item) => {
    if (!item.id) {
      setSlides((previous) => previous.filter((entry) => entry !== item));
      return;
    }

    runAction(
      () => deleteHeroSlide(item.id),
      'Hero slide deleted.'
    );
  };

  const saveStat = (item) => {
    const payload = {
      label: item.label,
      value: toInteger(item.value),
      suffix: item.suffix || '',
      icon_name: item.icon_name,
      sort_order: toInteger(item.sort_order),
      is_active: item.is_active ? 1 : 0,
    };

    runAction(
      () =>
        item.id
          ? updateHomeStat(item.id, payload)
          : createHomeStat(payload),
      'Home stat saved successfully.'
    );
  };

  const removeStat = (item) => {
    if (!item.id) {
      setStats((previous) => previous.filter((entry) => entry !== item));
      return;
    }

    runAction(
      () => deleteHomeStat(item.id),
      'Home stat deleted.'
    );
  };

  const saveNews = (item) => {
    const publishDate = toIsoDateTime(item.publish_date);

    if (!publishDate) {
      setError('Please provide a valid publish date for news item.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      image_url: item.image_url || null,
      external_link: item.external_link || null,
      publish_date: publishDate,
      is_active: item.is_active ? 1 : 0,
    };

    runAction(
      () => (item.id ? updateNewsItem(item.id, payload) : createNewsItem(payload)),
      'News item saved successfully.'
    );
  };

  const removeNews = (item) => {
    if (!item.id) {
      setNewsItems((previous) => previous.filter((entry) => entry !== item));
      return;
    }

    runAction(
      () => deleteNewsItem(item.id),
      'News item deleted.'
    );
  };

  const toNullableString = (value) => {
    const nextValue = String(value || '').trim();
    return nextValue.length > 0 ? nextValue : null;
  };

  const toStringArrayFromText = (value) => {
    const text = String(value || '');

    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const closePeopleModal = () => {
    setIsPeopleModalOpen(false);
    setEditingPeopleId(null);
    setPeopleDraft(defaultPeopleEntry);
  };

  const openCreatePeopleModal = () => {
    clearMessages();
    setEditingPeopleId(null);
    setPeopleDraft(defaultPeopleEntry);
    setIsPeopleModalOpen(true);
  };

  const openEditPeopleModal = (entry) => {
    clearMessages();
    setEditingPeopleId(entry.id || null);
    setPeopleDraft({
      category: entry.category || 'faculty',
      name: entry.name || '',
      designation: entry.designation || '',
      specialization: entry.specialization || '',
      department: entry.department || '',
      year_label: entry.year_label || '',
      email: entry.email || '',
      phone: entry.phone || '',
      room: entry.room || '',
      profile_url: entry.profile_url || '',
      image_url: entry.image_url || '',
      resource_link: entry.resource_link || '',
      research_interests_text: Array.isArray(entry.research_interests)
        ? entry.research_interests.join('\n')
        : '',
      responsibilities_text: Array.isArray(entry.responsibilities)
        ? entry.responsibilities.join('\n')
        : '',
      sort_order: toInteger(entry.sort_order),
      is_active: entry.is_active ? 1 : 0,
    });
    setIsPeopleModalOpen(true);
  };

  const savePeopleEntry = async () => {
    const category = peopleDraft.category;
    const isListType = category === 'mtech' || category === 'btech';

    if (!category) {
      setError('Please select a people category.');
      setSuccessMessage('');
      return;
    }

    if (isListType) {
      if (!toNullableString(peopleDraft.year_label)) {
        setError('Year label is required for student list entries.');
        setSuccessMessage('');
        return;
      }

      if (!toNullableString(peopleDraft.resource_link)) {
        setError('Resource link is required for student list entries.');
        setSuccessMessage('');
        return;
      }
    } else if (!toNullableString(peopleDraft.name)) {
      setError('Name is required for faculty, staff, and Ph.D. entries.');
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
      sort_order: toInteger(peopleDraft.sort_order),
      is_active: peopleDraft.is_active ? 1 : 0,
    };

    if (isListType) {
      payload.image_url = null;
      payload.research_interests = [];
      payload.responsibilities = [];
    }

    if (category === 'phd') {
      payload.designation = null;
      payload.specialization = null;
      payload.department = null;
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

    const wasSuccessful = await runAction(
      () =>
        editingPeopleId
          ? updatePeopleEntry(editingPeopleId, payload)
          : createPeopleEntry(payload),
      editingPeopleId ? 'People entry updated successfully.' : 'People entry created successfully.'
    );

    if (wasSuccessful) {
      closePeopleModal();
    }
  };

  const removePeople = (entry) => {
    if (!entry.id) {
      return;
    }

    runAction(
      () => deletePeopleEntry(entry.id),
      'People entry deleted.'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-lg font-medium">Loading admin content...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page min-h-screen bg-gray-100">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Admin</h1>
            <p className="text-sm text-gray-600">
              Signed in as {adminUser?.username || 'admin'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isWorking}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-medium disabled:bg-gray-500"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-8">
        <div className="admin-dashboard-layout grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
          <aside className="admin-sidebar hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:sticky lg:top-24 space-y-5">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Admin Sections
              </h2>
            </div>

            <div className="space-y-4">
              {adminSectionGroups.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {group.label}
                  </p>

                  <div className="space-y-1">
                    {group.sections.map((section) => (
                      <button
                        key={section.key}
                        type="button"
                        onClick={() => {
                          clearMessages();
                          setActiveSection(section.key);
                        }}
                        aria-current={activeSection === section.key ? 'page' : undefined}
                        className={`admin-sidebar-item w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === section.key
                            ? 'bg-blue-100 text-blue-800 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="admin-content space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3">
                {successMessage}
              </div>
            )}

            <div className="admin-panel admin-section-header bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5 space-y-3">
              <div className="lg:hidden">
                <label htmlFor="active-admin-section" className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Current Section
                </label>
                <select
                  id="active-admin-section"
                  value={activeSection}
                  onChange={(event) => {
                    clearMessages();
                    setActiveSection(event.target.value);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {sectionDetails[activeSection]?.title || 'Admin Section'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {sectionDetails[activeSection]?.description || ''}
                </p>
              </div>
            </div>

            {activeSection === 'site-settings' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Site Settings</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700">
              Site Name
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.site_name}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    site_name: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Department Name
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.department_name}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    department_name: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Logo URL
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.logo_url}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    logo_url: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Upload Logo
              <input
                className="mt-1 block"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  uploadImage(event.target.files?.[0], 'ce', (uploadedUrl) => {
                    setSiteSettings((previous) => ({
                      ...previous,
                      logo_url: uploadedUrl,
                    }));
                  })
                }
              />
            </label>

            {siteSettings.logo_url && (
              <div className="md:col-span-2">
                <img
                  src={resolveMediaUrl(siteSettings.logo_url)}
                  alt="Current logo"
                  className="h-16 w-auto object-contain border border-gray-200 rounded"
                />
              </div>
            )}

            <label className="text-sm text-gray-700">
              Navbar Title
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.navbar_title}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    navbar_title: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Navbar Subtitle
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.navbar_subtitle}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    navbar_subtitle: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Footer Description
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
                value={siteSettings.footer_description}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    footer_description: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Contact Address (one line per row)
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
                value={siteSettings.contact_address_lines_text}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    contact_address_lines_text: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Contact Phone
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.contact_phone}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    contact_phone: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Contact Email
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.contact_email}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    contact_email: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Google Map Embed URL
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.map_embed_url}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    map_embed_url: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Copyright Text
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={siteSettings.copyright_text}
                onChange={(event) =>
                  setSiteSettings((previous) => ({
                    ...previous,
                    copyright_text: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <button
            type="button"
            onClick={saveSiteSettings}
            disabled={isWorking}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-medium disabled:bg-blue-400"
          >
            Save Site Settings
          </button>
              </section>
            )}

            {activeSection === 'home-content' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Home Content</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 md:col-span-2">
              Welcome Title
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.welcome_title}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    welcome_title: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Welcome Paragraph 1
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
                value={homeContent.welcome_paragraph_1}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    welcome_paragraph_1: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Welcome Paragraph 2
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
                value={homeContent.welcome_paragraph_2}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    welcome_paragraph_2: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Welcome Image URL
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.welcome_image_url}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    welcome_image_url: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              Upload Welcome Image
              <input
                className="mt-1 block"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  uploadImage(event.target.files?.[0], 'home', (uploadedUrl) => {
                    setHomeContent((previous) => ({
                      ...previous,
                      welcome_image_url: uploadedUrl,
                    }));
                  })
                }
              />
            </label>

            {homeContent.welcome_image_url && (
              <div className="md:col-span-2">
                <img
                  src={resolveMediaUrl(homeContent.welcome_image_url)}
                  alt="Welcome"
                  className="h-40 w-full object-cover border border-gray-200 rounded"
                />
              </div>
            )}

            <label className="text-sm text-gray-700 md:col-span-2">
              CTA Title
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_title}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_title: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700 md:col-span-2">
              CTA Description
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-24"
                value={homeContent.cta_description}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_description: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Primary CTA Text
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_primary_text}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_primary_text: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Primary CTA Link
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_primary_link}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_primary_link: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Secondary CTA Text
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_secondary_text}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_secondary_text: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Secondary CTA Link
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_secondary_link}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_secondary_link: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Tertiary CTA Text
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_tertiary_text}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_tertiary_text: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm text-gray-700">
              Tertiary CTA Link
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={homeContent.cta_tertiary_link}
                onChange={(event) =>
                  setHomeContent((previous) => ({
                    ...previous,
                    cta_tertiary_link: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <button
            type="button"
            onClick={saveHomeContent}
            disabled={isWorking}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-medium disabled:bg-blue-400"
          >
            Save Home Content
          </button>
              </section>
            )}

            {activeSection === 'navigation' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Navigation Items</h2>
            <button
              type="button"
              onClick={() =>
                setNavigationItems((previous) => [...previous, { ...defaultNavigationItem }])
              }
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {navigationItems.map((item, index) => (
              <div key={`navigation-${item.id || index}`} className="admin-entry-card border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-4 gap-3">
                  <input
                    placeholder="Label"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.label}
                    onChange={(event) =>
                      setNavigationItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, label: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="Href"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.href}
                    onChange={(event) =>
                      setNavigationItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, href: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.sort_order}
                    onChange={(event) =>
                      setNavigationItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, sort_order: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(event) =>
                        setNavigationItems((previous) =>
                          previous.map((entry, currentIndex) =>
                            currentIndex === index
                              ? { ...entry, is_active: event.target.checked ? 1 : 0 }
                              : entry
                          )
                        )
                      }
                    />
                    Active
                  </label>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => saveNavigationItem(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNavigationItem(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
              </section>
            )}

            {activeSection === 'social' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
            <button
              type="button"
              onClick={() => setSocialLinks((previous) => [...previous, { ...defaultSocialLink }])}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {socialLinks.map((item, index) => (
              <div key={`social-${item.id || index}`} className="admin-entry-card border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-5 gap-3">
                  <input
                    placeholder="Platform"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.platform}
                    onChange={(event) =>
                      setSocialLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, platform: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="Icon name"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.icon}
                    onChange={(event) =>
                      setSocialLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, icon: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="URL"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.url}
                    onChange={(event) =>
                      setSocialLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, url: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.sort_order}
                    onChange={(event) =>
                      setSocialLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, sort_order: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(event) =>
                        setSocialLinks((previous) =>
                          previous.map((entry, currentIndex) =>
                            currentIndex === index
                              ? { ...entry, is_active: event.target.checked ? 1 : 0 }
                              : entry
                          )
                        )
                      }
                    />
                    Active
                  </label>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => saveSocialLink(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
              </section>
            )}

            {activeSection === 'footer' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Footer Links</h2>
            <button
              type="button"
              onClick={() => setFooterLinks((previous) => [...previous, { ...defaultFooterLink }])}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {footerLinks.map((item, index) => (
              <div key={`footer-${item.id || index}`} className="admin-entry-card border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-5 gap-3">
                  <select
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.section}
                    onChange={(event) =>
                      setFooterLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, section: event.target.value }
                            : entry
                        )
                      )
                    }
                  >
                    <option value="quick">quick</option>
                    <option value="important">important</option>
                  </select>
                  <input
                    placeholder="Label"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.label}
                    onChange={(event) =>
                      setFooterLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, label: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="Href"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.href}
                    onChange={(event) =>
                      setFooterLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, href: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.sort_order}
                    onChange={(event) =>
                      setFooterLinks((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, sort_order: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(event) =>
                        setFooterLinks((previous) =>
                          previous.map((entry, currentIndex) =>
                            currentIndex === index
                              ? { ...entry, is_active: event.target.checked ? 1 : 0 }
                              : entry
                          )
                        )
                      }
                    />
                    Active
                  </label>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => saveFooterLink(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFooterLink(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
              </section>
            )}

            {activeSection === 'slides' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Hero Slides</h2>
            <button
              type="button"
              onClick={() => setSlides((previous) => [...previous, { ...defaultSlide }])}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {slides.map((item, index) => (
              <div key={`slide-${item.id || index}`} className="admin-entry-card border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    placeholder="Title"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.title}
                    onChange={(event) =>
                      setSlides((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, title: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="CTA text"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.cta_text}
                    onChange={(event) =>
                      setSlides((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, cta_text: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                </div>

                <textarea
                  placeholder="Subtitle"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-20"
                  value={item.subtitle}
                  onChange={(event) =>
                    setSlides((previous) =>
                      previous.map((entry, currentIndex) =>
                        currentIndex === index
                          ? { ...entry, subtitle: event.target.value }
                          : entry
                      )
                    )
                  }
                />

                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    placeholder="CTA link"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.cta_link}
                    onChange={(event) =>
                      setSlides((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, cta_link: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.sort_order}
                    onChange={(event) =>
                      setSlides((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, sort_order: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(event) =>
                        setSlides((previous) =>
                          previous.map((entry, currentIndex) =>
                            currentIndex === index
                              ? { ...entry, is_active: event.target.checked ? 1 : 0 }
                              : entry
                          )
                        )
                      }
                    />
                    Active
                  </label>
                </div>

                <input
                  placeholder="Image URL"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={item.image_url}
                  onChange={(event) =>
                    setSlides((previous) =>
                      previous.map((entry, currentIndex) =>
                        currentIndex === index
                          ? { ...entry, image_url: event.target.value }
                          : entry
                      )
                    )
                  }
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    uploadImage(event.target.files?.[0], 'home', (uploadedUrl) => {
                      setSlides((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, image_url: uploadedUrl }
                            : entry
                        )
                      );
                    })
                  }
                />

                {item.image_url && (
                  <img
                    src={resolveMediaUrl(item.image_url)}
                    alt={item.title || 'Slide image'}
                    className="h-32 w-full object-cover rounded border border-gray-200"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveSlide(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
              </section>
            )}

            {activeSection === 'stats' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Home Stats</h2>
            <button
              type="button"
              onClick={() => setStats((previous) => [...previous, { ...defaultStat }])}
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Add Stat
            </button>
          </div>

          <div className="space-y-4">
            {stats.map((item, index) => (
              <div key={`stat-${item.id || index}`} className="admin-entry-card border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-6 gap-3">
                  <input
                    placeholder="Label"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.label}
                    onChange={(event) =>
                      setStats((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, label: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Value"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.value}
                    onChange={(event) =>
                      setStats((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, value: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="Suffix"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.suffix}
                    onChange={(event) =>
                      setStats((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, suffix: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="Icon Name"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.icon_name}
                    onChange={(event) =>
                      setStats((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, icon_name: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Sort"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.sort_order}
                    onChange={(event) =>
                      setStats((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, sort_order: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(event) =>
                        setStats((previous) =>
                          previous.map((entry, currentIndex) =>
                            currentIndex === index
                              ? { ...entry, is_active: event.target.checked ? 1 : 0 }
                              : entry
                          )
                        )
                      }
                    />
                    Active
                  </label>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => saveStat(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStat(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
              </section>
            )}

            {activeSection === 'news' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">News Items</h2>
            <button
              type="button"
              onClick={() =>
                setNewsItems((previous) => [
                  ...previous,
                  {
                    ...defaultNewsItem,
                    publish_date: formatDateTimeLocal(new Date().toISOString()),
                  },
                ])
              }
              className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Add News
            </button>
          </div>

          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <div key={`news-${item.id || index}`} className="admin-entry-card border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    placeholder="Title"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.title}
                    onChange={(event) =>
                      setNewsItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, title: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    placeholder="Category"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.category}
                    onChange={(event) =>
                      setNewsItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, category: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                </div>

                <textarea
                  placeholder="Excerpt"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-20"
                  value={item.excerpt}
                  onChange={(event) =>
                    setNewsItems((previous) =>
                      previous.map((entry, currentIndex) =>
                        currentIndex === index
                          ? { ...entry, excerpt: event.target.value }
                          : entry
                      )
                    )
                  }
                />

                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    placeholder="External link"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.external_link || ''}
                    onChange={(event) =>
                      setNewsItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, external_link: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <input
                    type="datetime-local"
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    value={item.publish_date || ''}
                    onChange={(event) =>
                      setNewsItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, publish_date: event.target.value }
                            : entry
                        )
                      )
                    }
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(event) =>
                        setNewsItems((previous) =>
                          previous.map((entry, currentIndex) =>
                            currentIndex === index
                              ? { ...entry, is_active: event.target.checked ? 1 : 0 }
                              : entry
                          )
                        )
                      }
                    />
                    Active
                  </label>
                </div>

                <input
                  placeholder="Image URL (optional)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={item.image_url || ''}
                  onChange={(event) =>
                    setNewsItems((previous) =>
                      previous.map((entry, currentIndex) =>
                        currentIndex === index
                          ? { ...entry, image_url: event.target.value }
                          : entry
                      )
                    )
                  }
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    uploadImage(event.target.files?.[0], 'events', (uploadedUrl) => {
                      setNewsItems((previous) =>
                        previous.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, image_url: uploadedUrl }
                            : entry
                        )
                      );
                    })
                  }
                />

                {item.image_url && (
                  <img
                    src={resolveMediaUrl(item.image_url)}
                    alt={item.title || 'News image'}
                    className="h-32 w-full object-cover rounded border border-gray-200"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveNews(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-sm disabled:bg-blue-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNews(item)}
                    disabled={isWorking}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
              </section>
            )}

            {activeSection === 'people' && (
              <section className="admin-panel bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">People Directory</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Use one table for faculty, staff, Ph.D. profiles, and M.Tech/B.Tech list links.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openCreatePeopleModal}
                    disabled={isWorking}
                    className="px-3 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium disabled:bg-blue-400"
                  >
                    Add Entry
                  </button>
                </div>

                <div className="admin-people-table-wrap overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="admin-people-table min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="text-left px-3 py-2 font-semibold">Category</th>
                        <th className="text-left px-3 py-2 font-semibold">Name / Year</th>
                        <th className="text-left px-3 py-2 font-semibold">Designation / Dept.</th>
                        <th className="text-left px-3 py-2 font-semibold">Email / Link</th>
                        <th className="text-left px-3 py-2 font-semibold">Sort</th>
                        <th className="text-left px-3 py-2 font-semibold">Active</th>
                        <th className="text-left px-3 py-2 font-semibold">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {peopleEntries.map((entry) => (
                        <tr key={`people-${entry.id}`} className="border-t border-gray-200">
                          <td className="px-3 py-2 uppercase tracking-wide text-xs font-semibold text-gray-600">
                            {entry.category}
                          </td>
                          <td className="px-3 py-2 text-gray-800 font-medium">
                            {entry.name || entry.year_label || '-'}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {entry.designation || entry.department || entry.specialization || '-'}
                          </td>
                          <td className="px-3 py-2 text-gray-700 break-all">
                            {entry.email || entry.resource_link || '-'}
                          </td>
                          <td className="px-3 py-2 text-gray-700">{entry.sort_order}</td>
                          <td className="px-3 py-2 text-gray-700">
                            {entry.is_active ? 'Yes' : 'No'}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEditPeopleModal(entry)}
                                disabled={isWorking}
                                className="px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removePeople(entry)}
                                disabled={isWorking}
                                className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {peopleEntries.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                            No people entries available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {isPeopleModalOpen && (
              <div className="admin-modal-backdrop" role="presentation" onClick={closePeopleModal}>
                <div className="admin-modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingPeopleId ? 'Edit People Entry' : 'Add People Entry'}
                    </h3>

                    <button
                      type="button"
                      onClick={closePeopleModal}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    <label className="text-sm text-gray-700">
                      Category
                      <select
                        className="mt-1"
                        value={peopleDraft.category}
                        onChange={(event) =>
                          setPeopleDraft((previous) => ({
                            ...previous,
                            category: event.target.value,
                          }))
                        }
                      >
                        {peopleCategoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="text-sm text-gray-700">
                      Sort Order
                      <input
                        type="number"
                        className="mt-1"
                        value={peopleDraft.sort_order}
                        onChange={(event) =>
                          setPeopleDraft((previous) => ({
                            ...previous,
                            sort_order: event.target.value,
                          }))
                        }
                      />
                    </label>

                    {(peopleDraft.category === 'mtech' || peopleDraft.category === 'btech') && (
                      <>
                        <label className="text-sm text-gray-700">
                          Year Label
                          <input
                            className="mt-1"
                            value={peopleDraft.year_label}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                year_label: event.target.value,
                              }))
                            }
                          />
                        </label>

                        <label className="text-sm text-gray-700 md:col-span-2">
                          List Link
                          <input
                            className="mt-1"
                            value={peopleDraft.resource_link}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                resource_link: event.target.value,
                              }))
                            }
                          />
                        </label>
                      </>
                    )}

                    {peopleDraft.category !== 'mtech' && peopleDraft.category !== 'btech' && (
                      <>
                        <label className="text-sm text-gray-700">
                          Name
                          <input
                            className="mt-1"
                            value={peopleDraft.name}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                name: event.target.value,
                              }))
                            }
                          />
                        </label>

                        <label className="text-sm text-gray-700">
                          Designation
                          <input
                            className="mt-1"
                            value={peopleDraft.designation}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                designation: event.target.value,
                              }))
                            }
                          />
                        </label>

                        {peopleDraft.category === 'faculty' && (
                          <label className="text-sm text-gray-700">
                            Specialization
                            <input
                              className="mt-1"
                              value={peopleDraft.specialization}
                              onChange={(event) =>
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  specialization: event.target.value,
                                }))
                              }
                            />
                          </label>
                        )}

                        {peopleDraft.category === 'staff' && (
                          <label className="text-sm text-gray-700">
                            Department
                            <input
                              className="mt-1"
                              value={peopleDraft.department}
                              onChange={(event) =>
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  department: event.target.value,
                                }))
                              }
                            />
                          </label>
                        )}

                        <label className="text-sm text-gray-700">
                          Email
                          <input
                            className="mt-1"
                            value={peopleDraft.email}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                email: event.target.value,
                              }))
                            }
                          />
                        </label>

                        <label className="text-sm text-gray-700">
                          Phone
                          <input
                            className="mt-1"
                            value={peopleDraft.phone}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                phone: event.target.value,
                              }))
                            }
                          />
                        </label>

                        {peopleDraft.category === 'faculty' && (
                          <label className="text-sm text-gray-700">
                            Room
                            <input
                              className="mt-1"
                              value={peopleDraft.room}
                              onChange={(event) =>
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  room: event.target.value,
                                }))
                              }
                            />
                          </label>
                        )}

                        {(peopleDraft.category === 'faculty' || peopleDraft.category === 'staff') && (
                          <label className="text-sm text-gray-700 md:col-span-2">
                            Profile URL
                            <input
                              className="mt-1"
                              value={peopleDraft.profile_url}
                              onChange={(event) =>
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  profile_url: event.target.value,
                                }))
                              }
                            />
                          </label>
                        )}

                        <label className="text-sm text-gray-700 md:col-span-2">
                          Image URL
                          <input
                            className="mt-1"
                            value={peopleDraft.image_url}
                            onChange={(event) =>
                              setPeopleDraft((previous) => ({
                                ...previous,
                                image_url: event.target.value,
                              }))
                            }
                          />
                        </label>

                        <label className="text-sm text-gray-700 md:col-span-2">
                          Upload Image
                          <input
                            className="mt-1"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              uploadImage(event.target.files?.[0], 'people', (uploadedUrl) => {
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  image_url: uploadedUrl,
                                }));
                              })
                            }
                          />
                        </label>

                        {peopleDraft.image_url && (
                          <div className="md:col-span-2">
                            <img
                              src={resolveMediaUrl(peopleDraft.image_url)}
                              alt={peopleDraft.name || 'People image preview'}
                              className="h-40 w-full object-contain border border-gray-200 rounded"
                            />
                          </div>
                        )}

                        {peopleDraft.category === 'faculty' && (
                          <label className="text-sm text-gray-700 md:col-span-2">
                            Research Interests (one per line)
                            <textarea
                              className="mt-1"
                              value={peopleDraft.research_interests_text}
                              onChange={(event) =>
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  research_interests_text: event.target.value,
                                }))
                              }
                            />
                          </label>
                        )}

                        {peopleDraft.category === 'staff' && (
                          <label className="text-sm text-gray-700 md:col-span-2">
                            Responsibilities (one per line)
                            <textarea
                              className="mt-1"
                              value={peopleDraft.responsibilities_text}
                              onChange={(event) =>
                                setPeopleDraft((previous) => ({
                                  ...previous,
                                  responsibilities_text: event.target.value,
                                }))
                              }
                            />
                          </label>
                        )}
                      </>
                    )}

                    <label className="text-sm text-gray-700 md:col-span-2 flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        checked={Boolean(peopleDraft.is_active)}
                        onChange={(event) =>
                          setPeopleDraft((previous) => ({
                            ...previous,
                            is_active: event.target.checked ? 1 : 0,
                          }))
                        }
                      />
                      Active
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-5">
                    <button
                      type="button"
                      onClick={closePeopleModal}
                      disabled={isWorking}
                      className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={savePeopleEntry}
                      disabled={isWorking}
                      className="px-3 py-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium disabled:bg-blue-400"
                    >
                      {editingPeopleId ? 'Save Changes' : 'Create Entry'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
