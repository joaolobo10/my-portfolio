'use client'

import React from 'react';
import { FolderGit2 } from 'lucide-react';

interface ProfileHeaderProps {
    onOpenProjects: () => void;
}

export default function ProfileHeader({ onOpenProjects }: ProfileHeaderProps) {
    return (
        <section className="flex flex-row items-center gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-zinc-700 p-1 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800">
                    <img
                        src="/fotoDePerfil.jpg"
                        alt="Foto de perfil de João"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Hi, i'm <span className="text-white">João!</span> 👋
                </h1>
                <p className="text-zinc-400 text-lg font-medium mt-1">Software Engineering Student</p>

                <button
                    onClick={onOpenProjects}
                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white px-4 py-2 rounded-lg transition-all border border-white/5 group"
                >
                    <FolderGit2 size={16} />
                    View Projects
                    <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">→</span>
                </button>
            </div>
        </section>
    );
}