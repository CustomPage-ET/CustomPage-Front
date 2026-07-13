'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function PromocionesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">Campañas y Promociones</h1>
          <p className="text-sm text-[#6b6686]">Configura cupones de descuento y ofertas especiales de temporada.</p>
        </div>
        <Button variant="primary" className="w-auto py-2.5 px-4 text-xs">Nueva Promoción</Button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-[#6b6686]">Actualmente no hay campañas promocionales programadas.</p>
      </div>
    </div>
  );
}