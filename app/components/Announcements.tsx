"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Megaphone,
    Calendar,
    User,
    School,
    Leaf,
    InfoIcon,
    LucideRotate3D,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useUserSession from "@/hooks/useUserSession"
import type { Announcement, User as PrismaUser } from "@prisma/client"

// Tipo extendido para el aviso
type AnnouncementWithUser = Announcement & {
    user: Pick<PrismaUser, "name">
}

// Mapeo de tipos de usuario
const USER_TYPE_MAP: { [key: string]: string } = {
    AVISO_SCHOMETRICS: "AVISO SCHOMETRICS",
    AVISO_ESCOLAR: "AVISO ESCOLAR",
    AVISO_AMBIENTAL: "AVISO AMBIENTAL",
    AVISO_GENERAL: "AVISO GENERAL",
    AVISO_ACTUALIZACION: "AVISO ACTUALIZACION",
}

// Función para formatear fecha
function formatDate(dateString: Date) {
    return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

const SchometricsAnnoucementsCarousel = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementWithUser[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const { session, isLoadingSession } = useUserSession()

    // Referencias para evitar stale closures
    const currentIndexRef = useRef(0)
    const isPlayingRef = useRef(true)
    const announcementsRef = useRef<AnnouncementWithUser[]>([])

    // Configuración del carousel
    const SLIDE_DURATION = 6000 // 6 segundos por slide
    const PROGRESS_INTERVAL = 50 // Actualizar progreso cada 50ms

    // Actualizar refs cuando cambien los estados
    useEffect(() => {
        currentIndexRef.current = currentIndex
    }, [currentIndex])

    useEffect(() => {
        isPlayingRef.current = isPlaying
    }, [isPlaying])

    useEffect(() => {
        announcementsRef.current = announcements
    }, [announcements])

    // Fetch de avisos
    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const response = await fetch("/api/announcements")
                if (!response.ok) {
                    throw new Error("Error al obtener los avisos")
                }
                const data = await response.json()
                setAnnouncements(data)
            } catch (error) {
                console.error("Error fetching announcements:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (!isLoadingSession) {
            fetchAnnouncements()
        }
    }, [isLoadingSession])

    // Función para ir al siguiente slide (sin useCallback para evitar dependencias)
    const nextSlide = () => {
        const totalSlides = announcementsRef.current.length
        if (totalSlides > 0) {
            const nextIndex = (currentIndexRef.current + 1) % totalSlides
            setCurrentIndex(nextIndex)
            setProgress(0)
        }
    }

    // Función para ir al slide anterior
    const prevSlide = useCallback(() => {
        if (announcements.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length)
            setProgress(0)
        }
    }, [announcements.length])

    // Función para ir a un slide específico
    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        setProgress(0)
    }

    // Auto-play mejorado con refs para evitar stale closures
    useEffect(() => {
        if (announcements.length === 0) return

        const progressTimer = setInterval(() => {
            // Verificar si debe continuar el auto-play
            if (!isPlayingRef.current || announcementsRef.current.length === 0) {
                return
            }

            setProgress((prevProgress) => {
                const increment = (PROGRESS_INTERVAL / SLIDE_DURATION) * 100
                const newProgress = prevProgress + increment

                // Si el progreso llega al 100%, avanzar al siguiente slide
                if (newProgress >= 100) {
                    // Usar setTimeout para evitar conflictos de estado
                    setTimeout(() => {
                        nextSlide()
                    }, 0)
                    return 0
                }

                return newProgress
            })
        }, PROGRESS_INTERVAL)

        return () => clearInterval(progressTimer)
    }, [announcements.length]) // Solo depende de la longitud del array

    // Resetear progreso cuando se cambie manualmente de slide
    useEffect(() => {
        setProgress(0)
    }, [currentIndex])

    // Obtener configuración de colores basada en el topic
    const getTopicConfig = (topic: string) => {
        switch (topic) {
            case "AVISO_SCHOMETRICS":
                return {
                    textClass: "text-teal-600",
                    badgeClass: "bg-teal-500 text-teal-50 border-teal-400",
                    gradientClass: "from-teal-500 to-emerald-500",
                    icon: Megaphone,
                }
            case "AVISO_ESCOLAR":
                return {
                    textClass: "text-amber-500",
                    badgeClass: "bg-amber-500 text-amber-50 border-amber-600",
                    gradientClass: "from-amber-500 to-orange-500",
                    icon: School,
                }
            case "AVISO_AMBIENTAL":
                return {
                    textClass: "text-green-600",
                    badgeClass: "bg-[#53c932] text-green-50 border-green-400",
                    gradientClass: "from-green-500 to-green-600",
                    icon: Leaf,
                }
            case "AVISO_GENERAL":
                return {
                    textClass: "text-purple-700",
                    badgeClass: "bg-purple-500 text-purple-50 border-purple-600",
                    gradientClass: "from-purple-500 to-purple-500",
                    icon: InfoIcon,
                }
            case "AVISO_ACTUALIZACION":
                return {
                    textClass: "text-rose-700",
                    badgeClass: "bg-rose-500 text-rose-50 border-rose-600",
                    gradientClass: "from-rose-500 to-rose-500",
                    icon: LucideRotate3D,
                }
            default:
                return {
                    textClass: "text-gray-700",
                    badgeClass: "bg-gray-500 text-gray-50 border-gray-600",
                    gradientClass: "from-gray-500 to-slate-500",
                    icon: Megaphone,
                }
        }
    }

    // Estado de carga
    if (isLoading || isLoadingSession) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            Avisos Generales de SchoMetrics
                        </h2>
                    </div>
                    <p className="text-gray-600">Mantente informado sobre las últimas actualizaciones y noticias importantes</p>
                </div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 h-80">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando avisos...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Si no hay avisos
    if (announcements.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                            Avisos Generales de SchoMetrics
                        </h2>
                    </div>
                    <p className="text-gray-400">Mantente informado sobre las últimas actualizaciones y noticias importantes</p>
                </div>
                <div className="relative bg-white rounded-md shadow-2xl overflow-hidden border border-gray-100 h-80">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center border-2 border-blue-200 border-dashed rounded-lg p-8">
                            <Megaphone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <p className="text-blue-600 text-lg">No hay avisos para mostrar en este momento.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full p-6">
            {/* Header del Carousel */}
            <div className="text-center mb-8">
                <div className="flex flex-col items-center justify-center gap-3 mb-4 md:flex-row">
                    <div className="p-3 bg-blue-500 rounded-full">
                        <Megaphone className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        Avisos Generales de SchoMetrics
                    </h2>
                </div>
                <p className="text-lg text-slate-400">
                    Hecha un vistazo a los avisos de SchoMetrics para estar al día sobre cualquier novedad.
                </p>
            </div>

            {/* Carousel Container */}
            <div
                className="relative w-full bg-white rounded-t-md overflow-hidden p-2 h-[610px] sm:h-[500px]"
                onMouseEnter={() => setIsPlaying(false)}
                onMouseLeave={() => setIsPlaying(true)}
            >
                {/* Barra de progreso */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Contenido del Slide */}
                <div className="relative h-[610px] sm:h-[500px] w-full">
                    {announcements.map((announcement, index) => {
                        const slideConfig = getTopicConfig(announcement.topic)
                        const SlideIcon = slideConfig.icon
                        return (
                            <div
                                key={announcement.id}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === currentIndex
                                    ? "translate-x-0 opacity-100 overflow-auto"
                                    : index < currentIndex
                                        ? "-translate-x-full opacity-0"
                                        : "translate-x-full opacity-0"
                                    }`}
                            >
                                <div className="flex">
                                    {/* Lado izquierdo - Contenido */}
                                    <div className="flex-1 p-8 flex flex-col justify-center">
                                        {/* Badge del tipo */}
                                        <div className="flex flex-col items-center justify-center gap-3 mb-6 md:flex-row md:justify-start">
                                            <div className={`p-2 rounded-full bg-gradient-to-r ${slideConfig.gradientClass}`}>
                                                <SlideIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <Badge variant="outline" className={`${slideConfig.badgeClass} font-semibold`}>
                                                {USER_TYPE_MAP[announcement.topic] || announcement.topic}
                                            </Badge>
                                        </div>

                                        {/* Título */}
                                        <h3
                                            className={`text-2xl font-bold text-center md:text-start ${slideConfig.textClass} mb-4 leading-tight`}
                                        >
                                            {announcement.title}
                                        </h3>

                                        {/* Descripción */}
                                        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border flex h-[200px] overflow-auto">
                                            <span className="text-gray-600 text-lg text-wrap">{announcement.content}</span>
                                        </div>

                                        {/* Información del autor y fecha */}
                                        <div className="space-y-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>
                                                    Publicado por:{" "}
                                                    <strong className="text-sky-900 uppercase">
                                                        {announcement.user?.name || "Admin"} (Administrador)
                                                    </strong>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Creado: {formatDate(announcement.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Controles de navegación */}
                    {announcements.length > 1 && (
                        <>
                            {/* Control de play/pause */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="absolute top-4 right-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                            >
                                {isPlaying ? (
                                    <div className="w-4 h-4 flex gap-1">
                                        <div className="w-1.5 h-4 bg-current rounded-full" />
                                        <div className="w-1.5 h-4 bg-current rounded-full" />
                                    </div>
                                ) : (
                                    <div className="w-4 h-4 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <>
                {/* Controles de navegación */}
                {announcements.length > 1 && (
                    <div className="bg-white rounded-b-md flex flex-col justify-center items-center">
                        {/* Indicadores de puntos */}
                        {
                            announcements.length > 7
                                ?
                                (
                                    <div className="grid grid-cols-7 gap-2">
                                        {announcements.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                    ? "bg-blue-500 scale-125 shadow-lg"
                                                    : "bg-slate-200 hover:bg-slate-300 hover:scale-110"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex gap-3 p-2">
                                        {announcements.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                    ? "bg-blue-500 scale-125 shadow-lg"
                                                    : "bg-slate-200 hover:bg-slate-300 hover:scale-110"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )
                        }

                        <div className="mb-5 p-4 w-full flex justify-between items-center">
                            <button
                                onClick={prevSlide}
                                className="ml-2 md:ml-4 transform-translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="mr-2 md:mr-4 transform-translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </>

            {/* Información adicional */}
            <div className="mt-6 flex flex-col items-center justify-between text-sm text-gray-500 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4" />
                    <span>
                        Aviso {currentIndex + 1} de {announcements.length}
                    </span>
                </div>
                <div className="flex flex-col items-center gap-2 mt-2 md:flex-row md:items-center md:gap-4">
                    {announcements.length > 1 && <span>Auto-reproducción: {isPlaying ? "Activada" : "Pausada"}</span>}
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>En vivo</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SchometricsAnnoucementsCarousel
