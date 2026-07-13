'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Módulos/Categorías', href: '/admin/modulos' },
    { name: 'Productos', href: '/admin/productos' },
    { name: 'Promociones', href: '/admin/promociones' },
    { name: 'Gestión de Contenido', href: '/admin/contenido' },
    { name: 'Reportes', href: '/admin/reportes' },
  ];

  return (
    <aside className="w-64 bg-[#1e1b4b] text-white min-h-screen flex flex-col border-r border-indigo-950">
      <div className="p-6 border-b border-indigo-900/50">
        <h2 className="text-xl font-bold tracking-tight text-indigo-200">Panel Admin</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#6366f1] text-white'
                  : 'text-indigo-200 hover:bg-indigo-900/40 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-indigo-900/50">
        <Link href="/login" className="block w-full px-4 py-2.5 text-center text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-xl transition-colors">
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}