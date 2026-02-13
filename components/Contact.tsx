import { NoiseBackground } from './ui/noise-background'
import { Check, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { FloatingDock } from './ui/floating-dock';
import React, { useState } from 'react';

const Contact = () => {

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
        <div>
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
                            gradientColors={copied ? ["#10b981", "#059669", "#064e3b"] : ["#8187f7", "#5d28a3", "#381883"]}
                            noiseIntensity={0.3}
                            speed={0.15}>
                            <span className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-3">
                                {copied ? 'Ready to paste!🫡' : 'Contact me'}
                                {copied ? (<Check size={16} className="text-white animate-in zoom-in duration-300" />)
                                    : (<Mail size={16} className="group-hover/contact:translate-x-1 transition-transform" />)}
                            </span>
                        </NoiseBackground>
                    </button>
                </section>
            </section>
        </div>
    )
}

export default Contact