import { ActivityForAdmin } from "@/types/types";
import { Film, ImageOff, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { ZoomableImage } from "./ZoomableImage";
import { Button } from "@/components/ui/button";



export const EvidenceThumbnailsAdmin = ({ evidence }: { evidence: ActivityForAdmin["evidence"] }) => {
    const [showAll, setShowAll] = useState(false);
    // Asegurarse de que 'evidence' sea un array antes de usar slice o length
    const validEvidence = Array.isArray(evidence) ? evidence : [];
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'gif' | null>(null);
    const visibleEvidence = showAll ? validEvidence : validEvidence.slice(0, 3);


    const handleMediaClick = (url: string, type: 'image' | 'video' | 'gif') => {
        setSelectedMedia(url);
        setMediaType(type);
    };

    const handleCloseModal = () => {
        setSelectedMedia(null);
        setMediaType(null);
    };

    if (validEvidence.length === 0) {
        return <p className="text-xs text-muted-foreground mt-2">Sin evidencia adjunta.</p>;
    }

    return (
        <div className="mt-2">
            <div className="relative flex gap-2 items-center">
                {visibleEvidence.map((ev) => (
                    <motion.div
                        key={ev.id}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-16 h-16 rounded-md overflow-hidden shadow-sm cursor-pointer bg-gray-100"
                        onClick={() => {
                            if (ev.fileType === "image" && ev.publicDisplayUrl) {
                                handleMediaClick(ev.publicDisplayUrl, 'image');
                            } else if (ev.fileType === "video" && ev.publicDisplayUrl) {
                                handleMediaClick(ev.publicDisplayUrl, 'video');
                            } else if (ev.fileType === "gif" && ev.publicDisplayUrl) {
                                handleMediaClick(ev.publicDisplayUrl, 'gif');
                            } else {
                                // Manejar otros tipos si es necesario
                            }
                        }}
                    >
                        {ev.publicDisplayUrl ? (
                            ev.fileType === "image" ? (
                                <Image
                                    src={ev.publicDisplayUrl}
                                    alt={ev.fileName || "Evidencia"}
                                    layout="fill"
                                    objectFit="cover" // cover puede ser mejor para miniaturas
                                    priority={false} // No todas necesitan ser priority
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/placeholder.svg"; // Placeholder genérico
                                        target.alt = "Error al cargar imagen";
                                    }}
                                />
                            ) : ev.fileType === "video" ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                                    <Film className="h-16 w-16 text-blue-400 opacity-70" />
                                </div>
                            ) : ev.fileType === "gif" ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                                    <Film className="h-16 w-16 text-blue-400 opacity-70" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100">
                                    <Film className="h-16 w-16 text-blue-400 opacity-70" />
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center bg-gray-200 text-gray-500 h-full w-full p-1 text-center">
                                <ImageOff className="h-6 w-6 mb-0.5" />
                                <span className="text-xs">No disponible</span>
                            </div>
                        )}
                    </motion.div>
                ))}
                {validEvidence.length > 3 && !showAll && (
                    <button onClick={() => setShowAll(true)} className="text-xs text-blue-500 hover:underline self-end">
                        Ver más ({validEvidence.length - 3})
                    </button>
                )}
                {validEvidence.length > 3 && showAll && (
                    <button onClick={() => setShowAll(false)} className="text-xs text-blue-500 hover:underline self-end">
                        Ver menos
                    </button>
                )}

                {/* Modal para imagen, video o gif */}
                {(selectedMedia && mediaType) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full bg-black/80 z-[100] flex items-center justify-center cursor-pointer p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="relative max-w-full max-h-full flex justify-center items-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {mediaType === "image" && (
                                <ZoomableImage src={selectedMedia} alt="Evidencia ampliada" />
                            )}
                            {mediaType === "video" && (
                                <video
                                    src={selectedMedia}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-full object-contain rounded-md"
                                />
                            )}
                            {mediaType === "gif" && (
                                <img
                                    src={selectedMedia}
                                    alt="GIF"
                                    className="max-w-full max-h-full object-contain rounded-md"
                                />
                            )}
                        </motion.div>
                        <Button
                            variant="outline"
                            onClick={
                                handleCloseModal
                            }
                            className="absolute top-0 mt-3 bg-teal-400 text-white border-none"
                        >
                            <X className="h-5 w-5 font-bold" />
                            Cerrar
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};