'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfbfe] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-soft border border-gray-100">

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-sm text-[#6b6686] mt-1">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-1.5">
              <Link href="#" className="text-xs font-medium text-[#6366f1] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Iniciar Sesión
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-[#6b6686]">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-semibold text-[#6366f1] hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}