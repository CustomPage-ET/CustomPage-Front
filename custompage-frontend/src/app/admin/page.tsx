'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Resumen General</h1>
        <p className="text-sm text-[#6b6686]">Monitorea el estado de tu tienda y productos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-[#6b6686] uppercase tracking-wider">Productos Activos</span>
          <h3 className="text-3xl font-bold text-[#1e1b4b] mt-2">142</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-[#6b6686] uppercase tracking-wider">Módulos</span>
          <h3 className="text-3xl font-bold text-[#1e1b4b] mt-2">8</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-[#6b6686] uppercase tracking-wider">Promociones Activas</span>
          <h3 className="text-3xl font-bold text-[#1e1b4b] mt-2 font-mono text-emerald-600">3</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-[#1e1b4b] mb-4">Actividad Reciente</h3>
        <p className="text-sm text-[#6b6686]">No hay eventos recientes que reportar por el momento.</p>
      </div>
    </div>
  );
}