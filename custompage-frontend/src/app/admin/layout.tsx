'use client';

import React from 'react';
import AdminNavigationLayout from '@/components/common/AdminSidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminNavigationLayout>
      {children}
    </AdminNavigationLayout>
  );
}