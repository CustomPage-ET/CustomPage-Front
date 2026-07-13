'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function ModulosPage() {
  const modulos = [
    { id: 1, nombre: 'Tecnología', estado: 'Activo', items: 45 },
    { id: 2, nombre: 'Hogar', estado: 'Activo', items: 28 },
    { id: 3, nombre: 'Moda', estado: 'Oculto', items: 69 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">Módulos y Categorías</h1>
          <p className="text-sm text-[#6b6686]">Gestiona las secciones principales que ven los clientes.</p>
        </div>
        <Button variant="primary" className="w-auto py-2.5 px-4 text-xs">Crear Módulo</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-[#1e1b4b] uppercase">Nombre</th>
              <th className="p-4 text-xs font-bold text-[#1e1b4b] uppercase">Items</th>
              <th className="p-4 text-xs font-bold text-[#1e1b4b] uppercase">Estado</th>
              <th className="p-4 text-xs font-bold text-[#1e1b4b] uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {modulos.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-[#1e1b4b]">{m.nombre}</td>
                <td className="p-4 text-[#6b6686]">{m.items} productos</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    m.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {m.estado}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-[#6366f1] text-xs font-semibold hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}