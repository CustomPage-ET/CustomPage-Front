'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-soft border border-gray-100">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Crear una cuenta</h1>
          <p className="text-sm text-brand-muted mt-1">Regístrate para empezar a personalizar tu catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nombre Completo"
            type="text"
            placeholder="Tu nombre y apellido"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Registrarse
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-brand-muted">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-brand-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}