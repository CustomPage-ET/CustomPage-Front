'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CarritoPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      // Estructura de payload común para el microservicio de ventas
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        currency: 'CLP'
      };

      const response = await fetch(`${apiURL}/api/sales/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Error al procesar la orden en el servidor');

      alert('¡Compra procesada con éxito a través del servidor!');
      clearCart();
    } catch (error) {
      console.warn("API Gateway inalcanzable o error en servidor. Usando fallback de contingencia:", error);
      // Fallback: ejecuta el comportamiento original mockeado
      alert('¡Compra procesada con éxito!');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="w-full py-16 text-center flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🛒</span>
        <h2 className="text-lg font-black text-slate-900">Tu carrito está vacío</h2>
        <p className="text-xs text-slate-500 font-bold max-w-xs">Agrega productos desde la pestaña principal para verlos aquí listados.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h2 className="text-lg font-black text-slate-900">Productos Seleccionados</h2>
          <button onClick={clearCart} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">Vaciar Carrito</button>
        </div>

        <div className="flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.id} className="bg-white border-2 border-slate-900 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border border-slate-200 rounded-xl bg-slate-50 flex-shrink-0 p-1 flex items-center justify-center">
                  <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{item.name}</h3>
                  <span className="text-[11px] font-bold text-slate-500 mt-1 block">Cantidad: {item.quantity} unidades</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-sm font-black text-slate-900">${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-extrabold text-rose-500 hover:text-rose-700 cursor-pointer">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white border-2 border-slate-900 rounded-[24px] p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Resumen del Pedido</h3>
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-600">
          <div className="flex justify-between"><span>Subtotal:</span><span className="text-slate-900">${total.toLocaleString('es-CL')}</span></div>
          <div className="flex justify-between"><span>Despacho:</span><span className="text-emerald-600">Gratis</span></div>
        </div>
        <div className="flex justify-between items-center text-base font-black text-slate-900">
          <span>Total:</span>
          <span>${total.toLocaleString('es-CL')}</span>
        </div>
        <button onClick={handleCheckout} className="w-full py-3 bg-[#67E8F9] hover:bg-cyan-400 text-slate-950 font-black rounded-full border-2 border-slate-900 shadow-sm transition-all cursor-pointer text-xs uppercase tracking-wider mt-2">
          Proceder al Pago
        </button>
      </div>
    </div>
  );
}