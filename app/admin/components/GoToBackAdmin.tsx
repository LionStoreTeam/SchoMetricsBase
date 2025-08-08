import { Button } from '@/components/ui/button';
import { DoorOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

export default function GoToBackAdmin() {
    const router = useRouter();
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
        <div className="w-min bg-slate-100 flex flex-col justify-center items-center gap-4 rounded-md p-3 lg:flex-row lg:items-center">
            <Link href="/admin">
                <Button
                    className="p-2 bg-sky-600 mt-5 md:mt-0 hover:bg-sky-700"
                >
                    Volver a Inicio
                </Button>
            </Link>
            <Button
                className="p-2 bg-red-600 mt-5 md:mt-0 hover:bg-red-700"
                onClick={handleLogout}
            >
                <DoorOpen className="h-7 w-7" />
                Cerrar Sesión
            </Button>
        </div>
    )
}
