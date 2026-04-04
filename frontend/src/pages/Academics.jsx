import React, { useEffect, useState } from 'react';
import { GraduationCap, BookOpen, Clock, Users, Award, ChevronRight } from 'lucide-react';
import {
  fetchPublicContentByKey,
  getCachedPublicContentByKey,
  resolveMediaUrl,
} from '../lib/contentApi';

const fallbackAcademicsContent = {
  hero_title: 'Academic Programs',
  hero_subtitle:
    'Comprehensive education programs designed to shape the next generation of civil engineers',
  programs_title: 'Our Programs',
  programs_subtitle:
    'From undergraduate to doctoral levels, we offer comprehensive programs that combine theoretical knowledge with practical application',
  programs: [
    {
      title: 'B.Tech in Civil Engineering',
      link_url:
        'https://academic.iiti.ac.in/app/storage/app/coursecurriculum/9NVdg9JRdMxVbWQmnp0vHGM10r2lwjBN8Oy4aSP6.pdf',
      link_target: '_blank',
      duration: '4 Years',
      intake: 'Intake: 53',
      description:
        'Comprehensive undergraduate program covering all major areas of civil engineering with strong emphasis on practical learning and industry exposure.',
      highlights: [
        'Strong foundation in mathematics, physics, and engineering sciences',
        'Hands-on laboratory experience in all core subjects',
        'Industry internships and live projects',
        'Professional development and communication skills',
      ],
      courses: [
        'Engineering Mechanics',
        'Structural Analysis',
        'RCC and Steel Design',
        'Geotechnical Engineering',
        'Transportation Systems Engineering',
        'Water Resources Engineering',
      ],
    },
    {
      title: 'M.Tech in Structural Engineering',
      link_url:
        'https://academic.iiti.ac.in/app/storage/app/coursecurriculum/7xAINJWsbYbISP5Lk9PSY2VJU5daoGrnm2lbjilf.pdf',
      link_target: '_blank',
      duration: '2 Years',
      intake: 'Intake: 10 (TA Category)',
      description:
        'Advanced program focusing on design, analysis, and behavior of structures with emphasis on modern computational methods and sustainable construction.',
      highlights: [
        'Advanced structural analysis and design',
        'Research-oriented curriculum',
        'Access to state-of-the-art laboratories',
        'Thesis work with industry collaboration',
      ],
      courses: [
        'Advanced Structural Analysis',
        'Earthquake Engineering',
        'Bridge Engineering',
        'High-rise Building Design',
        'Finite Element Methods',
        'Steel and Concrete Structures',
      ],
    },
    {
      title: 'M.Tech in Water, Climate & Sustainability',
      link_url:
        'https://academic.iiti.ac.in/app/storage/app/coursecurriculum/7xAINJWsbYbISP5Lk9PSY2VJU5daoGrnm2lbjilf.pdf',
      link_target: '_blank',
      duration: '2 Years',
      intake: 'Intake: 10 (TA Category)',
      description:
        'Interdisciplinary program focusing on water resources, climate resilience, and sustainable environmental systems to address emerging global challenges.',
      highlights: [
        'Advanced hydrology and climate modelling',
        'Sustainable water resource management',
        'Hands-on training with environmental simulation tools',
        'Research and field-based projects in climate resilience',
      ],
      courses: [
        'Advanced Hydrology',
        'Water Resources Systems Engineering',
        'Climate Change Impact Assessment',
        'Environmental Data Analytics',
        'Sustainable Water Infrastructure',
        'Hydraulic Modelling & Simulation',
      ],
    },
    {
      title: 'M.Tech in Transportation Systems Engineering (Upcoming)',
      link_url: '/programs/mtech-transportation-systems-engineering.html',
      link_target: '_blank',
      duration: '2 Years',
      intake: 'Intake: 10 (TA Category)',
      description:
        'Program dedicated to planning, design, and optimization of modern transportation networks with a focus on smart mobility and sustainable infrastructure.',
      highlights: [
        'Advanced traffic engineering and transport planning',
        'Exposure to intelligent transportation systems (ITS)',
        'Laboratory and software training in transport simulation',
        'Industry-linked projects on mobility and infrastructure',
      ],
      courses: [
        'Traffic Engineering & Management',
        'Transportation Planning',
        'Pavement Design & Materials',
        'Public Transport Systems',
        'Intelligent Transportation Systems (ITS)',
        'Transport Modelling & Simulation',
      ],
    },
    {
      title: 'M.Tech in Geotechnical Engineering (Upcoming)',
      link_url: null,
      link_target: '_blank',
      duration: '2 Years',
      intake: 'Intake: 10 (TA Category)',
      description:
        'Specialized program in soil mechanics, foundation engineering, and geoenvironmental engineering with modern testing and analysis techniques.',
      highlights: [
        'Comprehensive soil and rock mechanics',
        'Foundation design for complex structures',
        'Geoenvironmental engineering applications',
        'Field investigation techniques',
      ],
      courses: [
        'Advanced Soil Mechanics',
        'Foundation Engineering',
        'Slope Stability',
        'Ground Improvement',
        'Rock Mechanics',
        'Geosynthetics',
      ],
    },
    {
      title: 'Ph.D. in Civil Engineering',
      link_url:
        'https://academic.iiti.ac.in/app/storage/app/coursecurriculum/7xAINJWsbYbISP5Lk9PSY2VJU5daoGrnm2lbjilf.pdf',
      link_target: '_blank',
      duration: '3-6 Years',
      intake: null,
      description:
        'Research-intensive doctoral program aimed at producing independent researchers and academics in various specializations of civil engineering.',
      highlights: [
        'Independent research under expert supervision',
        'Interdisciplinary research opportunities',
        'Teaching assistantship opportunities',
        'International collaboration programs',
      ],
      courses: [
        'Research Methodology',
        'Advanced Mathematics',
        'Specialized Courses',
        'Dissertation Research',
        'Seminar Presentations',
        'Professional Development',
      ],
    },
  ],
  curriculum_title: 'B.Tech Curriculum Structure',
  curriculum_subtitle: 'Detailed semester-wise breakdown of the undergraduate program',
  curriculum_semesters: [
    {
      semester_label: 'Semester 1',
      courses: [
        'Basic Electrical Engineering',
        'Engineering Mechanics',
        'Basics of Physics',
        'Physics Lab- I',
        'Calculus',
        'Language and Composition',
        'Makerspace',
        'Computer Programming',
        'Computer Programming Lab',
      ],
    },
    {
      semester_label: 'Semester 2',
      courses: [
        'Biosciences',
        'Linear Algebra',
        'Differential Equations-I',
        'Environmental Studies',
        'Fundamentals of Economics',
        'Chemistry',
        'Chemistry Lab',
        'Flexible Elective',
        'Flexible Elective (HSS)',
      ],
    },
    {
      semester_label: 'Semester 3',
      courses: [
        'Complex Analysis',
        'Differential Equations-II',
        'Strength of Materials',
        'Fluid Mechanics',
        'Surveying',
        'Building Materials',
        'Surveying',
        'Department Elective I',
      ],
    },
    {
      semester_label: 'Semester 4',
      courses: [
        'Numerical Methods',
        'Structural Analysis-I',
        'Soil Mechanics-I',
        'Engineering Geology',
        'Environmental Engineering',
        'Department Elective II',
        'Institute Elective I',
      ],
    },
    {
      semester_label: 'Semester 5',
      courses: [
        'Structural Analysis-II',
        'Soil Mechanics-II',
        'Transportation Engineering',
        'Design of Reinforced Concrete Structures',
        'Department Elective III',
        'Institute Elective II',
      ],
    },
    {
      semester_label: 'Semester 6',
      courses: [
        'Design of steel structures',
        'Engineering Hydrology',
        'Computer Aided Design Lab',
        'Introduction to Finite Element Methods',
        'Department Elective IV',
        'Department Elective IV',
        'Institute Elective III',
      ],
    },
    {
      semester_label: 'Semester 7',
      courses: ['B Tech Project (BTP)', 'Internship'],
    },
    {
      semester_label: 'Semester 8',
      courses: [
        'Water Resources Engineering',
        'Design of Structures-III',
        'Transportation Engineering-II',
        'Foundation Engineering',
        'Department Elective V',
        'Institute Elective IV',
        'Institute Elective V',
      ],
    },
  ],
  facilities_title: 'Laboratory Facilities',
  facilities_subtitle:
    'State-of-the-art laboratories supporting hands-on learning and research',
  facilities_items: [
    'Computational Laboratory',
    'Engineering Geology Laboratory',
    'Environmental Engineering Laboratory',
    'Fluid Mechanics Laboratory',
    'Geotechnical Engineering Laboratory- 01',
    'Geotechnical Engineering Laboratory- 02',
    'Geodesy & Surveying Laboratory',
    'Hydraulics and Hydrology Laboratory',
    'Materials Engineering Laboratory',
    'Solid Mechanics Laboratory',
    'Transportation Engineering Laboratory',
    'Structure Engineering Laboratory',
  ],
  admission_title: 'Ready to Join Us?',
  admission_subtitle:
    'Take the first step towards a rewarding career in civil engineering. Learn about our admission process and requirements.',
  admission_primary_text: 'Admission Guidelines',
  admission_primary_link: '/contact',
  admission_secondary_text: 'Download Brochure',
  admission_secondary_link: '#',
};

function normalizeAcademicsContent(response) {
  const content = response?.academicsContent || {};

  const programs = Array.isArray(content.programs)
    ? content.programs
        .map((program) => ({
          title: String(program?.title || '').trim(),
          link_url: program?.link_url || null,
          link_target: program?.link_target || '_blank',
          duration: String(program?.duration || '').trim(),
          intake: program?.intake || null,
          description: String(program?.description || '').trim(),
          highlights: Array.isArray(program?.highlights)
            ? program.highlights.map((item) => String(item || '').trim()).filter(Boolean)
            : [],
          courses: Array.isArray(program?.courses)
            ? program.courses.map((item) => String(item || '').trim()).filter(Boolean)
            : [],
        }))
        .filter((program) => program.title && program.description)
    : [];

  const curriculumSemesters = Array.isArray(content.curriculum_semesters)
    ? content.curriculum_semesters
        .map((semester) => ({
          semester_label: String(semester?.semester_label || '').trim(),
          courses: Array.isArray(semester?.courses)
            ? semester.courses.map((item) => String(item || '').trim()).filter(Boolean)
            : [],
        }))
        .filter((semester) => semester.semester_label)
    : [];

  const facilitiesItems = Array.isArray(content.facilities_items)
    ? content.facilities_items.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

  return {
    ...fallbackAcademicsContent,
    ...content,
    programs: programs.length > 0 ? programs : fallbackAcademicsContent.programs,
    curriculum_semesters:
      curriculumSemesters.length > 0
        ? curriculumSemesters
        : fallbackAcademicsContent.curriculum_semesters,
    facilities_items:
      facilitiesItems.length > 0
        ? facilitiesItems
        : fallbackAcademicsContent.facilities_items,
  };
}

const Academics = () => {
  const [academicsContent, setAcademicsContent] = useState(() =>
    normalizeAcademicsContent(getCachedPublicContentByKey('academics'))
  );

  useEffect(() => {
    let isMounted = true;

    const loadAcademicsContent = async () => {
      try {
        const data = await fetchPublicContentByKey('academics');
        if (!isMounted) {
          return;
        }

        setAcademicsContent(normalizeAcademicsContent(data));
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setAcademicsContent((previous) => previous || fallbackAcademicsContent);
      }
    };

    loadAcademicsContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderProgramTitle = (program) => {
    if (!program.link_url) {
      return program.title;
    }

    const resolvedLink = resolveMediaUrl(program.link_url);
    const target = program.link_target || '_blank';
    const rel = target === '_blank' ? 'noreferrer' : undefined;

    return (
      <a href={resolvedLink} target={target} rel={rel}>
        {program.title}
      </a>
    );
  };

  return (
    <div className="bg-white">
      <section className="relative py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">{academicsContent.hero_title}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {academicsContent.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {academicsContent.programs_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {academicsContent.programs_subtitle}
            </p>
          </div>

          <div className="space-y-12">
            {academicsContent.programs.map((program, index) => (
              <div
                key={`${program.title}-${index}`}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-800 text-white p-3 rounded-lg mr-4">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {renderProgramTitle(program)}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2 text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{program.duration}</span>
                            </div>
                            {program.intake && (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span className="text-sm">{program.intake}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-amber-500" />
                            Program Highlights
                          </h4>
                          <ul className="space-y-2">
                            {program.highlights.map((highlight, highlightIndex) => (
                              <li key={`${highlight}-${highlightIndex}`} className="flex items-start">
                                <ChevronRight className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                                <span className="text-gray-600 text-sm">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-amber-500" />
                            Key Courses
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {program.courses.map((course, courseIndex) => (
                              <span
                                key={`${course}-${courseIndex}`}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
              {academicsContent.curriculum_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {academicsContent.curriculum_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicsContent.curriculum_semesters.map((semester, index) => (
              <div
                key={`${semester.semester_label}-${index}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <h3 className="text-lg font-bold text-blue-800 mb-4">
                  {semester.semester_label}
                </h3>
                <ul className="space-y-2">
                  {semester.courses.map((course, courseIndex) => (
                    <li key={`${course}-${courseIndex}`} className="text-sm text-gray-600 leading-relaxed">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {academicsContent.facilities_title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {academicsContent.facilities_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicsContent.facilities_items.map((facility, index) => (
              <div
                key={`${facility}-${index}`}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-blue-200"
              >
                <div className="flex items-center">
                  <div className="bg-blue-800 text-white p-2 rounded-lg mr-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{facility}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              {academicsContent.admission_title}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {academicsContent.admission_subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={resolveMediaUrl(academicsContent.admission_primary_link)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {academicsContent.admission_primary_text}
              </a>
              <a
                href={resolveMediaUrl(academicsContent.admission_secondary_link)}
                className="bg-white hover:bg-gray-100 text-blue-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {academicsContent.admission_secondary_text}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
