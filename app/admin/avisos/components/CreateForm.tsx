// app/ui/announcements/CreateForm.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Megaphone, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnnouncementTopic } from '@prisma/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import z from 'zod';

// Esquema de validación Zod para el frontend
const announcementFormSchema = z.object({
    title: z.string().max(100, "Máximo 100 caracteres."),
    content: z.string().max(2000, "Máximo 2000 caracteres."),
    topic: z.nativeEnum(AnnouncementTopic, { errorMap: () => ({ message: "Selecciona un tema válido." }) }),
});


type AnnouncementFormData = z.infer<typeof announcementFormSchema>;
type AnnouncementFormErrors = Partial<Record<keyof AnnouncementFormData, string>>;

export function CreateAnnouncementForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: "",
        content: "",
        topic: AnnouncementTopic.AVISO_GENERAL, // Valor por defecto
    });
    const [errors, setErrors] = useState<AnnouncementFormErrors>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof AnnouncementFormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleTopicChange = (value: string) => {
        setFormData(prev => ({ ...prev, topic: value as AnnouncementTopic }));
        if (errors.topic) {
            setErrors(prev => ({ ...prev, topic: undefined }));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const dataToValidate: AnnouncementFormData = {
            ...formData,
            title: "", // URL de S3 o la manual
            content: "", // Asegurar null si está vacío
            topic: AnnouncementTopic.AVISO_GENERAL, // Valor por defecto
        };

        const validationResult = announcementFormSchema.safeParse(dataToValidate);

        if (!validationResult.success) {
            const newErrors: AnnouncementFormErrors = {};
            validationResult.error.errors.forEach(err => {
                newErrors[err.path[0] as keyof AnnouncementFormData] = err.message;
            });
            setErrors(newErrors);
            toast.error("Por favor, corrige los errores en el formulario.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            setIsLoading(false);



            if (!response.ok) {
                const errorData = await response.json();
                // setError(errorData.message || 'Ocurrió un error. Verifica los campos.');
                toast.error('Ocurrió un error. Verifica los campos.');
                throw new Error(errorData.error || "Error al crear el aviso");
            } else {
                toast.success('Aviso creado con éxito');
                router.push('/admin/avisos');
                router.refresh(); // Refresca los datos del servidor
            }

        } catch (error) {
            console.error("Error al enviar formulario:", error);
            toast.error(error instanceof Error ? error.message : "Error desconocido al crear el artículo.");
            setError('Error desconocido al crear el artículo.');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }


    }


    const announcementTopicsArray = Object.values(AnnouncementTopic);


    return (
        <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
            <div className="mb-6">
                <Link href="/admin/avisos" className="text-sm text-lime-600 hover:underline flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Volver a todos los avisos
                </Link>
            </div>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <Megaphone className="h-7 w-7 text-lime-600" />
                        <CardTitle className="text-2xl font-semibold">Crear Nuevo Aviso</CardTitle>
                    </div>
                    <CardDescription>
                        Crea nuevos avisos para los usuarios de SchoMetrics.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Título */}
                        <div className="space-y-1">
                            <Label htmlFor="title">Título del Aviso <span className="text-lime-500">*</span></Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Aviso importante para los estudiantes de la plataforma"
                                disabled={isLoading}
                                className={""} />
                            {errors.title && <p className="text-sm text-lime-500">{errors.title}</p>}
                        </div>

                        {/* Contenido (Textarea) */}
                        <div className="space-y-1">
                            <Label htmlFor="content">Contenido del Aviso <span className="text-lime-500">*</span></Label>
                            <Textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="Escribe aquí el contenido detallado del aviso"
                                rows={10}
                                disabled={isLoading}
                                className={""} />
                            {errors.content && <p className="text-sm text-lime-500">{errors.content}</p>}
                        </div>

                        {/* Tema */}
                        <div className="space-y-1 w-min">
                            <Label htmlFor="topic">Tema Principal <span className="text-lime-500">*</span></Label>
                            <Select
                                value={formData.topic}
                                onValueChange={handleTopicChange}
                                name="topic"
                                disabled={isLoading}
                            >
                                <SelectTrigger id="topic" className={"uppercase"}>
                                    <SelectValue placeholder="Selecciona un tema" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Temas de Sostenibilidad</SelectLabel>
                                        {announcementTopicsArray.map(topicValue => (
                                            <SelectItem key={topicValue} value={topicValue}>
                                                {topicValue.replace(/_/g, " ").charAt(0).toUpperCase() + topicValue.replace(/_/g, " ").slice(1).toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.topic && <p className="text-sm text-lime-500">{errors.topic}</p>}
                        </div>
                        {error && <p className="text-sm text-lime-500">{error}</p>}

                        <CardFooter className="flex flex-col justify-center gap-3 sm:flex-row sm:items-start sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-lime-500 hover:bg-lime-600"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Publicar Artículo
                            </Button>
                        </CardFooter>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}