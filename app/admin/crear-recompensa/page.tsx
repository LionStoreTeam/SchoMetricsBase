"use client"

import { useState, useEffect } from "react"
import { Gift, Search, Filter, Tag, Award, Ticket, ShoppingBag, Calendar, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import Image from "next/legacy/image"
import GoToBackAdmin from "../components/GoToBackAdmin"
import Link from "next/link"
import { luckiestGuy } from "@/fonts/fonts"

interface Reward {
    id: string
    title: string
    description: string
    pointsCost: number
    available: boolean
    quantity?: number
    expiresAt?: string
    category: string
}

export default function RewardsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [rewards, setRewards] = useState<Reward[]>([])
    const [userPoints, setUserPoints] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("all")



    // Cargar datos del usuario y recompensas
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                // Obtener puntos del usuario desde la sesión
                const sessionRes = await fetch("/api/auth/session")
                const sessionData = await sessionRes.json()
                if (sessionData && sessionData.user) {
                    setUserPoints(sessionData.user.points || 0)
                }

                // Obtener recompensas disponibles
                const rewardsRes = await fetch("/api/admin/rewards")
                const rewardsData = await rewardsRes.json()
                if (rewardsData) {
                    setRewards(rewardsData)
                }

            } catch (error) {
                console.error("Error al cargar datos:", error)
                toast.error("No se pudieron cargar los datos. Intenta de nuevo más tarde")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Función para obtener el icono según la categoría
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "discount":
                return <Tag className="h-5 w-5 text-blue-600" />
            case "workshop":
                return <Calendar className="h-5 w-5 text-amber-600" />
            case "product":
                return <ShoppingBag className="h-5 w-5 text-green-600" />
            case "recognition":
                return <Award className="h-5 w-5 text-purple-600" />
            case "experience":
                return <Ticket className="h-5 w-5 text-pink-600" />
            default:
                return <Gift className="h-5 w-5 text-green-600" />
        }
    }

    // Función para formatear la fecha
    const formatDate = (dateString?: string) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(date)
    }

    // Filtrar recompensas
    const filteredRewards = rewards.filter((reward) => {
        const matchesSearch =
            reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reward.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter =
            filter === "all" ||
            (filter === "available" && reward.available) ||
            (filter === "affordable" && reward.pointsCost <= userPoints) ||
            reward.category === filter

        return matchesSearch && matchesFilter
    })



    return (
        <>
            <div className="flex flex-col gap-8 m-5">
                <div className="mt-16 lg:mt-0 p-5 flex flex-col md:flex-row md:justify-between md:items-center justify-center items-center gap-2 text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl">
                    <div className="">
                        <h1 className="text-3xl font-bold tracking-tight">Recompensas</h1>
                        <p className="text-amber-50">Crea nuevas Recompensas o actualiza las existentes</p>
                    </div>
                    <GoToBackAdmin />
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar recompensas..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filtrar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="available">Disponibles</SelectItem>
                                <SelectItem value="affordable">Puedo canjear</SelectItem>
                                <SelectItem value="discount">Descuentos</SelectItem>
                                <SelectItem value="workshop">Talleres</SelectItem>
                                <SelectItem value="product">Productos</SelectItem>
                                <SelectItem value="recognition">Reconocimientos</SelectItem>
                                <SelectItem value="experience">Experiencias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="w-full flex justify-center items-center">
                    <Link href="/admin/crear-recompensa/nueva" className="">
                        <Button className="bg-green-600 hover:bg-green-700 ">
                            <span className="font-bold text-amber-50">Crear Nueva Recompensa</span>
                        </Button>
                    </Link>
                </div>
                <Tabs defaultValue="available" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="available">Disponibles</TabsTrigger>
                        {/* Nueva pestaña para recompensas no disponibles */}
                        <TabsTrigger value="unavailable">No disponibles</TabsTrigger>
                    </TabsList>

                    {/* Recompensas Disponibles */}
                    <TabsContent value="available" className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : filteredRewards.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {filteredRewards.filter((reward) => reward.available).map((reward) => (
                                    <Card key={reward.id} className="flex flex-col">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/20">
                                                    {getCategoryIcon(reward.category)}
                                                </div>
                                                <CardTitle className="text-lg">{reward.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <p className="text-muted-foreground">{reward.description}</p>
                                            {reward.quantity && (
                                                <p className="text-sm mt-2">
                                                    <span className="text-muted-foreground">Disponibles:</span>{" "}
                                                    <span className="font-medium">{reward.quantity}</span>
                                                </p>
                                            )}
                                            {reward.expiresAt && (
                                                <p className="text-sm mt-2">
                                                    <span className="text-muted-foreground">Válido hasta:</span>{" "}
                                                    <span className="font-medium">{formatDate(reward.expiresAt)}</span>
                                                </p>
                                            )}
                                        </CardContent>
                                        <CardFooter className="flex flex-col justify-center items-center gap-5 border-t pt-4 sm:flex-row md:justify-between">
                                            <div className="font-bold text-green-600 flex gap-2 items-center justify-center">
                                                <Image src="/eco_points_logo.png" alt="eco_points_logo" width={30} height={30} priority />
                                                <p>EcoPoints:</p>
                                                <span className={`${luckiestGuy.className} text-[20px]`}>
                                                    {reward.pointsCost}
                                                </span>
                                            </div>
                                            <Link href={`/admin/crear-recompensa/editar/${reward.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4 mr-1.5" /> Ver más
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <h3 className="text-lg font-medium">No se encontraron recompensas</h3>
                                <p className="text-muted-foreground mt-1">Intenta cambiar los filtros o vuelve más tarde</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Recompensas No Disponibles */}
                    <TabsContent value="unavailable" className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : (
                            // Filtrar las recompensas no disponibles
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                                {rewards
                                    .filter((reward) => !reward.available) // Solo recompensas no disponibles
                                    .map((reward) => (
                                        <Card key={reward.id} className="flex flex-col bg-slate-300 text-slate-500">
                                            <CardHeader>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-400">
                                                        {getCategoryIcon(reward.category)}
                                                    </div>
                                                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1">
                                                <p className="text-slate-400">{reward.description}</p>
                                                <p className="text-sm mt-2">
                                                    <span className="text-slate-400">Disponibles:</span>{" "}
                                                    <span className="font-bold text-slate-600">{reward.quantity}</span>
                                                </p>
                                                {reward.expiresAt && (
                                                    <p className="text-sm mt-2">
                                                        <span className="text-slate-100">Válido hasta:</span>{" "}
                                                        <span className="font-medium">{formatDate(reward.expiresAt)}</span>
                                                    </p>
                                                )}
                                            </CardContent>
                                            <CardFooter className="flex flex-col justify-center items-center gap-5 border-t pt-4 sm:flex-row md:justify-between">
                                                <div className="font-bold text-red-600 flex gap-2 items-center justify-center">
                                                    <Image src="/eco_points_logo.png" alt="eco_points_logo" width={45} height={40} priority className="grayscale" />
                                                    <p className="text-slate-500">EcoPoints:</p>
                                                    <span className={`${luckiestGuy.className} text-[20px] text-slate-500`}>
                                                        {reward.pointsCost}
                                                    </span>
                                                </div>
                                                <Link href={`/admin/crear-recompensa/editar/${reward.id}`}>
                                                    <Button variant="outline" size="sm" className="bg-slate-400 text-white hover:bg-slate-500 hover:text-white">
                                                        <Edit className="h-4 w-4 mr-1.5" /> Ver más
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
