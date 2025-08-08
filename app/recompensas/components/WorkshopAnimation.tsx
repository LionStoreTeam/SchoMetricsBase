"use client"

import { motion } from "framer-motion"
import { Calendar, BookOpen, Users } from "lucide-react"

export function WorkshopAnimation() {
    return (
        <div className="relative w-24 h-24 mx-auto">
            {/* Círculo de fondo */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full"
            />

            {/* Calendario principal */}
            <motion.div
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Calendar className="h-10 w-10 text-amber-600" />
            </motion.div>

            {/* Libro flotante */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -top-3 -left-3 bg-amber-600 rounded-full p-1"
            >
                <BookOpen className="h-4 w-4 text-white" />
            </motion.div>

            {/* Usuarios flotante */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-3 -right-3 bg-amber-600 rounded-full p-1"
            >
                <Users className="h-4 w-4 text-white" />
            </motion.div>

            {/* Ondas de conocimiento */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: [0, 2, 3], opacity: [0.8, 0.3, 0] }}
                    transition={{
                        delay: 0.8 + i * 0.3,
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 1,
                    }}
                    className="absolute inset-0 border-2 border-amber-400 rounded-full"
                />
            ))}
        </div>
    )
}
