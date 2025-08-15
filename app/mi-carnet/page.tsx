"use client"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Award,
    Leaf,
    MapPin,
    Loader2,
    LucideSquareCheck,
    CalendarCheck,
    User,
    MSquareIcon,
    Coins,
    QrCode,
    RefreshCw,
    BadgeQuestionMarkIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AvatarUser from "../components/AvatarUser"
import { useState, useEffect } from "react"
import type { UserProfileData, UserStats } from "@/types/types"
import toast from "react-hot-toast"
import { formatDate } from "../../hooks/allHooks"
import QRCode from "qrcode"

export default function MiCarnet() {
    const [profile, setProfile] = useState<UserProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [validationLink, setValidationLink] = useState<string>("")
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
    const [isGeneratingQR, setIsGeneratingQR] = useState(false)
    const [stats, setStats] = useState<UserStats>({
        totalPoints: 0,
        activityCount: 0,
        recentActivities: [],
    })

    const generateValidationLink = async () => {
        if (!profile?.id) return

        setIsGeneratingQR(true)
        try {
            const response = await fetch("/api/validate-user/generate-validation-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: profile.id }),
            })

            if (!response.ok) {
                toast.error("Error al generar link de validación")
                throw new Error("Error al generar link de validación")
            }


            const data = await response.json()
            setValidationLink(data.url)

            const qrDataUrl = await QRCode.toDataURL(data.url, {
                width: 200,
                margin: 2,
                color: {
                    dark: "#059669",
                    light: "#FFFFFF",
                },
            })
            setQrCodeDataUrl(qrDataUrl)

            toast.success("Código QR generado exitosamente")
        } catch (error) {
            console.error("Error al generar código QR:", error)
            toast.error("Error al generar código QR")
        } finally {
            setIsGeneratingQR(false)
        }
    }

    const fetchProfileData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/profile")
            if (!response.ok) throw new Error("Error al obtener perfil")
            const data: UserProfileData = await response.json()
            setProfile(data)
        } catch (error) {
            console.error("Error al cargar perfil:", error)
            toast.error("Error, No se pudo cargar el perfil")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true)
            await Promise.all([fetchProfileData()])
            setIsLoading(false)
        }
        loadInitialData()
    }, [])

    useEffect(() => {
        if (profile?.id && !validationLink) {
            generateValidationLink()
        }
    }, [profile?.id])

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!profile?.id) return
            try {
                const statsResponse = await fetch("/api/stats")
                if (!statsResponse.ok) throw new Error("Error al obtener estadísticas")
                const statsData = await statsResponse.json()

                const activitiesResponse = await fetch("/api/activities?limit=3")
                if (!activitiesResponse.ok) throw new Error("Error al obtener actividades")
                const activitiesData = await activitiesResponse.json()

                setStats({
                    totalPoints: statsData.totalPoints || 0,
                    activityCount: statsData.activityCount || 0,
                    recentActivities: activitiesData.activities || [],
                })
            } catch (error) {
                console.error("Error al cargar datos del dashboard:", error)
            }
        }
        fetchUserStats()
    }, [profile?.id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            </div>
        )
    }

    return (
        <div className="py-10 flex flex-col gap-2 justify-start items-center min-h-screen bg-slate-950 p-4">
            <Link
                href="/inicio"
                className="flex gap-3 justify-center items-center px-4 py-2 bg-white border-2 border-teal-500 rounded-lg text-teal-500 font-semibold hover:bg-gray-50"
            >
                <Image src="/logo.png" alt="logo" width={20} height={15} priority objectFit="contain" />
                Ir a SchoMetrics
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex flex-col justify-center items-center text-center px-10 py-5">
                <h1 className="mx-auto max-w-full text-start text-2xl font-bold text-[#00d4a6] md:text-4xl lg:text-6xl">
                    Mi Carnet
                </h1>
                <span className="my-2 text-gray-400">
                    Aquí encontrarás tu Carnet y mediante el podrás validar tu identidad al momento de subir tus evidencias de
                    actividades.
                </span>
                <Link href="/mi-carnet/tutorial" className="flex gap-2 text-blue-300 border-b border-blue-300 hover:text-blue-400 hover:border-blue-400">
                    <BadgeQuestionMarkIcon className="h-5 w-5 text-blue-400 animate-bounce" />
                    ¿Cómo usarlo?
                </Link>
            </div>
            <Card className="w-80 h-[570px] rounded-t-lg rounded-b-none bg-gradient-to-b from-teal-100 via-white to-white border-0 shadow-2xl overflow-hidden relative backdrop-blur-sm">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
                    <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-8 left-4 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-emerald-200/20 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-4">
                    <div className="w-full flex justify-center">
                        <div className="bg-slate-950 rounded-full w-[25px] h-[25px] border border-teal-200"></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Image src="/logo.png" alt="logo" width={20} height={15} priority objectFit="contain" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-lg">SchoMetrics</h1>
                                <p className="text-emerald-100 text-xs">Carnet de Identidad</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <LucideSquareCheck className="w-4 h-4 text-yellow-200" />
                            <span className="text-white text-xs font-bold">VÁLIDO</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-6">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <AvatarUser />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                                <Award className="w-3 h-3 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                                <Leaf className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1 uppercase">
                            {profile?.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                            <span className="text-blue-800 text-lg font-bold">{profile?.matricula}</span>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="mt-10 flex items-center gap-2 text-sm">
                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Miembro desde:</span>
                            <span className="font-bold text-emerald-800">{formatDate(profile?.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Tipo:</span>
                            <span className="font-bold text-emerald-800">
                                {profile?.userType === "STUDENT"
                                    ? "ESTUDIANTE"
                                    : profile?.userType === "TEACHER"
                                        ? "DOCENTE"
                                        : profile?.userType === "ADMIN"
                                            ? "ADMINISTRADOR"
                                            : "SIN TIPO"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MSquareIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Matricula:</span>
                            <span className="font-bold text-emerald-800">{profile?.matricula}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Leaf className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Actividades:</span>
                            <span className="font-bold text-emerald-800">{stats.activityCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Coins className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">EcoPoints:</span>
                            <span className="font-bold text-emerald-800">{profile?.points}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Ciudad:</span>
                            <span className="font-bold text-emerald-800">
                                {profile?.profile?.city} - {profile?.profile?.state}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gradient-to-r from-transparent via-emerald-200 to-transparent">
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                            </div>
                            <p className="text-gray-400 text-xs font-medium">Impacto Positivo Certificado</p>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </Card>
            <Card className="w-80 h-[500px] rounded-b-lg rounded-t-none bg-gradient-to-t from-teal-50 via-white to-white border-0 shadow-2xl overflow-hidden relative backdrop-blur-sm">

                <div className="mt-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <QrCode className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-800">Código de Validación</span>
                        </div>

                        {qrCodeDataUrl ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="bg-white p-3 rounded-lg shadow-md border-2 border-emerald-200">
                                    <Image
                                        src={qrCodeDataUrl || "/placeholder.svg"}
                                        alt="Código QR de validación"
                                        width={150}
                                        height={150}
                                        className="rounded"
                                    />
                                </div>

                                <Button
                                    onClick={generateValidationLink}
                                    disabled={isGeneratingQR}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs px-3 py-2 h-8"
                                >
                                    {isGeneratingQR ? (
                                        <>
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-3 w-3 mr-1" />
                                            Volver a generar
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-[150px] h-[150px] bg-gray-100 rounded-lg flex items-center justify-center">
                                    {isGeneratingQR ? (
                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                                    ) : (
                                        <QrCode className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>

                                <Button
                                    onClick={generateValidationLink}
                                    disabled={isGeneratingQR}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs px-3 py-2 h-8"
                                >
                                    {isGeneratingQR ? (
                                        <>
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <QrCode className="h-3 w-3 mr-1" />
                                            Generar QR
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {validationLink && (
                    <div className="mt-4 p-3 mx-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-xs text-emerald-700 font-medium mb-1">Link de validación:</p>
                        <p className="text-xs text-emerald-600 break-all font-mono bg-white p-2 rounded border">
                            <a href={validationLink} target="_blank">
                                {validationLink}
                            </a>
                        </p>
                        <p className="text-xs text-emerald-500 mt-1">⏱️ Válido por 15 minutos</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
