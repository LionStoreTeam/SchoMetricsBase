"use client"

import { useEffect, useState } from "react"
import { Leaf, BookOpen, TrendingUp, Zap } from "lucide-react"

const SchoMetricsLoader = () => {
    const [progress, setProgress] = useState(0)
    const [loadingText, setLoadingText] = useState("Iniciando SchoMetrics...")
    const [isClient, setIsClient] = useState(false)
    const [particles, setParticles] = useState<
        Array<{ id: number; left: number; top: number; delay: number; duration: number }>
    >([])

    const loadingMessages = [
        "Iniciando SchoMetrics...",
        "Cargando tu perfil ecológico...",
        "Preparando tus métricas...",
        "Sincronizando datos ambientales...",
        "¡Casi listo para aprender!",
    ]

    // Inicializar en el cliente para evitar problemas de hidratación
    useEffect(() => {
        setIsClient(true)

        // Generar partículas solo en el cliente
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 2,
        }))
        setParticles(newParticles)
    }, [])

    useEffect(() => {
        if (!isClient) return

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 300)

        const textInterval = setInterval(() => {
            setLoadingText((prev) => {
                const currentIndex = loadingMessages.indexOf(prev)
                const nextIndex = (currentIndex + 1) % loadingMessages.length
                return loadingMessages[nextIndex]
            })
        }, 1500)

        return () => {
            clearInterval(progressInterval)
            clearInterval(textInterval)
        }
    }, [isClient, loadingMessages])

    // Renderizar un loader simple hasta que el cliente esté listo
    if (!isClient) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-700 mb-2">SchoMetrics</h1>
                    <p className="text-green-600">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center z-50">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 rounded-full animate-pulse"></div>
                <div
                    className="absolute top-3/4 right-1/4 w-48 h-48 bg-emerald-200/20 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-teal-200/20 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                ></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute animate-float"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                        }}
                    >
                        <Leaf className="w-4 h-4 text-green-400/60" />
                    </div>
                ))}
            </div>

            {/* Main loader content */}
            <div className="relative z-10 text-center max-w-md mx-auto px-6">
                {/* Logo/Icon section */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        {/* Rotating outer ring */}
                        <div className="w-24 h-24 border-4 border-green-200 rounded-full animate-spin">
                            <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        </div>

                        {/* Inner content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white rounded-full p-4 shadow-lg">
                                <div className="relative">
                                    <BookOpen className="w-8 h-8 text-green-600 animate-pulse" />
                                    <div className="absolute -top-1 -right-1">
                                        <Leaf className="w-4 h-4 text-emerald-500 animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand name */}
                <div className="mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        SchoMetrics
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Plataforma Educativa</span>
                        <Zap className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>

                {/* Loading progress */}
                <div className="mb-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-inner mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300 ease-out relative"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                <div className="absolute right-0 top-0 w-2 h-3 bg-white/50 animate-ping"></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-green-700 font-medium text-lg mb-1">{loadingText}</p>
                        <p className="text-green-600 text-sm">{Math.round(Math.min(progress, 100))}% completado</p>
                    </div>
                </div>

                {/* Loading dots */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                    ))}
                </div>

                {/* Inspirational message */}
                <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-green-100">
                    <p className="text-green-700 text-sm italic">"Cada pequeña acción cuenta para un futuro más sostenible 🌱"</p>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}

export default SchoMetricsLoader
