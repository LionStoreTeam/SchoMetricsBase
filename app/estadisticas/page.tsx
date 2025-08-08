"use client"

import { useState, useEffect } from "react"
import { Leaf, Trees, Recycle, PlusCircle, FileDownIcon, FileBadgeIcon, Award, HeartCrack } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { StatsData, UserProfileData } from "@/types/types"
import Image from "next/legacy/image"
import DashboardLayout from "../components/DashboardLayout"
import { ReportDownloadButton } from "./components/report-download-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import EcoPointsUserCard from "../components/EcoPointsUserCard"
import toast from "react-hot-toast"


export default function StatsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<StatsData | null>(null)
    const [period, setPeriod] = useState("month")
    const [isHovered, setIsHovered] = useState(false)
    const [profile, setProfile] = useState<UserProfileData | null>(null); // Initialize as null



    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true)

                // Obtener estadísticas
                const response = await fetch(`/api/stats?period=${period}`)
                if (!response.ok) {
                    throw new Error("Error al obtener estadísticas")
                }
                const data = await response.json()

                // Obtener datos del usuario (incluye nivel)
                const userResponse = await fetch("/api/auth/session")
                if (!userResponse.ok) {
                    throw new Error("Error al obtener datos del usuario")
                }
                const userData = await userResponse.json()
                setStats(data)
            } catch (error) {
                console.error("Error al cargar estadísticas:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [period])


    const fetchProfileData = async () => {
        // setIsLoading(true) will be handled by the main isLoading state
        try {
            const response = await fetch("/api/profile");
            if (!response.ok) throw new Error("Error al obtener perfil");
            const data: UserProfileData = await response.json();
            setProfile(data);

        } catch (error) {
            console.error("Error al cargar perfil:", error);
            toast.error("Error, No se pudieron cargar las Insignias");
        }
        // setIsLoading(false) will be handled by the main isLoading state
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([fetchProfileData()]);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    // Función para obtener el nombre del tipo de actividad
    const getActivityTypeName = (type: string) => {
        switch (type) {
            case "RECYCLING":
                return "Reciclaje"
            case "TREE_PLANTING":
                return "Plantación"
            case "WATER_SAVING":
                return "Ahorro de agua"
            case "ENERGY_SAVING":
                return "Ahorro de energía"
            case "COMPOSTING":
                return "Compostaje"
            case "EDUCATION":
                return "Educación"
            default:
                return "Otro"
        }
    }

    // Función para obtener el color según el tipo de actividad
    const getActivityColor = (type: string) => {
        switch (type) {
            case "RECYCLING":
                return "bg-blue-500"
            case "TREE_PLANTING":
                return "bg-green-500"
            case "WATER_SAVING":
                return "bg-cyan-500"
            case "ENERGY_SAVING":
                return "bg-yellow-500"
            case "COMPOSTING":
                return "bg-amber-500"
            case "EDUCATION":
                return "bg-purple-500"
            default:
                return "bg-gray-500"
        }
    }

    // Función para formatear la fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-MX", {
            day: "numeric",
            month: "short",
        }).format(date)
    }

    // Calcular el total de actividades
    const totalActivities = stats?.activityCount || 0

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 m-5">
                <div className="mt-16 lg:mt-0 p-5 flex flex-col gap-2 text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl">
                    <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
                    <p className="">Visualiza el impacto de tus actividades ecológicas</p>
                </div>
                <div className="flex justify-end">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="week">Última semana</SelectItem>
                            <SelectItem value="month">Último mes</SelectItem>
                            <SelectItem value="year">Último año</SelectItem>
                            <SelectItem value="all">Todo el tiempo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                ) : stats ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            <EcoPointsUserCard />
                            <Card className="border-4 border-transparent rounded-xl transition-all ease-linear duration-300 hover:border-teal-500 hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-semibold text-green-500">
                                        Actividades
                                    </CardTitle>
                                    <Leaf className={`w-7 h-7 text-green-500 transition-all duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                        }`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-bold text-2xl">{totalActivities}</div>
                                    <p className="text-sm text-muted-foreground">
                                        En{" "}
                                        {period === "week"
                                            ? "la última semana"
                                            : period === "month"
                                                ? "el último mes"
                                                : period === "year"
                                                    ? "el último año"
                                                    : "todo el tiempo"}
                                    </p>

                                </CardContent>
                                <div className="w-full flex justify-center items-center mb-4">
                                    <Link href="/actividades/nueva">
                                        <Button className="bg-green-600 hover:bg-green-700 rounded-md shadow-md" title="Nueva actividad">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Nueva actividad
                                        </Button>
                                    </Link>
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-semibold text-cyan-500">Material Reciclado</CardTitle>
                                    <Recycle className={`w-7 h-7 text-cyan-500 transition-all duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                        }`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.impactMetrics.recycledMaterials.toFixed(1)} kg</div>
                                    <p className="text-sm text-muted-foreground">
                                        Equivalente a {Math.round(stats.impactMetrics.recycledMaterials * 0.5)} kg de CO₂ evitados
                                    </p>
                                </CardContent>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-semibold text-lime-500">Árboles Plantados</CardTitle>
                                    <Trees className={`w-7 h-7 text-lime-500 transition-all duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                        }`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.impactMetrics.treesPlanted}</div>
                                    <p className="text-sm text-muted-foreground">
                                        Capturarán aprox. {stats.impactMetrics.treesPlanted * 25} kg de CO₂ al año
                                    </p>
                                </CardContent>
                            </Card>
                            {/*  */}
                            <div className="w-full p-5 flex flex-col justify-center items-center text-center bg-white rounded-md border-2 border-teal-200 border-dashed transition-all ease-linear duration-300 hover:scale-105">
                                <h2 className="text-xl pb-2 font-semibold text-teal-600">
                                    ¡ Descarga tu
                                    <b className="mx-2 text-teal-700 border-b-2 border-teal-700">
                                        Reporte de Trayectoria
                                    </b>
                                    de SchoMetrics aquí !
                                </h2>
                                <div className="my-8">
                                    <FileBadgeIcon className="w-16 h-16 text-teal-500" />
                                </div>
                                <p className="pb-5 text-sm text-slate-400 font-semibold">
                                    El Reporte de Trayectoria es un archivo en formato PDF que contine tu Información Registra, las Actividades enviadas, Impacto Ambiental Acumulado, Recompensas Canjeadas y las Insignias Obtenidas, además de incluir un mecanismo de seguridad que válida tu información en la plataforma.
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className={`bg-teal-500 hover:bg-teal-600 rounded-md shadow-md transition-all duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                            }`}
                                            title="Descargar Reporte"
                                        >
                                            <FileDownIcon className="h-8 w-8" />
                                            Descargar Reporte
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl font-bold text-teal-900">Información Importante</AlertDialogTitle>
                                            <AlertDialogDescription className="text-red-950 tracking-wide">
                                                Se prohíbe la alteración, ya sea parcial o total, del presente documento descargado, así como de la información contenida en él, con la intención de obtener beneficios adicionales. Ante cualquier incumplimiento, se aplicarán las medidas disciplinarias estipuladas en el Reglamento Escolar de la Institución Educativa correspondiente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                            <ReportDownloadButton />
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            {/*  */}
                            <Card className="px-2 flex flex-col border-4 border-transparent rounded-xl transition-all ease-linear duration-300 hover:border-teal-500 hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xl font-semibold text-amber-400">
                                        Insignias
                                    </CardTitle>
                                    <Award className={`w-7 h-7 text-amber-400 transition-all duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                        }`} />
                                </CardHeader>
                                <span className="font-bold text-2xl px-6">{profile?.profile?.badges.length}</span>
                                <p className="mb-3 text-muted-foreground text-sm px-6">
                                    Obtenidas en total
                                </p>
                                {profile?.profile?.badges && profile.profile.badges.length > 0 ? (
                                    <div className="h-[330px] px-6 flex flex-col gap-2 overflow-auto">
                                        {profile.profile.badges.map((badge) => (
                                            <Badge
                                                key={badge.id}
                                                variant="outline"
                                                className="mt-5 flex flex-col items-center gap-1 px-2 py-1 border-none transition-all ease-linear duration-300 hover:scale-105"
                                            >
                                                {/* Asumiendo que badge.imageUrl es una URL completa y pública */}
                                                <Image src={badge.imageUrl || ""} alt={badge.name} width={64} height={64} className={`${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                                    }`} />
                                                <span className="font-bold text-xl text-gray-500">
                                                    {badge.name}
                                                </span>
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[330px] px-6 flex flex-col justify-center items-center text-center gap-2 overflow-auto text-gray-500">
                                        <p>
                                            ¡ Aún no has obtenido insignias !
                                        </p>
                                        <HeartCrack className={`w-20 h-20 my-8 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"
                                            }`} />
                                        <p>
                                            Envía nuevas Actividades para obtener increíbles Insignias.
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>
                        <Tabs defaultValue="activities" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-200">
                                <TabsTrigger value="activities">Actividades</TabsTrigger>
                                <TabsTrigger value="timeline">Línea de tiempo</TabsTrigger>
                                {/* <TabsTrigger value="impact">Impacto ambiental</TabsTrigger> */}
                            </TabsList>

                            <TabsContent value="activities">
                                <Card className="border-4 border-gray-50 rounded-xl transition-all ease-linear hover:border-teal-500">
                                    <CardHeader>
                                        <CardTitle>Distribución de actividades</CardTitle>
                                        <CardDescription>Desglose de tus actividades ecológicas por tipo</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {stats.activityStats.length > 0 ? (
                                            <div className="space-y-4">
                                                {stats.activityStats.map((stat) => (
                                                    <div key={stat.type} className="space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={getActivityColor(stat.type)}>{stat._count.id}</Badge>
                                                                <span>{getActivityTypeName(stat.type)}</span>
                                                            </div>
                                                            <span className="text-sm font-medium">{stat._sum.points} pts</span>
                                                        </div>
                                                        <Progress value={(stat._count.id / totalActivities) * 100} className="h-2 bg-teal-100" />
                                                        <div className="text-xs text-muted-foreground">
                                                            {stat.type === "RECYCLING" && `${stat._sum.quantity.toFixed(1)} kg de material reciclado`}
                                                            {stat.type === "TREE_PLANTING" && `${stat._sum.quantity} árboles plantados`}
                                                            {stat.type === "WATER_SAVING" &&
                                                                `${stat._sum.quantity.toFixed(1)} litros de agua ahorrados`}
                                                            {stat.type === "ENERGY_SAVING" &&
                                                                `${stat._sum.quantity.toFixed(1)} kWh de energía ahorrados`}
                                                            {stat.type === "COMPOSTING" &&
                                                                `${stat._sum.quantity.toFixed(1)} kg de material compostado`}
                                                            {stat.type === "EDUCATION" &&
                                                                `${stat._sum.quantity.toFixed(1)} horas de educación ambiental`}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-muted-foreground">Aún no has registrado actividades</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="timeline">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Evolución de puntos</CardTitle>
                                        <CardDescription>Progreso de tus puntos a lo largo del tiempo</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {stats.timeSeries.length > 0 ? (
                                            <>
                                                <div className="h-[300px] w-full">
                                                    <div className="flex h-full items-end gap-2">
                                                        {stats.timeSeries.map((data, index) => {
                                                            // Encontrar el valor máximo para escalar el gráfico
                                                            const maxPoints = Math.max(...stats.timeSeries.map((d) => d.points))
                                                            const heightPercentage = maxPoints > 0 ? (data.points / maxPoints) * 100 : 0

                                                            return (
                                                                <div key={index} className="relative flex h-full w-full flex-col justify-end">
                                                                    <div
                                                                        className="bg-teal-700 w-full rounded-md"
                                                                        style={{ height: `${heightPercentage}%` }}
                                                                    ></div>
                                                                    <span className="mt-1 text-xs text-muted-foreground text-center">
                                                                        {formatDate(data.date)}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                                                    <div>Actividades: {stats.timeSeries.reduce((sum, data) => sum + data.count, 0)}</div>
                                                    <div>Puntos totales: {stats.timeSeries.reduce((sum, data) => sum + data.points, 0)}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-muted-foreground">
                                                    No hay suficientes datos para mostrar la línea de tiempo
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <Card className="mt-10 border-4 border-gray-50 rounded-xl transition-all ease-linear hover:border-teal-500">
                                <CardHeader>
                                    <CardTitle>Impacto ambiental</CardTitle>
                                    <CardDescription>Medición del impacto positivo de tus actividades</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">Material reciclado</h3>
                                                    <span className="font-bold">{stats.impactMetrics.recycledMaterials.toFixed(1)} kg</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Equivalente a:</p>
                                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                                        <li>{Math.round(stats.impactMetrics.recycledMaterials * 0.5)} kg de CO₂ evitados</li>
                                                        <li>
                                                            {Math.round(stats.impactMetrics.recycledMaterials * 0.2)} litros de petróleo ahorrados
                                                        </li>
                                                        <li>{Math.round(stats.impactMetrics.recycledMaterials * 2)} kWh de energía ahorrados</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">Árboles plantados</h3>
                                                    <span className="font-bold">{stats.impactMetrics.treesPlanted}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Beneficios:</p>
                                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                                        <li>Capturarán aprox. {stats.impactMetrics.treesPlanted * 25} kg de CO₂ al año</li>
                                                        <li>Producirán oxígeno para {stats.impactMetrics.treesPlanted * 2} personas</li>
                                                        <li>Ayudarán a prevenir la erosión del suelo</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">Agua ahorrada</h3>
                                                    <span className="font-bold">{stats.impactMetrics.waterSaved.toFixed(1)} litros</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Equivalente a:</p>
                                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                                        <li>{Math.round(stats.impactMetrics.waterSaved / 150)} duchas completas</li>
                                                        <li>{Math.round(stats.impactMetrics.waterSaved / 10)} cargas de lavadora</li>
                                                        <li>
                                                            Agua potable para {Math.round(stats.impactMetrics.waterSaved / 2)} personas por un día
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-medium">Energía ahorrada</h3>
                                                    <span className="font-bold">{stats.impactMetrics.energySaved.toFixed(1)} kWh</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>Equivalente a:</p>
                                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                                        <li>{Math.round(stats.impactMetrics.energySaved * 0.5)} kg de CO₂ evitados</li>
                                                        <li>
                                                            {Math.round(stats.impactMetrics.energySaved / 5)} días de consumo de un hogar promedio
                                                        </li>
                                                        <li>
                                                            {Math.round(stats.impactMetrics.energySaved * 0.1)} litros de combustible ahorrados
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </Tabs>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-medium">No se pudieron cargar las estadísticas</h3>
                        <p className="text-muted-foreground mt-1">Intenta recargar la página</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
