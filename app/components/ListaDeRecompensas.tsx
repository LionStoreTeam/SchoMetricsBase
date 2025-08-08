import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tag, Calendar, ShoppingBag, Award, Ticket, Gift, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Redemption {
    id: string
    rewardId: string
    userId: string
    createdAt: string
    redeemedAt: string;
    rewardTitle: string
    rewardDesc: string
    rewardPoints: number
    rewardQuantity: number
    rewardExpiresAt: Date
    rewardCategory: string
}

interface RedeemedRewardsProps {
    userId: string
}


const ListaDeRecompensas: React.FC<RedeemedRewardsProps> = ({ userId }) => {
    const [redeemedRewards, setRedeemedRewards] = useState<Redemption[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();



    const fetchRedeemedRewards = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/rewards/redeemed/${userId}`)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cargar recompensas canjeadas");
            }
            const data: Redemption[] = await response.json();
            setRedeemedRewards(data);
            // console.log("Recompensas canjeadas cargadas:", data);
        } catch (error) {
            console.error("Error al cargar recompensas canjeadas:", error);
            setError(error instanceof Error ? error.message : "Ocurrió un error desconocido.");
        } finally {
            setIsLoading(false);
        }
    }, [userId])

    useEffect(() => {
        fetchRedeemedRewards();
    }, [fetchRedeemedRewards]);

    const formatDate = (dateString: string | undefined, includeTime = true) => {
        if (!dateString) return "Fecha no disponible";
        const date = new Date(dateString);
        if (includeTime) {
            return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es });
        }
        return format(date, "dd MMM, yyyy", { locale: es });
    };

    // Función para obtener el icono según la categoría
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "DISCOUNT":
                return <Tag className="h-5 w-5 text-blue-600" />
            case "WORKSHOP":
                return <Calendar className="h-5 w-5 text-amber-600" />
            case "PRODUCT":
                return <ShoppingBag className="h-5 w-5 text-green-600" />
            case "RECOGNITION":
                return <Award className="h-5 w-5 text-purple-600" />
            case "EXPERIENCE":
                return <Ticket className="h-5 w-5 text-pink-600" />
            default:
                return <Gift className="h-5 w-5 text-green-600" />
        }
    }

    const REWARD_CATEGORY_MAP: { [category: string]: string } = {
        DISCOUNT: "DESCUENTO",
        WORKSHOP: "TALLER",
        PRODUCT: "PRODUCTO",
        RECOGNITION: "RECONOCIMIENTO",
        EXPERIENCE: "EXPERIENCIA",
        OTHER: "OTRO",
    };

    return (
        <div className="">
            {/* Sección de Recompensas Canjeadas */}
            <div className="flex flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 pt-5">
                    <Gift className="h-6 w-6 text-amber-400" />
                    <span className="mb-5 text-sm font-medium text-gray-500">Recompensas Canjeadas:</span>
                </div>
                {/*  */}
                <Card className="p-2 w-full">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            <p>{error}</p>
                            <Button onClick={() => router.push(`/validez/${userId}`)} variant="outline" className="mt-4">Reintentar</Button>
                        </div>
                    ) : redeemedRewards.length > 0 ? (
                        <>
                            <div className="w-full p-4 h-[400px] overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center text-teal-600 font-bold">Fecha de Canje</TableHead>
                                            <TableHead className="text-center text-teal-600 font-bold">Recompensa</TableHead>
                                            <TableHead className="text-center text-teal-600 font-bold">Costo en EcoPoints</TableHead>
                                            <TableHead className="text-center text-teal-600 font-bold">Descripción</TableHead>
                                            <TableHead className="text-center text-teal-600 font-bold">Tipo de Recompensa</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {redeemedRewards.map((redemption) => (
                                            <TableRow key={redemption.id}>
                                                <TableCell className="w-[100px] text-gray-500 font-bold text-center">
                                                    {format(new Date(redemption.redeemedAt), "dd MMM, yyyy", { locale: es })}
                                                </TableCell>
                                                <TableCell className="font-bold text-amber-500 flex gap-4 items-center text-center justify-start">
                                                    <p title={`Recompensa de tipo: ${REWARD_CATEGORY_MAP[redemption.rewardCategory] || redemption.rewardCategory}`}>
                                                        {getCategoryIcon(redemption.rewardCategory)}
                                                    </p>
                                                    {redemption.rewardTitle}
                                                </TableCell>
                                                <TableCell className="text-xl text-center font-bold text-[#17d627]">{redemption.rewardPoints}</TableCell>
                                                <TableCell className="text-start font-semibold text-gray-400">{redemption.rewardDesc}</TableCell>
                                                <TableCell className="text-center font-semibold text-gray-400">
                                                    {REWARD_CATEGORY_MAP[redemption.rewardCategory] || redemption.rewardCategory}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-3xl font-bold text-gray-400">No hay recompensas canjeadas.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default ListaDeRecompensas;