import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Search, ChevronRight, MapPin, Clock } from 'lucide-react';
import {
  fetchPublicContentByKey,
  getCachedPublicContentByKey,
  resolveMediaUrl,
} from '../lib/contentApi';

const fallbackEventsContent = {
  hero_title: 'Events & Activities',
  hero_subtitle:
    'Stay connected with our academic events, workshops, conferences, and departmental activities',
  search_placeholder: 'Search events by title, description, or category...',
  tab_news_label: 'News & Updates',
  tab_upcoming_label: 'Upcoming Events',
  tab_past_label: 'Past Events',
  no_news_message: 'No news found matching your criteria.',
  no_upcoming_message: 'No upcoming events at the moment.',
  no_past_message: 'No past events recorded recently.',
  upcoming_events: [],
  past_events: [
    {
      date: '2026-01-22',
      title: 'REIMAGINING CONSTRUCTION PARADIGMS: STEEL FOR THE NEXT GENERATION',
      description:
        'The Indian Institute of Technology Indore (IITI), in association with the Institute for Steel Development and Growth (INSDAG), hosted a one-day technical seminar on reimagining construction paradigms through steel for the next generation.',
      time: '09:00 AM - 05:00 PM',
      venue: '1D-105, IIT Indore Campus',
      category: 'Seminar',
      image_url: '/assets/Events/steel.jpg',
      registration_link:
        'https://docs.google.com/forms/d/1oTXpXYolZUIVl8vKsj0q_HRgBIjvkn-NXKQ5Nc4qKCQ/edit?ts=69390ad1&pli=1',
    },
  ],
};

const fallbackNews = [
  {
    date: '2026-02-15',
    title: 'Toppers for the NPTEL course "Climate Change - Extreme Events',
    description:
      'Students from the Civil Engineering Department featured among the toppers for the NPTEL course "Climate Change - Extreme Events" offered during Jul-Oct 2025.',
    category: 'Achievement',
    image_url: '/assets/Events/International conference/nptel_toppers.jpeg',
    link: '',
  },
  {
    date: '2025-12-20',
    title: '2025 International Conference at NIT Rourkela',
    description:
      'Ph.D. and M.Tech research scholars from HydroInformatics Lab secured several laurels at HYDRO 2025 International Conference.',
    category: 'Achievement',
    image_url: '/assets/Events/International conference/1.jpeg',
    link: '',
  },
  {
    date: '2025-12-06',
    title: 'Inauguration of the BIS Student Chapter (SC-11283)',
    description:
      'IIT Indore announced inauguration of the Bureau of Indian Standards student chapter in the Department of Civil Engineering.',
    category: 'Seminar',
    image_url: '/assets/Events/BIS_Inaugration.jpeg',
    link: 'https://www.linkedin.com/posts/ced-outreach-iit-indore-a51575390_civilengineering-bis-bureauofindianstandards-activity-7402743045588279296-oVRU',
  },
  {
    date: '2025-12-01',
    title: 'One-Week Short Term Training Programme',
    description:
      'One-week training programme on advances in resilient infrastructure and sustainable initiatives under climate change at IIT Indore.',
    category: 'Seminar',
    image_url: '/assets/Events/linkedin_post.png',
    link: 'https://www.linkedin.com/posts/prof-manish-kumar-goyal-8062b86_sttp-ugcPost-7393564039991402497-_AJd',
  },
  {
    date: '2025-11-26',
    title: 'ANRF Financial Assistance for International Symposium',
    description:
      'Mr. Vikas Rawat received financial assistance from ANRF for participating in an international symposium in Singapore.',
    category: 'Achievement',
    image_url: '/assets/ce/Civil_front_jpg.jpg',
    link: '',
  },
  {
    date: '2025-11-03',
    title: 'Technical Visit to Indore Airport',
    description:
      'M.Tech students in Water, Climate, and Sustainability visited the ATC office at Devi Ahilyabai Holkar International Airport.',
    category: 'Field Visit',
    image_url: '/assets/Events/Site_visit_ATCIndore.jpeg',
    link: 'https://www.linkedin.com/posts/ced-outreach-iit-indore-a51575390_civilengineering-iitindore-waterclimatesustainability-activity-7391437916901781504-MkWJ',
  },
  {
    date: '2025-02-10',
    title: 'Prestigious Humboldt Fellowship Awarded',
    description:
      'Ms. Minu Treesa Abraham, Ph.D. student under Prof. Neelima Satyam, selected for the prestigious Humboldt fellowship for postdocs.',
    category: 'Award',
    image_url: '/assets/ce/Civil_front_jpg.jpg',
    link: '',
  },
  {
    date: '2024-03-15',
    title: 'Himalayan Glaciology Research Featured in Mongabay',
    description:
      'Research on western Himalayan glaciers reacting to climate change by Dr. Mohd Farooq Azam\'s team was featured in Mongabay.',
    category: 'Research',
    image_url: '/assets/ce/Civil_front_jpg.jpg',
    link: '',
  },
  {
    date: '2024-02-20',
    title: 'Research Featured in Media: Soil and Rocks of MP',
    description:
      'Research work on soil and rocks of Madhya Pradesh by Dr. Lalit Borana and group was featured in media.',
    category: 'Research',
    image_url: '/assets/ce/Civil_front_jpg.jpg',
    link: '',
  },
  {
    date: '2020-12-15',
    title: 'Editor\'s Choice Papers Award-2020',
    description:
      'Mr. M. Johnson Singh received the Editor\'s Choice Papers Award from the International Journal of Geosynthetics and Ground Engineering.',
    category: 'Award',
    image_url: '/assets/ce/Civil_front_jpg.jpg',
    link: '',
  },
];

function normalizeEventItem(item) {
  return {
    date: String(item?.date || '').trim(),
    title: String(item?.title || '').trim(),
    description: String(item?.description || '').trim(),
    time: String(item?.time || '').trim(),
    venue: String(item?.venue || '').trim(),
    category: String(item?.category || 'General').trim(),
    image_url: String(item?.image_url || item?.image || '').trim(),
    registration_link: String(item?.registration_link || item?.registrationLink || '').trim(),
  };
}

function normalizeNewsItem(item) {
  const dateValue = item?.publish_date || item?.date || '';

  return {
    date: String(dateValue).trim(),
    title: String(item?.title || '').trim(),
    description: String(item?.excerpt || item?.description || '').trim(),
    category: String(item?.category || 'News').trim(),
    image_url: String(item?.image_url || item?.image || '').trim(),
    link: String(item?.external_link || item?.link || '').trim(),
  };
}

function normalizeEventsPayload(payload) {
  const eventsContentRaw = payload?.eventsContent || {};
  const newsRaw = Array.isArray(payload?.news) ? payload.news : [];

  const eventsContent = {
    ...fallbackEventsContent,
    ...eventsContentRaw,
    upcoming_events: Array.isArray(eventsContentRaw.upcoming_events)
      ? eventsContentRaw.upcoming_events.map(normalizeEventItem)
      : fallbackEventsContent.upcoming_events,
    past_events: Array.isArray(eventsContentRaw.past_events)
      ? eventsContentRaw.past_events.map(normalizeEventItem)
      : fallbackEventsContent.past_events,
  };

  const news = newsRaw.length > 0
    ? newsRaw.map(normalizeNewsItem)
    : fallbackNews.map(normalizeNewsItem);

  return {
    eventsContent,
    news,
  };
}

const Events = () => {
  const cachedContent = getCachedPublicContentByKey('events');
  const [content, setContent] = useState(() => normalizeEventsPayload(cachedContent));

  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetchPublicContentByKey('events');
        if (!isMounted) {
          return;
        }
        setContent(normalizeEventsPayload(response));
      } catch (_error) {
        // Keep fallback content on fetch failure.
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedNews = useMemo(() => {
    return [...content.news].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [content.news]);

  const categories = useMemo(() => {
    const allCategories = [
      ...content.eventsContent.upcoming_events,
      ...content.eventsContent.past_events,
      ...content.news,
    ]
      .map((item) => String(item.category || '').trim())
      .filter(Boolean);

    return ['All', ...Array.from(new Set(allCategories))];
  }, [content.eventsContent.past_events, content.eventsContent.upcoming_events, content.news]);

  const filterEvents = (events) => {
    return events.filter((event) => {
      const haystack = `${event.title} ${event.description} ${event.category}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const ImageModal = () => {
    if (!selectedImage) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <img
          src={resolveMediaUrl(selectedImage)}
          alt="Preview"
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    );
  };

  return (
    <div className="bg-white pt-0">
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              {content.eventsContent.hero_title}
            </h1>
            <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {content.eventsContent.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={content.eventsContent.search_placeholder}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'news'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {content.eventsContent.tab_news_label}
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {content.eventsContent.tab_upcoming_label}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                activeTab === 'past'
                  ? 'border-blue-800 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {content.eventsContent.tab_past_label}
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'news' && (
            <div>
              {filterEvents(sortedNews).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{content.eventsContent.no_news_message}</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                  {filterEvents(sortedNews).map((item, index) => (
                    <div
                      key={`news-${index}-${item.title}`}
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={resolveMediaUrl(item.image_url)}
                          alt={item.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={() => setSelectedImage(item.image_url)}
                          loading="lazy"
                        />

                        <div className="absolute top-2 right-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm border border-blue-200">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center mb-3 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                          <span className="font-medium">{formatDate(item.date)}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-800 hover:text-amber-600 font-medium text-sm flex items-center transition-colors"
                          >
                            <span>Read Full Story</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div>
              {filterEvents(content.eventsContent.upcoming_events).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{content.eventsContent.no_upcoming_message}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filterEvents(content.eventsContent.upcoming_events).map((event, index) => (
                    <div
                      key={`upcoming-${index}-${event.title}`}
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col md:flex-row"
                    >
                      <div className="relative md:w-1/2 aspect-[210/297] bg-gray-100 flex items-center justify-center">
                        <img
                          src={resolveMediaUrl(event.image_url)}
                          alt={event.title}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => setSelectedImage(event.image_url)}
                          loading="lazy"
                        />

                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium shadow-sm">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:w-1/2 flex flex-col">
                        <div className="flex items-center text-blue-800 font-semibold mb-2">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>

                        <div className="space-y-2 mb-4 text-gray-600">
                          {event.time ? (
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                              <span>{event.time}</span>
                            </div>
                          ) : null}
                          {event.venue ? (
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                              <span>{event.venue}</span>
                            </div>
                          ) : null}
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed border-t pt-4 border-gray-100">
                          {event.description}
                        </p>

                        {event.registration_link ? (
                          <div className="mt-auto">
                            <a
                              href={event.registration_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm"
                            >
                              Register Now
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div>
              {filterEvents(content.eventsContent.past_events).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{content.eventsContent.no_past_message}</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                  {filterEvents(content.eventsContent.past_events).map((event, index) => (
                    <div
                      key={`past-${index}-${event.title}`}
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={resolveMediaUrl(event.image_url)}
                          alt={event.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                          onClick={() => setSelectedImage(event.image_url)}
                          loading="lazy"
                        />

                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm font-medium shadow-sm">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center text-blue-800 font-semibold mb-2">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>

                        <div className="space-y-2 mb-4 text-gray-600">
                          {event.time ? (
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                              <span>{event.time}</span>
                            </div>
                          ) : null}
                          {event.venue ? (
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                              <span>{event.venue}</span>
                            </div>
                          ) : null}
                        </div>

                        <p className="text-gray-600 leading-relaxed border-t pt-4 border-gray-100">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ImageModal />
    </div>
  );
};

export default Events;
