'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [showAccessModal, setShowAccessModal] = useState(false);
  const router = useRouter();

  // Estados dinámicos vinculados al panel de control
  const [siteName, setSiteName] = useState('Tu catálogo digital');
  const [logoUrl, setLogoUrl] = useState('/logo-clean.png');
  const [bgImage, setBgImage] = useState('');

  // 3 Barritas de Colores Independientes
  const [buttonColor, setButtonColor] = useState('#8EB8B2');
  const [mainTextColor, setMainTextColor] = useState('#1F2937');
  const [boxBgColor, setBoxBgColor] = useState('#FFFFFF');

  // Configuración extendida de Tipografía
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [fontColor, setFontColor] = useState('#4B5563');

  const syncLocalStorageData = () => {
    if (typeof window !== 'undefined') {
      setSiteName(localStorage.getItem('web_site_name') || 'Tu catálogo digital');
      setLogoUrl(localStorage.getItem('web_logo') || '/logo-clean.png');
      setBgImage(localStorage.getItem('web_bg_img') || '');

      setButtonColor(localStorage.getItem('web_button_color') || '#8EB8B2');
      setMainTextColor(localStorage.getItem('web_main_text_color') || '#1F2937');
      setBoxBgColor(localStorage.getItem('web_box_bg_color') || '#FFFFFF');

      setFontSize(localStorage.getItem('web_font_size') || '16px');
      setFontColor(localStorage.getItem('web_font_color') || '#4B5563');

      const savedFont = localStorage.getItem('web_font');
      if (savedFont) {
        setFontFamily(savedFont === 'Playfair Display' ? 'serif' : 'sans-serif');
      }
    }
  };

  useEffect(() => {
    // 1. Carga inicial desde LocalStorage
    syncLocalStorageData();

    // 2. Intentar descargar personalizaciones globales del Microservicio CMS / Configuración
    const fetchGlobalConfig = async () => {
      try {
        const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiURL}/api/config/global`);

        if (response.ok) {
          const config = await response.json();

          if (config.siteName) localStorage.setItem('web_site_name', config.siteName);
          if (config.logoUrl) localStorage.setItem('web_logo', config.logoUrl);
          if (config.bgImage) localStorage.setItem('web_bg_img', config.bgImage);
          if (config.buttonColor) localStorage.setItem('web_button_color', config.buttonColor);
          if (config.mainTextColor) localStorage.setItem('web_main_text_color', config.mainTextColor);
          if (config.boxBgColor) localStorage.setItem('web_box_bg_color', config.boxBgColor);
          if (config.fontSize) localStorage.setItem('web_font_size', config.fontSize);
          if (config.fontColor) localStorage.setItem('web_font_color', config.fontColor);
          if (config.fontFamily) localStorage.setItem('web_font', config.fontFamily);

          syncLocalStorageData();
        }
      } catch (error) {
        console.warn("API Gateway para CMS/Configuración inalcanzable. Utilizando personalizaciones locales en LocalStorage:", error);
      }
    };

    fetchGlobalConfig();

    const handleStorageChange = () => {
      syncLocalStorageData();
    };
    window.addEventListener('storage', handleStorageChange);

    // Intervalo de alta prioridad para forzar re-renderizado reactivo en la Home
    const interval = setInterval(() => {
      syncLocalStorageData();
    }, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleNavigation = (path: string) => {
    setShowAccessModal(false);
    router.push(path);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-hidden transition-all duration-300"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: fontColor,
        backgroundImage: bgImage ? `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Header / Barra Superior */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20 z-10">
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="CustomPage Logo"
            className="h-11 object-contain mix-blend-multiply"
          />
        </div>
        <button
          onClick={() => setShowAccessModal(true)}
          className="px-5 py-2 rounded-full text-white font-bold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          style={{ backgroundColor: buttonColor }}
        >
          Ingresar
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center items-center text-center z-10">
        <div className="max-w-3xl space-y-6">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border inline-block"
            style={{ backgroundColor: `${buttonColor}20`, color: buttonColor, borderColor: `${buttonColor}40` }}
          >
            Crea • Personaliza • Publica
          </span>
          <h1
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none"
            style={{ color: mainTextColor }}
          >
            {siteName} en <span style={{ color: buttonColor }}>cuestión de minutos</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto opacity-90" style={{ color: fontColor }}>
            La plataforma más intuitiva para estructurar tus productos, ordenar por módulos y ofrecer una experiencia de compra impecable a tus clientes.
          </p>
          <div className="pt-4">
            <button
              className="px-8 py-4 text-base text-white font-bold rounded-full shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              onClick={() => setShowAccessModal(true)}
              style={{ backgroundColor: buttonColor }}
            >
              Comenzar Ahora
            </button>
          </div>
        </div>

        {/* Sección de Características (Tarjetas reactivas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-16">
          <div
            className="backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300"
            style={{ backgroundColor: boxBgColor }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto bg-black/5" style={{ color: buttonColor }}>🎨</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: mainTextColor }}>Diseño Flexible</h3>
            <p className="text-sm leading-relaxed opacity-85" style={{ color: fontColor }}>
              Personaliza el aspecto, colores e identidad para que se adapte perfectamente a la esencia de tu marca.
            </p>
          </div>

          <div
            className="backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300"
            style={{ backgroundColor: boxBgColor }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto bg-black/5" style={{ color: buttonColor }}>📦</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: mainTextColor }}>Módulos Inteligentes</h3>
            <p className="text-sm leading-relaxed opacity-85" style={{ color: fontColor }}>
              Agrupa tus productos en categorías dinámicas y modifícalas en tiempo real desde tu panel de control.
            </p>
          </div>

          <div
            className="backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300"
            style={{ backgroundColor: boxBgColor }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto bg-black/5" style={{ color: buttonColor }}>🚀</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: mainTextColor }}>Pedidos Directos</h3>
            <p className="text-sm leading-relaxed opacity-85" style={{ color: fontColor }}>
              Tus clientes seleccionan lo que desean y completan su orden mediante un flujo de carrito intuitivo.
            </p>
          </div>
        </div>
      </main>

      {/* Modal de Acceso Interactivo */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 transition-all">
          <div
            className="rounded-3xl p-8 max-w-sm w-full border border-white/40 shadow-2xl relative"
            style={{ backgroundColor: boxBgColor }}
          >
            <button
              onClick={() => setShowAccessModal(false)}
              className="absolute top-4 right-4 text-sm font-bold cursor-pointer opacity-60 hover:opacity-100"
              style={{ color: mainTextColor }}
            >
              ✕
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto text-3xl">👋</div>
              <h2 className="text-2xl font-bold" style={{ color: mainTextColor }}>¿Cómo deseas continuar?</h2>
              <p className="text-sm opacity-85" style={{ color: fontColor }}>Accede a tu cuenta o únete a nosotros para empezar a crear.</p>
            </div>

            <div className="mt-8 space-y-3">
              <button
                className="w-full py-3 rounded-full font-bold text-sm text-white shadow-sm transition-all cursor-pointer"
                onClick={() => handleNavigation('/login')}
                style={{ backgroundColor: buttonColor }}
              >
                Inicia Sesión
              </button>
              <button
                className="w-full py-3 rounded-full font-bold text-sm bg-transparent border shadow-sm transition-all cursor-pointer"
                onClick={() => handleNavigation('/register')}
                style={{ color: mainTextColor, borderColor: buttonColor }}
              >
                Registrarme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs opacity-70 bg-white/10 border-t border-white/10">
        &copy; 2026 CustomPage. Todos los derechos reservados.
      </footer>
    </div>
  );
}