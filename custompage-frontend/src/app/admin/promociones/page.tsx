'use client';

import React, { useState } from 'react';

interface Promotion {
  id: string;
  title: string;
  imageUrl: string;
  isPublished: boolean;
}

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: '3x2 en Productos Seleccionados',
    imageUrl: '/promocion1.jpg',
    isPublished: true,
  },
  {
    id: 'promo-2',
    title: '40% Off Productos Seleccionados',
    imageUrl: '/promocion2.jpg',
    isPublished: false,
  },
];

export default function GestionarPromocionesPage() {
  // Estados principales
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados de control para Modales
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Formulario de promoción
  const [promoForm, setPromoForm] = useState({
    title: '',
    imageUrl: '',
  });

  // Notificaciones instantáneas
  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Botón: Publicar / Despublicar (Alterna el estado visual)
  const handleTogglePublish = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.isPublished;
          triggerNotification(
            nextState ? 'Promoción publicada en la tienda.' : 'Promoción ocultada.'
          );
          return { ...p, isPublished: nextState };
        }
        return p;
      })
    );
  };

  // Botón: Guardar (Crea nueva o modifica existente)
  const handleSavePromotion = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPromo) {
      // Modificar existente
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === editingPromo.id
            ? {
                ...p,
                title: promoForm.title,
                imageUrl: promoForm.imageUrl || 'https://via.placeholder.com/400',
              }
            : p
        )
      );
      triggerNotification('Promoción modificada con éxito.');
    } else {
      // Crear nueva promoción
      const newPromo: Promotion = {
        id: `promo-${Date.now()}`,
        title: promoForm.title,
        imageUrl: promoForm.imageUrl || 'https://via.placeholder.com/400',
        isPublished: false,
      };
      setPromotions((prev) => [...prev, newPromo]);
      triggerNotification('Nueva promoción creada correctamente.');
    }

    setIsPromoModalOpen(false);
    setEditingPromo(null);
    setPromoForm({ title: '', imageUrl: '' });
  };

  // Botón: Eliminar
  const handleDeletePromotion = (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la promoción "${title}"?`)) return;
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    triggerNotification('Promoción eliminada.');
  };

  return (
    <div className="w-full text-slate-800">
      {/* Contenedor del panel de Promociones */}
      <main className="w-full py-2 flex flex-col gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Promociones</h2>

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-2xl shadow-sm max-w-md">
            ✅ {successMessage}
          </div>
        )}

        <div className="flex flex-wrap items-start gap-8 mt-4">
          {/* Mapeo dinámico de promociones existentes */}
          {promotions.map((promo) => (
            <div key={promo.id} className="flex flex-col items-center gap-3">
              {/* Marco de Imagen de la Promoción */}
              <div className="w-[280px] h-[280px] rounded-2xl border-2 border-slate-800 overflow-hidden relative shadow-md bg-white">
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400';
                  }}
                />
                {!promo.isPublished && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <span className="bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      No Publicada (Borrador)
                    </span>
                  </div>
                )}
              </div>

              {/* Fila de Botones: Publicar, Modificar, Eliminar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(promo.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all border ${
                    promo.isPublished
                      ? 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {promo.isPublished ? 'Publicado' : 'Publicar'}
                </button>

                <button
                  onClick={() => {
                    setEditingPromo(promo);
                    setPromoForm({ title: promo.title, imageUrl: promo.imageUrl });
                    setIsPromoModalOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-full bg-white border border-slate-300 text-slate-800 text-xs font-bold shadow-sm hover:bg-slate-50 transition-all"
                >
                  Modificar
                </button>

                <button
                  onClick={() => handleDeletePromotion(promo.id, promo.title)}
                  className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {/* Tarjeta interactiva: Crear Promoción */}
          <div className="flex flex-col items-center justify-center w-[280px] h-[280px] bg-white/40 border-2 border-dashed border-slate-400 rounded-3xl gap-4 p-6 text-center">
            <button
              onClick={() => {
                setEditingPromo(null);
                setPromoForm({ title: '', imageUrl: '' });
                setIsPromoModalOpen(true);
              }}
              className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              +
            </button>
            <span className="text-sm font-extrabold text-slate-700">Crear promoción</span>
          </div>
        </div>
      </main>

      {/* MODAL INTEGRADO: CREAR / MODIFICAR PROMOCIÓN */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsPromoModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold tracking-tight mb-4 text-slate-900">
              {editingPromo ? 'Modificar Promoción' : 'Nueva Promoción'}
            </h3>

            <form onSubmit={handleSavePromotion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Título de la Promoción:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Oferta de Invierno 20% OFF"
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">URL o Ruta de la Imagen Banner:</label>
                <input
                  type="text"
                  placeholder="Ej: /promocion1.jpg o enlace web HTTPS"
                  value={promoForm.imageUrl}
                  onChange={(e) => setPromoForm({ ...promoForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Puedes colocar una imagen guardada en tu carpeta public o un link de internet.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}