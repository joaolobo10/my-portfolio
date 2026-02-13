import React from 'react'
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

const GridProjects = () => {
    return (
        <div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                <CardContainer className="inter-var w-full" containerClassName="py-4">
                    <CardBody className="bg-zinc-900/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-[#8187f7]/[0.1] border-white/10 w-full h-auto rounded-xl p-6 border">

                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                        >
                            Title
                        </CardItem>

                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                        >
                            Description
                        </CardItem>

                        <CardItem translateZ="100" className="w-full mt-4">
                            {/* Placeholder Visual do Projeto */}
                            <div className="w-full h-40 bg-gradient-to-br from-[#8187f7] to-[#381883] rounded-lg flex items-center justify-center group-hover/card:shadow-xl shadow-[#8187f7]/20">
                                <span className="text-4xl">👋</span>
                            </div>
                        </CardItem>

                        <div className="flex justify-between items-center mt-8">
                            <CardItem
                                translateZ={20}
                                as="a"
                                href="https://github.com/FGA0138-MDS-Ajax/2024.2-Virgo"
                                target="__blank"
                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:underline"
                            >
                                Ver no GitHub →
                            </CardItem>
                            <CardItem
                                translateZ={20}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-white dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                                Detalhes
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
                <CardContainer className="inter-var w-full" containerClassName="py-4">
                    <CardBody className="bg-zinc-900/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-[#8187f7]/[0.1] border-white/10 w-full h-auto rounded-xl p-6 border">

                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                        >
                            Title
                        </CardItem>

                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                        >
                            Description
                        </CardItem>

                        <CardItem translateZ="100" className="w-full mt-4">
                            {/* Placeholder Visual do Projeto */}
                            <div className="w-full h-40 bg-gradient-to-br from-[#8187f7] to-[#381883] rounded-lg flex items-center justify-center group-hover/card:shadow-xl shadow-[#8187f7]/20">
                                <span className="text-4xl">👋</span>
                            </div>
                        </CardItem>

                        <div className="flex justify-between items-center mt-8">
                            <CardItem
                                translateZ={20}
                                as="a"
                                href="https://github.com/UnB-IHC/IHC-2025.2-Grupo7"
                                target="__blank"
                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:underline"
                            >
                                Ver no GitHub →
                            </CardItem>
                            <CardItem
                                translateZ={20}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-white dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                                Detalhes
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>

                <CardContainer className="inter-var w-full" containerClassName="py-4">
                    <CardBody className="bg-zinc-900/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-[#8187f7]/[0.1] border-white/10 w-full h-auto rounded-xl p-6 border">

                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                        >
                            Title
                        </CardItem>

                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                        >
                            Description
                        </CardItem>

                        <CardItem translateZ="100" className="w-full mt-4">
                            {/* Placeholder Visual do Projeto */}
                            <div className="w-full h-40 bg-gradient-to-br from-[#8187f7] to-[#381883] rounded-lg flex items-center justify-center group-hover/card:shadow-xl shadow-[#8187f7]/20">
                                <span className="text-4xl">👋</span>
                            </div>
                        </CardItem>

                        <div className="flex justify-between items-center mt-8">
                            <CardItem
                                translateZ={20}
                                as="a"
                                href="https://github.com/joaolobo10/site-doisnovemeia"
                                target="__blank"
                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:underline"
                            >
                                Ver no GitHub →
                            </CardItem>
                            <CardItem
                                translateZ={20}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-white dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                                Detalhes
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>

                <CardContainer className="inter-var w-full" containerClassName="py-4">
                    <CardBody className="bg-zinc-900/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-[#8187f7]/[0.1] border-white/10 w-full h-auto rounded-xl p-6 border">

                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                        >
                            Title
                        </CardItem>

                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                        >
                            Description
                        </CardItem>

                        <CardItem translateZ="100" className="w-full mt-4">
                            {/* Placeholder Visual do Projeto */}
                            <div className="w-full h-40 bg-gradient-to-br from-[#8187f7] to-[#381883] rounded-lg flex items-center justify-center group-hover/card:shadow-xl shadow-[#8187f7]/20">
                                <span className="text-4xl">👋</span>
                            </div>
                        </CardItem>

                        <div className="flex justify-between items-center mt-8">
                            <CardItem
                                translateZ={20}
                                as="a"
                                href="https://github.com/joaolobo10/BootAut"
                                target="__blank"
                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:underline"
                            >
                                Ver no GitHub →
                            </CardItem>
                            <CardItem
                                translateZ={20}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-white dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                                Detalhes
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
            </div>
        </div>
    )
}

export default GridProjects