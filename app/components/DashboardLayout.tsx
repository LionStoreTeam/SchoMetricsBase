"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, Map, User, LogOut, Menu, LayoutDashboard, BarChart2, Award, Trophy, Bell, Gift, GraduationCap, UserCog, Crown, Megaphone } from "lucide-react"; // Añadido Bell y Gift (si no estaba)
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { UserProfileData, UserStats } from "@/types/types"; // Asumo que UserProfileBadge está en types.ts
import Image from "next/legacy/image";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserSession from "@/hooks/useUserSession";
import SchoMetricsLoader from "./SchoMetricsLoader";
import { luckiestGuy } from "@/fonts/fonts";
import { calculateNextGoal, calculatePreviousGoal, calculateProgress } from "./EcoPointsUserCard";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Interfaz para la respuesta de la API de notificaciones (solo necesitamos el contador aquí)
interface NotificationsSummary {
    unreadCount: number;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    // const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null); // No parece usarse en este layout
    const [profile, setProfile] = useState<UserProfileData | null>(null); // Inicializar como null para manejar mejor el estado de carga
    const [unreadNotifications, setUnreadNotifications] = useState(0); // Estado para notificaciones
    const currentSession = useUserSession();
    const [isHovered, setIsHovered] = useState(false)



    const [stats, setStats] = useState<UserStats>({
        totalPoints: 0,
        // level: 1,
        activityCount: 0,
        recentActivities: [],
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true); // Iniciar carga
            try {
                const userDataResponse = await fetch("/api/profile");
                if (!userDataResponse.ok) {
                    if (userDataResponse.status === 401) { // Manejar caso de no autorizado
                        toast.error("Sesión inválida. Por favor, inicia sesión de nuevo.");
                        router.push("/login");
                        return; // Salir temprano si no está autorizado
                    }
                    throw new Error("Error al obtener perfil de usuario");
                }
                const userData: UserProfileData = await userDataResponse.json();
                setProfile(userData); // Establecer perfil

                // Fetch notificaciones no leídas solo si el perfil se cargó correctamente
                if (userData && userData.id) { // Asegurarse que userData y userData.id existan
                    const notificationsResponse = await fetch("/api/notifications");
                    if (notificationsResponse.ok) {
                        const notificationsData: NotificationsSummary = await notificationsResponse.json();
                        setUnreadNotifications(notificationsData.unreadCount || 0);
                    } else {
                        console.warn("No se pudieron cargar las notificaciones no leídas para el layout.");
                        // No mostrar toast de error aquí para no ser intrusivo, solo loguear
                    }
                }

            } catch (error) {
                console.error("Error al cargar datos iniciales en layout:", error);
                // No redirigir aquí para evitar bucles si la página de login también usa este layout
                // o si hay errores intermitentes. El estado !profile se usará para mostrar un loader.
            } finally {
                setIsLoading(false); // Finalizar carga
            }
        };

        fetchInitialData();
    }, [router, pathname]); // Dependencia en pathname para re-fetch notificaciones al navegar (opcional)

    useEffect(() => {
        if (!profile) return; // Solo buscar estadísticas si el perfil está cargado

        const fetchUserStats = async () => {
            try {
                // No es necesario setIsLoading aquí si el loader principal ya está activo
                const statsResponse = await fetch("/api/stats");
                if (!statsResponse.ok) throw new Error("Error al obtener estadísticas");
                const statsData = await statsResponse.json();

                const activitiesResponse = await fetch("/api/activities?limit=3");
                if (!activitiesResponse.ok) throw new Error("Error al obtener actividades");
                const activitiesData = await activitiesResponse.json();

                setStats({
                    totalPoints: statsData.totalPoints || 0,
                    // level: profile.level || statsData.level || 1,
                    activityCount: statsData.activityCount || 0,
                    recentActivities: activitiesData.activities || [],
                });
            } catch (error) {
                console.error("Error al cargar estadísticas del dashboard:", error);
            }
        };
        fetchUserStats();
    }, [profile]); // Depender del perfil para cargar estadísticas

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", { method: "POST" });
            if (response.ok) {
                toast.success("Has cerrado sesión correctamente");
                router.push("/");
            } else {
                toast.error("Error al cerrar sesión");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast.error("No se pudo cerrar sesión");
        }
    };

    const getInitials = (name: string = "") => {
        return name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";
    };

    // Calcular valores dinámicos basados en los puntos
    const nextGoal = calculateNextGoal(stats.totalPoints)
    const progress = calculateProgress(stats.totalPoints)

    // Loader de página completa mientras se carga el perfil esencial
    if (isLoading && !profile) {
        return (
            <SchoMetricsLoader />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header para móviles */}
            <header className="bg-white py-3 px-4 flex justify-between items-center lg:hidden border-shadow-sm top-0 fixed w-full z-40">
                <div className="flex items-center gap-2">

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-600">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white p-0">
                            <div className="flex flex-col h-full overflow-auto">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center gap-2">
                                        <Image src="/logo.png" alt="logo" width={70} height={70} priority objectFit="contain" />
                                        <span className="text-xl font-bold text-[#00b38c] pl-3">SchoMetrics</span>
                                    </div>
                                </div>

                                {/* Añade el SheetTitle aquí */}
                                <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>

                                {/* Añade el SheetDescription aquí */}
                                <SheetDescription className="sr-only">
                                    Menú de navegación principal de la aplicación EcoTrack MX.
                                </SheetDescription>
                                <div className="mx-2 text-sm p-2">
                                    <span>
                                        Notificaciones: {" "}
                                        <Link href="/avisos" passHref> {/* Enlace a la pestaña de notificaciones del perfil */}
                                            <Button variant="ghost" size="icon" className="relative text-gray-600">
                                                <Bell className="h-5 w-5" />
                                                {unreadNotifications > 0 && (
                                                    <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-white border-px"></span>
                                                    </span>
                                                )}
                                                <span className="sr-only">Notificaciones</span>
                                            </Button>
                                        </Link>
                                    </span>
                                </div>
                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-5 w-5" />Cerrar Sesión
                                </Button>
                                {profile && (
                                    <div className="flex flex-col items-center mt-2">
                                        <Avatar className="h-20 w-20 mb-3">
                                            <AvatarImage src={profile.profile?.publicAvatarDisplayUrl || ""} alt={profile.name || "Avatar"} />
                                            <AvatarFallback className="text-xl bg-teal-100 text-teal-600">
                                                {getInitials(profile.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="font-medium text-gray-800 uppercase">{profile.name}</p>
                                        <p className="text-start text-sm text-gray-500">Matricula:
                                            <span className="text-[#00b38c] font-semibold">{profile.matricula}</span>
                                        </p>
                                        <div className="mt-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <Image
                                                    src="/eco_points_logo.png"
                                                    alt="EcoPoints Badge"
                                                    width={23}
                                                    height={20}
                                                    className={`mx-auto transition-transform duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"}`}
                                                />
                                                <span className="text-[#17d627] font-semibold text-sm" title="Total de actividades enviadas">EcoPoints: {profile.points}</span>
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            <div className="flex items-center justify-center gap-2">
                                                <Leaf
                                                    className={` w-4 h-4 text-green-600 transition-all duration-1000 ${isHovered ? "animate-pulse" : "animate-pulse"}`}
                                                    style={{ top: "15%", left: "15%" }}
                                                />
                                                <span className="text-green-600 font-semibold text-sm" title="Total de actividades enviadas">Actividades: {stats.activityCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {
                                    currentSession.session?.userType === "ADMIN" && (
                                        <div className="mt-2 mr-3 ml-2 p-2 transition-all ease-linear duration-300 rounded-md border-none">
                                            <Link href="/admin">
                                                <Button size="icon" className="w-full px-3 justify-start text-white bg-rose-500 hover:bg-red-600 transition-all ease-in-out duration-300 hover:-translate-x-1">
                                                    <UserCog className="h-5 w-5" />
                                                    Panel de Administración
                                                </Button>
                                            </Link>
                                        </div>
                                    )
                                }
                                <nav className="flex-1 p-2 space-y-1 overflow-y-auto min-h-screen">
                                    <MobileNavItem href="/inicio" icon={<LayoutDashboard className="h-5 w-5" />} label="Inicio" active={pathname === "/inicio"} />
                                    <MobileNavItem href="/actividades" icon={<Leaf className="h-5 w-5" />} label="Actividades" active={pathname.startsWith("/actividades")} />
                                    <MobileNavItem href="/estadisticas" icon={<BarChart2 className="h-5 w-5" />} label="Estadísticas" active={pathname === "/estadisticas"} />
                                    <MobileNavItem href="/educacion" icon={<GraduationCap className="h-5 w-5" />} label="Educacion" active={pathname.startsWith("/educacion")} />
                                    <MobileNavItem href="/recompensas" icon={<Gift className="h-5 w-5" />} label="Recompensas" active={pathname === "/recompensas"} />
                                    {/* <MobileNavItem href="/negocios-disponibles" icon={<Store className="h-5 w-5" />} label="Negocios Disponibles" active={pathname === "/negocios-disponibles"} /> */}
                                    {/* <MobileNavItem href="/productos-disponibles" icon={<ShoppingBasket className="h-5 w-5" />} label="Productos Disponibles" active={pathname === "/productos-disponibles"} /> */}
                                    <MobileNavItem href="/insignias" icon={<Award className="h-5 w-5" />} label="Insignias" active={pathname === "/insignias"} />
                                    <MobileNavItem href="/marcadores" icon={<Trophy className="h-5 w-5" />} label="Marcadores" active={pathname === "/marcadores"} />
                                    <MobileNavItem href="/centros-de-acopio" icon={<Map className="h-5 w-5" />} label="Centros de Acopio" active={pathname === "/centros-de-acopio"} />
                                    <MobileNavItem href="/avisos" icon={<Megaphone className="h-5 w-5" />} label="Avisos" active={pathname === "/avisos"} />
                                    <MobileNavItem href="/perfil" icon={<User className="h-5 w-5" />} label="Mi Perfil" active={pathname === "/perfil"} />
                                </nav>

                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link href="/perfil#notifications_tab" passHref> {/* Enlace a la pestaña de notificaciones del perfil */}
                        <Button variant="ghost" size="icon" className="relative text-gray-600">
                            <Bell className="h-5 w-5" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-white border-px"></span>
                                </span>
                            )}
                            <span className="sr-only">Notificaciones</span>
                        </Button>
                    </Link>
                </div>
                <Link href="/inicio" className="flex items-center">
                    <span className="text-xl font-bold text-[#00b38c] pr-3">SchoMetrics</span>
                    <Image src="/logo.png" alt="logo" width={50} height={50} priority objectFit="contain" />
                </Link>
            </header>
            {/* Seccion para Escritorio */}

            <div className="flex flex-1">
                <aside className="bg-white hidden lg:flex lg:flex-col lg:w-64 shadow-md border-r-2 border-teal-50">
                    <div className="p-4 mt-3">
                        <Link href="/inicio" className="flex items-center">
                            <Image src="/logo.png" alt="logo" width={70} height={70} priority objectFit="contain" />
                            <span className="text-2xl font-bold text-[#00b38c] pl-3">SchoMetrics</span>
                        </Link>
                    </div>
                    <div className="">
                        <div className="p-3">
                            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100" onClick={handleLogout}>
                                <LogOut className="mr-2 h-5 w-5" />Cerrar Sesión
                            </Button>
                        </div>
                        <div className="mx-5 mb-5 text-sm p-2">
                            <span>
                                Notificaciones: {" "}
                                <Link href="/avisos" passHref> {/* Enlace a la pestaña de notificaciones del perfil */}
                                    <Button variant="ghost" size="icon" className="relative text-gray-600">
                                        <Bell className="h-5 w-5" />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-white border-px"></span>
                                            </span>
                                        )}
                                        <span className="sr-only">Notificaciones</span>
                                    </Button>
                                </Link>
                            </span>
                        </div>
                    </div>

                    {profile && (
                        <div className="flex flex-col items-center py-5">
                            <Avatar className="h-20 w-20 mb-3">
                                <AvatarImage src={profile.profile?.publicAvatarDisplayUrl || ""} alt={profile.name || "Avatar"} />
                                <AvatarFallback className="text-xl bg-teal-100 text-teal-500 border-2 border-emerald-500">
                                    {getInitials(profile.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center flex flex-col gap-1">
                                <p className="font-semibold text-gray-800 uppercase">{profile.name}</p>
                                <p className="font-light text-gray-400">Matricula: <span className="text-[#00b38c] font-semibold">{profile.matricula}</span></p>
                            </div>

                        </div>
                    )}
                    <DashboardEcoPointsUserCard />
                    {
                        currentSession.session?.userType === "ADMIN" && (
                            <div className="mt-3 flex justify-center items-center transition-all ease-linear duration-300 rounded-md border-none">
                                <Link href="/admin">
                                    <Button size="icon" className="w-full px-3 justify-start text-white bg-rose-500 hover:bg-red-600 transition-all ease-in-out duration-300 hover:-translate-x-1">
                                        <UserCog className="h-5 w-5" />
                                        Panel de Administración
                                    </Button>
                                </Link>
                            </div>
                        )
                    }
                    <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
                        <NavItem href="/inicio" icon={<LayoutDashboard className="h-5 w-5" />} label="Inicio" active={pathname === "/inicio"} />
                        <NavItem href="/actividades" icon={<Leaf className="h-5 w-5" />} label="Actividades" active={pathname.startsWith("/actividades")} />
                        <NavItem href="/estadisticas" icon={<BarChart2 className="h-5 w-5" />} label="Estadísticas" active={pathname === "/estadisticas"} />
                        <NavItem href="/educacion" icon={<GraduationCap className="h-5 w-5" />} label="Educacion" active={pathname.startsWith("/educacion")} />
                        <NavItem href="/recompensas" icon={<Gift className="h-5 w-5" />} label="Recompensas" active={pathname === "/recompensas"} />
                        <NavItem href="/insignias" icon={<Award className="h-5 w-5" />} label="Insignias" active={pathname === "/insignias"} />
                        <NavItem href="/marcadores" icon={<Trophy className="h-5 w-5" />} label="Marcadores" active={pathname === "/marcadores"} />
                        <NavItem href="/centros-de-acopio" icon={<Map className="h-5 w-5" />} label="Centros de Acopio" active={pathname === "/centros-de-acopio"} />
                        <NavItem href="/avisos" icon={<Megaphone className="h-5 w-5" />} label="Avisos" active={pathname === "/Avisos"} />
                        <NavItem href="/perfil" icon={<User className="h-5 w-5" />} label="Mi Perfil" active={pathname === "/perfil"} />
                        {/* <NavItem href="/productos-disponibles" icon={<ShoppingBasket className="h-5 w-5" />} label="Productos Disponibles" active={pathname === "/productos-disponibles"} /> */}
                        {/* <NavItem href="/negocios-disponibles" icon={<Store className="h-5 w-5" />} label="Negocios Disponibles" active={pathname === "/negocios-disponibles"} /> */}
                    </nav>


                </aside>

                <main className="test flex-1 overflow-auto">
                    <div className="container mx-auto p-4">
                        {children}
                    </div>
                </main>
            </div>
            <footer className="py-4 bg-white border-t">
                <div className="container mx-auto flex flex-col items-center justify-between gap-2 md:flex-row px-4">
                    <p className="text-center text-xs text-gray-600 md:text-left">© {new Date().getFullYear()} SchoMetrics. Todos los derechos reservados.</p>
                    <div className="flex gap-3">
                        <Link href="/terminos" className="text-xs text-gray-600">Términos</Link>
                        <Link href="/privacidad" className="text-xs text-gray-600">Privacidad</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
    function DashboardEcoPointsUserCard() {
        return (
            <div className="mt-4">
                <div
                    className="w-full relative overflow-hidden bg-white"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >


                    {/* Inner card */}
                    <div className="relative bg-white p-6 m-0.5 w-full">
                        {/* Premium badge */}
                        <div className="absolute top-4 right-4">
                            <div className="bg-gradient-to-r from-sky-400 to-sky-500 rounded-full p-2">
                                <Crown className={`w-5 h-5 text-white`} />
                            </div>
                        </div>


                        <div className="text-center">
                            <div className="mb-4">
                                <Image
                                    src="/eco_points_logo.png"
                                    alt="EcoPoints Badge"
                                    width={110}
                                    height={90}
                                    className={`mx-auto transition-transform duration-1000 ${isHovered ? "animate-heartbeat" : "animate-heartbeat"}`}
                                />
                            </div>

                            <h3 className={`${luckiestGuy.className} text-2xl text-[#17d627] mb-2`}>
                                EcoPoints:
                            </h3>

                            <p className={`${luckiestGuy.className} text-5xl font-bold text-[#17d627] mb-2`}>{stats.totalPoints.toLocaleString()}</p>

                            <div className="bg-gradient-to-r from-green-100 to-emerald-50 rounded-full p-3 mb-4">
                                <div className="flex items-center justify-center gap-2">
                                    <Leaf
                                        className={` w-5 h-5 text-green-600 transition-all duration-1000 ${isHovered ? "" : ""}`}
                                        style={{ top: "15%", left: "15%" }}
                                    />
                                    <span className="text-green-600 font-bold text-sm" title="Total de actividades enviadas">Actividades: {stats.activityCount}</span>

                                </div>
                            </div>


                            {/* Próximo Objetivo - Funcionalidad implementada */}
                            <span className="text-sky-400 font-bold ">Próximo Objetivo</span>
                            <div className={`${luckiestGuy.className} space-y-2 tracking-wider`}>
                                <div className="flex flex-col justify-center items-center text-sm">
                                    <span className="text-[#17d627]">{nextGoal.toLocaleString()} EcoPoints</span>
                                </div>

                                {/* Barra de progreso dinámica */}
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-sky-400 via-blue-500 to-teal-500 h-3 rounded-full relative transition-all duration-700 ease-out"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Indicador de progreso en texto */}
                                <div className="flex flex-col justify-between items-center text-xs text-[#17d627] mt-1">
                                    <span>{calculatePreviousGoal(stats.totalPoints).toLocaleString()} Epts</span>
                                    <span className={`text-[16px] text-sky-400`}>{progress.toFixed(1)}%</span>
                                    <span>{nextGoal.toLocaleString()} Epts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



// Label modificado para aceptar notificationsCount
function LabelNotificaction({
    notificationsCount
}: {
    notificationsCount?: number;

}) {
    return (
        <span>
            {notificationsCount && notificationsCount > 0 && (
                <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notificationsCount > 9 ? '9+' : notificationsCount}
                </span>
            )}
        </span>
    )
}

// NavItem 
function NavItem({
    href, // Añadido href para que Link funcione correctamente
    icon,
    label,
    active,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}) {
    return (
        <Link href={href} passHref>
            <Button
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start text-sm px-3 py-2 relative ${active
                    ? "bg-[#00b38c] hover:bg-teal-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 transition-all ease-in-out duration-300 hover:-translate-x-1"
                    }`}
            >
                {React.cloneElement(icon as any, { className: "h-5 w-5 mr-3" })}
                {label}
            </Button>
        </Link>
    );
}

// MobileNavItem modificado para aceptar notificationsCount
function MobileNavItem({
    href,
    icon,
    label,
    active,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}) {
    return (
        <Link href={href} className="block w-full">
            <Button
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start px-4 py-3 text-base relative ${active
                    ? "bg-[#00b38c] hover:bg-teal-600 text-white "
                    : "text-gray-700 hover:bg-gray-100 "
                    }`}
            >
                {React.cloneElement(icon as any, { className: "h-5 w-5 mr-3" })}
                {label}
            </Button>
        </Link>
    );
}

