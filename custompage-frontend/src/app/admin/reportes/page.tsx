'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function ReportesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Reportes del Sistema</h1>
        <p className="text-sm text-[#6b6686]">Exporta información clave sobre tus módulos e inventarios en formatos estándar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#1e1b4b] mb-1">Catálogo de Productos</h3>
            <p className="text-xs text-[#6b6686] mb-4">Descarga el inventario completo clasificado con sus respectivos precios y estados de stock.</p>
          </div>
          <Button variant="outline" className="py-2 text-xs">Exportar como CSV</Button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#1e1b4b] mb-1">Módulos y Métricas</h3>
            <p className="text-xs text-[#6b6686] mb-4">Resumen del rendimiento estructural de las categorías visibles en el frontend.</p>
          </div>
          <Button variant="outline" className="py-2 text-xs">Exportar como PDF</Button>
        </div>
      </div>
    </div>
  );
}