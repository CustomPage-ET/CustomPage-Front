'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuFuncionesPage() {
  const router = useRouter();

  // Inicialización con valores por defecto para evitar desfases visuales en el servidor
  const [colors, setColors] = useState({
    button: '#8EB8B2',
    boxBg: '#FFFFFF',
    isLoaded: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedButton = localStorage.getItem('web_button_color') || '#8EB8B2';
      const storedBoxBg = localStorage.getItem('web_box_bg_color') || '#FFFFFF';
      setColors({
        button: storedButton,
        boxBg: storedBoxBg,
        isLoaded: true
      });
    }
  }, []);

  const herramientas = [
    { name: 'Módulos/Categorías', path: '/admin/modulos', icon: '📁', desc: 'Organiza las secciones y navegación de tu catálogo.' },
    { name: 'Productos', path: '/admin/productos', icon: '📦', desc: 'Gestiona existencias, precios, imágenes y detalles.' },
    { name: 'Promociones', path: '/admin/promociones', icon: '🏷️', desc: 'Configura ofertas especiales y banners promocionales.' },
    { name: 'Gestión de Contenido', path: '/admin/contenido', icon: '🎨', desc: 'Modifica colores corporativos, logotipos y textos del sitio.' },
    { name: 'Reportes', path: '/admin/reportes', icon: '📝', desc: 'Revisa listas de órdenes y registros del negocio.' },
    { name: 'Dashboard (Gráficos)', path: '/admin/dashboard', icon: '📊', desc: 'Estadísticas visuales de ventas y productos más vendidos.' },
  ];

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${colors.isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Menú de Funciones</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">Selecciona una herramienta para comenzar a administrar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {herramientas.map((item, idx) => (
          <div
            key={idx}
            onClick={() => router.push(item.path)}
            className="group p-6 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 active:scale-[0.98]"
            style={{
              backgroundColor: colors.boxBg,
              // Mapeo dinámico a variables CSS para limpieza sintáctica
              ...({ '--custom-accent': colors.button } as React.CSSProperties)
            }}
          >
            <div className="space-y-4">
              {/* Contenedor del ícono con color de fondo alpha calculado */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${colors.button}15` }}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800 transition-colors group-hover:text-slate-950">
                  {item.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <span
                className="text-xs font-bold px-4 py-2 rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white shadow-sm"
                style={{ backgroundColor: 'var(--custom-accent)' }}
              >
                Ingresar →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}