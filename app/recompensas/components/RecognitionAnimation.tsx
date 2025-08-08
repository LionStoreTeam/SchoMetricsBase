"use client"

import { motion } from "framer-motion"
import { Award, Crown, Trophy } from "lucide-react"

export function RecognitionAnimation() {
    return (
        <div className="relative w-24 h-24 mx-auto">
            {/* Círculo de fondo dorado */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full"
            />

            {/* Premio principal */}
            <motion.div
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Award className="h-10 w-10 text-purple-600" />
            </motion.div>

            {/* Corona flotante */}
            <motion.div
                initial={{ opacity: 0, y: -30, rotate: -30 }}
                animate={{ opacity: 1, y: -10, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            >
                <Crown className="h-6 w-6 text-yellow-500" />
            </motion.div>

            {/* Trofeo flotante */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 -right-2 bg-purple-600 rounded-full p-1"
            >
                <Trophy className="h-4 w-4 text-white" />
            </motion.div>

            {/* Confeti */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: [0, -40, -80],
                        x: [0, (i % 2 === 0 ? 1 : -1) * Math.random() * 20],
                    }}
                    transition={{
                        delay: 0.8 + i * 0.1,
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                    }}
                    className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${i % 3 === 0 ? "bg-yellow-400" : i % 3 === 1 ? "bg-purple-400" : "bg-pink-400"
                        }`}
                />
            ))}

            {/* Brillo dorado */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ delay: 1, duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-purple-200 rounded-full opacity-20"
            />
        </div>
    )
}
