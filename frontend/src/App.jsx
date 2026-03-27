import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import People from './pages/People';
import Specializations from './pages/Specializations';
import Events from './pages/Events';
import Contact from './pages/Contacts';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import {
  fetchBootstrapContent,
  fetchPublicContentByKey,
  getBackgroundPublicContentKeys,
  getPublicContentKeyFromPath,
  prefetchPublicContent,
  startPublicContentAutoRefresh,
} from './lib/contentApi';

function AppLayout() {
  const [bootstrapContent, setBootstrapContent] = useState(null);
  const [bootstrapState, setBootstrapState] = useState('loading');
  const refreshStopRef = useRef(null);
  const location = useLocation();

  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/admin/login';

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    let isMounted = true;

    const loadBootstrapContent = async () => {
      setBootstrapState('loading');

      try {
        const data = await fetchBootstrapContent({ force: true });
        if (isMounted) {
          setBootstrapContent(data);
          setBootstrapState('ready');
        }
      } catch (_error) {
        if (isMounted) {
          // If API fails, render with static fallback content in components.
          setBootstrapContent(null);
          setBootstrapState('fallback');
        }
      }

      if (!isMounted) {
        return;
      }

      const keys = getBackgroundPublicContentKeys('home');
      prefetchPublicContent(keys);

      if (refreshStopRef.current) {
        refreshStopRef.current();
      }

      refreshStopRef.current = startPublicContentAutoRefresh(keys, 60_000);
    };

    loadBootstrapContent();

    return () => {
      isMounted = false;

      if (refreshStopRef.current) {
        refreshStopRef.current();
        refreshStopRef.current = null;
      }
    };
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute || bootstrapState === 'loading') {
      return;
    }

    let isMounted = true;

    const prioritizeRouteContent = async () => {
      const routeKey = getPublicContentKeyFromPath(location.pathname);
      if (!routeKey) {
        return;
      }

      try {
        await fetchPublicContentByKey(routeKey);
      } catch (_error) {
        return;
      }

      if (!isMounted) {
        return;
      }

      const remainingKeys = getBackgroundPublicContentKeys(routeKey).filter(
        (key) => key !== routeKey
      );

      prefetchPublicContent(remainingKeys);
    };

    prioritizeRouteContent();

    return () => {
      isMounted = false;
    };
  }, [bootstrapState, isAdminRoute, location.pathname]);

  if (!isAdminRoute && bootstrapState === 'loading') {
    return (
      <>
        <ScrollToTop />
        <LoadingScreen message="Loading website..." fullScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      {!isAdminRoute && <Navbar bootstrapContent={bootstrapContent} />}
      <main className={isAdminRoute ? '' : 'pt-16'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/people" element={<People />} />
          <Route path="/specializations" element={<Specializations />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer bootstrapContent={bootstrapContent} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;