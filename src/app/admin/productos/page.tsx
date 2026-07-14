'use client';

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
  moduleId?: string;
}

const PRESET_PRODUCTS: Product[] = [
  {
    id: 'preset-1',
    name: 'Celimax Noni Ampoule',
    price: 24.99,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=400',
    category: 'Ampoules'
  },
  {
    id: 'preset-2',
    name: 'Anua Heartleaf',
    price: 22.50,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    category: 'Toners'
  },
  {
    id: 'preset-3',
    name: 'Anua Niacinamide',
    price: 26.00,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    category: 'Serums'
  },
  {
    id: 'preset-4',
    name: 'Anua Heartleaf Intense',
    price: 28.00,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400',
    category: 'Creams'
  }
];

export default function GestionarProductosPage() {
  // Estados principales
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de control para la barra lateral
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // CONTROL DE MODALES
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Formularios
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryStatus, setNewCategoryStatus] = useState<'visible' | 'hidden'>('visible');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: 'Ampoules'
  });

  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

  // Carga de productos desde el servidor
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${gatewayUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al conectar');
      const data = await response.json();
      setProducts(data.length > 0 ? data : PRESET_PRODUCTS);
    } catch (err) {
      console.warn("Servidor inalcanzable. Usando catálogo provisional local.");
      setProducts(PRESET_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Incremento/Decremento de stock persistido en backend
  const handleUpdateStock = async (id: string, increment: number) => {
    const targetProduct = products.find(p => p.id === id);
    if (!targetProduct) return;

    const newStock = Math.max(0, targetProduct.stock + increment);

    // Actualización optimista
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, stock: newStock } : p)
    );
    triggerNotification('Stock actualizado.');

    try {
      const token = localStorage.getItem('token');
      await fetch(`${gatewayUrl}/products/${id}/stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: newStock })
      });
    } catch (err) {
      console.error("Error al sincronizar stock en el servidor:", err);
    }
  };

  // Crear o Editar Producto en el Servidor
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const processedPrice = parseFloat(productForm.price) || 0;
    const processedStock = parseInt(productForm.stock) || 0;
    const processedImg = productForm.imageUrl || 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=400';

    const payload = {
      name: productForm.name,
      price: processedPrice,
      stock: processedStock,
      imageUrl: processedImg,
      category: productForm.category
    };

    if (editingProduct) {
      // Modificación local instantánea
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
      triggerNotification('Producto actualizado correctamente.');

      try {
        await fetch(`${gatewayUrl}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error("Error al actualizar producto en el servidor:", err);
      }
    } else {
      // Creación local con ID temporal
      const tempId = `local-${Date.now()}`;
      const newProduct: Product = { id: tempId, ...payload };
      setProducts(prev => [newProduct, ...prev]);
      triggerNotification('Nuevo producto agregado correctamente.');

      try {
        const response = await fetch(`${gatewayUrl}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const savedProduct = await response.json();
          // Actualiza el ID definitivo asignado por la base de datos
          setProducts(prev => prev.map(p => p.id === tempId ? savedProduct : p));
        }
      } catch (err) {
        console.error("Error al registrar producto en el servidor:", err);
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', price: '', stock: '', imageUrl: '', category: 'Ampoules' });
  };

  // Guardar nueva categoría en backend
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerNotification(`Categoría "${newCategoryName}" agregada con éxito.`);
    setIsCategoryModalOpen(false);

    try {
      const token = localStorage.getItem('token');
      await fetch(`${gatewayUrl}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newCategoryName,
          status: newCategoryStatus
        })
      });
    } catch (err) {
      console.error("Error al registrar categoría en el servidor:", err);
    }
    setNewCategoryName('');
  };

  // Eliminar producto de forma definitiva
  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${productName}"?`)) return;

    setProducts(prev => prev.filter(p => p.id !== id));
    triggerNotification('Producto eliminado correctamente.');

    try {
      const token = localStorage.getItem('token');
      await fetch(`${gatewayUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Error al remover producto del servidor:", err);
    }
  };

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full text-slate-800">
      <main className="w-full py-2 flex flex-col md:flex-row gap-8">

        {/* Panel Lateral de Acciones */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Productos</h2>

          <button
            onClick={() => {
              setEditingProduct(null);
              setProductForm({ name: '', price: '', stock: '', imageUrl: '', category: 'Ampoules' });
              setIsProductModalOpen(true);
            }}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-sm transition-all text-center cursor-pointer active:scale-95"
          >
            Agregar producto
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-sm transition-all text-center cursor-pointer active:scale-95"
          >
            Agregar categoría
          </button>

          <div className="space-y-1">
            <button
              onClick={() => {
                setIsSearching(!isSearching);
                if (isSearching) setSearchTerm('');
              }}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-sm transition-all text-center cursor-pointer ${
                isSearching ? 'bg-sky-500 text-white' : 'bg-sky-400 text-slate-800'
              }`}
            >
              {isSearching ? 'Cerrar Buscador' : 'Buscar producto'}
            </button>
            {isSearching && (
              <input
                type="text"
                placeholder="Escribe el nombre del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-white text-xs font-semibold focus:outline-none"
              />
            )}
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setIsSearching(false);
              setIsDeleteMode(false);
              fetchProducts();
            }}
            className="w-full py-4 rounded-2xl bg-sky-400 hover:bg-sky-500 text-slate-800 font-extrabold text-sm shadow-sm transition-all"
          >
            Listar productos
          </button>

          <button
            onClick={() => setIsDeleteMode(!isDeleteMode)}
            className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-sm transition-all text-center cursor-pointer ${
              isDeleteMode ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-400 text-white'
            }`}
          >
            {isDeleteMode ? 'Modo Borrar Activo' : 'Eliminar producto'}
          </button>
        </div>

        {/* Listado de Tarjetas */}
        <div className="flex-1">
          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-2xl">
              ✅ {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-400 tracking-wider uppercase animate-pulse">
              Sincronizando catálogo con el servidor...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    if (isDeleteMode) handleDeleteProduct(product.id, product.name);
                  }}
                  className={`bg-white p-5 rounded-[28px] border shadow-sm flex flex-col justify-between items-center text-center relative group transition-all ${
                    isDeleteMode ? 'border-rose-400 bg-rose-50/20 cursor-pointer scale-95' : 'border-slate-200/60'
                  }`}
                >
                  {/* Botón rápido para eliminar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id, product.name);
                    }}
                    className="absolute top-4 right-4 w-7 h-7 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold border border-rose-100"
                  >
                    ✕
                  </button>

                  <div className="w-full">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                      {product.category || 'Skincare'}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-tight mb-4 min-h-[38px] flex items-center justify-center px-2">
                      {product.name}
                    </h3>

                    {/* Imagen */}
                    <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-slate-50 border border-slate-100 relative mb-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    </div>
                  </div>

                  {/* Acciones e Información */}
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-xs font-bold text-slate-500">Stock: {product.stock}</span>
                      <span className="text-sm font-extrabold text-emerald-600">${product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                          setProductForm({
                            name: product.name,
                            price: product.price.toString(),
                            stock: product.stock.toString(),
                            imageUrl: product.imageUrl,
                            category: product.category || 'Ampoules'
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-extrabold transition-all"
                      >
                        Info / Editar
                      </button>
                      <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStock(product.id, 1); }}
                          className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          +
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStock(product.id, -1); }}
                          className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: AGREGAR / EDITAR PRODUCTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold tracking-tight mb-4">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del producto:</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Precio ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Stock inicial:</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Categoría:</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="Ampoules">Ampoules</option>
                  <option value="Toners">Toners</option>
                  <option value="Serums">Serums</option>
                  <option value="Creams">Creams</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Enlace de imagen (URL):</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com..."
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR CATEGORÍA */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold tracking-tight mb-4">Nueva Categoría</h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Nombre de la Categoría:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sérums, Protectores Solares"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Visibilidad inicial:</label>
                <select
                  value={newCategoryStatus}
                  onChange={(e) => setNewCategoryStatus(e.target.value as 'visible' | 'hidden')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
                >
                  <option value="visible">☀️ Visible en la tienda</option>
                  <option value="hidden">🌙 Oculto (Borrador)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}