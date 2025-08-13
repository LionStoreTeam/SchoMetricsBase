// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import { Bell, CheckCircle, Loader2, MailOpen, MessageCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { format, formatDistanceToNow } from "date-fns"; // Import formatDistanceToNow
// import { es } from "date-fns/locale"; // Import es locale



// // Definición para Notificaciones (puedes moverla a types/types.ts)
// interface NotificationItem {
//     id: string;
//     title: string;
//     message: string;
//     isRead: boolean;
//     createdAt: string; // ISO string
// }
// interface NotificationsApiResponse {
//     notifications: NotificationItem[];
//     unreadCount: number;
// }

// const ShowUserNotifications = () => {
//     // Estados para notificaciones
//     const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//     const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
//     const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState("info"); // Para manejar la pestaña activa


//     const fetchNotifications = async () => {
//         setIsLoadingNotifications(true);
//         try {
//             const response = await fetch("/api/notifications");
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || "Error al obtener notificaciones");
//             }
//             const data: NotificationsApiResponse = await response.json();
//             setNotifications(data.notifications);
//             setUnreadNotificationsCount(data.unreadCount);
//         } catch (error) {
//             console.error("Error cargando notificaciones:", error);
//             toast.error("No se pudieron cargar tus notificaciones.");
//         } finally {
//             setIsLoadingNotifications(false);
//         }
//     };


//     useEffect(() => {
//         const loadInitialData = async () => {
//             setIsLoading(true);
//             await Promise.all([fetchNotifications()]);
//             setIsLoading(false);
//         };
//         loadInitialData();
//     }, []);

//     // Efecto para manejar el anclaje a la pestaña de notificaciones
//     useEffect(() => {
//         if (typeof window !== "undefined" && window.location.hash === "#notifications_tab") {
//             setActiveTab("notifications");
//         }
//     }, []);


//     const markNotificationAsRead = async (notificationId: string, currentIsRead: boolean) => {
//         if (currentIsRead) return;

//         const previousNotifications = [...notifications];
//         const previousUnreadCount = unreadNotificationsCount;

//         setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
//         setUnreadNotificationsCount(prev => Math.max(0, prev - 1));

//         try {
//             const response = await fetch(`/api/notifications/${notificationId}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ isRead: true }),
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 setNotifications(previousNotifications);
//                 setUnreadNotificationsCount(previousUnreadCount);
//                 throw new Error(errorData.error || "Error al marcar notificación como leída");
//             }
//             // toast.success("Notificación marcada como leída."); // Opcional
//         } catch (error) {
//             console.error("Error marcando notificación como leída:", error);
//             setNotifications(previousNotifications);
//             setUnreadNotificationsCount(previousUnreadCount);
//             toast.error(error instanceof Error ? error.message : "No se pudo actualizar la notificación.");
//         }
//     };

//     const formatDate = (dateString: string | undefined, includeTime = true) => {
//         if (!dateString) return "Fecha no disponible";
//         const date = new Date(dateString);
//         if (includeTime) {
//             return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es });
//         }
//         return format(date, "dd MMM, yyyy", { locale: es });
//     };

//     const formatRelativeDate = (dateString: string | undefined) => {
//         if (!dateString) return "";
//         try {
//             return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
//         } catch (e) {
//             console.warn("Error formatting relative date:", e);
//             return "hace un momento"; // Fallback
//         }
//     };

//     return (
//         <div className="">
//             {/* Sección de Notificaciones */}
//             <div className="space-y-3 overflow-y-auto pr-2 -mr-2"> {/* Ajustado max-h y padding */}

//                 {isLoadingNotifications ? (
//                     <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
//                 ) : notifications.length === 0 ? (
//                     <div className="text-center py-10">
//                         <Bell className="mx-auto h-12 w-12 mb-3" />
//                         <p className="font-medium">No tienes notificaciones.</p>
//                         <p className="text-sm">Cuando recibas mensajes del administrador, aparecerán aquí.</p>
//                     </div>
//                 ) : (
//                     notifications.map(notif => (
//                         <Card key={notif.id} className={cn("shadow-sm hover:shadow-md transition-shadow", !notif.isRead && "bg-green-50 border-green-200")}>
//                             <CardHeader className="p-3">
//                                 <div className="flex flex-col justify-center items-center gap-2">
//                                     {!notif.isRead && (
//                                         <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs text-green-600 hover:bg-green-100" onClick={() => markNotificationAsRead(notif.id, notif.isRead)}>
//                                             <CheckCircle className="mr-1 h-3.5 w-3.5" /> Marcar leída
//                                         </Button>
//                                     )}
//                                     <div className="flex-1">
//                                         <CardTitle className={cn("text-sm font-semibold leading-tight flex items-center gap-1.5", !notif.isRead ? "text-green-700" : "text-gray-800")}>
//                                             {!notif.isRead ? <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
//                                             {notif.title}
//                                         </CardTitle>
//                                         <CardDescription className="text-xs mt-0.5 pl-6"> {/* Alineado con el título */}
//                                             {formatRelativeDate(notif.createdAt)} ({formatDate(notif.createdAt)})
//                                         </CardDescription>
//                                     </div>

//                                 </div>
//                             </CardHeader>
//                             <CardContent className="px-3 pb-3 pt-1">
//                                 <p>Contenido del mensaje: </p>
//                                 <p className="text-green-600 whitespace-pre-wrap pl-6">{notif.message}</p>
//                             </CardContent>
//                         </Card>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ShowUserNotifications;




"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Bell, CheckCircle, Loader2, MailOpen, MessageCircle, Clock, MessageCircleWarningIcon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

// Definición para Notificaciones
interface NotificationItem {
    id: string
    title: string
    message: string
    isRead: boolean
    createdAt: string // ISO string
}

interface NotificationsApiResponse {
    notifications: NotificationItem[]
    unreadCount: number
}

const ShowUserNotifications = () => {
    // Estados para notificaciones
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("info")

    const fetchNotifications = async () => {
        setIsLoadingNotifications(true)
        try {
            const response = await fetch("/api/notifications")
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Error al obtener notificaciones")
            }
            const data: NotificationsApiResponse = await response.json()
            setNotifications(data.notifications)
            setUnreadNotificationsCount(data.unreadCount)
        } catch (error) {
            console.error("Error cargando notificaciones:", error)
            toast.error("No se pudieron cargar tus notificaciones.")
        } finally {
            setIsLoadingNotifications(false)
        }
    }

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true)
            await Promise.all([fetchNotifications()])
            setIsLoading(false)
        }
        loadInitialData()
    }, [])

    // Efecto para manejar el anclaje a la pestaña de notificaciones
    useEffect(() => {
        if (typeof window !== "undefined" && window.location.hash === "#notifications_tab") {
            setActiveTab("notifications")
        }
    }, [])

    const markNotificationAsRead = async (notificationId: string, currentIsRead: boolean) => {
        if (currentIsRead) return

        const previousNotifications = [...notifications]
        const previousUnreadCount = unreadNotificationsCount

        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1))

        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true }),
            })
            if (!response.ok) {
                const errorData = await response.json()
                setNotifications(previousNotifications)
                setUnreadNotificationsCount(previousUnreadCount)
                throw new Error(errorData.error || "Error al marcar notificación como leída")
            }
        } catch (error) {
            console.error("Error marcando notificación como leída:", error)
            setNotifications(previousNotifications)
            setUnreadNotificationsCount(previousUnreadCount)
            toast.error(error instanceof Error ? error.message : "No se pudo actualizar la notificación.")
        }
    }

    const formatDate = (dateString: string | undefined, includeTime = true) => {
        if (!dateString) return "Fecha no disponible"
        const date = new Date(dateString)
        if (includeTime) {
            return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es })
        }
        return format(date, "dd MMM, yyyy", { locale: es })
    }

    const formatRelativeDate = (dateString: string | undefined) => {
        if (!dateString) return ""
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es })
        } catch (e) {
            console.warn("Error formatting relative date:", e)
            return "hace un momento"
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            {/* Header con contador de notificaciones */}
            <div className="mb-8 bg-gradient-to-br from-blue-700 to-violet-800 p-2 px-5 rounded-md w-full text-center md:rounded-full md:text-left sm:w-max">
                <div className="pt-2 flex items-center justify-between mb-2">
                    <div className="flex flex-col justify-center items-center gap-3 md:flex-row md:items-start">
                        <div className="relative">
                            <Bell className="h-7 w-7 text-purple-200" />
                            {unreadNotificationsCount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="pl-2 text-md text-purple-50">
                                {unreadNotificationsCount > 0
                                    ? `Tienes ${unreadNotificationsCount} notificación${unreadNotificationsCount > 1 ? "es" : ""} sin leer`
                                    : "Todas las notificaciones están al día"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Notificaciones */}
            <div className="space-y-4">
                {isLoadingNotifications ? (
                    <div className="flex flex-col justify-center items-center py-16 space-y-4">
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-600/20"></div>
                        </div>
                        <p className="text-muted-foreground animate-pulse">Cargando notificaciones...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="relative mx-auto w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                            <Bell className="absolute inset-0 m-auto h-12 w-12 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-800">No tienes notificaciones</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Cuando recibas mensajes del administrador, aparecerán aquí con un diseño hermoso y fácil de leer.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {notifications.map((notif, index) => (
                            <Card
                                key={notif.id}
                                className={cn(
                                    "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                                    "border-l-4 animate-in slide-in-from-left-5 fade-in-0",
                                    !notif.isRead
                                        ? "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-blue-500 shadow-lg shadow-blue-100/50"
                                        : "bg-gradient-to-r from-gray-50 to-slate-50 border-l-gray-300 hover:shadow-md",
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Efecto de brillo para notificaciones no leídas */}
                                {!notif.isRead && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                                )}

                                <CardHeader className="pb-3">
                                    <div className="flex flex-col items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div
                                                className={cn(
                                                    "flex-shrink-0 p-2 rounded-full transition-all duration-300",
                                                    !notif.isRead
                                                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                                        : "bg-gray-200 text-gray-600",
                                                )}
                                            >
                                                {!notif.isRead ? <MessageCircle className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <CardTitle
                                                    className={cn(
                                                        "text-base sm:text-lg font-semibold leading-tight mb-1 transition-colors duration-300",
                                                        !notif.isRead ? "text-gray-900" : "text-gray-700",
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {notif.title}
                                                        {!notif.isRead && <MessageCircleWarningIcon className="h-4 w-4 text-green-500 animate-bounce" />}
                                                    </div>
                                                </CardTitle>

                                                <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                                    <span className="font-medium">{formatRelativeDate(notif.createdAt)}</span>
                                                    <span className="hidden sm:inline text-muted-foreground">
                                                        • {formatDate(notif.createdAt)}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                        </div>

                                        {!notif.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "z-50 flex-shrink-0 h-8 px-3 text-xs font-medium transition-all duration-300",
                                                    "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600",
                                                    "shadow-md hover:shadow-lg hover:scale-105 hover:text-white",
                                                )}
                                                onClick={() => markNotificationAsRead(notif.id, notif.isRead)}
                                            >
                                                <CheckCircle className="mr-1.5 h-3.5 w-3.5 animate-heartbeat" />
                                                Marcar leída
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div
                                        className={cn(
                                            "rounded-lg p-4 transition-all duration-300",
                                            !notif.isRead ? "bg-white/70 border border-blue-100" : "bg-white/50 border border-gray-200",
                                        )}
                                    >
                                        <p className="text-sm text-muted-foreground mb-2 font-medium">Contenido del mensaje:</p>
                                        <p
                                            className={cn(
                                                "whitespace-pre-wrap leading-relaxed transition-colors duration-300 flex overflow-auto z-500",
                                                !notif.isRead ? "text-gray-800 font-medium" : "text-gray-600",
                                            )}
                                        >
                                            {notif.message}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShowUserNotifications
