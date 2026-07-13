'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function ProductosPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1e1b4b]">Productos</h1>
          <p className="text-sm text-[#6b6686]">Controla el inventario, precios e imágenes de tu stock.</p>
        </div>
        <Button variant="primary" className="w-auto py-2.5 px-4 text-xs">Añadir Producto</Button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="max-w-sm mx-auto">
          <p className="text-[#1e1b4b] font-medium mb-1">Tu inventario está vacío</p>
          <p className="text-sm text-[#6b6686] mb-6">Comienza agregando tu primer producto al sistema utilizando el botón superior.</p>
        </div>
      </div>
    </div>
  );
}