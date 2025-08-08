"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { DefaultAnimation } from "./DefaultAnimation"
import { DiscountAnimation } from "./DiscountAnimation"
import { ExperienceAnimation } from "./ExperienceAnimation"
import { ProductAnimation } from "./ProductAnimation"
import { RecognitionAnimation } from "./RecognitionAnimation"
import { WorkshopAnimation } from "./WorkshopAnimation"
import Image from "next/image"
import { luckiestGuy } from "@/fonts/fonts"

interface RewardAnimationProps {
    isVisible: boolean
    category: string
    rewardTitle: string
    pointsCost: number
    onClose: () => void
}

export function RewardAnimation({ isVisible, category, rewardTitle, pointsCost, onClose }: RewardAnimationProps) {
    const [showAnimation, setShowAnimation] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setShowAnimation(true)
            // Auto cerrar después de 4 segundos
            const timer = setTimeout(() => {
                onClose()
            }, 9000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    const renderCategoryAnimation = () => {
        switch (category.toLowerCase()) {
            case "discount":
                return <DiscountAnimation />
            case "workshop":
                return <WorkshopAnimation />
            case "product":
                return <ProductAnimation />
            case "recognition":
                return <RecognitionAnimation />
            case "experience":
                return <ExperienceAnimation />
            default:
                return <DefaultAnimation />
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Animación de categoría */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6">{renderCategoryAnimation()}</div>

                            {/* Título de éxito */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-green-600 mb-2"
                            >
                                ¡Recompensa Canjeada!
                            </motion.h2>

                            {/* Nombre de la recompensa */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg font-semibold mb-2"
                            >
                                {rewardTitle}
                            </motion.p>

                            {/* Puntos gastados */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-2 text-amber-600"
                            >
                                <div className="font-medium flex gap-2 items-center text-green-600">
                                    <Image src="/eco_points_logo.png" alt="eco_points_logo" width={30} height={30} priority />
                                    <p>EcoPoints Gastados:</p>
                                    <span className={`${luckiestGuy.className} text-[20px]`}>
                                        {pointsCost}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Mensaje adicional */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-sm text-gray-600 dark:text-gray-400 mt-4"
                            >
                                ¡Sigue acumulando puntos para más recompensas!
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
