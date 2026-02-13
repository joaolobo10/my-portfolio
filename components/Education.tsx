import { GraduationCap } from 'lucide-react'
import React from 'react'

const Education = () => {
    return (
        <div>
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
        </div>
    )
}

export default Education