import React from 'react'
import ForgotPasswordForm from '../components/forgot-password-form'

export default function RestaurarContraseña() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-green-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">SchoMetrics</h1>
                    <p className="mt-2 text-gray-600">Sistema de Gestión Educativa</p>
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
