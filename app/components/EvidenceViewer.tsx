"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "motion/react"

interface Evidence {
    id: string
    fileUrl: string
    fileType: string
    fileName: string
    format: string
}

interface EvidenceViewerProps {
    evidence: Evidence[]
}

export default function EvidenceViewer({ evidence }: EvidenceViewerProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean[]>(evidence.map(() => true))

    const handleImageLoad = (index: number) => {
        setLoading((prev) => {
            const newLoading = [...prev]
            newLoading[index] = false
            return newLoading
        })
    }

    const openModal = (index: number) => {
        setSelectedIndex(index)
    }

    const closeModal = () => {
        setSelectedIndex(null)
    }

    if (evidence.length === 0) {
        return <div className="text-gray-500 text-sm">No hay evidencias disponibles</div>
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {evidence.map((item, index) => (
                    <div
                        key={item.id}
                        className="relative border rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => openModal(index)}
                    >
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                            {loading[index] && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                </div>
                            )}

                            {item.fileType === "image" || item.format === "gif" ? (
                                <img
                                    src={item.fileUrl || "/placeholder.svg"}
                                    alt={`Evidencia ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onLoad={() => handleImageLoad(index)}
                                    onError={() => handleImageLoad(index)}
                                />
                            ) : item.fileType === "video" ? (
                                <video
                                    src={item.fileUrl}
                                    className="w-full h-full object-cover"
                                    onLoadedData={() => handleImageLoad(index)}
                                    onError={() => handleImageLoad(index)}
                                />
                            ) : (
                                <div className="text-gray-500 text-sm">Archivo no compatible</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para vista ampliada */}
            {selectedIndex !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 w-full h-full bg-black/80 z-[100] flex items-center justify-center cursor-pointer p-4" // Aumentado z-index
                    onClick={closeModal}
                >
                    <motion.img
                        src={evidence[selectedIndex].fileUrl || "/placeholder.svg"}
                        alt="Evidencia ampliada"
                        className="max-w-full max-h-full object-contain rounded-md"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()} // Evitar que el clic en la imagen cierre el modal
                    />
                </motion.div>
            )}
        </div>
    )
}
