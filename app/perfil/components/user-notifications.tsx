import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bell, CheckCircle, Loader2, MailOpen, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format, formatDistanceToNow } from "date-fns"; // Import formatDistanceToNow
import { es } from "date-fns/locale"; // Import es locale



// Definición para Notificaciones (puedes moverla a types/types.ts)
interface NotificationItem {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string; // ISO string
}
interface NotificationsApiResponse {
    notifications: NotificationItem[];
    unreadCount: number;
}

const ShowUserNotifications = () => {
    // Estados para notificaciones
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("info"); // Para manejar la pestaña activa


    const fetchNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
            const response = await fetch("/api/notifications");
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al obtener notificaciones");
            }
            const data: NotificationsApiResponse = await response.json();
            setNotifications(data.notifications);
            setUnreadNotificationsCount(data.unreadCount);
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
            toast.error("No se pudieron cargar tus notificaciones.");
        } finally {
            setIsLoadingNotifications(false);
        }
    };


    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            await Promise.all([fetchNotifications()]);
            setIsLoading(false);
        };
        loadInitialData();
    }, []);

    // Efecto para manejar el anclaje a la pestaña de notificaciones
    useEffect(() => {
        if (typeof window !== "undefined" && window.location.hash === "#notifications_tab") {
            setActiveTab("notifications");
        }
    }, []);


    const markNotificationAsRead = async (notificationId: string, currentIsRead: boolean) => {
        if (currentIsRead) return;

        const previousNotifications = [...notifications];
        const previousUnreadCount = unreadNotificationsCount;

        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        setUnreadNotificationsCount(prev => Math.max(0, prev - 1));

        try {
            const response = await fetch(`/api/notifications/${notificationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: true }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                setNotifications(previousNotifications);
                setUnreadNotificationsCount(previousUnreadCount);
                throw new Error(errorData.error || "Error al marcar notificación como leída");
            }
            // toast.success("Notificación marcada como leída."); // Opcional
        } catch (error) {
            console.error("Error marcando notificación como leída:", error);
            setNotifications(previousNotifications);
            setUnreadNotificationsCount(previousUnreadCount);
            toast.error(error instanceof Error ? error.message : "No se pudo actualizar la notificación.");
        }
    };

    const formatDate = (dateString: string | undefined, includeTime = true) => {
        if (!dateString) return "Fecha no disponible";
        const date = new Date(dateString);
        if (includeTime) {
            return format(date, "dd MMM, yyyy 'a las' HH:mm", { locale: es });
        }
        return format(date, "dd MMM, yyyy", { locale: es });
    };

    const formatRelativeDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
        } catch (e) {
            console.warn("Error formatting relative date:", e);
            return "hace un momento"; // Fallback
        }
    };

    return (
        <div className="">
            {/* Sección de Notificaciones */}
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 -mr-2"> {/* Ajustado max-h y padding */}

                {isLoadingNotifications ? (
                    <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10">
                        <Bell className="mx-auto h-12 w-12 mb-3" />
                        <p className="font-medium">No tienes notificaciones.</p>
                        <p className="text-sm">Cuando recibas mensajes del administrador, aparecerán aquí.</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <Card key={notif.id} className={cn("shadow-sm hover:shadow-md transition-shadow", !notif.isRead && "bg-green-50 border-green-200")}>
                            <CardHeader className="p-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <CardTitle className={cn("text-sm font-semibold leading-tight flex items-center gap-1.5", !notif.isRead ? "text-green-700" : "text-gray-800")}>
                                            {!notif.isRead ? <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                                            {notif.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs mt-0.5 pl-6"> {/* Alineado con el título */}
                                            {formatRelativeDate(notif.createdAt)} ({formatDate(notif.createdAt)})
                                        </CardDescription>
                                    </div>
                                    {!notif.isRead && (
                                        <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs text-green-600 hover:bg-green-100" onClick={() => markNotificationAsRead(notif.id, notif.isRead)}>
                                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Marcar leída
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="px-3 pb-3 pt-1">
                                <p>Contenido del mensaje: </p>
                                <p className="text-green-600 whitespace-pre-wrap pl-6">{notif.message}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

export default ShowUserNotifications;