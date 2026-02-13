'use client'

import React from 'react';
import { FolderGit2, ArrowLeft } from 'lucide-react';

interface ProjectsHeaderProps {
  onBack: () => void;
}

export default function ProjectsHeader({ onBack }: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-2">
      <h2 className="text-3xl font-bold flex items-center gap-3">
        <FolderGit2 className="text-[#8187f7]" size={32} /> 
        My Projects
      </h2>
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-4 py-2 rounded-lg border border-white/5"
      >
        <ArrowLeft size={16} /> Back to Bio
      </button>
   </div>
  );
}