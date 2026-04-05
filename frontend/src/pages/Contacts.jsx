import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Send,
  Building,
  Globe,
} from 'lucide-react';
import {
  fetchPublicContentByKey,
  getCachedPublicContentByKey,
  resolveMediaUrl,
  submitContactForm,
} from '../lib/contentApi';

const ICON_MAP = {
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Building,
  Globe,
};

const fallbackContactContent = {
  hero_title: 'Contact Us',
  hero_subtitle:
    'Get in touch with us for admissions, research opportunities, collaborations, or any other inquiries',
  info_section_title: 'Get in Touch',
  info_section_subtitle: 'We are here to help and answer any questions you might have',
  contact_info_cards: [
    {
      icon_name: 'MapPin',
      title: 'Address',
      details: [
        'Pod 1C-403',
        'Department of Civil Engineering',
        'Indian Institute of Technology Indore',
        'Khandwa Road, Simrol',
        'Indore 453552, Madhya Pradesh, India',
      ],
    },
    {
      icon_name: 'Phone',
      title: 'Phone',
      details: ['Department Office: 0731-660 3477', 'HOD Office: 0731-660 3188'],
    },
    {
      icon_name: 'Mail',
      title: 'Email',
      details: ['Department: ceoffice@iiti.ac.in', 'HOD: hodce@iiti.ac.in'],
    },
    {
      icon_name: 'Clock',
      title: 'Office Hours',
      details: ['Monday - Friday: 10:00 AM - 6:00 PM'],
    },
  ],
  form_title: 'Send us a Message',
  form_submit_message: 'Thank you for your message! We will get back to you soon.',
  form_categories: [
    'General Inquiry',
    'Admission Information',
    'Research Collaboration',
    'Industry Partnership',
    'Alumni Relations',
    'Media Inquiry',
  ],
  key_contacts_title: 'Key Contacts',
  key_contacts_subtitle: 'Direct contacts for specific departments and services',
  key_contacts: [
    {
      name: 'Dr. Gourab Sil',
      designation: 'Head of Department',
      email: 'hodce@iiti.ac.in',
      phone: '0731-660 3188',
      office: 'Pod 1C-403, IIT Indore',
    },
    {
      name: 'Ms. Rinki Seth',
      designation: 'Senior Assistant',
      email: 'ceoffice@iiti.ac.in',
      phone: '0731-660 3477',
      office: 'Pod 1C-403, IIT Indore',
    },
    {
      name: 'Ms. Divya Bangar',
      designation: 'Junior Superintendent',
      email: 'ceoffice@iiti.ac.in',
      phone: '0731-660 3477',
      office: 'Pod 1C-403, IIT Indore',
    },
  ],
  quick_links_title: 'Quick Links',
  quick_links_subtitle: 'Find specific information quickly',
  quick_links: [
    {
      title: 'Admission Information',
      description: 'Details about admission procedures and requirements',
      url: null,
    },
    {
      title: 'Research Collaboration',
      description: 'Opportunities for research partnerships and projects',
      url: null,
    },
    {
      title: 'Industry Partnership',
      description: 'Corporate collaboration and consultancy services',
      url: null,
    },
    {
      title: 'Alumni Network',
      description: 'Connect with our alumni community',
      url: 'https://alumni.iiti.ac.in/',
    },
    {
      title: 'Student Services',
      description: 'Academic support and student facilities',
      url: null,
    },
    {
      title: 'Media Inquiries',
      description: 'Press releases and media-related queries',
      url: null,
    },
  ],
  stay_connected_title: 'Stay Connected',
  stay_connected_subtitle:
    'Follow us on social media for the latest updates, news, and events',
  stay_connected_links: [
    { icon_name: 'Globe', label: 'Website', url: '#' },
    { icon_name: 'Mail', label: 'Email', url: '#' },
    { icon_name: 'Users', label: 'Community', url: '#' },
  ],
  footer_cards: [
    { title: 'Emergency Contact', description: 'Campus Security: 0731 660 3524' },
    { title: 'Transportation', description: 'Bus Service Available from Indore City' },
    { title: 'Visitor Information', description: 'Prior appointment recommended' },
  ],
  map_embed_url: 'https://www.google.com/maps?q=IIT+Indore+Pod+1C&output=embed',
};

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

function normalizeContactContent(rawContent) {
  const source = rawContent || {};

  return {
    ...fallbackContactContent,
    ...source,
    contact_info_cards: Array.isArray(source.contact_info_cards)
      ? source.contact_info_cards
          .map((item) => ({
            icon_name: String(item?.icon_name || '').trim() || 'Mail',
            title: String(item?.title || '').trim(),
            details: normalizeStringArray(item?.details),
          }))
          .filter((item) => item.title)
      : fallbackContactContent.contact_info_cards,
    form_categories:
      normalizeStringArray(source.form_categories).length > 0
        ? normalizeStringArray(source.form_categories)
        : fallbackContactContent.form_categories,
    key_contacts: Array.isArray(source.key_contacts)
      ? source.key_contacts
          .map((item) => ({
            name: String(item?.name || '').trim(),
            designation: String(item?.designation || '').trim(),
            email: String(item?.email || '').trim(),
            phone: String(item?.phone || '').trim(),
            office: String(item?.office || '').trim(),
          }))
          .filter((item) => item.name)
      : fallbackContactContent.key_contacts,
    quick_links: Array.isArray(source.quick_links)
      ? source.quick_links
          .map((item) => ({
            title: String(item?.title || '').trim(),
            description: String(item?.description || '').trim(),
            url: String(item?.url || '').trim() || null,
          }))
          .filter((item) => item.title)
      : fallbackContactContent.quick_links,
    stay_connected_links: Array.isArray(source.stay_connected_links)
      ? source.stay_connected_links
          .map((item) => ({
            icon_name: String(item?.icon_name || '').trim() || 'Globe',
            label: String(item?.label || '').trim() || 'Link',
            url: String(item?.url || '').trim() || '#',
          }))
          .filter((item) => item.label)
      : fallbackContactContent.stay_connected_links,
    footer_cards: Array.isArray(source.footer_cards)
      ? source.footer_cards
          .map((item) => ({
            title: String(item?.title || '').trim(),
            description: String(item?.description || '').trim(),
          }))
          .filter((item) => item.title)
      : fallbackContactContent.footer_cards,
  };
}

const Contact = () => {
  const cachedContent = getCachedPublicContentByKey('contact');
  const [contactContent, setContactContent] = useState(() =>
    normalizeContactContent(cachedContent?.contactContent),
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: fallbackContactContent.form_categories[0],
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetchPublicContentByKey('contact');
        if (!isMounted) {
          return;
        }

        const normalized = normalizeContactContent(response?.contactContent);
        setContactContent(normalized);
        setFormData((previous) => ({
          ...previous,
          category: normalized.form_categories[0] || 'General Inquiry',
        }));
      } catch (_error) {
        // Keep fallback values when API is unavailable.
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      name: String(formData.name || '').trim(),
      email: String(formData.email || '').trim(),
      subject: String(formData.subject || '').trim(),
      category: String(formData.category || '').trim(),
      message: String(formData.message || '').trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setSubmitError('Please fill all required fields before submitting.');
      setSubmitSuccess('');
      return;
    }

    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    try {
      await submitContactForm(payload);

      setSubmitSuccess(
        contactContent.form_submit_message || fallbackContactContent.form_submit_message
      );
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: contactContent.form_categories[0] || 'General Inquiry',
        message: '',
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="relative py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">{contactContent.hero_title}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {contactContent.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {contactContent.info_section_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {contactContent.info_section_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactContent.contact_info_cards.map((info, index) => {
              const IconComponent = ICON_MAP[info.icon_name] || Mail;

              return (
                <div
                  key={`info-card-${index}-${info.title}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                >
                  <div className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p key={`card-detail-${detailIndex}`} className="text-gray-600 text-sm leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{contactContent.form_title}</h3>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter message subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {contactContent.form_categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your message here..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {submitError}
                  </p>
                )}

                {submitSuccess && (
                  <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    {submitSuccess}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-full">
                <iframe
                  src={contactContent.map_embed_url}
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IIT Indore Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {contactContent.key_contacts_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {contactContent.key_contacts_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactContent.key_contacts.map((contact, index) => (
              <div
                key={`key-contact-${index}-${contact.name}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{contact.name}</h3>
                  <p className="text-blue-800 font-medium">{contact.designation}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-blue-600" />
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-800 transition-colors">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-blue-600" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-start text-gray-600">
                    <Building className="h-4 w-4 mr-3 text-blue-600 mt-0.5" />
                    <span>{contact.office}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {contactContent.quick_links_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {contactContent.quick_links_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactContent.quick_links.map((link, index) => (
              <a
                key={`quick-link-${index}-${link.title}`}
                href={link.url || '#'}
                target={link.url ? '_blank' : undefined}
                rel={link.url ? 'noopener noreferrer' : undefined}
                className={`block bg-white rounded-lg p-6 border border-gray-200 transition-shadow duration-300 group ${
                  link.url ? 'cursor-pointer hover:shadow-lg' : 'cursor-default opacity-60'
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              {contactContent.stay_connected_title}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {contactContent.stay_connected_subtitle}
            </p>

            <div className="flex justify-center space-x-6 mb-8">
              {contactContent.stay_connected_links.map((item, index) => {
                const IconComponent = ICON_MAP[item.icon_name] || Globe;

                return (
                  <a
                    key={`stay-connected-link-${index}-${item.label}`}
                    href={item.url || '#'}
                    target={item.url && item.url !== '#' ? '_blank' : undefined}
                    rel={item.url && item.url !== '#' ? 'noopener noreferrer' : undefined}
                    aria-label={item.label}
                    className="text-blue-100 hover:text-amber-500 transition-colors"
                  >
                    <IconComponent className="h-8 w-8" />
                  </a>
                );
              })}
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {contactContent.footer_cards.map((item, index) => (
                <div key={`footer-card-${index}-${item.title}`}>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-blue-100">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
