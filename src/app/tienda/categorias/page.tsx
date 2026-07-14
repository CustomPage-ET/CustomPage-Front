'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface CatProducto {
  id: string;
  name: string;
  category: 'Serums' | 'Tónicos' | 'Cremas';
  price: number;
  stock: number;
  imageUrl: string;
}

const MOCK_CATEGORIZADOS: CatProducto[] = [
  { id: 'c1', name: 'Anua Heartleaf', category: 'Tónicos', price: 21990, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=300' },
  { id: 'c2', name: 'Anua Heartleaf Intense', category: 'Cremas', price: 28900, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=300' },
  { id: 'c3', name: 'Skin1004 Madagascar', category: 'Serums', price: 23400, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=300' },
];

export default function CategoriasPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Serums' | 'Tónicos' | 'Cremas'>('Todos');
  const [productos, setProductos] = useState<CatProducto[]>(MOCK_CATEGORIZADOS);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiURL}/api/products`);
        if (!response.ok) throw new Error('Error al conectar con el servidor de productos');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Mapeo seguro de la respuesta para cumplir con la interfaz requerida
          const mappedData = data.map((p: any) => ({
            id: p.id || String(p.productId),
            name: p.name || p.nombre,
            category: p.category || p.categoria,
            price: Number(p.price || p.precio),
            stock: Number(p.stock !== undefined ? p.stock : 10),
            imageUrl: p.imageUrl || p.imagenUrl || 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=300'
          }));
          setProductos(mappedData);
        }
      } catch (error) {
        console.warn("API Gateway inalcanzable para productos. Utilizando respaldo mockeado:", error);
        setProductos(MOCK_CATEGORIZADOS);
      }
    };

    fetchProductos();
  }, []);

  const filtered = selectedCategory === 'Todos'
    ? productos
    : productos.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Filtros de categoría horizontales */}
      <div className="flex flex-wrap gap-2 border-b border-indigo-200 pb-4">
        {(['Todos', 'Serums', 'Tónicos', 'Cremas'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black border border-slate-900 transition-all cursor-pointer shadow-sm ${
              selectedCategory === cat ? 'bg-[#67E8F9] text-slate-950' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {filtered.map((prod) => (
          <div key={prod.id} className="flex flex-col items-center">
            <h4 className="text-xs font-black text-slate-900 mb-2 text-center h-4 truncate w-full">{prod.name}</h4>

            <div className="w-full aspect-square max-w-[200px] bg-white border-2 border-slate-900 rounded-[24px] p-4 flex items-center justify-center shadow-sm">
              <img src={prod.imageUrl} alt={prod.name} className="max-h-full max-w-full object-contain" />
            </div>

            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 mt-2">
              {prod.category}
            </span>

            <span className="text-xs font-bold text-slate-700 mt-1">${prod.price.toLocaleString('es-CL')}</span>

            <div className="flex gap-2 mt-2 w-full max-w-[200px] justify-center">
              <button
                onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.price, stock: prod.stock, imageUrl: prod.imageUrl })}
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