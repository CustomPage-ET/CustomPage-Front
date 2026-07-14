'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function AdminNavigationLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados de sincronización de colores
  const [buttonColor, setButtonColor] = useState('#8EB8B2');
  const [mainTextColor, setMainTextColor] = useState('#1F2937');

  // Estados para el perfil del usuario (Pop-up)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  // Carga de preferencias de estilos y datos del perfil desde el API Gateway
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setButtonColor(localStorage.getItem('web_button_color') || '#8EB8B2');
      setMainTextColor(localStorage.getItem('web_main_text_color') || '#1F2937');
    }

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${gatewayUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser({ name: 'Admin', email: 'admin@custompage.com', role: 'Administrador' });
        }
      } catch (error) {
        setUser({ name: 'Admin', email: 'admin@custompage.com', role: 'Administrador' });
      }
    };

    fetchUserProfile();
  }, [gatewayUrl]);

  // Cerrar el pop-up de perfil si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Gestionar módulos', path: '/admin/modulos' },
    { name: 'Gestionar productos', path: '/admin/productos' },
    { name: 'Gestionar promociones', path: '/admin/promociones' },
    { name: 'Gestionar contenido', path: '/admin/contenido' },
    { name: 'Reportes', path: '/admin/reportes' },
    { name: 'Ver Dashboard', path: '/admin/dashboard' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#E0E7FF]/60" style={{ color: mainTextColor }}>

      {/* 1. SECCIÓN SUPERIOR: LOGO Y PERFIL ADMIN CON POP-UP */}
      <header className="w-full bg-[#C7D2FE] px-6 py-3 flex justify-between items-center border-b border-indigo-200/40">
        {/* Lado Izquierdo: Logo / Marca */}
        <div className="flex items-center bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
          <span className="text-emerald-600 font-extrabold text-sm flex items-center gap-1">
            <span className="text-xl">📊</span> CustomPage <span className="text-xs text-slate-400 font-normal">| Panel Admin</span>
          </span>
        </div>

        {/* Lado Derecho: Perfil del Administrador (Contenedor del Pop-up) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 bg-white/40 px-3 py-1 rounded-full cursor-pointer hover:bg-white/60 transition-colors focus:outline-none"
          >
            <span className="text-sm font-bold text-indigo-950 uppercase tracking-wide">
              {user ? user.name : 'Admin'}
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-950 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm">
              👤
            </div>
          </button>

          {/* MENÚ DESPLEGABLE INTERACTIVO (POP-UP) */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-100 text-slate-800">
              <div className="border-b border-slate-100 pb-3 mb-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Sesión Activa</p>
                <p className="text-sm font-black text-slate-900 mt-1">{user?.name || 'Admin'}</p>
                <p className="text-[11px] font-semibold text-slate-500 truncate">{user?.email || 'admin@custompage.com'}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="px-2 py-1.5 rounded-lg bg-indigo-50/50 border border-indigo-100/50 flex justify-between items-center text-[10px] font-bold text-indigo-800 uppercase">
                  <span>Rol:</span>
                  <span>{user?.role || 'Admin'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left mt-2 px-2 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  🚪 Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. BARRA DE PESTAÑAS HORIZONTAL */}
      <nav className="w-full bg-indigo-200 flex flex-wrap items-center divide-x divide-indigo-300/60 border-b border-indigo-300/40">
        {menuItems.map((tab, idx) => {
          const isActive = pathname === tab.path;
          return (
            <button
              key={idx}
              onClick={() => router.push(tab.path)}
              className="flex-1 py-3.5 px-4 text-xs font-bold text-center transition-all cursor-pointer whitespace-nowrap"
              style={{
                backgroundColor: isActive ? '#E0E7FF' : 'transparent',
                color: isActive ? '#4338CA' : '#1E1B4B',
              }}
            >
              {tab.name}
            </button>
          );
        })}

        {/* Botón: Publicar Cambios */}
        <button
          onClick={() => alert('Cambios publicados de forma exitosa')}
          className="flex-1 py-3.5 px-4 text-xs font-bold text-center text-indigo-950 hover:bg-emerald-500/10 hover:text-emerald-900 transition-colors cursor-pointer whitespace-nowrap"
        >
          Publicar cambios
        </button>

        {/* Botón: Visualizar Sitio Web */}
        <button
          onClick={() => router.push('/')}
          className="flex-1 py-3.5 px-4 text-xs font-bold text-center text-white transition-colors cursor-pointer whitespace-nowrap hover:opacity-90"
          style={{ backgroundColor: buttonColor }}
        >
          Visualizar sitio web
        </button>
      </nav>

      {/* 3. ZONA DE CONTENIDO PRINCIPAL RE-AJUSTADA */}
      <main className="flex-1 p-6 w-full max-w-7xl mx-auto block">
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm min-h-[75vh]">
          {children}
        </div>
      </main>

    </div>
  );
}