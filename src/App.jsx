import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import PortfolioView from './views/PortfolioView';
import ServicesView from './views/ServicesView';
import AboutView from './views/AboutView';
import InsightsView from './views/InsightsView';
import ContactView from './views/ContactView';
import ProjectDetailModal from './components/ProjectDetailModal';
import AdminCMSModal from './components/AdminCMSModal';
import InteractiveBriefEstimator from './components/InteractiveBriefEstimator';
import CommandPalette from './components/CommandPalette';
import { initialData } from './data/initialData';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [cmsModalOpen, setCmsModalOpen] = useState(false);
  const [estimatorModalOpen, setEstimatorModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const lenisRef = useRef(null);

  // Initialize Lenis Ultra-Smooth Momentum Scrolling Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Initialize projects from localStorage with fallback to initialData
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('best_consulting_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse localStorage projects:', err);
    }
    return initialData.projects;
  });

  // Sync projects to localStorage on update
  const handleUpdateProjects = (newProjects) => {
    setProjects(newProjects);
    try {
      localStorage.setItem('best_consulting_projects', JSON.stringify(newProjects));
    } catch (err) {
      console.warn('Failed to save projects to localStorage:', err);
    }
  };

  // Smooth scroll to top on page change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false, duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePage]);

  // Pause / Resume Lenis when modals are open
  const isAnyModalOpen = !!(selectedProject || cmsModalOpen || estimatorModalOpen || searchModalOpen);
  useEffect(() => {
    if (lenisRef.current) {
      if (isAnyModalOpen) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [isAnyModalOpen]);

  // Global Keyboard listener for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-[#FFF9ED] text-[#08184E] min-h-screen relative font-sans selection:bg-[#08184E] selection:text-white">
      {/* Dynamic Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenEstimator={() => setEstimatorModalOpen(true)}
        onOpenCMS={() => setCmsModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative z-10">
        {activePage === 'home' && (
          <HomeView
            projects={projects}
            services={initialData.services}
            setActivePage={setActivePage}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenEstimator={() => setEstimatorModalOpen(true)}
          />
        )}

        {activePage === 'portfolio' && (
          <PortfolioView
            projects={projects}
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenEstimator={() => setEstimatorModalOpen(true)}
          />
        )}

        {activePage === 'services' && (
          <ServicesView
            services={initialData.services}
            onOpenEstimator={() => setEstimatorModalOpen(true)}
          />
        )}

        {activePage === 'about' && (
          <AboutView
            staff={initialData.staff}
            onOpenEstimator={() => setEstimatorModalOpen(true)}
          />
        )}

        {activePage === 'insights' && (
          <InsightsView
            onOpenEstimator={() => setEstimatorModalOpen(true)}
            onSelectProject={(project) => setSelectedProject(project)}
          />
        )}

        {activePage === 'contact' && (
          <ContactView
            onOpenEstimator={() => setEstimatorModalOpen(true)}
          />
        )}
      </main>

      {/* Global Luxury Footer */}
      <Footer
        setActivePage={setActivePage}
        onOpenEstimator={() => setEstimatorModalOpen(true)}
        onOpenCMS={() => setCmsModalOpen(true)}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          allProjects={projects}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(p) => setSelectedProject(p)}
          onOpenEstimator={() => {
            setSelectedProject(null);
            setEstimatorModalOpen(true);
          }}
        />
      )}

      {/* Admin CMS Modal */}
      {cmsModalOpen && (
        <AdminCMSModal
          isOpen={cmsModalOpen}
          onClose={() => setCmsModalOpen(false)}
          projects={projects}
          onSaveProjects={handleUpdateProjects}
          onResetProjects={() => handleUpdateProjects(initialData.projects)}
        />
      )}

      {/* Interactive RFP / Project Brief Estimator Modal */}
      {estimatorModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#08184E]/40 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setEstimatorModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-modal rounded-3xl text-[#08184E] p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <InteractiveBriefEstimator
              isModal={true}
              onClose={() => setEstimatorModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={searchModalOpen}
        onClose={setSearchModalOpen}
        projects={projects}
        setActivePage={setActivePage}
        onSelectProject={(p) => setSelectedProject(p)}
        onOpenEstimator={() => setEstimatorModalOpen(true)}
        onOpenCMS={() => setCmsModalOpen(true)}
      />
    </div>
  );
}
