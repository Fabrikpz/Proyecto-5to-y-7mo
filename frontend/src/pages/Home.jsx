import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// --- Iconos SVG ---

const IconLogo = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
)

const IconLogin = () => (
  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" />
  </svg>
)

const IconArrowRight = () => (
  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

// --- NUEVO COMPONENTE: Ilustración de CSS ---
// Esto reemplaza la imagen estática. Es 100% código.
const AppVisualIllustration = () => (
  <div className="relative">
    {/* Fondo decorativo abstracto */}
    <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-30 -z-10" />
    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-slate-200 rounded-lg opacity-40 -z-10 transform rotate-12" />

    {/* Mockup de Navegador con UI Abstracta */}
    <div className="w-full rounded-xl shadow-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Barra de navegador falsa */}
      <div className="h-11 flex items-center gap-1.5 px-4 border-b border-slate-200">
        <span className="w-3 h-3 rounded-full bg-slate-300"></span>
        <span className="w-3 h-3 rounded-full bg-slate-300"></span>
        <span className="w-3 h-3 rounded-full bg-slate-300"></span>
      </div>

      {/* Contenido Falso de la UI */}
      <div className="flex gap-4 p-4 h-64 md:h-80">
        {/* Sidebar Falsa */}
        <div className="w-1/4 rounded-lg bg-slate-100 p-2 space-y-2">
          <div className="h-4 rounded bg-slate-200"></div>
          <div className="h-4 rounded bg-blue-200 w-3/4"></div>
          <div className="h-4 rounded bg-slate-200"></div>
          <div className="h-4 rounded bg-slate-200"></div>
        </div>
        
        {/* Contenido Falso Principal */}
        <div className="flex-1 space-y-3">
          {/* Tarjetas Falsas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-white border border-slate-200 p-2 space-y-1">
              <div className="h-3 rounded bg-slate-200 w-1/2"></div>
              <div className="h-5 rounded bg-blue-200 w-3/4"></div>
            </div>
            <div className="h-16 rounded-lg bg-white border border-slate-200 p-2 space-y-1">
              <div className="h-3 rounded bg-slate-200 w-1/2"></div>
              <div className="h-5 rounded bg-slate-200 w-3/4"></div>
            </div>
            <div className="h-16 rounded-lg bg-white border border-slate-200 p-2 space-y-1">
              <div className="h-3 rounded bg-slate-200 w-1/2"></div>
              <div className="h-5 rounded bg-slate-200 w-3/4"></div>
            </div>
          </div>
          {/* Gráfico Falso */}
          <div className="h-full max-h-40 rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-end gap-1">
            <div className="w-1/4 h-1/3 rounded-t-md bg-slate-300"></div>
            <div className="w-1/4 h-1/2 rounded-t-md bg-blue-300"></div>
            <div className="w-1/4 h-2/3 rounded-t-md bg-slate-300"></div>
            <div className="w-1/4 h-1/4 rounded-t-md bg-slate-300"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


export default function Home() {
  const { user } = useAuth()

  // Define el texto del botón y el enlace basado en el usuario
  const ctaLink = user ? (user.role === 'admin' ? '/dashboard' : '/equipments') : '/login'
  const ctaText = user ? (user.role === 'admin' ? 'Go to Dashboard' : 'View Equipments') : 'Login'
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* --- Header --- */}
      <header className="w-full px-4 sm:px-8 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center gap-2">
            
          </Link>
          
          {/* Botones de Navegación */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to={ctaLink}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {ctaText}
                <IconArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login
                  <IconLogin />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* --- Main Hero Section --- */}
      <main className="flex-1 flex items-center px-4">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 py-12 md:py-24">
          
          {/* Columna Izquierda: Texto y CTA */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
              <span className="px-2 py-1 rounded-lg bg-blue-600 text-white">Manage equipment</span>
              <span> loans with ease.</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
              Centralize laptop, projector, tablet and camera reservations for your institution with a clean,
              scalable web dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to={ctaLink}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {ctaText}
                <IconArrowRight />
              </Link>
            </div>
          </div>
          
          {/* Columna Derecha: Ilustración de CSS */}
          <div className="hidden lg:block">
            <AppVisualIllustration />
          </div>
          
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} EquipLoan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}