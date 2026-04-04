import React, { useEffect, useState } from 'react';
import { Target, Eye, Award, Users, BookOpen } from 'lucide-react';
import {
  fetchPublicContentByKey,
  getCachedPublicContentByKey,
  resolveMediaUrl,
} from '../lib/contentApi';

const fallbackAboutContent = {
  hero_title: 'About Our Department',
  hero_subtitle:
    'Excellence in civil engineering education, research, and innovation',
  story_title: 'Our Story',
  story_paragraph_1:
    'The Department of Civil Engineering at IIT Indore has grown rapidly to become a center for academic and research excellence. We are dedicated to creating world-class engineers who contribute to the sustainable development of global infrastructure.',
  story_paragraph_2:
    'Since our inception, we have evolved into a thriving academic community with distinguished faculty, state-of-the-art facilities, and a strong network of alumni working in leading organizations worldwide.',
  story_paragraph_3:
    'Our department is committed to addressing the challenges of modern infrastructure through innovative research, comprehensive education programs, and strong industry partnerships.',
  story_image_url: '/assets/ce/groupphoto2.jpeg',
  mission_title: 'Our Mission',
  mission_description:
    'To provide world-class education in civil engineering, conduct cutting-edge research that addresses societal needs, and develop leaders who will shape the future of sustainable infrastructure development in India and beyond.',
  vision_title: 'Our Vision',
  vision_description:
    'To be recognized as a premier department of civil engineering that contributes significantly to technological advancement, sustainable development, and the creation of innovative solutions for complex engineering challenges.',
  values_title: 'Our Core Values',
  values_subtitle:
    'The principles that guide our approach to education, research, and service',
  values_items: [
    {
      icon_name: 'Award',
      title: 'Excellence',
      description:
        'Striving for the highest standards in education, research, and innovation in civil engineering.',
    },
    {
      icon_name: 'Users',
      title: 'Collaboration',
      description:
        'Fostering teamwork, partnerships, and knowledge sharing within our academic community.',
    },
    {
      icon_name: 'Target',
      title: 'Innovation',
      description:
        'Pioneering cutting-edge research and sustainable solutions for modern infrastructure challenges.',
    },
    {
      icon_name: 'BookOpen',
      title: 'Knowledge',
      description:
        'Committed to advancing the frontiers of civil engineering through continuous learning and discovery.',
    },
  ],
  milestones_title: 'Our Journey',
  milestones_subtitle: 'Key milestones in the development of our department',
  milestones: [
    { year: '2009', event: 'Foundation of IIT Indore' },
    {
      year: '2016',
      event: 'Department of Civil Engineering established and first B.Tech batch admitted',
    },
    { year: '2020', event: 'Reached milestone of 200+ alumni' },
    { year: '2023', event: 'First M.Tech batch admitted' },
    { year: '2025', event: 'Celebrating 10+ years of excellence' },
  ],
  stats_title: 'Department at a Glance',
  stats_subtitle: 'Numbers that reflect our growth and impact over the years',
  stats_items: [
    { label: 'Faculty Members', value: 17, suffix: '' },
    { label: 'Alumni', value: 500, suffix: '+' },
    { label: 'Research Papers', value: 1000, suffix: '+' },
    { label: 'Active Projects', value: 50, suffix: '+' },
  ],
};

const iconMap = {
  Award,
  Users,
  Target,
  BookOpen,
};

function normalizeAboutContent(response) {
  const content = response?.aboutContent || {};

  const valuesItems = Array.isArray(content.values_items)
    ? content.values_items
        .map((item) => ({
          icon_name: item?.icon_name || 'Award',
          title: item?.title || '',
          description: item?.description || '',
        }))
        .filter((item) => item.title && item.description)
    : [];

  const milestones = Array.isArray(content.milestones)
    ? content.milestones
        .map((item) => ({
          year: String(item?.year || '').trim(),
          event: String(item?.event || '').trim(),
        }))
        .filter((item) => item.year && item.event)
    : [];

  const statsItems = Array.isArray(content.stats_items)
    ? content.stats_items
        .map((item) => ({
          label: item?.label || '',
          value: Number(item?.value) || 0,
          suffix: item?.suffix || '',
        }))
        .filter((item) => item.label)
    : [];

  return {
    ...fallbackAboutContent,
    ...content,
    story_image_url:
      resolveMediaUrl(content.story_image_url) || fallbackAboutContent.story_image_url,
    values_items:
      valuesItems.length > 0 ? valuesItems : fallbackAboutContent.values_items,
    milestones:
      milestones.length > 0 ? milestones : fallbackAboutContent.milestones,
    stats_items: statsItems.length > 0 ? statsItems : fallbackAboutContent.stats_items,
  };
}

const About = () => {
  const [aboutContent, setAboutContent] = useState(() =>
    normalizeAboutContent(getCachedPublicContentByKey('about'))
  );

  useEffect(() => {
    let isMounted = true;

    const loadAboutContent = async () => {
      try {
        const data = await fetchPublicContentByKey('about');
        if (!isMounted) {
          return;
        }

        setAboutContent(normalizeAboutContent(data));
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setAboutContent((previous) => previous || fallbackAboutContent);
      }
    };

    loadAboutContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white">
      <section className="relative py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">{aboutContent.hero_title}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {aboutContent.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {aboutContent.story_title}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {aboutContent.story_paragraph_1}
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {aboutContent.story_paragraph_2}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutContent.story_paragraph_3}
              </p>
            </div>
            <div className="relative">
              <img
                src={aboutContent.story_image_url}
                alt="Department"
                className="w-full h-[420px] object-cover rounded-lg shadow-2xl bg-gray-200"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-blue-800 text-white p-3 rounded-lg mr-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {aboutContent.mission_title}
                </h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutContent.mission_description}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-amber-500 text-white p-3 rounded-lg mr-4">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {aboutContent.vision_title}
                </h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutContent.vision_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {aboutContent.values_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent.values_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutContent.values_items.map((value, index) => {
              const Icon = iconMap[value.icon_name] || Award;

              return (
                <div
                  key={`${value.title}-${index}`}
                  className="text-center group hover:bg-gray-50 p-6 rounded-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {aboutContent.milestones_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent.milestones_subtitle}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-800 h-full" />

            <div className="space-y-12">
              {aboutContent.milestones.map((milestone, index) => (
                <div key={`${milestone.year}-${index}`} className="relative">
                  <div
                    className={`flex items-center ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className={`text-right ${index % 2 !== 0 ? 'text-left' : ''}`}>
                          <span className="text-2xl font-bold text-blue-800">
                            {milestone.year}
                          </span>
                          <p className="text-gray-600 mt-2 leading-relaxed">
                            {milestone.event}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {aboutContent.stats_title}
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {aboutContent.stats_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {aboutContent.stats_items.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
