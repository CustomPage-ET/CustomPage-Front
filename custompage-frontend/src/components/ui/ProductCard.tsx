'use client';

import React from 'react';
import { Button } from './Button';

interface ProductCardProps {
  nombre: string;
  precio: number;
  categoria: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ nombre, precio, categoria }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
      <div className="h-48 bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 flex items-center justify-center border-b border-gray-50">
        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">Sin Imagen</span>
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-[#6b6686]">{categoria}</span>
        <h4 className="font-bold text-[#1e1b4b] mt-1 mb-2 text-base line-clamp-1">{nombre}</h4>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-[#1e1b4b]">${precio.toLocaleString()}</span>
          <Button variant="primary" className="w-auto py-1.5 px-3.5 text-xs rounded-lg">Añadir</Button>
        </div>
      </div>
    </div>
  );
}