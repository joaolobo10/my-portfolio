import { FolderGit2 } from 'lucide-react';
import React, { useState } from 'react';
import { FaJava, FaPython } from 'react-icons/fa';
import { BiLogoSpringBoot } from 'react-icons/bi';
import { PiFileSqlThin } from 'react-icons/pi';

const Experience = () => {

  const skills = [
    { name: "Java", years: 1, icon: <FaJava size={25} />, width: "w-1/3" },
    { name: "SpringBoot", years: 1, icon: <BiLogoSpringBoot size={25} />, width: "w-1/3" },
    { name: "Python", years: 1.5, icon: <FaPython size={25} />, width: "w-2/5" },
    { name: "Sql", years: 1.6, icon: <PiFileSqlThin size={25} />, width: "w-1/2" },
  ];

  return (
    <div>
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
  )
}

export default Experience