import React from 'react'

const Languages = () => {
    return (
        <div>
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
        </div>
    )
}

export default Languages