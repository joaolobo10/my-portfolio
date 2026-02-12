'use client'

import React from 'react';
import { useState } from 'react';
import { 
  Instagram, 
  Linkedin, 
  Github, 
  Mail, 
  GraduationCap,
  Check
} from 'lucide-react';
import { FaJava, FaPython } from 'react-icons/fa';
import { BiLogoSpringBoot } from 'react-icons/bi';
import { PiFileSqlThin } from 'react-icons/pi';

import { FloatingDock } from "@/components/ui/floating-dock"; 
import { NoiseBackground } from '@/components/ui/noise-background';

export default function App() {
  
  const skills = [
    { name: "Java", years: 1, icon: <FaJava size={25} />, width: "w-1/3" },
    { name: "SpringBoot", years: 1, icon: <BiLogoSpringBoot size={25} />, width: "w-1/3" },
    { name: "Python", years: 1.5, icon: <FaPython size={25} />, width: "w-2/5" },
    { name: "Sql", years: 1.6, icon: <PiFileSqlThin size={25} />, width: "w-1/2" },
  ];

  const socialLinks = [
    {
      title: "Instagram",
      icon: <Instagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://github.com/joaolobo10",
    },
    {
      title: "LinkedIn",
      icon: <Linkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://www.linkedin.com/in/jo%C3%A3o-lobo-17bb922b1/",
    },
    {
      title: "GitHub",
      icon: <Github className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://github.com/joaolobo10",
    },
  ];

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText("joaocarloslobo10@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  } catch (err) {
    console.error('Falha ao copiar:', err);
  }
};

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-5xl bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row p-8 md:p-16 gap-12 border border-white/5">

        <div className="flex-1 flex flex-col gap-10"> 
          <section className="flex flex-row items-center gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-zinc-700 p-1">
               <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800">
                  <img 
                    src="/fotoDePerfil.jpg" 
                    alt="Foto de perfil de João" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
               </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Hi, i'm <span className="text-white">João!</span> 👋
              </h1>
              <p className="text-zinc-400 text-lg font-medium mt-1">Software Engineering Student</p>
            </div>
          </section>

          <section aria-labelledby="experiencia-title" className="flex flex-col gap-6">
            <h2 id="experiencia-title" className="text-xl font-semibold border-b border-white/10 pb-2 w-fit pr-8">
              Experience
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              Currently working as a <span className="text-white font-medium">Software Developer</span> for the past 7 months, 
              and dedicated to <span className="text-white font-medium">working on personal projects.</span>
            </p>
            
            <ul className="flex flex-col gap-5 mt-2"> 
              {skills.map((skill, index) => (
                <li key={index} className="flex items-center gap-4 group">
                  <div className="text-zinc-500 group-hover:text-white transition-colors">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <div className="h-7 w-[90%] bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full animate-pulse bg-linear-to-r from-[#8187f7] via-[#5d28a3] to-[#381883] rounded-full flex items-center justify-end px-3 transition-all duration-1000 ${skill.width}`}
                      >
                        <span className="text-[14px] font-regular text-white/80 whitespace-nowrap">
                          {skill.years} years
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="w-full md:w-64 flex flex-col gap-12">
          <section aria-labelledby="lang-title" className="flex flex-col gap-4">
            <h2 id="lang-title" className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Languages</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <span className="text-lg">🇺🇸</span>
                <span className="font-medium text-zinc-300">EN <span className="text-zinc-500 font-normal">Advanced</span></span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-lg">🇧🇷</span>
                <span className="font-medium text-zinc-300">PT-BR <span className="text-zinc-500 font-normal">Native Speaker</span></span>
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 id="edu-title" className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Education</h2>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-zinc-400">
                <GraduationCap size={22} />
              </div>
              <p className="text-sm text-zinc-300 leading-snug">
                Bachelor’s Degree in Software Engineering - 7th semester | <span className="text-zinc-400">Universidade de Brasília</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-zinc-400">
                <GraduationCap size={22} />
              </div>
              <p className="text-sm text-zinc-300 leading-snug">
                Associate Degree in Systems Analysis and Development - Final Semester | <span className="text-zinc-400">IESB</span>
              </p>
            </div>
          </section>

          <section aria-label="Redes Sociais e Contato" className="mt-auto flex flex-col items-center gap-6">
            <div className="flex items-center justify-center w-full">
              <FloatingDock items={socialLinks} />
            </div>
            <section aria-label="Contato" className="mt-auto w-full">
              <button 
                onClick={handleCopy}
                className="block w-full group/contact transition-transform hover:scale-[1.02] active:scale-[0.98] outline-none">
                <NoiseBackground
                  containerClassName="py-4 px-6 rounded-full border border-white/10 cursor-pointer"
                  className="flex items-center justify-center gap-3"
                  gradientColors={copied ? ["#10b981", "#059669", "#064e3b"] : ["#8187f7", "#5d28a3", "#381883"]} // Muda para verde se copiado
                  noiseIntensity={0.3}
                  speed={0.15}>

                  <span className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-3">
                    {copied ? 'Ready to paste!🫡' : 'Contact me'}
                    
                    {copied ? (<Check size={16} className="text-white animate-in zoom-in duration-300" /> ) 
                    : (<Mail size={16} className="group-hover/contact:translate-x-1 transition-transform" />)}
                  </span>
                </NoiseBackground>
              </button>
            </section>
          </section>
        </aside>
      </main>
    </div>
  );
}