"use client"

import { ArrowLeftCircleIcon, Leaf } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
interface LoginButtonProps {
    href: string
}

const LoginButton = ({ href }: LoginButtonProps) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null)

    return (
        <Link
            href={href}
            onMouseEnter={() => setHoveredButton("premium")}
            onMouseLeave={() => setHoveredButton(null)}
            title="Iniciar Sesión en SchoMetrics"
        >
            <button className="group relative w-full bg-white shadow-sm shadow-teal-100 border-t-4 border-t-emerald-100 font-semibold py-4 px-8 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:rotate-1 hover:shadow-emerald-300">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                        className="absolute top-2 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                        className="absolute top-6 right-8 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                        className="absolute bottom-4 left-8 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                    ></div>
                    <div
                        className="absolute bottom-2 right-4 w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.6s" }}
                    ></div>
                </div>
                <div className="relative flex items-center justify-center gap-3">
                    <Leaf className="w-5 h-5  text-teal-500 group-hover:animate-spin transition-transform duration-500" />
                    <span className="text-teal-500">Iniciar Sesión</span>
                    <ArrowLeftCircleIcon className="w-5 h-5  text-teal-500 group-hover:rotate-180 transition-transform duration-500" />
                </div>
            </button>
        </Link>
    )
}

export default LoginButton
