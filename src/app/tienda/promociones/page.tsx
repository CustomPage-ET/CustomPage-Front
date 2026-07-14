'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface Promocion {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  imageUrl: string;
}

const MOCK_PROMOS: Promocion[] = [
  { id: 'p1', name: 'Celimax Noni Ampoule', originalPrice: 24990, discountPrice: 19990, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300' },
  { id: 'p2', name: 'Anua Niacinamide', originalPrice: 26500, discountPrice: 21200, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=300' },
];

export default function PromocionesPage() {
  const { addToCart } = useCart();
  const [promociones, setPromociones] = useState<Promocion[]>(MOCK_PROMOS);

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiURL}/api/marketing/promotions`);
        if (!response.ok) throw new Error('Error al conectar con el servidor de marketing');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedData = data.map((p: any) => ({
            id: p.id || String(p.promoId),
            name: p.name || p.nombre,
            originalPrice: Number(p.originalPrice || p.precioOriginal),
            discountPrice: Number(p.discountPrice || p.precioDescuento),
            stock: Number(p.stock !== undefined ? p.stock : 5),
            imageUrl: p.imageUrl || p.imagenUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300'
          }));
          setPromociones(mappedData);
        }
      } catch (error) {
        console.warn("API Gateway inalcanzable para marketing. Utilizando respaldo mockeado:", error);
        setPromociones(MOCK_PROMOS);
      }
    };

    fetchPromociones();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="border-b border-indigo-200 pb-2">
        <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
          🔥 Ofertas Exclusivas <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full">Especial</span>
        </h2>
        <p className="text-xs text-slate-500 font-bold mt-0.5">Descuentos por tiempo limitado en cosmética seleccionada.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-2">
        {promociones.map((prod) => (
          <div key={prod.id} className="flex flex-col items-center relative">
            {/* Etiqueta de Descuento */}
            <div className="absolute top-10 right-4 bg-rose-500 text-white font-black text-[10px] px-2 py-1 rounded-lg z-10 border border-slate-900 shadow-sm rotate-12">
              OFERTA
            </div>

            <h4 className="text-xs font-black text-slate-900 mb-2 text-center h-4 truncate w-full">{prod.name}</h4>

            <div className="w-full aspect-square max-w-[200px] bg-white border-2 border-slate-900 rounded-[24px] p-4 flex items-center justify-center shadow-sm">
              <img src={prod.imageUrl} alt={prod.name} className="max-h-full max-w-full object-contain" />
            </div>

            {/* Precios */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold text-slate-400 line-through">${prod.originalPrice.toLocaleString('es-CL')}</span>
              <span className="text-xs font-black text-rose-600">${prod.discountPrice.toLocaleString('es-CL')}</span>
            </div>

            <span className="text-[11px] font-bold text-slate-500">Stock: {prod.stock}</span>

            <div className="flex gap-2 mt-2 w-full max-w-[200px] justify-center">
              <button
                onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.discountPrice, stock: prod.stock, imageUrl: prod.imageUrl })}
                className="w-full px-4 py-1.5 rounded-full border border-slate-900 text-[10px] font-black bg-slate-200 hover:bg-indigo-100 cursor-pointer text-center"
              >
                Agregar Al Carrito
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}