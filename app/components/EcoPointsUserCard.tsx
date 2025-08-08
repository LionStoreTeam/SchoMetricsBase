"use client"

import { useEffect, useState } from "react"
import type { UserStats } from "@/types/types"
import Image from "next/legacy/image"
import { Crown, Star } from "lucide-react"
import { luckiestGuy } from "@/fonts/fonts"

// Función para calcular el próximo objetivo basado en los puntos actuales
export const calculateNextGoal = (points: number): number => {
    if (points < 500) return 500
    return Math.ceil(points / 500) * 500
}

// Función para calcular el objetivo anterior
export const calculatePreviousGoal = (points: number): number => {
    if (points < 500) return 0
    return Math.floor(points / 500) * 500
}

// Función para calcular el porcentaje de progreso
export const calculateProgress = (points: number): number => {
    const nextGoal = calculateNextGoal(points)
    const previousGoal = calculatePreviousGoal(points)

    if (nextGoal === previousGoal) return 100

    const progress = ((points - previousGoal) / (nextGoal - previousGoal)) * 100
    return Math.min(Math.max(progress, 0), 100) // Asegurar que esté entre 0 y 100
}

const EcoPointsUserCard = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [stats, setStats] = useState<UserStats>({
        totalPoints: 0,
        activityCount: 0,
        recentActivities: [],
    })

    // Calcular valores dinámicos basados en los puntos
    const nextGoal = calculateNextGoal(stats.totalPoints)
    const progress = calculateProgress(stats.totalPoints)

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                setIsLoading(true)
                // Obtener estadísticas del usuario
                const statsResponse = await fetch("/api/stats")
                if (!statsResponse.ok) {
                    throw new Error("Error al obtener estadísticas")
                }
                const statsData = await statsResponse.json()

                // Obtener actividades recientes
                const activitiesResponse = await fetch("/api/activities?limit=3")
                if (!activitiesResponse.ok) {
                    throw new Error("Error al obtener actividades")
                }
                const activitiesData = await activitiesResponse.json()

                // Obtener datos del usuario
                const userResponse = await fetch("/api/auth/session")
                if (!userResponse.ok) {
                    throw new Error("Error al obtener datos del usuario")
                }
                const userData = await userResponse.json()

                setStats({
                    totalPoints: statsData.totalPoints || 0,
                    activityCount: statsData.activityCount || 0,
                    recentActivities: activitiesData.activities || [],
                })
            } catch (error) {
                console.error("Error al cargar datos del dashboard:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserStats()
    }, [])

    if (isLoading) {
        return (
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl p-0.5">
                <div className="relative bg-white rounded-3xl p-6 m-0.5">
                    <div className="text-center animate-pulse">
                        <div className="w-[90px] h-[90px] bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-12 bg-gray-200 rounded mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="w-full relative overflow-hidden bg-white p-0.5 transition-all duration-500 hover:shadow-3xl hover:scale-95 md:hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Inner card */}
            <div className="relative bg-white p-6 m-0.5 h-full flex flex-col justify-center w-full">
                {/* Premium badge */}
                <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-full p-2">
                        <Crown className={`w-5 h-5 text-white`} />
                    </div>
                </div>

                {/* Floating stars */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Star
                        className={`absolute w-7 h-7 text-yellow-400 transition-all duration-1000 ${isHovered ? "animate-spin" : "animate-bounce"
                            }`}
                        style={{ top: "15%", left: "15%" }}
                    />
                </div>
                <div className="text-center">
                    <div className="mb-4 p-2 w-full flex justify-center items-center">
                        <div className="p-3 bg-transparent w-max flex justify-center items-center" >
                            <Image
                                src="/eco_points_logo.png"
                                alt="EcoPoints Badge"
                                width={110}
                                height={90}
                                className={`mx-auto transition-transform duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"}`}
                                title="EcoPoints Badge"
                            />
                        </div>
                    </div>

                    <h3 className="text-4xl font-extrabold text-[#17d627] mb-2 uppercase tracking-wider">
                        <p className={`${luckiestGuy.className}`}>
                            EcoPoints:
                        </p>
                    </h3>
                    <p className={`${luckiestGuy.className} text-5xl font-bold text-[#17d627] tracking-wider mb-2`} title="EcoPoints Actuales">
                        {stats.totalPoints.toLocaleString()}
                    </p>

                    {/* Próximo Objetivo - Funcionalidad implementada */}
                    <div className="space-y-2">
                        <div className="flex flex-col justify-center items-center text-sm md:flex-row md:justify-between" title={`Próximo Objetivo  Llegar a ${nextGoal.toLocaleString()} EcoPoints`}>
                            <span className="text-sky-500 font-semibold">Próximo Objetivo</span>
                            <span className="font-bold text-[#17d627] tracking-wide uppercase">
                                <p className={`${luckiestGuy.className}`} title="Próximo Objetivo Llegar a 500 EcoPoints">
                                    {nextGoal.toLocaleString()} EcoPoints
                                </p>
                            </span>
                        </div>

                        {/* Barra de progreso dinámica */}
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-sky-400 via-blue-500 to-teal-500 h-3 rounded-full relative transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                                title="Barra de Progreso Dinámica Para llegar al Próximo Objetivo"
                            >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"
                                    title="Barra de Progreso Dinámica Para llegar al Próximo Objetivo"
                                ></div>
                            </div>
                        </div>

                        {/* Indicador de progreso en texto */}
                        <div className={`${luckiestGuy.className} flex justify-between items-center text-xs text-[#17d627] mt-1 tracking-wider`}>
                            <span
                                title={`Objetivo Actual de ${calculatePreviousGoal(stats.totalPoints).toLocaleString()} a ${nextGoal.toLocaleString()} EcoPoints`}
                            >{calculatePreviousGoal(stats.totalPoints).toLocaleString()} Epts</span>
                            <span className="text-2xl font-bold text-sky-400 tracking-wider" title="Porcentaje de Progreso de EcoPoints con respecto al Próximo Objetivo">{progress.toFixed(1)}%</span>
                            <span
                                title={`Próximo Objetivo  Llegar a ${nextGoal.toLocaleString()} EcoPoints`}
                            >{nextGoal.toLocaleString()} Epts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EcoPointsUserCard
