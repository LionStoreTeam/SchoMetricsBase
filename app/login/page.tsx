"use client"

import type React from "react"; // Necesario para Suspense
import Link from "next/link";
import LoginForm from "./login-form"; // Importa el nuevo componente cliente
import { motion } from "motion/react";

export default function LoginPage() {
    return (
        <div className="min-h-screen py-10 bg-gradient-to-br from-teal-100 via-white to-green-100">
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
                        <LoginForm />
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
