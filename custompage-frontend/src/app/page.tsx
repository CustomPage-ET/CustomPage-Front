'use client';

import React from 'react';
import Navbar from '@/components/common/Navbar';
import { ProductCard } from '@/components/ui/ProductCard';

export default function Home() {
  const dummyProducts = [
    { id: 1, nombre: 'Audífonos Inalámbricos Premium', precio: 89990, categoria: 'Tecnología' },
    { id: 2, nombre: 'Cafetera Expresso Automática', precio: 145000, categoria: 'Hogar' },
    { id: 3, nombre: 'Mochila Impermeable Urbana', precio: 34990, categoria: 'Moda' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbfe]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-[#1e1b4b] tracking-tight sm:text-4xl">Descubre nuestro catálogo</h1>
          <p className="mt-2 text-base text-[#6b6686]">Explora los mejores artículos agregados por el administrador.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dummyProducts.map((p) => (
            <ProductCard key={p.id} nombre={p.nombre} precio={p.precio} categoria={p.categoria} />
          ))}
        </div>
      </main>
    </div>
  );
}