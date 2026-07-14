'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface CustomerProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  avatarUrl?: string;
}

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customer, setCustomer] = useState<CustomerProfile>({
    name: 'Lucía Fernández',
    email: 'cliente.prueba@custompage.com',
    role: 'Cliente',
    phone: '+56 9 8765 4321',
    address: 'Av. El Bosque 1234, Santiago',
    avatarUrl: ''
  });

  const [editPhone, setEditPhone] = useState(customer.phone);
  const [editAddress, setEditAddress] = useState(customer.address);
  const [editAvatar, setEditAvatar] = useState(customer.avatarUrl || '');

  useEffect(() => {
    const fetchProfile = async () => {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setCustomer(prev => {
            const updated = { ...prev, ...parsed };
            setEditPhone(parsed.phone || prev.phone);
            setEditAddress(parsed.address || prev.address);
            setEditAvatar(parsed.avatarUrl || '');
            return updated;
          });
        }

        // Intentar sincronizar datos en tiempo real con el backend de autenticación
        try {
          const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          const response = await fetch(`${apiURL}/api/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const serverUserData = await response.json();
            setCustomer(prev => ({ ...prev, ...serverUserData }));
            setEditPhone(serverUserData.phone || editPhone);
            setEditAddress(serverUserData.address || editAddress);
            setEditAvatar(serverUserData.avatarUrl || '');
            localStorage.setItem('user', JSON.stringify({ ...JSON.parse(savedUser || '{}'), ...serverUserData }));
          }
        } catch (error) {
          console.warn("API Gateway inalcanzable. Usando sesión local de LocalStorage:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    const updated = { ...customer, phone: editPhone, address: editAddress, avatarUrl: editAvatar };

    // Guardar localmente de inmediato (Fallback rápido)
    setCustomer(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setIsEditing(false);

    // Intentar actualizar en el servidor backend
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiURL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: editPhone,
          address: editAddress,
          avatarUrl: editAvatar
        })
      });

      if (!response.ok) throw new Error('Error al actualizar el perfil en el servidor');
    } catch (error) {
      console.warn("No se pudo sincronizar la actualización del perfil con el servidor. Modo offline activado:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const tabs = [
    { name: 'Productos', path: '/tienda' },
    { name: 'Promociones', path: '/tienda/promociones' },
    { name: 'Categorías', path: '/tienda/categorias' },
    { name: 'Carrito', path: '/tienda/carrito', badge: cart.reduce((acc, item) => acc + item.quantity, 0) },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#E0E7FF]/50 text-slate-900">
      <header className="w-full bg-[#C7D2FE] px-6 py-3 flex justify-between items-center border-b border-indigo-200">
        <div className="flex items-center bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 cursor-pointer" onClick={() => router.push('/tienda')}>
          <span className="text-emerald-600 font-extrabold text-sm flex items-center gap-1">📊 CustomPage</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2.5 bg-transparent px-3 py-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none cursor-pointer">
            <span className="text-sm font-bold text-indigo-950">Usuario</span>
            <div className="w-9 h-9 rounded-full border-2 border-slate-900 flex items-center justify-center overflow-hidden bg-white text-xl font-bold">
              {customer.avatarUrl ? <img src={customer.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : '👤'}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-slate-900 rounded-2xl shadow-xl z-50 p-4 text-slate-800">
              {!isEditing ? (
                <>
                  <div className="border-b border-slate-200 pb-3 mb-3">
                    <p className="text-[10px] font-extrabold text-emerald-600 uppercase">Perfil {customer.role}</p>
                    <p className="text-base font-black text-slate-900 mt-1">{customer.name}</p>
                    <p className="text-xs font-semibold text-slate-500 truncate">{customer.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Teléfono</span>
                      <span className="font-bold text-slate-700">{customer.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Dirección 📍</span>
                      <span className="font-bold text-slate-700 block leading-tight">{customer.address}</span>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-400 font-bold rounded-xl text-xs transition-all cursor-pointer">
                      ✏️ Editar Perfil
                    </button>
                    <button onClick={handleLogout} className="w-full py-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold border border-rose-200 transition-all cursor-pointer">
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 text-xs">
                  <h3 className="font-black text-slate-900">Editar Información</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">URL Imagen de Perfil</label>
                    <input type="text" value={editAvatar} onChange={(e) => setEditAvatar(e.target.value)} placeholder="https://..." className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Teléfono</label>
                    <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dirección de Envío</label>
                    <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium" />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold rounded-xl cursor-pointer">Cancelar</button>
                    <button onClick={handleSaveProfile} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl cursor-pointer">Guardar</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <nav className="w-full bg-indigo-200 flex items-center border-b border-indigo-300">
        {tabs.map((tab, idx) => {
          const isActive = pathname === tab.path;
          return (
            <button key={idx} onClick={() => router.push(tab.path)} className="flex-1 py-4 px-4 text-sm font-black text-center border-r border-indigo-300/60 transition-all cursor-pointer relative" style={{ backgroundColor: isActive ? '#E0E7FF' : 'transparent', color: isActive ? '#1E1B4B' : '#4338CA' }}>
              {tab.name}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-2 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="flex-1 w-full p-6">{children}</main>
    </div>
  );
}