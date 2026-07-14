'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigationLayout from '@/components/common/AdminSidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !savedUser) {
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role !== 'admin') {
          // Si no tiene rol de administrador, redirigir a la tienda pública
          router.push('/tienda');
        }
      } catch (error) {
        console.error("Error al verificar los permisos del administrador:", error);
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <AdminNavigationLayout>
      {children}
    </AdminNavigationLayout>
  );
}