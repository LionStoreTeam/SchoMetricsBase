"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/hooks/getInitials";
import { UserProfileData } from "@/types/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRightLeftIcon, Award, Calendar, CalendarCheckIcon, CheckCircle, Gift, Medal, Shield, ShoppingBag, Tag, Ticket, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ListaDeRecompensas from "../../components/ListaDeRecompensas";
import SchoMetricsLoader from "@/app/components/SchoMetricsLoader";

const ValidezPage = () => {
    const params = useParams();
    const userId = params.userId as string;
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchUser = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/users/profiles/${userId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Usuario no encontrado o error al cargar.");
            }
            const data: UserProfileData = await response.json();
            setUser(data);
            console.log("Usuario cargado:", data);
        } catch (err) {
            console.error("Error cargando usuario:", err);
            setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    const formatDate = (dateString: string | undefined, includeTime = true) => {
        if (!dateString) return "Fecha no disponible";
        const date = new Date(dateString);
        if (includeTime) {
            return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es });
        }
        return format(date, "dd MMM, yyyy", { locale: es });
    };

    const USER_TYPE_MAP: { [key: string]: string } = {
        STUDENT: "Estudiante",
        TEACHER: "Docente",
        ADMIN: "Administrador",
    };

    if (isLoading) {
        return (
            <SchoMetricsLoader />
        )
    }

    return (
        <div className="min-h-screen py-10 bg-gradient-to-br from-teal-50 to-green-50 p-4 lg:pt-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="ftext-center mb-8 text-center">
                    <div className="flex flex-col items-center justify-center mb-4 md:flex-row">
                        <Shield className="h-12 w-12 text-green-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">SchoMetrics</h1>
                    </div>
                    <p className="text-lg text-gray-600">Validación de Documento Oficial</p>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center mb-6">
                    <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm hover:bg-green-200">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reporte de Trayectoria Verificado
                    </Badge>
                </div>

                {/* Main Card */}
                <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-teal-950 to-sky-950 text-white">
                        <div className="flex flex-col items-center justify-between p-4 md:flex-row">
                            <div className="flex flex-col text-sky-50">
                                <CardTitle className="flex items-center text-center text-xl">
                                    <User className="h-6 w-6 mr-2" />
                                    Información del Usuario
                                </CardTitle>
                                <CardDescription className="text-green-200 text-center">
                                    Datos básicos verificados del sistema SchoMetrics.
                                </CardDescription>
                            </div>
                            <div className="mt-5 p-1 rounded-full bg-white">
                                <Avatar className="w-[80px] h-[80px]">
                                    <AvatarImage src={user?.profile?.publicAvatarDisplayUrl || ""} alt={user?.name || "Avatar"} />
                                    <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold text-[25px]" >
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Información Personal */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Datos Personales</h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                                        <p className="text-lg font-medium text-gray-900">{user?.name.toUpperCase()}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">ID de Usuario</label>
                                        <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{user?.id}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Matrícula</label>
                                        <p className="text-lg font-bold text-sky-800">{user?.matricula}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Tipo de Cuenta: {" "}</label>
                                        <Badge
                                            variant={
                                                user?.userType === "STUDENT" ? "secondary" :
                                                    user?.userType === "TEACHER" ? "outline" :
                                                        user?.userType === "ADMIN" ? "outline"  // Example: use outline for community
                                                            : "default"
                                            }
                                            className={
                                                user?.userType === "STUDENT" ? "bg-sky-100 text-sky-700 border-sky-300" :
                                                    user?.userType === "TEACHER" ? "bg-green-100 text-green-700 border-green-300" :
                                                        user?.userType === "ADMIN" ? "bg-red-950 text-white"
                                                            : "bg-gray-100 text-gray-700 border-gray-300"
                                            }
                                        >
                                            {USER_TYPE_MAP[user?.userType as string] || user?.userType}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col items-start gap-2 text-sm">
                                        <div className="flex gap-2 items-center justify-center">
                                            <CalendarCheckIcon className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-sm font-medium text-gray-500">Miembro desde:</span>
                                        </div>
                                        <span className="font-semibold">{formatDate(user?.createdAt, false)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Información Académica */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Académica</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">EcoPoint Totales</label>
                                        <div className="flex gap-2 mt-2 justify-start items-center">
                                            <Image src="/eco_points_logo.png" alt="eco_points_logo" width={60} height={40} priority />
                                            <p className="text-2xl font-bold text-[#17d627]">{user?.points}</p>
                                        </div>
                                    </div>
                                    {/* Datos del Usuario */}
                                    <div className='w-full flex flex-col justify-center items-start gap-4'>
                                        {user?.profile?.badges && user.profile.badges.length > 0 ? (
                                            <div className="flex flex-col flex-wrap gap-2">
                                                <div className="flex items-center text-center gap-2 md:flex-row text-slate-500">
                                                    Insignias: {" "}
                                                </div>
                                                {user.profile.badges.map((badge) => (
                                                    <Badge
                                                        key={badge.id}
                                                        variant="outline"
                                                        className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-800"
                                                    >
                                                        {/* Asumiendo que badge.imageUrl es una URL completa y pública */}
                                                        <img src={badge.imageUrl || ""} alt={badge.name} className="h-4 w-4" />
                                                        {badge.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col justify-center items-start gap-2 md:flex-row text-slate-500">
                                                <div className="flex items-center gap-2 md:flex-row text-slate-500">
                                                    <CheckCircle className='w-6 h-6' />
                                                    Insignias: {" "}
                                                </div>
                                                <p className='text-sky-800 font-bold'>
                                                    Sin Insignias obtenidas.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />
                        <ListaDeRecompensas userId={user?.id as string} />


                        <Separator className="my-6" />

                        {/* Footer Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p>
                                        <strong>Verificación de la cuenta realizada el:</strong> {
                                            formatDate(new Date().toISOString())}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 text-center">
                                    Este documento ha sido verificado automáticamente por el sistema SchoMetrics.
                                    <br />
                                    Para más información, contacte al administrador del sistema.
                                </p>
                            </div>
                        </div>
                        <div className="my-5 flex w-full justify-center items-center">
                            <Link href="/dashboard">
                                <Button className="w-max bg-teal-500 text-white hover:bg-teal-600">
                                    <ArrowRightLeftIcon className="mr-2 h-4 w-4" />
                                    Ir a SchoMetrics
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} SchoMetrics. Documento oficial verificado.</p>
                </div>
            </div>
        </div>
    )
}

export default ValidezPage;