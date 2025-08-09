"use client"

import type React from "react"; // Necesario para Suspense
import Link from "next/link";
import LoginForm from "./login-form"; // Importa el nuevo componente cliente
import { Suspense } from "react"; // Importa Suspense
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";

// Un componente simple para el fallback de Suspense
function LoginFormSkeleton() {
    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md animate-pulse">
            <div className="space-y-2 text-center">
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-full mx-auto"></div>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
                <div className="h-8 bg-green-300 rounded w-full mt-6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mt-4"></div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="bg-gradient-to-br from-teal-100 via-white to-green-100">
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative min-h-screen flex flex-col items-center justify-center"
            >
                <div className="">
                    <div className="px-4">
                        {/* Envuelve el componente que usa useSearchParams con Suspense */}
                        <Suspense fallback={<LoginFormSkeleton />}>
                            <LoginForm />
                        </Suspense>

                        <footer className="bottom-0 text-center text-xs text-gray-500 w-full px-4 mt-10">
                            © {new Date().getFullYear()} SchoMetrics. Todos los derechos reservados.
                            <div className="mt-1">
                                <Link href="/terminos" className="hover:underline">Términos</Link> | <Link href="/privacidad" className="hover:underline">Privacidad</Link>
                            </div>
                        </footer>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
