'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Modulo {
  id: string;
  name: string;
  status: 'visible' | 'hidden';
}

export default function GestionarModulosPage() {
  const router = useRouter();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Modulo | null>(null);
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<'visible' | 'hidden'>('visible');

  // Estado para seguir el índice del elemento que se está arrastrando
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

  // Cargar módulos al iniciar
  useEffect(() => {
    fetchModulos();
  }, []);

  const fetchModulos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${gatewayUrl}/modules`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar los módulos');
      const data = await response.json();
      setModulos(data);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    }
  };

  // --- LÓGICA DE DRAG & DROP (HTML5 NATIVO) ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necesario para permitir el drop
    if (draggedIndex === null || draggedIndex === index) return;

    // Reordenación visual interactiva en caliente
    const currentModulos = [...modulos];
    const draggedItem = currentModulos[draggedIndex];

    // Remueve de la posición original e inserta en la nueva posición
    currentModulos.splice(draggedIndex, 1);
    currentModulos.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setModulos(currentModulos);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);

    // Mapea el nuevo orden de los IDs para enviarlo al backend si tu backend lo soporta
    const orderPayload = modulos.map((m, idx) => ({ id: m.id, position: idx }));

    try {
      const token = localStorage.getItem('token');
      await fetch(`${gatewayUrl}/modules/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order: orderPayload })
      });
    } catch (err) {
      console.error("Error al persistir el nuevo orden en el servidor:", err);
    }
  };
  // --------------------------------------------

  const handleOpenCreateModal = () => {
    setEditingModule(null);
    setFormName('');
    setFormStatus('visible');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (modulo: Modulo) => {
    setEditingModule(modulo);
    setFormName(modulo.name);
    setFormStatus(modulo.status);
    setIsModalOpen(true);
  };

  const handleSaveModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const url = editingModule
      ? `${gatewayUrl}/modules/${editingModule.id}`
      : `${gatewayUrl}/modules`;

    const method = editingModule ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formName,
          status: formStatus
        })
      });

      if (!response.ok) throw new Error('No se pudo guardar el módulo');

      await fetchModulos();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModulo = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este módulo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${gatewayUrl}/modules/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('No se pudo eliminar el módulo');
      setModulos(modulos.filter(m => m.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full text-slate-800">
      {/* Contenido Principal */}
      <main className="w-full flex flex-col">

        {/* Cabecera de la Sección Modulos */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Módulos</h2>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span className="text-sm">+</span> Añadir nueva categoría
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl shadow-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Tabla Estilo CustomPage */}
        <div className="w-full bg-white/70 backdrop-blur-md rounded-[28px] border border-slate-200/60 shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-indigo-50/70 border-b border-indigo-100/30 text-xs font-bold text-indigo-950/80 uppercase tracking-wider">
                <th className="py-4 px-6 w-24">Reordenar</th>
                <th className="py-4 px-6">Categoría / Módulo</th>
                <th className="py-4 px-6 w-36">Estado</th>
                <th className="py-4 px-6 w-48 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/40 text-sm font-semibold text-slate-700">
              {modulos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 text-xs font-bold">
                    No se han encontrado categorías o módulos creados.
                  </td>
                </tr>
              ) : (
                modulos.map((modulo, index) => (
                  <tr
                    key={modulo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-colors select-none ${
                      draggedIndex === index
                        ? 'bg-indigo-50/50 opacity-50'
                        : 'hover:bg-white/40 bg-white/10'
                    }`}
                  >
                    <td className="py-4 px-6 text-slate-400 font-bold tracking-widest cursor-grab active:cursor-grabbing text-base">
                      :::
                    </td>
                    <td className="py-4 px-6 font-extrabold text-indigo-950">
                      {modulo.name}
                    </td>
                    <td className="py-4 px-6">
                      {modulo.status === 'visible' ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/20">
                          Visible
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200/20">
                          Oculto
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(modulo)}
                        className="px-4 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all border border-sky-100/30 cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteModulo(modulo.id)}
                        className="px-4 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all border border-rose-100/30 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal para Crear y Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-slate-100 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold mb-6 tracking-tight text-slate-900">
              {editingModule ? 'Editar Módulo' : 'Añadir nueva categoría'}
            </h3>

            <form onSubmit={handleSaveModulo} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Nombre de la Categoría:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Promociones, Destacados"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Estado Inicial:
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'visible' | 'hidden')}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-800 font-semibold"
                >
                  <option value="visible">☀️ Visible</option>
                  <option value="hidden">🌙 Oculto</option>
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm transition-all cursor-pointer"
                >
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}