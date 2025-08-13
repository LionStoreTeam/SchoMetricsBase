"use client"

import { Bell, Megaphone } from 'lucide-react'
import SchometricsAnnoucementsCarousel from '../components/Announcements'
import DashboardLayout from '../components/DashboardLayout'
import ShowUserNotifications from '../components/UserNotifications'

export default function AvisosSchoMetrics() {
    return (
        <DashboardLayout>
            <div className='container flex flex-col mt-5'>
                <div className="mt-16 lg:mt-0 p-8 flex flex-col gap-3 text-white bg-gradient-to-br from-blue-700 to-blue-500 rounded-xl shadow-2xl">
                    <h1 className="text-3xl text-center font-bold tracking-tight flex flex-col md:flex-row items-center gap-3">
                        <Megaphone className="h-10 w-10 animate-bounce" />
                        Avisos y Notificaciones
                    </h1>
                    <p className="text-lg opacity-90 text-center md:text-start">Visualiza tus Notificaciones y los Avisos de SchoMetrics</p>
                </div>
                <div className="my-5 p-10 h-[500px] overflow-auto bg-white shadow-md rounded-xl border-2 border-green-100">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center justify-center gap-3 mb-4 md:flex-row">
                            <div className="p-3 bg-green-500 rounded-full">
                                <Bell className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                Mis Notificaciones
                            </h2>
                        </div>
                        <p className="text-lg text-slate-400">
                            Aquí se mostrarán tus notificaciones recibidas.
                        </p>
                    </div>
                    <ShowUserNotifications />
                </div>
                <div className="my-5 bg-white shadow-md rounded-xl border-2 border-blue-100">
                    <SchometricsAnnoucementsCarousel />
                </div>
            </div>
        </DashboardLayout>
    )
}
