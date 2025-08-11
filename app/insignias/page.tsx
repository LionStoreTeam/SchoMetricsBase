"use client";

import { useState, useEffect } from "react";
import { Award, Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //
import { Button } from "@/components/ui/button"; //
import BadgeCard from "./components/BadgeCard"; // Importar el nuevo componente
import { type BadgeApiResponseItem } from "@/app/api/badges/route"; //
import DashboardLayout from "../components/DashboardLayout";

export default function BadgesPage() {
    const [badges, setBadges] = useState<BadgeApiResponseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBadges = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/badges");
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error al obtener las insignias");
                }
                const data: BadgeApiResponseItem[] = await response.json();
                setBadges(data);
            } catch (err) {
                console.error("Error al cargar insignias:", err);
                setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
                setBadges([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBadges();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 m-5">
                <div className="mt-16 lg:mt-0 p-8 flex flex-col gap-3 text-white bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-2xl">
                    <h1 className="text-4xl font-bold tracking-tight flex flex-col md:flex-row items-center gap-3">
                        <Award className="h-10 w-10 animate-bounce" />
                        Galería de Insignias
                    </h1>
                    <p className="text-lg opacity-90 text-center md:text-start"> Descubre todas las insignias que puedes obtener y sigue contribuyendo al medio ambiente</p>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
                    </div>
                ) : error ? (
                    <Card className="bg-red-50 border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-700 flex items-center gap-2">
                                <ShieldAlert className="h-6 w-6" /> Error al Cargar Insignias
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-red-600">{error}</p>
                            <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
                                Reintentar
                            </Button>
                        </CardContent>
                    </Card>
                ) : badges.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {badges.map((badge) => (
                            <BadgeCard key={badge.id} badge={badge} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">No hay insignias disponibles por el momento.</p>
                            <p className="text-sm text-muted-foreground">Vuelve más tarde para ver nuevas insignias.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}