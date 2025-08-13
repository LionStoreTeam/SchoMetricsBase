"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Search, Filter, Loader2, ImageOff, CheckCircle, Clock, Film, BadgeInfo, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/legacy/image"
import { motion } from "framer-motion"
import type { Activity as ActivityType } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Recycle, TreePine, Droplets, Lightbulb, Leaf, BookOpen, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "../components/DashboardLayout"
import { StickyBanner } from "@/components/ui/sticky-banner"
import { ZoomableImage } from "../components/ZoomableImage"
import { InteractiveCalendar } from "./components/InteractiveCalendar"

interface ExtendedActivity extends ActivityType {
    status: "PENDING_REVIEW" | "REVIEWED"
}

export const EvidenceThumbnails = ({ evidence }: { evidence: ActivityType["evidence"] }) => {
    const [showAll, setShowAll] = useState(false)
    const validEvidence = Array.isArray(evidence) ? evidence : []
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<"image" | "video" | "gif" | null>(null)
    const visibleEvidence = showAll ? validEvidence : validEvidence.slice(0, 3)

    const handleMediaClick = (url: string, type: "image" | "video" | "gif") => {
        setSelectedMedia(url)
        setMediaType(type)
    }

    const handleCloseModal = () => {
        setSelectedMedia(null)
        setMediaType(null)
    }

    if (validEvidence.length === 0) {
        return <p className="text-xs text-muted-foreground mt-2">Sin evidencia adjunta.</p>
    }

    return (
        <div className="mt-2">
            <h4 className="text-sm font-semibold w-full border-b-2 border-b-green-700 mb-2 text-green-600">Evidencia:</h4>
            <div className="relative flex flex-wrap gap-2 items-center">
                {visibleEvidence.map((ev) => (
                    <motion.div
                        key={ev.id}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-24 h-24 rounded-md overflow-hidden shadow-sm cursor-pointer bg-gray-100"
                        onClick={() => {
                            if (ev.fileType === "image" && ev.publicDisplayUrl) {
                                handleMediaClick(ev.publicDisplayUrl, "image")
                            } else if (ev.fileType === "video" && ev.publicDisplayUrl) {
                                handleMediaClick(ev.publicDisplayUrl, "video")
                            } else if (ev.fileType === "gif" && ev.publicDisplayUrl) {
                                handleMediaClick(ev.publicDisplayUrl, "gif")
                            }
                        }}
                    >
                        {ev.publicDisplayUrl ? (
                            ev.fileType === "image" ? (
                                <Image
                                    src={ev.publicDisplayUrl || "/placeholder.svg"}
                                    alt={ev.fileName || "Evidencia"}
                                    layout="fill"
                                    objectFit="cover"
                                    priority={false}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg"
                                        target.alt = "Error al cargar imagen"
                                    }}
                                />
                            ) : ev.fileType === "video" ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                                    <Film className="h-16 w-16 text-blue-400 opacity-70" />
                                </div>
                            ) : ev.fileType === "gif" ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                                    <Film className="h-16 w-16 text-blue-400 opacity-70" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                                    <Film className="h-16 w-16 text-blue-400 opacity-70" />
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-gray-200 text-gray-500 h-full w-full p-1 text-center">
                                <ImageOff className="h-6 w-6 mb-0.5" />
                                <span className="text-xs">No disponible</span>
                            </div>
                        )}
                    </motion.div>
                ))}
                {validEvidence.length > 3 && !showAll && (
                    <button onClick={() => setShowAll(true)} className="text-xs text-blue-500 hover:underline self-end">
                        Ver más ({validEvidence.length - 3})
                    </button>
                )}
                {validEvidence.length > 3 && showAll && (
                    <button onClick={() => setShowAll(false)} className="text-xs text-blue-500 hover:underline self-end">
                        Ver menos
                    </button>
                )}

                {selectedMedia && mediaType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/80 z-[100] flex items-center justify-center cursor-pointer p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="relative max-w-full max-h-full flex justify-center items-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {mediaType === "image" && <ZoomableImage src={selectedMedia} alt="Evidencia ampliada" />}
                            {mediaType === "video" && (
                                <video
                                    src={selectedMedia}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full object-contain rounded-md"
                                />
                            )}
                            {mediaType === "gif" && (
                                <img
                                    src={selectedMedia || "/placeholder.svg"}
                                    alt="GIF"
                                    className="max-w-full max-h-full object-contain rounded-md"
                                />
                            )}
                        </motion.div>
                        <Button
                            variant="outline"
                            onClick={
                                handleCloseModal
                            }
                            className="absolute top-0 mt-3 bg-teal-400 text-white border-none"
                        >
                            <X className="h-5 w-5 font-bold" />
                            Cerrar
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

const ActivityCard = ({ activity }: { activity: ExtendedActivity }) => (
    <motion.div
        key={activity.id}
        className="rounded-xl bg-white shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
    >
        <div className="p-5">
            <div className="flex flex-col items-center xl:flex-row xl:items-center justify-between gap-2 mb-3">
                <div className="flex flex-col items-center justify-center text-center gap-3 md:flex-row">
                    <div className="rounded-full bg-green-100 p-2.5">{getActivityIcon(activity.type)}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                </div>
                {activity.status === "REVIEWED" && activity.points > 0 && (
                    <div className="p-1 flex justify-center items-center gap-2 text-[#17d627] font-bold border-y-2 border-y-[#53c932]">
                        <Image src="/eco_points_logo.png" alt="eco_points_logo" width={40} height={35} priority />
                        <span>+{activity.points}</span>
                    </div>
                )}
            </div>

            {activity.description && <p className="text-gray-600 text-sm mb-3">{activity.description}</p>}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 mb-3">
                <span>
                    <span className="font-medium text-green-600">Cantidad:</span> {activity.quantity} {activity.unit}
                </span>
                <span>
                    <span className="font-medium text-green-600">Fecha:</span> {formatDate(activity.date)}
                </span>
            </div>

            {activity.evidence && activity.evidence.length > 0 && <EvidenceThumbnails evidence={activity.evidence} />}

            <div className="mt-4 pt-3 border-t border-gray-200">
                {activity.status === "PENDING_REVIEW" ? (
                    <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-500 bg-amber-50 flex items-center gap-1.5 w-max"
                    >
                        <Clock className="h-3.5 w-3.5" />
                        Pendiente por revisar
                    </Badge>
                ) : activity.status === "REVIEWED" ? (
                    <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5 w-max"
                    >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Revisado. Puntos Obtenidos: {activity.points}
                    </Badge>
                ) : (
                    <Badge variant="secondary">Estado desconocido</Badge>
                )}
            </div>
        </div>
    </motion.div>
)

export default function ActivitiesPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [activities, setActivities] = useState<ExtendedActivity[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/activities")

                if (!response.ok) {
                    throw new Error("Error al obtener actividades")
                }

                const data = await response.json()
                setActivities(data.activities || [])
            } catch (error) {
                console.error("Error al cargar actividades:", error)
                setActivities([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const filteredActivities = activities.filter((activity: ExtendedActivity) => {
        const matchesSearch =
            activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesFilter = filter === "all" || activity.type === filter
        return matchesSearch && matchesFilter
    })

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 m-5">
                <StickyBanner className="bg-transparent mt-16 lg:mt-0">
                    <span className="mx-0 max-w-[90%] text-red-800 text-[12px] md:text-[13px] xl:text-[15px] bg-red-50 p-3 rounded-md border border-red-200">
                        <p className="font-bold">Aviso importante:</p>
                        Recuerda que por cuestiones de Seguridad de los Datos y para favorecer una sana competitividad dentro de
                        nuestra plataforma, las Actividades que hayan sido enviadas, no permiten su posterior modificación y/o
                        eliminación por parte del usuario. Antes de realizar un envío, verifica siempre todos los datos en el
                        formulario, cumpliendo con: Información y evidencias 100% reales, mismas que serán verificadas y
                        monitoreadas por los Administradores de la plataforma.
                        <br />
                        En caso de algún inconveniente puedes comunicarte al correo:
                        <span className="font-bold"> ecosoporte@schometricsmx.com</span>
                    </span>
                </StickyBanner>
                <div className="mt-16 lg:mt-0 p-8 flex flex-col gap-3 text-white bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 rounded-xl shadow-2xl">
                    <h1 className="text-4xl text-center font-bold tracking-tight flex flex-col md:flex-row items-center gap-3">
                        <Leaf className="h-10 w-10 animate-bounce" />
                        Mis Actividades
                    </h1>
                    <p className="text-lg opacity-90 text-center md:text-start">Gestiona y visualiza tus actividades ecológicas registradas</p>
                </div>
                <div className="w-auto flex justify-center items-center">
                    <Link href="/actividades/manual-de-actividades-permitidas" title="Revisa el Manual de Actividades Permitidas">
                        <Button
                            variant={"outline"}
                            className="text-rose-50 bg-red-500 font-bold w-auto transition-all ease-linear duration-300 hover:bg-red-600 hover:text-white"
                        >
                            <BadgeInfo className="h-7 w-7" />
                            Ver Manual de Actividades
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar actividades..."
                                className="pl-8 rounded-md border shadow-sm bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full md:w-[180px] rounded-md border shadow-sm bg-white">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-md border shadow-md">
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="RECYCLING">Reciclaje</SelectItem>
                                <SelectItem value="TREE_PLANTING">Plantación</SelectItem>
                                <SelectItem value="WATER_SAVING">Ahorro de agua</SelectItem>
                                <SelectItem value="ENERGY_SAVING">Ahorro de energía</SelectItem>
                                <SelectItem value="COMPOSTING">Compostaje</SelectItem>
                                <SelectItem value="EDUCATION">Educación</SelectItem>
                                <SelectItem value="OTHER">Otros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Link href="/actividades/nueva">
                        <Button className="bg-green-600 hover:bg-green-700 rounded-md shadow-md">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nueva actividad
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="list" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 rounded-md shadow-sm bg-gray-200">
                        <TabsTrigger value="list" className="rounded-md">
                            Lista
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="rounded-md">
                            Calendario
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="list" className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                            </div>
                        ) : filteredActivities.length > 0 ? (
                            <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredActivities.map((activity) => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <h3 className="text-lg font-medium text-gray-700">No se encontraron actividades</h3>
                                <p className="text-muted-foreground mt-1">
                                    Intenta cambiar los filtros o registra una nueva actividad.
                                </p>
                                <Link href="/actividades/nueva" className="mt-4 inline-block">
                                    <Button className="bg-green-600 hover:bg-green-700 rounded-md shadow-md">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Registrar Actividad
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="calendar">
                        <InteractiveCalendar activities={filteredActivities as any} />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}

export const getActivityIcon = (type: string) => {
    switch (type) {
        case "RECYCLING":
            return <Recycle className="h-5 w-5 text-green-600" />
        case "TREE_PLANTING":
            return <TreePine className="h-5 w-5 text-amber-600" />
        case "WATER_SAVING":
            return <Droplets className="h-5 w-5 text-blue-600" />
        case "ENERGY_SAVING":
            return <Lightbulb className="h-5 w-5 text-yellow-500" />
        case "COMPOSTING":
            return <Leaf className="h-5 w-5 text-lime-600" />
        case "EDUCATION":
            return <BookOpen className="h-5 w-5 text-purple-600" />
        default:
            return <HelpCircle className="h-5 w-5 text-gray-500" />
    }
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date)
}
