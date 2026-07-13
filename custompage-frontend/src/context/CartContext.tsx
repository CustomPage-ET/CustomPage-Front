'use client';
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState([]);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);