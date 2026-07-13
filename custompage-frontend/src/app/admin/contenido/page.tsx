'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ContenidoPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1e1b4b]">Personalización de Contenido</h1>
        <p className="text-sm text-[#6b6686]">Ajusta los textos visibles, logotipos y metadatos de tu landing page.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-xl">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input label="Nombre comercial del sitio" placeholder="Mi Empresa S.A." />
          <Input label="Eslogan publicitario" placeholder="La mejor calidad al mejor precio" />

          <div>
            <label className="block text-sm font-semibold text-[#1e1b4b] mb-1.5 ml-1">Logotipo (URL o archivo corporativo)</label>
            <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-[#6366f1] hover:file:bg-indigo-100" />
          </div>

          <div className="pt-2">
            <Button variant="primary" className="w-auto px-6 py-2.5">Guardar Cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
}