'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuFuncionesPage() {
  const router = useRouter();
  const [buttonColor, setButtonColor] = useState('#8EB8B2');
  const [boxBgColor, setBoxBgColor] = useState('#FFFFFF');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setButtonColor(localStorage.getItem('web_button_color') || '#8EB8B2');
      setBoxBgColor(localStorage.getItem('web_box_bg_color') || '#FFFFFF');
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Menú de Funciones</h1>
        <p className="text-xs text-slate-500 mt-1">Selecciona una herramienta para comenzar a administrar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {herramientas.map((item, idx) => (
          <div
            key={idx}
            onClick={() => router.push(item.path)}
            className="group p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between bg-white hover:-translate-y-0.5"
            style={{ backgroundColor: boxBgColor }}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${buttonColor}15` }}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-white" style={{ backgroundColor: buttonColor }}>
                Ingresar →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}