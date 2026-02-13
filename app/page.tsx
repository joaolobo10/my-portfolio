'use client'

import React, { useState } from 'react';

import Languages from '@/components/Languages';
import Education from '@/components/Education';
import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import GridProjects from '@/components/GridProjects';
import ProfileHeader from '@/components/Profile';
import ProjectsHeader from '@/components/ScreenProjects'; 

export default function App() {

  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-5xl bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-white/5 p-8 md:p-16 transition-all duration-500 ease-in-out">

        {currentView === 'home' ? (

          <div className="flex flex-col md:flex-row gap-12 w-full animate-in fade-in slide-in-from-left-8 duration-500">

            <div className="flex-1 flex flex-col gap-10">
              <ProfileHeader onOpenProjects={() => setCurrentView('projects')} />
              <Experience />
            </div>

            <aside className="w-full md:w-72 flex flex-col gap-12 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-12">
              <Languages />
              <Education />
              <Contact />
            </aside>

          </div>
        ) : (
          <div className="w-full flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
            <ProjectsHeader onBack={() => setCurrentView('home')} />
            <GridProjects />
          </div>
        )}

      </main>
    </div>
  );
}