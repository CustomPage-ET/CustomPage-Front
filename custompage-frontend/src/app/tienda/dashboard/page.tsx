'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    router.refresh();
  };

  const clientActions = [
    { title: 'Explorar Catálogos', emoji: '📖', description: 'Descubre las plantillas y tiendas activas.', path: '/', color: 'bg-indigo-50/90 hover:bg-indigo-100/95 text-indigo-950 border-indigo-100/50' },
    { title: 'Mis Pedidos', emoji: '🛒', description: 'Revisa el historial y estado de tus compras.', path: '/dashboard/pedidos', color: 'bg-emerald-50/90 hover:bg-emerald-100/95 text-emerald-950 border-emerald-100/50' },
    { title: 'Mis Favoritos', emoji: '❤️', description: 'Guarda los productos que más te gustan.', path: '/dashboard/favoritos', color: 'bg-rose-50/90 hover:bg-rose-100/95 text-rose-950 border-rose-100/50' },
    { title: 'Configurar Perfil', emoji: '👤', description: 'Actualiza tus datos de envío y contraseña.', path: '/dashboard/perfil', color: 'bg-sky-50/90 hover:bg-sky-100/95 text-sky-950 border-sky-100/50' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 relative overflow-hidden animate-dynamic-bg text-brand-dark">

      <header className="w-full max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-md rounded-[24px] px-6 py-4 border border-white/40 shadow-sm z-10">
        <div className="flex items-center">
          <Image
            src="/logo-clean.png"
            alt="CustomPage Logo"
            width={160}
            height={45}
            className="object-contain mix-blend-multiply"
            priority
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-brand-dark">{user?.name || 'Cliente'}</p>
            <p className="text-[10px] text-brand-muted font-medium">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all duration-200 text-xs font-bold cursor-pointer border border-rose-100/50 shadow-sm"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col justify-center z-10 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            ¡Hola de nuevo, <span className="text-brand-primary">{user?.name?.split(' ')[0] || 'Comprador'}</span>! 👋
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Bienvenido a tu portal personal. Desde aquí puedes gestionar tus compras y explorar tiendas de forma segura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {clientActions.map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.path)}
              className={`p-6 text-left rounded-[24px] border shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer ${action.color} flex items-center justify-between group`}
            >
              <div className="space-y-1 pr-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{action.emoji}</span>
                  <h3 className="text-lg font-bold tracking-tight">{action.title}</h3>
                </div>
                <p className="text-xs text-brand-dark/70 font-medium pt-1">
                  {action.description}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/80 border border-white flex items-center justify-center text-xs font-bold shadow-sm transition-colors group-hover:bg-white flex-shrink-0">
                ➔
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs font-medium text-brand-muted/60 z-10">
        &copy; 2026 CustomPage • Espacio de Clientes.
      </footer>
    </div>
  );
}