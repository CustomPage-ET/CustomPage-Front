'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-[#1e1b4b] tracking-tight">
          Store<span className="text-[#6366f1]">Custom</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium text-[#6b6686]">
          <Link href="/carrito" className="hover:text-[#6366f1] transition-colors">Carrito (0)</Link>
          <Link href="/login" className="px-4 py-2 bg-indigo-50 text-[#6366f1] rounded-xl hover:bg-indigo-100 transition-colors">Ingresar</Link>
        </nav>
      </div>
    </header>
  );
}