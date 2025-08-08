"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Gift, Leaf, User, BookOpen, Activity, Award, CheckCircle, BarChart2, GraduationCap, Trophy, Map, BarChart2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfileData } from "@/types/types"
import Image from "next/legacy/image"
import toast from "react-hot-toast"
import DashboardLayout from "../components/DashboardLayout"
import { Badge } from "@/components/ui/badge"
import { FlipWords } from "@/components/ui/flip-words"
import SchometricsAnnoucementsCarousel from "./components/Announcements"



export default function Inicio() {
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfileData | null>(null); // Inicializar como null para manejar mejor el estado de carga
    const [greeting, setGreeting] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setGreeting(getGreeting());
        const timeout = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timeout);
    }, []);

    function getGreeting(): string {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return '¡Buenos días!';
        if (hour >= 12 && hour < 19) return '¡Buenas tardes!';
        return '¡Buenas noches!';
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true); // Iniciar carga
            try {
                const userDataResponse = await fetch("/api/profile");
                if (!userDataResponse.ok) {
                    if (userDataResponse.status === 401) { // Manejar caso de no autorizado
                        toast.error("Sesión inválida. Por favor, inicia sesión de nuevo.");
                        return; // Salir temprano si no está autorizado
                    }
                    throw new Error("Error al obtener perfil de usuario");
                }
                const userData: UserProfileData = await userDataResponse.json();
                setProfile(userData); // Establecer perfil


            } catch (error) {
                console.error("Error al cargar datos iniciales en layout:", error);
                // No redirigir aquí para evitar bucles si la página de login también usa este layout
                // o si hay errores intermitentes. El estado !profile se usará para mostrar un loader.
            } finally {
                setIsLoading(false); // Finalizar carga
            }
        };
        fetchInitialData();
    }, []); // Dependencia en pathname para re-fetch notificaciones al navegar (opcional)

    const features = [
        {
            icon: Leaf,
            title: "Actividades",
            description: "Registra tus actividades ambientales para ganar EcoPoints",
            color: "bg-green-100 text-emerald-700",
            url: "/actividades"
        },
        {
            icon: BarChart2,
            title: "Estadísticas",
            description: "Visualiza tu progreso y el impacto positivo ambiental generado",
            color: "bg-teal-100 text-teal-700",
            url: "/estadisticas"
        },
        {
            icon: GraduationCap,
            title: "Educación",
            description: "Aprende sobre sostenibilidad con contenido educativo diverso",
            color: "bg-blue-100 text-blue-700",
            url: "/educacion"
        },
        {
            icon: Gift,
            title: "Recompensas",
            description: "Canjea tus EcoPoints por increíbles recompensas",
            color: "bg-amber-100 text-amber-700",
            url: "/recompensas"
        },
        {
            icon: Award,
            title: "Insignias",
            description: "Desbloquea insignias especiales por tus logros ambientales",
            color: "bg-yellow-100 text-yellow-700",
            url: "/insignias"
        },
        {
            icon: Trophy,
            title: "Marcadores",
            description: "Compite sanamente con otros participantes de SchoMetrics",
            color: "bg-purple-100 text-indigo-700",
            url: "/marcadores"
        },
        {
            icon: Map,
            title: "Centros de Acopio",
            description: "Encuentra centros de reciclaje y acopio cercanos a tu ubicación",
            color: "bg-cyan-100 text-cyan-700",
            url: "/centros-de-acopio"
        },
        {
            icon: User,
            title: "Perfil",
            description: "Personaliza tu perfil y gestiona tu información personal",
            color: "bg-gray-100 text-gray-700",
            url: "/perfil"
        },
    ]

    const benefits = [
        "Gamificación con sistema de EcoPoints",
        "Seguimiento de impacto ambiental real",
        "Contenido educativo especializado",
        "Comunidad estudiantil comprometida",
        "Recompensas por acciones sostenibles",
        "Herramientas de medición y análisis",
    ]

    const words = ["¿Listo para hacer la diferencia ambiental?", "Registra Actividades Ambientales", "Visualiza tu Impacto Ambiental", "Obtén Increíbles Recompensas", "Aprende Sobre Sostenibilidad"];

    return (
        <DashboardLayout>
            <div className="mt-24 md:mt-6 w-full bg-white rounded-xl shadow-md">
                <div className="pt-5 flex justify-end items-center gap-4 bg-white rounded-xl w-full px-4 py-2">
                    <div className="flex gap-2 justify-center items-center">
                        <Image src="/logo.png" alt="logo" width={30} height={30} priority objectFit="contain" />
                        <p className="text-sm font-bold leading-tight text-[#00B38C]">
                            SchoMetrics
                        </p>
                    </div>
                </div>
                <div className="pt-5 flex justify-start items-center gap-4 bg-white rounded-md w-full px-4 py-2">
                    <h1 className="flex flex-col gap-2 pl-5 text-lg font-bold leading-tight text-gray-600 mb-4">
                        {greeting}
                        <span className="text-teal-500 font-semibold">{profile?.name}</span>
                        <span className="font-normal text-gray-600">Nos alegra verte aquí. <FlipWords words={words} /></span>
                    </h1>
                </div>
                <div className="my-5">
                    <SchometricsAnnoucementsCarousel />
                </div>
                {/* Platform Overview */}
                <section className="py-20 px-4 bg-white rounded-lg">
                    <div className="container mx-auto px-4">
                        <div className="text-center space-y-6 mb-16">
                            <h2 className="text-3xl lg:text-5xl font-bold text-gray-600">
                                ¿Cómo funciona <span className="text-[#00B38C]">SchoMetrics</span>?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Nuestra plataforma integra gamificación, educación y medición de impacto para crear una experiencia
                                completa de aprendizaje ambiental en el entorno escolar.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
                            <Card className="border-2 border-[#00B38C]/20 hover:border-[#00B38C]/40 transition-colors">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-[#00B38C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Leaf className="w-8 h-8 text-green-500" />
                                    </div>
                                    <CardTitle className="text-green-500">1. Registra Actividades</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center">
                                        Los estudiantes registran sus actividades ambientales siguiendo nuestro manual de actividades
                                        permitidas y ganan EcoPoints por cada acción positiva.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-blue-600">2. Aprende sobre Sostenibilidad Ambiental</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center">
                                        Visita la sección Educación y aprende sobre temas relacionados al medio ambiente y a la sostenibilidad.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-2 border-teal-200 hover:border-teal-400 transition-colors">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BarChart2Icon className="w-8 h-8 text-teal-600" />
                                    </div>
                                    <CardTitle className="text-teal-600">2. Mide tu Impacto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center">
                                        Visualiza estadísticas detalladas de tu progreso personal y el impacto ambiental colectivo generado
                                        por toda la comunidad escolar.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 border-amber-200 hover:border-amber-400 transition-colors">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <CardTitle className="text-amber-500">3. Obtén Recompensas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-center">
                                        Canjea tus EcoPoints por recompensas increíbles, desbloquea insignias especiales y compite sanamente
                                        con otros estudiantes.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-gradient-to-r from-[#00B38C]/5 to-emerald-50 rounded-lg p-4 lg:p-12 flex flex-col justify-center items-center">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-xl lg:text-3xl font-bold text-gray-600 text-start">Beneficios de usar SchoMetrics</h3>
                                    <div className="space-y-4">
                                        {benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <CheckCircle className="w-6 h-6 text-[#00B38C] flex-shrink-0" />
                                                <span className="text-gray-500 font-medium">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-gray-900">Tu Progreso Semanal</h4>
                                            <Badge className="bg-[#00B38C]/10 text-[#00B38C] hover:bg-teal-100">+15 EcoPoints</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Reciclaje</span>
                                                <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-20 h-2 bg-[#00B38C] rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Ahorro de Agua</span>
                                                <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Educación</span>
                                                <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-18 h-2 bg-purple-500 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-4">
                    <div className="container mx-auto px-4">
                        <div className="text-center space-y-6 mb-16">
                            <Badge className="bg-[#00B38C]/10 text-[#00B38C] border-[#00B38C]/20 hover:bg-white">
                                <Activity className="w-4 h-4 mr-2" />
                                Funcionalidades
                            </Badge>
                            <h2 className="text-3xl lg:text-5xl font-bold text-gray-600">
                                Explora todas las <span className="text-[#00B38C]">secciones</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Descubre cada una de las herramientas y secciones que SchoMetrics pone a tu disposición para maximizar tu
                                impacto ambiental positivo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <Link key={index} href={feature.url}>
                                    <Card
                                        key={index}
                                        className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2"
                                    >
                                        <CardHeader className="text-center pb-4">
                                            <div
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform`}
                                            >
                                                <feature.icon className="w-8 h-8" />
                                            </div>
                                            <CardTitle className="text-lg font-bold text-gray-600">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <CardDescription className="text-gray-600 text-center leading-relaxed">
                                                {feature.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-gradient-to-r from-[#00B38C] to-emerald-600 text-white rounded-b-xl flex flex-col justify-center items-center">
                    <div className="p-4 text-center">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <h2 className="text-3xl lg:text-5xl font-bold">¿Listo para hacer la diferencia?</h2>
                            <p className="text-xl lg:text-2xl text-teal-100 leading-relaxed">
                                Registra tus actividades ambientales, obtén EcoPoints y canjea increíbles recompensas
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/actividades">
                                    <Button size="lg" className="bg-white text-[#00B38C] hover:bg-green-50 font-semibold">
                                        <Leaf className="w-5 h-5 mr-2" />
                                        Comenzar mi Impacto
                                    </Button>
                                </Link>
                                <Link href="/actividades/manual-de-actividades-permitidas">
                                    <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-emerald-50 font-semibold hover:text-teal-600">
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        Ver Manual de Actividades
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    )
}
