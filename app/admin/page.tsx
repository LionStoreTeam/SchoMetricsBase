"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Importar Link
import { Loader2, Building, PlusCircle, Gift, LandPlot, UserCog2, MonitorCheck, UserCheck2, Eye, Megaphone, UserRoundX, ArrowRightLeftIcon, UserCog, DoorOpen, Settings2 } from "lucide-react"; // Añadir Building y PlusCircle
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from 'react-hot-toast';
import Image from "next/image";
import SchoMetricsLoader from "../components/SchoMetricsLoader";
export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/auth/session");
                const data = await response.json();
                if (!data.user || data.user.role !== "ADMIN") {
                    toast.error("Acceso denegado.");
                    router.push("/inicio");
                    return;
                }
                setIsAdmin(true);
            } catch (error) {
                console.error("Error al verificar permisos:", error);
                toast.error("Error al verificar permisos.");
                router.push("/inicio");
            } finally {
                setIsLoading(false);
            }
        };
        checkAdmin();
    }, [router]);

    if (isLoading) {
        return (
            <SchoMetricsLoader />
        );
    }

    if (!isAdmin) return null; // Redirección ya manejada

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Sesión cerrada exitosamente.");
                router.push("/admin/auth/login-admin");
            } else {
                toast.error("Error al cerrar sesión.");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            toast.error("Error al cerrar sesión.");
        }
    }

    return (
        <div className="p-4 flex flex-col gap-8 m-5 sm:m-10">
            <div className="mt-16 lg:mt-0 p-8 flex flex-col gap-3 text-white bg-gradient-to-br from-rose-700 via-red-500 to-red-700 rounded-xl shadow-2xl">
                <h1 className="text-3xl text-center font-bold tracking-tight flex flex-col md:flex-row items-center gap-3">
                    <Settings2 className="h-10 w-10 animate-bounce" />
                    Panel de Administración
                </h1>
                <p className="text-lg opacity-90 text-center md:text-start">Gestiona los recursos de SchoMetrics</p>
            </div>
            <div className="w-full flex justify-end items-center">
                <Button
                    className="p-2 bg-white mt-5 md:mt-0 hover:bg-red-500 hover:text-white text-rose-600 font-bold shadow-lg border-2 border-red-500"
                    onClick={handleLogout}
                >
                    <DoorOpen className="h-7 w-7" />
                    Cerrar Sesión
                </Button>
            </div>
            <div className="flex flex-col justify-center items-center gap-5">
                {/* Tarjeta para Navegar a "Crear Nuevo Usuario STUDENT-TEACHER" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-blue-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <UserCheck2 className="h-6 w-6 text-[#2e86c1]" />
                            <CardTitle className="text-center">Crear NUEVA cuenta de Usuario <span className="text-[#2e86c1]">(ESTUDIANTE / DOCENTE)</span></CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Crea un nuevo usuario en la plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <UserCheck2 className="h-16 w-16 text-[#2e86c1] mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            Asegurate de verificar los datos del usuario antes de crear una cuenta. Recuerda que la matricula debe ser única y no repetible.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/auth/registro-usuario">
                            <Button className="w-full bg-[#2e86c1] hover:bg-sky-700 tracking-wider">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Crear Cuenta Usuario
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "Crear Nuevo Usuario ADMIN" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-blue-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <UserCog2 className="h-6 w-6 text-[#2e86c1]" />
                            <CardTitle className="text-center">Crear NUEVA cuenta de Usuario <span className="text-[#2e86c1]">(ADMINISTRADOR)</span></CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Crea un nuevo usuario tipo ADMIN en la plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <UserCog2 className="h-16 w-16 text-[#2e86c1] mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            Asegurate de verificar los datos del usuario antes de crear una cuenta. Recuerda que la matricula debe ser única y no repetible. Está cuenta de Administrador tendra todas las funciones del administrador.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/auth/registro-admin">
                            <Button className="w-full bg-[#2e86c1] hover:bg-sky-700 tracking-wider">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Crear Cuenta ADMIN
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "ELIMINAR USUARIOS" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-red-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <UserRoundX className="h-6 w-6 text-red-500" />
                            <CardTitle className="text-center">Elimina Usuarios de SchoMetrics</CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Elimina los usuarios de SchoMetrics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <UserRoundX className="h-16 w-16 text-red-300 mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            La eliminación de un Usuario es irreversible y permanente, se eliminarán todos los registros de la Base de Datos, así como las imágenes. Verifica siempre los datos antes de eliminar un Usuario.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/lista-de-usuarios">
                            <Button className="w-full bg-red-600 hover:bg-red-700">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Todos los Usuarios
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "Administrar Actividades" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-purple-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <MonitorCheck className="h-6 w-6 text-purple-500" />
                            <CardTitle className="text-center">Administrar las Actividades</CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Revisa, Califica, Edita o Elimina las Actividades de los usuarios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <MonitorCheck className="h-16 w-16 text-purple-300 mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            Para mantener la transparencia y honestidad en nuestra plataforma, siempre se debe verificar las evidencias y el contenido de la Actividad.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/validar-actividades">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Las Actividades
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "Crear/Editar Avisos" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-lime-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <Megaphone className="h-6 w-6 text-lime-400" />
                            <CardTitle className="text-center">Crear o Editar Avisos</CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Crea o Edita los Avisos de SchoMetrics (Generales, Educativos, Ambientales, etc).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <Megaphone className="h-16 w-16 text-lime-400 mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            Mantén actualizados los avisos que estarán visibles para todos los usuarios de SchoMetrics.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/avisos" >
                            <Button className="w-full bg-lime-500 hover:bg-lime-600">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Crear o Editar Avisos
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "Añadir Nuevo Centro de Acopio" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-cyan-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <Building className="h-6 w-6 text-cyan-300" />
                            <CardTitle className="text-center">Gestionar Centros de Acopio</CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Añade y administra los centros de reciclaje y acopio en la plataforma.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <LandPlot className="h-16 w-16 text-cyan-300 mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            Mantén actualizada la red de centros de reciclaje y acopio para ayudar a los usuarios a encontrar dónde llevar sus materiales.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/nuevo-centro" >
                            <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Añadir Centro de Acopio
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "Crear Nueva Recompensa" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-amber-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <Gift className="h-6 w-6 text-amber-500" />
                            <CardTitle className="text-center">Crea o Edita  Recompensas</CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Añade nuevas recompensas o edita las existentes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <Gift className="h-16 w-16 text-amber-300 mb-4" />
                        <p className="text-muted-foreground mb-4 text-center">
                            Mantén actualizada las recompensas para mantener el entusiasmo en los usuarios de SchoMetrics.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/admin/crear-recompensa">
                            <Button className="w-full bg-amber-600 hover:bg-amber-700">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Ver Recompensas
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                {/* Tarjeta para Navegar a "SchoMetrics" */}
                <Card className="shadow-lg flex flex-col justify-between items-center w-full lg:w-[700px] transition-all ease-linear duration-500 border-4 border-slate-50 rounded-xl hover:border-emerald-200">
                    <CardHeader>
                        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:items-center md:justify-center">
                            <Image src="logo.png" alt="SchoMetrics" width={30} height={30} objectFit="contain"></Image>
                            <CardTitle className="text-center">Navega a SchoMetrics</CardTitle>
                        </div>
                        <CardDescription className="pt-3 text-center">
                            Verifica la correcta funcionalidad de los recursos que hayas creado o modificado en la plataforma de SchoMetrics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center"> {/* Ajustar altura para centrar */}
                        <Image src="logo.png" alt="SchoMetrics" width={150} height={150} objectFit="contain"></Image>
                    </CardContent>
                    <div className="text-muted-foreground mb-4 text-center">
                        Pudes volver a este Panel mediante el botón:
                        <div className="w-full flex justify-center items-center">
                            <div className="my-3 p-2 transition-all ease-linear duration-300 rounded-md border-none">
                                <Button size="icon" className="w-full px-3 justify-start text-white bg-rose-300 hover:bg-rose-300 cursor-default">
                                    <UserCog className="h-5 w-5" />
                                    Panel de Administración
                                </Button>
                            </div>
                        </div>
                    </div>
                    <CardFooter>
                        <Link href="/inicio">
                            <Button className="w-full bg-[#00b38c] hover:bg-teal-600">
                                <ArrowRightLeftIcon className="mr-2 h-4 w-4" />
                                Ir a SchoMetrics
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div >
    );
}
