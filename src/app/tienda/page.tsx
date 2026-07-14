'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface Producto {
  id: string;
  name: string;
  stock: number;
  price: number;
  description: string;
  imageUrl: string;
}

const MOCK_PRODUCTOS: Producto[] = [
  { id: '1', name: 'Celimax Noni Ampoule', stock: 10, price: 24990, description: 'Ampolla nutritiva concentrada con extracto de Noni para calmar e hidratar profundamente la barrera de la piel.', imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300' },
  { id: '2', name: 'Anua Heartleaf', stock: 10, price: 21990, description: 'Tónico facial calmante formulado con un 77% de extracto de Heartleaf, ideal para mitigar rojeces y pieles propensas al acné.', imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=300' },
  { id: '3', name: 'Anua Niacinamide', stock: 10, price: 26500, description: 'Serum iluminador corrector de manchas de alta potencia con Niacinamide para restaurar el tono natural de la piel.', imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=300' },
  { id: '4', name: 'Anua Heartleaf Intense', stock: 10, price: 28900, description: 'Crema reparadora intensa de rápida absorción que sella la hidratación y protege contra agentes externos irritantes.', imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=300' },
  { id: '5', name: 'Anua Heartleaf Mask', stock: 10, price: 18900, description: 'Tratamiento en crema mascarilla purificante profunda diseñada para pieles sensibles y deshidratadas.', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=300' },
  { id: '6', name: 'Skin1004 Madagascar', stock: 10, price: 23400, description: 'Ampolla de Centella Asiática pura extraída en Madagascar que promueve la regeneración celular acelerada.', imageUrl: 'https://images.unsplash.com/photo-1601049676099-e7ed07d825b0?q=80&w=300' },
];

export default function TiendaPage() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [productos, setProductos] = useState<Producto[]>(MOCK_PRODUCTOS);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiURL}/api/products`);
        if (!response.ok) throw new Error('Error al conectar con el servidor de productos');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const mappedData = data.map((p: any) => ({
            id: p.id || String(p.productId),
            name: p.name || p.nombre,
            stock: Number(p.stock !== undefined ? p.stock : 10),
            price: Number(p.price || p.precio),
            description: p.description || p.descripcion || 'Sin descripción disponible.',
            imageUrl: p.imageUrl || p.imagenUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300'
          }));
          setProductos(mappedData);
        }
      } catch (error) {
        console.warn("API Gateway inalcanzable para catálogo general. Utilizando respaldo mockeado:", error);
        setProductos(MOCK_PRODUCTOS);
      }
    };

    fetchProductos();
  }, []);

  const filtered = productos.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-start">
      <aside className="w-full md:w-52 flex flex-col gap-2 flex-shrink-0">
        <div className="bg-[#67E8F9] border-2 border-slate-900 rounded-[18px] p-4 text-center">
          <h2 className="text-lg font-black text-slate-900 leading-tight">Buscar producto</h2>
        </div>
        <div className="w-full bg-white border border-slate-400 rounded-full px-4 py-1.5 flex items-center shadow-sm">
          <input type="text" placeholder="Buscar: 🔎" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-bold outline-none" />
        </div>
      </aside>

      <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {filtered.map((prod) => (
          <div key={prod.id} className="flex flex-col items-center">
            <h4 className="text-xs font-black text-slate-900 mb-2 text-center h-4 truncate w-full">{prod.name}</h4>
            <div className="w-full aspect-square max-w-[200px] bg-white border-2 border-slate-900 rounded-[24px] p-4 flex items-center justify-center shadow-sm">
              <img src={prod.imageUrl} alt={prod.name} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="text-xs font-bold text-slate-700 mt-2">Stock: {prod.stock}</span>
            <div className="flex gap-2 mt-2 w-full max-w-[200px] justify-center">
              <button onClick={() => setSelectedProduct(prod)} className="px-3 py-1.5 rounded-full border border-slate-900 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 cursor-pointer">
                Informacion
              </button>
              <button onClick={() => addToCart({ ...prod, price: prod.price })} className="px-3 py-1.5 rounded-full border border-slate-900 text-[10px] font-black bg-slate-200 hover:bg-indigo-100 cursor-pointer">
                Agregar Al Carrito
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* POP-UP MODAL DE INFORMACIÓN DEL PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-slate-900 rounded-[32px] p-6 max-w-sm w-full shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-slate-900 text-center">{selectedProduct.name}</h3>
            <div className="w-40 h-40 border border-slate-200 rounded-2xl overflow-hidden p-2 bg-slate-50 flex items-center justify-center">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-full max-w-full object-contain" />
            </div>
            <p className="text-xs font-bold text-slate-500 text-center leading-relaxed px-2">{selectedProduct.description}</p>
            <div className="text-sm font-black text-indigo-950 mt-1">${selectedProduct.price.toLocaleString('es-CL')}</div>
            <button onClick={() => setSelectedProduct(null)} className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-full text-xs transition-colors cursor-pointer">
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}