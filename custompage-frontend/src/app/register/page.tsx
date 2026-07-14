'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
    // 1. Ejecución inicial al montar el componente
    syncLocalStorageData();

    // 2. Escuchar cambios de localStorage desde otras ventanas o pestañas abiertas
    const handleStorageChange = () => {
      syncLocalStorageData();
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Sincronización proactiva cada 500ms por si los cambios ocurren en la misma pestaña
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

    const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

    try {
      const response = await fetch(`${gatewayUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar la cuenta');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-6 relative overflow-hidden animate-dynamic-bg"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize, // Aplica el tamaño dinámico del panel
        color: fontColor   // Aplica el color de fuente general del panel
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
          style={{ color: mainTextColor }} // Usa el color de texto principal del panel
        >
          ← Volver atrás
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center z-10 py-10">
        <div
          className="w-full max-w-md backdrop-blur-md rounded-[32px] p-8 border border-white/60 shadow-lg"
          style={{ backgroundColor: boxBgColor }} // Color personalizado de casillas/cuadrados de fondo
        >
          <div className="mb-6 text-center">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: mainTextColor }} // Color para títulos principales
            >
              Crear una cuenta
            </h1>
            <p className="text-xs font-bold mt-1 opacity-80">
              Regístrate para personalizar tu catálogo
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100/50 text-rose-700 text-xs font-semibold rounded-2xl shadow-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre Completo:"
              type="text"
              placeholder="Tu nombre y apellido"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
            <Input
              label="Correo electrónico:"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
            />
            <Input
              label="Contraseña:"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 text-white font-bold text-sm rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: buttonColor }} // Color personalizado para barra de botones
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-black/10 text-center">
            <p className="text-xs font-bold opacity-80">
              ¿Ya tienes una cuenta?{' '}
              <span
                onClick={() => router.push('/login')}
                className="underline cursor-pointer font-bold"
                style={{ color: buttonColor }} // Aplica el color de los llamados a la acción
              >
                Inicia sesión aquí
              </span>
            </p>
          </div>
        </div>
      </main>

      <div className="h-10"></div>
    </div>
  );
}