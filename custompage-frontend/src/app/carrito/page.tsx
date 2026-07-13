'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import { Button } from '@/components/ui/Button';

export default function CarritoPage() {
  return (
    <div className="min-h-screen bg-[#fcfbfe]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-[#1e1b4b] mb-6">Tu Carrito de Compras</h1>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft text-center">
          <p className="text-[#6b6686] mb-6 text-sm">No has agregado ningún producto todavía.</p>
          <Link href="/">
            <Button variant="primary" className="w-auto px-6 py-2.5">Explorar Productos</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}