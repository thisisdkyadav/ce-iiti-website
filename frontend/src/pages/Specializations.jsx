import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Building,
  ChevronRight,
  FlaskConical,
  HardHat,
  Microscope,
  Settings,
  Target,
  Users,
} from 'lucide-react';
import {
  fetchPublicContentByKey,
  getCachedPublicContentByKey,
  resolveMediaUrl,
} from '../lib/contentApi';

const COLOR_CLASS_MAP = {
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    hover: 'hover:bg-blue-700',
    light: 'bg-blue-50',
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    border: 'border-amber-600',
    hover: 'hover:bg-amber-700',
    light: 'bg-amber-50',
  },
  green: {
    bg: 'bg-green-600',
    text: 'text-green-600',
    border: 'border-green-600',
    hover: 'hover:bg-green-700',
    light: 'bg-green-50',
  },
  cyan: {
    bg: 'bg-cyan-600',
    text: 'text-cyan-600',
    border: 'border-cyan-600',
    hover: 'hover:bg-cyan-700',
    light: 'bg-cyan-50',
  },
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    hover: 'hover:bg-emerald-700',
    light: 'bg-emerald-50',
  },
};

const ICON_MAP = {
  Building,
  Microscope,
  Target,
  FlaskConical,
  Award,
};

const fallbackSpecializationsContent = {
  hero_title: 'Research & Facilities',
  hero_subtitle: 'Explore our core specializations and state-of-the-art laboratories',
  specializations_tab_label: 'Specializations',
  laboratories_tab_label: 'Laboratories',
  specializations_title: 'Areas of Expertise',
  specializations_subtitle:
    'Each specialization offers unique opportunities for advanced learning and research',
  specializations: [
    {
      key: 'structural',
      title: 'Structural Engineering',
      description:
        'Advanced research in structural analysis, design, and earthquake engineering with state-of-the-art testing facilities.',
      color: 'blue',
      icon_name: 'Building',
      image_url: '/assets/Specialization banners/Structural_specialization_banner.jpg',
      labs: [
        {
          name: 'Materials Engineering Laboratory',
          equipments: [
            {
              name: 'Servo Compression Testing Machine',
              image_url:
                '/assets/Instruments/Structural/Materials/ServoCompressionTestingMachine.jpg',
            },
            { name: 'Fatigue Testing Machine', image_url: '/assets/Instruments/Structural/Materials/Fatigue.jpg' },
            {
              name: 'Dynamic Shear Rheometer',
              image_url: '/assets/Instruments/Structural/Materials/DynamicShear.jpg',
            },
            {
              name: 'Le-Chatelier Apparatus',
              image_url: '/assets/Instruments/Structural/Materials/LeChatlier.jpg',
            },
            { name: 'Wet Seiving of Fly Ash', image_url: '/assets/Instruments/Structural/Materials/WetSeiving.jpg' },
            { name: 'Small Size Machine Cleaner', image_url: '/assets/Instruments/Structural/Materials/Cleaner.jpg' },
            { name: 'Slump Test for Concretee', image_url: '/assets/Instruments/Structural/Materials/Slump.jpg' },
            {
              name: 'Concrete Permeability Test',
              image_url: '/assets/Instruments/Structural/Materials/ConcretePermeability.jpg',
            },
            { name: 'Pan Mixer', image_url: '/assets/Instruments/Structural/Materials/PanMixer.jpg' },
          ],
        },
        {
          name: 'Solid Mechanics Laboratory',
          equipments: [
            { name: 'Stress and Strain in Bending', image_url: '/assets/Instruments/Structural/SolidMechanics/StressStrain.png' },
            { name: 'Beam Bending Moment', image_url: '/assets/Instruments/Structural/SolidMechanics/BeamBending.png' },
            {
              name: 'Unsymmetrical Bending of Beam',
              image_url: '/assets/Instruments/Structural/SolidMechanics/UnsymmetricalBending.png',
            },
            { name: 'Column Test Rig', image_url: '/assets/Instruments/Structural/SolidMechanics/ColumnTest.png' },
          ],
        },
      ],
      faculty: [
        { name: 'Dr. Sandeep Chaudhary', url: 'https://sustainableconstructionlab.com/' },
        { name: 'Dr. Abhishek Rajput', url: 'https://people.iiti.ac.in/~abhishekrajput/' },
        { name: 'Dr. Kaustav Bakshi', url: 'https://sites.google.com/view/kaustavbakshi/home' },
        { name: 'Dr. Guru Prakash', url: 'https://sites.google.com/view/guruprakash/home?authuser=0' },
        { name: 'Dr. Ravinder', url: 'https://ravinderbhattoo.github.io/' },
      ],
    },
    {
      key: 'geotechnical',
      title: 'Geotechnical Engineering',
      description:
        'Comprehensive soil mechanics, foundation engineering, and ground improvement research with modern testing equipment.',
      color: 'amber',
      icon_name: 'Microscope',
      image_url: '/assets/Specialization banners/Geotechnical_specialization_banner.jpg',
      labs: [
        {
          name: 'Geotechnical Engineering Laboratory',
          equipments: [
            { name: 'Automatic Compaction', image_url: '/assets/Instruments/Geotechnical/Geotechnical/AutomaticCompaction.png' },
            { name: 'Environment Chamber', image_url: '/assets/Instruments/Geotechnical/Geotechnical/EnvironmentChamber.png' },
            {
              name: 'California Bearing Ratio Machine - 50 kN',
              image_url: '/assets/Instruments/Geotechnical/Geotechnical/CBR.png',
            },
            { name: 'Relative Density Apparatus', image_url: '/assets/Instruments/Geotechnical/Geotechnical/RelativeDensity.png' },
            { name: 'Direct Shear Machine', image_url: '/assets/Instruments/Geotechnical/Geotechnical/DirectShear.png' },
            { name: 'Sieve Shaker', image_url: '/assets/Instruments/Geotechnical/Geotechnical/SieveShaker.png' },
            { name: 'Vertical Auto Clave', image_url: '/assets/Instruments/Geotechnical/Geotechnical/VerticalAuto.png' },
            { name: 'Hot Air Oven', image_url: '/assets/Instruments/Geotechnical/Geotechnical/HotAirOven.png' },
            { name: 'Weighing Balance', image_url: '/assets/Instruments/Geotechnical/Geotechnical/Weighingbalance.png' },
            { name: 'Vane Shear Test', image_url: '/assets/Instruments/Geotechnical/Geotechnical/VaneShear.png' },
            { name: 'High Speed Starrier', image_url: '/assets/Instruments/Geotechnical/Geotechnical/HighSpeed.png' },
            { name: 'Plate Load Test', image_url: '/assets/Instruments/Geotechnical/Geotechnical/PlateLoad.png' },
            { name: 'Standard Penetration Test (SPT)', image_url: '/assets/Instruments/Geotechnical/Geotechnical/SPT.png' },
            {
              name: 'Electrical Resistivity Tomography (ERT)',
              image_url: '/assets/Instruments/Geotechnical/Geotechnical/ERT.png',
            },
          ],
        },
        {
          name: 'Computational Laboratory',
          equipments: [
            { name: 'Desktop PCs in Computational Lab', image_url: '/assets/Instruments/Geotechnical/Computational/PC.jpg' },
          ],
        },
        {
          name: 'Engineering Geology Laboratory',
          equipments: [
            { name: 'Microscope', image_url: '/assets/Instruments/Geotechnical/Geology/Microscope.jpg' },
            { name: 'Display Tables for Rock Samples', image_url: '/assets/Instruments/Geotechnical/Geology/Display.jpg' },
            {
              name: 'Display Tables for Mineral Samples',
              image_url: '/assets/Instruments/Geotechnical/Geology/DisplayMineral.jpg',
            },
            {
              name: 'Display Tables for 3D Geology Models',
              image_url: '/assets/Instruments/Geotechnical/Geology/Display3D.jpg',
            },
            {
              name: 'Wall Models for Different Geologic Cycles',
              image_url: '/assets/Instruments/Geotechnical/Geology/WallModels.jpg',
            },
          ],
        },
      ],
      faculty: [
        { name: 'Dr. Neelima Satyam D', url: 'https://people.iiti.ac.in/~neelima.satyam/' },
        { name: 'Dr. Lalit Borana', url: 'https://sites.google.com/site/lalitborana/' },
        { name: 'Dr. Akshay Pratap Singh', url: 'https://sites.google.com/view/apsingh/bio?authuser=0' },
        { name: 'Dr. Baadiga Ramu', url: 'https://sites.google.com/view/ramubaadiga/' },
      ],
    },
    {
      key: 'transportation',
      title: 'Transportation Systems Engineering',
      description:
        'Highway engineering, traffic management, and intelligent transportation systems with advanced simulation capabilities.',
      color: 'green',
      icon_name: 'Target',
      image_url: '/assets/Specialization banners/Transport_specialization_banner.jpg',
      labs: [
        {
          name: 'Geodesy and Surveying Laboratory',
          equipments: [
            { name: 'Transit Vernier Theodolite', image_url: '/assets/Instruments/Transportation/Survey/TransitTheodolite.jpg' },
            { name: 'Dumpy Level', image_url: '/assets/Instruments/Transportation/Survey/DumpyLevel.jpg' },
            { name: 'Auto Level', image_url: '/assets/Instruments/Transportation/Survey/Autolevel.jpg' },
            { name: 'Plane Table', image_url: '/assets/Instruments/Transportation/Survey/PlaneTable.jpg' },
            { name: 'Prismatic Compass', image_url: '/assets/Instruments/Transportation/Survey/PrismaticCompass.jpg' },
            { name: 'Total Station', image_url: '/assets/Instruments/Transportation/Survey/TotalStation.jpg' },
            { name: 'DGPS', image_url: '/assets/Instruments/Transportation/Survey/DGPS 1.jpg' },
            { name: 'Ranging Rod', image_url: '/assets/Instruments/Transportation/Survey/RangingRod.jpg' },
            { name: 'Metric Chain', image_url: '/assets/Instruments/Transportation/Survey/MetricChain.jpg' },
            { name: 'Measuring Tapes', image_url: '/assets/Instruments/Transportation/Survey/MeasuringTapes.jpg' },
            { name: 'Wooden Pegs, Hammer', image_url: '/assets/Instruments/Transportation/Survey/WoodenPegs.jpg' },
          ],
        },
        {
          name: 'Transportation Engineering Laboratory',
          equipments: [
            {
              name: 'Aggregate Crushing Apparatus',
              image_url: '/assets/Instruments/Transportation/Transportation/AggregateCrushing.jpg',
            },
            { name: 'Aggregate Impact Apparatus', image_url: '/assets/Instruments/Transportation/Transportation/ImpactValue.png' },
            { name: 'Kinematic Viscosity Bath', image_url: '/assets/Instruments/Transportation/Transportation/KViscosity.png' },
            { name: 'Marshall Stability Test', image_url: '/assets/Instruments/Transportation/Transportation/Marshall.png' },
            { name: 'Los Angeles Abrasion', image_url: '/assets/Instruments/Transportation/Transportation/LosAngeles.jpg' },
            { name: 'Planetary Mixture', image_url: '/assets/Instruments/Transportation/Transportation/PlanetaryMixture.jpg' },
            { name: 'Ductility Testing', image_url: '/assets/Instruments/Transportation/Transportation/Ductility.jpg' },
            { name: 'Digital Ductility', image_url: '/assets/Instruments/Transportation/Transportation/DigitalDuctility.jpg' },
            { name: 'Cleveland Flash/Fire Point', image_url: '/assets/Instruments/Transportation/Transportation/Cleveland.jpg' },
            {
              name: 'Universal Penetrometer',
              image_url: '/assets/Instruments/Transportation/Transportation/UniversalPenetrometer.jpg',
            },
            { name: 'Ring and Ball Apparatus', image_url: '/assets/Instruments/Transportation/Transportation/RingBall.jpg' },
            {
              name: 'Constant Temperature Bath',
              image_url: '/assets/Instruments/Transportation/Transportation/WaterBath.png',
            },
            {
              name: 'Mastic Asphalt Tester',
              image_url: '/assets/Instruments/Transportation/Transportation/HardnessTester.png',
            },
            { name: 'Digital Marshall', image_url: '/assets/Instruments/Transportation/Transportation/DigitalMarshall.png' },
            {
              name: 'Marshall Compactor',
              image_url: '/assets/Instruments/Transportation/Transportation/MarshallCompactor.png',
            },
            { name: 'Hot Air Oven', image_url: '/assets/Instruments/Transportation/Transportation/HotAirOven.jpg' },
            {
              name: 'Rolling Thin Film Oven',
              image_url: '/assets/Instruments/Transportation/Transportation/ThinFilmOven.png',
            },
            {
              name: 'Vacuum Pycnometer',
              image_url: '/assets/Instruments/Transportation/Transportation/VacumePycnometer.jpg',
            },
          ],
        },
      ],
      faculty: [
        { name: 'Dr. Gourab Sil', url: 'https://gourabsil.profiles.iiti.ac.in/' },
        { name: 'Dr. Priyansh Singh', url: 'https://priyanshsingh.com/' },
        {
          name: 'Dr. Pushpa Choudhary',
          url: 'https://choudharypushpa.github.io/HumanFRSTLab/pages/team/faculty/pushpa.html',
        },
      ],
    },
    {
      key: 'water',
      title: 'Water Resources Engineering',
      description:
        'Hydrology, hydraulics, and water quality management with comprehensive testing and modeling facilities.',
      color: 'cyan',
      icon_name: 'FlaskConical',
      image_url: '/assets/Specialization banners/Water_specialization_banner.jpg',
      labs: [
        {
          name: 'Fluid Mechanics Laboratory',
          equipments: [
            { name: 'Minor Losses in Pipes', image_url: '/assets/Instruments/Water/FluidMechanics/MinorLosses.jpg' },
            { name: 'Major Losses in Pipes', image_url: '/assets/Instruments/Water/FluidMechanics/MajorLosses.jpg' },
            { name: 'Reynolds Apparatus', image_url: '/assets/Instruments/Water/FluidMechanics/Reynolds.jpg' },
            { name: 'Universal Base Module', image_url: '/assets/Instruments/Water/FluidMechanics/UniversalBase.jpg' },
            { name: 'Electrical Analogy', image_url: '/assets/Instruments/Water/FluidMechanics/ElectricalAnalogy.jpg' },
            { name: 'Hele-Shaw Apparatus', image_url: '/assets/Instruments/Water/FluidMechanics/HeleShaw.jpg' },
            { name: 'Metacentric Height', image_url: '/assets/Instruments/Water/FluidMechanics/Metacentric.jpg' },
            { name: 'Venturi Meter', image_url: '/assets/Instruments/Water/FluidMechanics/Venturi.jpg' },
            { name: 'Free Vortex Apparatus', image_url: '/assets/Instruments/Water/FluidMechanics/FreeVortex.jpg' },
            { name: 'Force Vortex Apparatus', image_url: '/assets/Instruments/Water/FluidMechanics/ForceVortex.jpg' },
          ],
        },
        {
          name: 'Hydraulics and Hydrology Laboratory',
          equipments: [
            { name: 'Multipurpose Tilting Flume', image_url: '/assets/Instruments/Water/Hydrology/Multipurpose.png' },
            { name: 'Pygmy Current Meter', image_url: '/assets/Instruments/Water/Hydrology/Pygmy.jpg' },
            {
              name: 'Advance Hydrology System',
              image_url: '/assets/Instruments/Water/Hydrology/AdvanceHydrology.png',
            },
            { name: 'Drainage and Seepage Tank', image_url: '/assets/Instruments/Water/Hydrology/Drainage.png' },
            { name: 'Vertical Axis Current Meter', image_url: '/assets/Instruments/Water/Hydrology/VerticalAxis.jpg' },
          ],
        },
      ],
      faculty: [
        { name: 'Dr. Manish Kumar Goyal', url: 'https://sites.google.com/view/mkg1/home' },
        { name: 'Dr. Priyank J. Sharma', url: 'https://sites.google.com/view/priyank2306' },
        { name: 'Dr. Mohd. Farooq Azam', url: 'https://sites.google.com/view/mohdfarooqazam/home' },
      ],
    },
    {
      key: 'environmental',
      title: 'Environmental Engineering',
      description:
        'Environmental monitoring, waste management, and sustainable construction with advanced analytical equipment.',
      color: 'emerald',
      icon_name: 'Award',
      image_url: '/assets/Specialization banners/Environmental_specialization_banner.jpg',
      labs: [
        {
          name: 'Environmental Engineering Laboratory',
          equipments: [
            { name: 'Dissolved Oxygen Meter', image_url: '/assets/Instruments/Environment/DO.jpg' },
            { name: 'Turbidity & Chlorine Tester', image_url: '/assets/Instruments/Environment/Turbidity.png' },
            { name: 'Autoclave', image_url: '/assets/Instruments/Environment/Autoclave.png' },
            { name: 'Hot Plate', image_url: '/assets/Instruments/Environment/HotPlate.png' },
            { name: 'Flame Photometer', image_url: '/assets/Instruments/Environment/FlamePhotometer.png' },
            { name: 'Weighing Balance', image_url: '/assets/Instruments/Environment/WeighingBalance.png' },
            { name: 'Hot Air Oven', image_url: '/assets/Instruments/Environment/HotAirOven.png' },
            { name: 'TKN Nitrogen Unit', image_url: '/assets/Instruments/Environment/TKN.png' },
            { name: 'Muffle Furnace', image_url: '/assets/Instruments/Environment/MuffleFurnace.png' },
            { name: 'Incubator', image_url: '/assets/Instruments/Environment/MCL.png' },
            {
              name: 'Distillation Apparatus',
              image_url: '/assets/Instruments/Environment/DistillationApparatus.png',
            },
            { name: 'COD Digestion Unit', image_url: '/assets/Instruments/Environment/COD.jpg' },
            { name: 'Weighing Machine', image_url: '/assets/Instruments/Environment/WeighingMachine.jpg' },
          ],
        },
      ],
      faculty: [
        { name: 'Dr. Ashootosh Mandpe', url: 'https://ashootoshmandpe.profiles.iiti.ac.in/' },
        { name: 'Dr. Mayur Shirish Jain', url: 'https://sites.google.com/view/mayur-shirish-jain' },
      ],
    },
  ],
  laboratory_rows: [
    { name: 'Computational Laboratory', location: '1C-404(A)' },
    { name: 'Engineering Geology Laboratory', location: '1C-404(B)' },
    { name: 'Environmental Engineering Laboratory', location: '1C-402' },
    { name: 'Fluid Mechanics Laboratory', location: '1C-403(A)' },
    { name: 'Geotechnical Engineering Laboratory- I', location: '1C-102(A)' },
    { name: 'Geotechnical Engineering Laboratory- II', location: '1C-102(B)' },
    { name: 'Geodesy & Surveying Laboratory', location: '1E- 101(A)' },
    { name: 'Hydraulics and Hydrology Laboratory', location: '1C-403(B)' },
    { name: 'Materials Engineering Laboratory', location: '1C-101(A)' },
    { name: 'Solid Mechanics Laboratory', location: '1C-101(B)' },
    { name: 'Transportation Engineering Laboratory', location: '1A-103' },
    { name: 'Structure Engineering Laboratory', location: '1E- 101(B)' },
  ],
};

function getColorClasses(color, type = 'bg') {
  return COLOR_CLASS_MAP[color]?.[type] || COLOR_CLASS_MAP.blue[type];
}

function normalizeFaculty(faculty) {
  if (!Array.isArray(faculty)) {
    return [];
  }

  return faculty
    .map((item) => ({
      name: String(item?.name || '').trim(),
      url: typeof item?.url === 'string' && item.url.trim() ? item.url.trim() : null,
    }))
    .filter((item) => item.name);
}

function normalizeEquipments(equipments) {
  if (!Array.isArray(equipments)) {
    return [];
  }

  return equipments
    .map((item) => ({
      name: String(item?.name || '').trim(),
      image_url: String(item?.image_url || item?.image || '').trim(),
    }))
    .filter((item) => item.name);
}

function normalizeLabs(labs) {
  if (!Array.isArray(labs)) {
    return [];
  }

  return labs
    .map((item) => ({
      name: String(item?.name || '').trim(),
      equipments: normalizeEquipments(item?.equipments),
    }))
    .filter((item) => item.name);
}

function normalizeSpecializationItem(item, fallback, index) {
  const key = String(item?.key || fallback?.key || `spec-${index + 1}`)
    .trim()
    .toLowerCase();

  return {
    key,
    title: String(item?.title || fallback?.title || 'Specialization').trim(),
    description: String(item?.description || fallback?.description || '').trim(),
    color: String(item?.color || fallback?.color || 'blue').trim().toLowerCase(),
    icon_name: String(item?.icon_name || fallback?.icon_name || 'Building').trim(),
    image_url: String(item?.image_url || fallback?.image_url || '').trim(),
    labs: normalizeLabs(item?.labs ?? fallback?.labs),
    faculty: normalizeFaculty(item?.faculty ?? fallback?.faculty),
  };
}

function normalizeLaboratories(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => ({
      name: String(row?.name || '').trim(),
      location: String(row?.location || '').trim(),
    }))
    .filter((row) => row.name && row.location)
    .sort((a, b) => {
      const isA1C = a.location.startsWith('1C');
      const isB1C = b.location.startsWith('1C');
      if (isA1C && !isB1C) return -1;
      if (!isA1C && isB1C) return 1;
      return a.location.localeCompare(b.location);
    });
}

function normalizeSpecializationsContent(raw) {
  const source = raw || {};
  const fallback = fallbackSpecializationsContent;
  const sourceSpecializations =
    Array.isArray(source.specializations) && source.specializations.length > 0
      ? source.specializations
      : fallback.specializations;

  const specializations = sourceSpecializations.map((item, index) =>
    normalizeSpecializationItem(item, fallback.specializations[index], index),
  );

  const laboratoryRows = normalizeLaboratories(
    Array.isArray(source.laboratory_rows) && source.laboratory_rows.length > 0
      ? source.laboratory_rows
      : fallback.laboratory_rows,
  );

  return {
    hero_title: String(source.hero_title || fallback.hero_title).trim(),
    hero_subtitle: String(source.hero_subtitle || fallback.hero_subtitle).trim(),
    specializations_tab_label: String(
      source.specializations_tab_label || fallback.specializations_tab_label,
    ).trim(),
    laboratories_tab_label: String(
      source.laboratories_tab_label || fallback.laboratories_tab_label,
    ).trim(),
    specializations_title: String(
      source.specializations_title || fallback.specializations_title,
    ).trim(),
    specializations_subtitle: String(
      source.specializations_subtitle || fallback.specializations_subtitle,
    ).trim(),
    specializations,
    laboratory_rows: laboratoryRows,
  };
}

const Specializations = () => {
  const cachedContent = getCachedPublicContentByKey('specializations');

  const [content, setContent] = useState(() =>
    normalizeSpecializationsContent(cachedContent?.specializationsContent),
  );
  const [activeMainTab, setActiveMainTab] = useState('specializations');
  const [activeSpecialization, setActiveSpecialization] = useState(
    content.specializations[0]?.key || 'structural',
  );

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetchPublicContentByKey('specializations');
        if (!isMounted || !response?.specializationsContent) {
          return;
        }

        setContent(normalizeSpecializationsContent(response.specializationsContent));
      } catch (_error) {
        // Keep rendering fallback content if request fails.
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const specializationsByKey = useMemo(() => {
    return content.specializations.reduce((acc, item) => {
      acc[item.key] = item;
      return acc;
    }, {});
  }, [content.specializations]);

  useEffect(() => {
    if (!specializationsByKey[activeSpecialization]) {
      setActiveSpecialization(content.specializations[0]?.key || '');
    }
  }, [activeSpecialization, content.specializations, specializationsByKey]);

  const currentSpec =
    specializationsByKey[activeSpecialization] || content.specializations[0] || null;

  if (!currentSpec) {
    return null;
  }

  const CurrentSpecIcon = ICON_MAP[currentSpec.icon_name] || Building;

  return (
    <div className="bg-white">
      <section className="relative py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">{content.hero_title}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {content.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveMainTab('specializations')}
              className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 flex items-center gap-2 ${
                activeMainTab === 'specializations'
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Award className="h-5 w-5" /> {content.specializations_tab_label}
            </button>
            <button
              onClick={() => setActiveMainTab('laboratories')}
              className={`px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 flex items-center gap-2 ${
                activeMainTab === 'laboratories'
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HardHat className="h-5 w-5" /> {content.laboratories_tab_label}
            </button>
          </div>
        </div>
      </section>

      {activeMainTab === 'specializations' ? (
        <>
          <section className="py-8 bg-gray-50 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-2">
                {content.specializations.map((spec) => {
                  const SpecIcon = ICON_MAP[spec.icon_name] || Building;

                  return (
                    <button
                      key={spec.key}
                      onClick={() => setActiveSpecialization(spec.key)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                        activeSpecialization === spec.key
                          ? `${getColorClasses(spec.color, 'bg')} text-white shadow-lg`
                          : `bg-white ${getColorClasses(spec.color, 'text')} ${getColorClasses(spec.color, 'border')} border hover:shadow-md`
                      }`}
                    >
                      <SpecIcon className="h-4 w-4" />
                      <span>{spec.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div
                  className={`inline-flex items-center space-x-3 ${getColorClasses(
                    currentSpec.color,
                    'text',
                  )} mb-4`}
                >
                  <CurrentSpecIcon className="h-8 w-8" />
                  <h2 className="text-4xl font-bold text-gray-900">{currentSpec.title}</h2>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {currentSpec.description}
                </p>
              </div>

              {currentSpec.image_url ? (
                <div className="mb-16">
                  <img
                    src={resolveMediaUrl(currentSpec.image_url)}
                    alt={currentSpec.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-xl"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="grid lg:grid-cols-2 gap-12 mb-16">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className={`${getColorClasses(currentSpec.color, 'bg')} text-white p-3 rounded-lg mr-4`}>
                      <Building className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Laboratory Facilities</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentSpec.labs.map((lab, idx) => (
                      <li key={`${lab.name}-${idx}`} className="flex items-start text-gray-700">
                        <span
                          className={`mt-2 mr-2 h-2 w-2 rounded-full ${getColorClasses(
                            currentSpec.color,
                            'bg',
                          )}`}
                        />
                        <span className="text-lg font-medium">{lab.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className={`${getColorClasses(currentSpec.color, 'bg')} text-white p-3 rounded-lg mr-4`}>
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Faculty Members</h3>
                  </div>
                  <div className="space-y-3">
                    {currentSpec.faculty.map((faculty, idx) => (
                      <div
                        key={`${faculty.name}-${idx}`}
                        className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <ChevronRight
                          className={`h-4 w-4 mr-2 ${getColorClasses(currentSpec.color, 'text')}`}
                        />
                        {faculty.url ? (
                          <a
                            href={faculty.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-800 font-medium hover:text-blue-700"
                          >
                            {faculty.name}
                          </a>
                        ) : (
                          <span className="text-gray-800 font-medium">{faculty.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-16">
                <div className="text-center mb-10">
                  <div
                    className={`inline-flex items-center space-x-2 ${getColorClasses(
                      currentSpec.color,
                      'text',
                    )} mb-2`}
                  >
                    <Settings className="h-6 w-6" />
                    <h3 className="text-3xl font-bold text-gray-900">Research Infrastructure</h3>
                  </div>
                </div>

                <div className="space-y-12">
                  {currentSpec.labs.map((lab, labIdx) => (
                    <div
                      key={`${lab.name}-${labIdx}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className={`${getColorClasses(currentSpec.color, 'light')} px-6 py-4 border-b border-gray-100`}>
                        <h4 className={`text-xl font-bold ${getColorClasses(currentSpec.color, 'text')}`}>
                          {lab.name}
                        </h4>
                      </div>
                      <div className="p-6">
                        {lab.equipments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lab.equipments.map((eq, eqIdx) => (
                              <div key={`${eq.name}-${eqIdx}`} className="group">
                                {eq.image_url ? (
                                  <div className="relative overflow-hidden rounded-lg shadow-md aspect-video mb-3">
                                    <img
                                      src={resolveMediaUrl(eq.image_url)}
                                      alt={eq.name}
                                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                  </div>
                                ) : null}
                                <h5 className="text-gray-800 font-semibold group-hover:text-blue-600 transition-colors">
                                  {eq.name}
                                </h5>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">Equipment details coming soon.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900">Department Laboratories</h2>
            </div>
            <div className="shadow-lg overflow-hidden border-b border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Sr. No.</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Laboratory Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.laboratory_rows.map((lab, index) => (
                    <tr key={`${lab.name}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{lab.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{lab.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Specializations;
