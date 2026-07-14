'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 3 Barritas de Colores Independientes
  const [buttonColor, setButtonColor] = useState('#8EB8B2');    // Color para botones y acciones
  const [mainTextColor, setMainTextColor] = useState('#1F2937'); // Color para títulos y textos principales
  const [boxBgColor, setBoxBgColor] = useState('#FFFFFF');     // Color para casillas, cuadrados y fondos de tarjetas

  // Configuración extendida de Tipografía
  const [logoUrl, setLogoUrl] = useState('/logo-clean.png');
  const [fontFamily, setFontFamily] = useState('inherit');
  const [fontSize, setFontSize] = useState('16px');             // Tamaño base de la fuente
  const [fontColor, setFontColor] = useState('#4B5563');        // Color general de la fuente

  // Función aislada para sincronizar el estado visual con localStorage en tiempo real
  const syncLocalStorageData = () => {
    if (typeof window !== 'undefined') {
      setLogoUrl(localStorage.getItem('web_logo') || '/logo-clean.png');

      // Carga de las 3 variables de color personalizadas
      setButtonColor(localStorage.getItem('web_button_color') || '#8EB8B2');
      setMainTextColor(localStorage.getItem('web_main_text_color') || '#1F2937');
      setBoxBgColor(localStorage.getItem('web_box_bg_color') || '#FFFFFF');

      // Carga de la configuración avanzada de fuentes
      setFontSize(localStorage.getItem('web_font_size') || '16px');
      setFontColor(localStorage.getItem('web_font_color') || '#4B5563');

      const savedFont = localStorage.getItem('web_font');
      if (savedFont) {
        setFontFamily(savedFont === 'Playfair Display' ? 'serif' : 'sans-serif');
      }
    }
  };

  // Cargar y escuchar configuraciones en tiempo real
  useEffect(() => {
    syncLocalStorageData();

    const handleStorageChange = () => {
      syncLocalStorageData();
    };
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      syncLocalStorageData();
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // 1. CREDENCIALES DE BYPASS OFFLINE (LOCALES)
    const BYPASS_EMAIL = 'admin@custompage.com';
    const BYPASS_PASSWORD = 'admin123';

    const CLIENT_BYPASS_EMAIL = 'cliente.prueba@custompage.com';
    const CLIENT_BYPASS_PASSWORD = '123456';

    // Bypass para Administrador
    if (email.toLowerCase() === BYPASS_EMAIL && password === BYPASS_PASSWORD) {
      localStorage.setItem('token', 'fake-bypass-jwt-token-2026');
      localStorage.setItem('user', JSON.stringify({ email: BYPASS_EMAIL, role: 'admin' }));
      router.push('/admin/productos');
      return;
    }

    // Bypass para Cliente
    if (email.toLowerCase() === CLIENT_BYPASS_EMAIL && password === CLIENT_BYPASS_PASSWORD) {
      localStorage.setItem('token', 'mock-client-token-xyz');
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: 'Lucía Fernández',
          email: CLIENT_BYPASS_EMAIL,
          role: 'Cliente',
          phone: '+56 9 8765 4321',
          address: 'Av. El Bosque 1234, Santiago'
        })
      );
      router.push('/tienda');
      return;
    }

    // 2. CONEXIÓN REAL AL BACKEND
    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      const userRole = data.user?.role;
      if (userRole === 'admin') {
        router.push('/admin/productos');
      } else {
        router.push('/tienda');
      }

      router.refresh();
    } catch (err: any) {
      console.warn("Error en la conexión con el servidor. Se mantienen accesos offline locales.", err);
      setError(
        err.message === 'Failed to fetch'
          ? 'El backend no responde. Usa las credenciales offline de Admin o Cliente.'
          : err.message || 'Ocurrió un error al intentar iniciar sesión'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-6 relative overflow-hidden animate-dynamic-bg"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: fontColor
      }}
    >
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center z-10">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="CustomPage Logo"
            className="h-11 object-contain mix-blend-multiply"
          />
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2.5 rounded-full bg-white/80 text-xs font-bold hover:bg-white active:scale-95 border border-indigo-100/50 shadow-sm transition-all cursor-pointer"
          style={{ color: mainTextColor }}
        >
          ← Volver atrás
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center z-10 py-10">
        <div
          className="w-full max-w-md backdrop-blur-md rounded-[32px] p-8 border border-white/60 shadow-lg"
          style={{ backgroundColor: boxBgColor }}
        >
          <div className="mb-6 text-center">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: mainTextColor }}
            >
              Iniciar Sesión
            </h1>
            <p className="text-xs font-semibold mt-1 opacity-80">
              Accede a tu cuenta de CustomPage
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-100/50 text-rose-700 text-xs font-semibold rounded-2xl shadow-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo Electrónico:"
              type="email"
              placeholder="E.ejemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Contraseña:"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 text-white font-bold text-sm rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: buttonColor }}
              >
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          {/* Indicador visual de credenciales offline extendido */}
          <div className="mt-6 p-3 bg-black/5 rounded-xl border border-black/10 text-[10px] text-center font-medium leading-relaxed flex flex-col gap-1">
            <span>💡 <strong>Desarrollo Offline habilitado:</strong></span>
            <div>
              <span className="font-bold" style={{ color: mainTextColor }}>Admin:</span> admin@custompage.com / admin123
            </div>
            <div>
              <span className="font-bold" style={{ color: mainTextColor }}>Cliente:</span> cliente.prueba@custompage.com / 123456
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-black/10 flex flex-col items-center space-y-4">
            <div className="flex justify-between w-full text-xs font-bold">
              <Link href="/register" className="cursor-pointer hover:underline" style={{ color: buttonColor }}>
                ¿No tienes una cuenta?
              </Link>
              <span className="cursor-pointer hover:underline opacity-70">¿Olvidaste la contraseña?</span>
            </div>

            <Link href="/register" className="w-full">
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                Regístrate
              </button>
            </Link>
          </div>
        </div>
      </main>

      <div className="h-10"></div>
    </div>
  );
}