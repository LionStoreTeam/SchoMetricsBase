"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TypeAnimation } from 'react-type-animation';
import Image from "next/image"
import { motion } from "motion/react"
import LoginButton from "./components/LogInButton";
import { DynamicCounters } from "./components/home/DynamicCounters";
import GlobalMetricsSchool from "./components/home/GlobalMetricsSchool";
import { TimelineSchoMetrics } from "./components/home/TimeLineSchoMetrics";
export default function Home() {
  return (
    <div className="home flex flex-col min-h-screen">
      <header className="top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mb-5 py-3 container flex flex-col items-center justify-between md:flex-row">
          <div className="mt-4 mb-4 flex items-center gap-4">
            <Image src="/logo.png" alt="logo" width={70} height={70} priority />
            <span className="text-2xl font-bold text-[#00B38C]">SchoMetrics</span>
          </div>
          <LoginButton href="/login" />
        </div>
      </header>
      <main className="container flex-1">
        <motion.span
          initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1,
            ease: "easeInOut",
          }}
          className=""
        >
          <section className="w-full py-12 lg:py-16 bg-white">
            <div className="px-4 md:px-6">
              <div className="flex flex-col justify-center items-center lg:flex-row gap-3 lg:mx-10 lg:gap-5">
                <div className="space-y-4 lg:mx-10">
                  <h1 className="mx-auto max-w-full text-start text-2xl font-bold text-slate-600 md:text-4xl lg:text-6xl">
                    <span className="text-[#00B38C]">
                      SchoMetrics
                    </span>
                    <br />
                    Transformación educativa hacia la sostenibilidad
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Una plataforma para que escuelas y alumnos lleven un seguimiento y educación
                    sobre hábitos ambientales sostenibles.
                  </p>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row font-semibold text-[#00B38C]">
                    <TypeAnimation
                      sequence={[
                        // Same substring at the start will only be typed out once, initially
                        'Inicia Sesión',
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                        'Sube Actividades',
                        1000,
                        'Gana Recompensas',
                        1000,
                      ]}
                      wrapper="span"
                      speed={50}
                      style={{ fontSize: '1.5em', display: 'inline-block', borderBottom: '2px solid #00B38C', width: 'max-content' }}
                      repeat={Infinity}
                    />
                  </div>
                </div>
                <div className="mt-16 w-[320px] sm:w-[500px] md:w-[600px] lg:w-[900px] lg:mt-0 xl:w-[1200px]">
                  <Image src="/hero.svg" alt="hero" width={1000} height={1000} priority className="animate-heartbeat" />
                </div>
              </div>
            </div>
          </section>
          {/* Contadores de Estádisticas Generales */}
          <section className="w-full py-12 md:py-16 lg:py-20 ">
            <div className="px-4 md:px-6">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="mx-auto max-w-full text-center text-2xl font-bold text-slate-600 md:text-4xl lg:text-6xl">
                  Nuestra Comunidad en Números
                </h2>
                <p className="mt-3 max-w-2xl mx-auto text-md text-gray-500">
                  Descubre el impacto colectivo de SchoMetrics y cómo estamos creciendo juntos.
                </p>
              </div>
              <DynamicCounters />
              {/* Global Metrics */}
              <GlobalMetricsSchool />
            </div>
          </section>
          {/* TimeLine Demo */}
          <TimelineSchoMetrics />
        </motion.span>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 SchoMetrics. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terminos" className="text-sm text-muted-foreground hover:underline">
              Términos
            </Link>
            <Link href="/privacidad" className="text-sm text-muted-foreground hover:underline">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

