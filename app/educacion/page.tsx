"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText, Eye, GraduationCap } from 'lucide-react'
import Image from "next/legacy/image";
import Link from 'next/link';
import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout';

interface EducationSectionContentType {
    imageCard: string;
    badgeContent: string;
    title: string;
    description: string;
    url: string
}


export const EducationSectionsContente: EducationSectionContentType[] = [
    {
        imageCard: "/education/robot.svg",
        badgeContent: "SchoMetrics Education",
        title: 'Artículos y guías',
        description: "Explora distintos artículos y guias sobre, sostenibilidad, medio ambiente, entre otros temas.",
        url: "/educacion/articulos/"
    },
    {
        imageCard: "/education/cactus.svg",
        badgeContent: "SchoMetrics Education",
        title: 'Material Visual',
        description: "Explora distintos elementos visuales como infografías, diagramas, entre otros",
        url: "/educacion/visual/"
    },
    {
        imageCard: "/education/recording.svg",
        badgeContent: "SchoMetrics Education",
        title: 'Videos Cortos',
        description: "Explora distintos videos educativos sobre medio ambiente, sostenibilidad, recomendaciones y mucho más.",
        url: "/educacion/videos/"
    },
    {
        imageCard: "/education/monitor.svg",
        badgeContent: "SchoMetrics Education",
        title: 'Directorio Ambiental',
        description: "Enlaces a organizaciones gubernamentales relevantes (SEMARNAT, PROFEPA, secretarías de medio ambiente estatales), ONGs, Documentales, libros, sitios web recomendados y mucho más.",
        url: "/educacion/directorio-ambiental/"
    }
]


export default function EducationPage() {
    const [contentEducation, setContentEducation] = useState<EducationSectionContentType[]>([])

    React.useEffect(() => {
        setContentEducation(EducationSectionsContente)
    }, [])



    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 m-5 sm:m-10">
                <div className="mt-16 lg:mt-5 p-8 flex flex-col gap-2 text-white bg-gradient-to-r from-blue-900 to-gray-800 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8" />
                        <h1 className="text-3xl font-bold tracking-tight">Educación Ambiental</h1>
                    </div>
                    <p className="text-blue-100">
                        Aquí encontrarás Artículos, Guías, Material Visual y mucho más para dasarrollarte como una persona ambientalmente sostenible.
                    </p>
                </div>
                <div className="flex flex-col gap-8 m-5 sm:m-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {contentEducation.map((item, index) => (
                            <Card key={index} title={item.title} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all ease-linear duration-300 hover:scale-105 ">
                                <CardHeader className="p-0" title={item.title}>
                                    <div className="relative w-full h-48 bg-slate-50">
                                        {item.imageCard ? (
                                            <Image src={item.imageCard} alt="Card Image" layout="fill" objectFit="contain" priority />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-teal-100">
                                                <BookText className="h-16 w-16 text-green-400 opacity-70" />
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 flex-grow flex flex-col" title={item.title}>
                                    <Badge className="mb-2 text-xs self-start">
                                        <p>{item.badgeContent}</p>
                                    </Badge>
                                    <CardTitle className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                                        <h2>{item.title}</h2>
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-500 line-clamp-3 mb-2 flex-grow">
                                        <span>{item.description}</span>
                                    </CardDescription>

                                </CardContent>
                                <CardFooter className="p-3 border-t bg-gray-50 flex items-center justify-center md:justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link href={item.url}>
                                            <Button className="h-auto px-3 py-2 text-xs bg-blue-900 text-white transition-all ease-linear duration-300 hover:bg-blue-900">
                                                <Eye className="h-3.5 w-3.5 mr-1" /> Ver Contenido
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
