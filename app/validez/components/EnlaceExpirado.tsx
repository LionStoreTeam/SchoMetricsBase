"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Leaf, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react"
import Link from 'next/link';
import Image from "next/image"

export default function EnlaceExpirado() {
    const [isVisible, setIsVisible] = useState(false)
    const [isResending, setIsResending] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])


    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 animate-leaf-sway opacity-20">
                    <Leaf className="w-16 h-16 text-primary" />
                </div>
                <div className="absolute top-40 right-20 animate-float opacity-15" style={{ animationDelay: "1s" }}>
                    <Leaf className="w-12 h-12 text-accent" />
                </div>
                <div className="absolute bottom-32 left-1/4 animate-leaf-sway opacity-10" style={{ animationDelay: "2s" }}>
                    <Leaf className="w-20 h-20 text-primary" />
                </div>
                <div className="absolute bottom-20 right-1/3 animate-float opacity-20" style={{ animationDelay: "0.5s" }}>
                    <Leaf className="w-14 h-14 text-accent" />
                </div>
            </div>

            <div
                className={`w-full max-w-md transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                {/* Notification Banner */}
                <div className="mb-6 animate-pulse-glow">
                    <Card className="border-2 border-destructive/20 bg-destructive/5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="w-6 h-6 text-destructive animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-destructive text-sm">¡Enlace Expirado!</h3>
                                    <p className="text-xs text-destructive/80 mt-1">Tu enlace de verificación ya no es válido</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Card */}
                <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-float">
                                    <Clock className="w-10 h-10 text-primary animate-spin" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center animate-ping">
                                    <span className="text-destructive-foreground text-xs font-bold">!</span>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-foreground mb-3 font-sans">Enlace de Validación Expirado</h1>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Tu enlace de verificación ha caducado por motivos de seguridad. No te preocupes, puedes solicitar uno nuevo
                            fácilmente descargando el <span className="text-teal-500 font-bold">Reporte de Trayectoria</span>.
                        </p>

                        {/* Sustainability Message */}
                        <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-primary animate-leaf-sway" />
                                <span className="text-sm font-medium text-primary">Compromiso y Seguridad</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Validamos enlaces por tiempo limitado para mantener la seguridad en la visibilidad de tus datos.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 flex flex-col">
                            <Link href="https://schometrics.website/estadisticas">
                                <Button
                                    disabled={isResending}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 transition-all duration-200 hover:scale-105"
                                >
                                    {isResending ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Enviando nuevo enlace...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Solicitar Nuevo Enlace
                                        </>
                                    )}
                                </Button>
                            </Link>

                            <Link href="https://schometrics.website/">
                                <Button
                                    variant="outline"
                                    className="w-full border-border hover:bg-muted transition-all duration-200 text-teal-500 font-bold hover:text-teal-600"
                                >
                                    <Image src="/logo.png" alt="logo.png" width={25} height={25} priority />
                                    Ir a SchoMetrics
                                </Button>
                            </Link>
                        </div>

                        {/* Help Text */}
                        <p className="text-xs text-muted-foreground mt-6">¿Necesitas ayuda? Contacta a nuestro equipo de soporte</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
