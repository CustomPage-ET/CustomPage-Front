'use client';

import React, { useState, useRef, useEffect } from 'react';

// Subcomponente interno para selectores de color optimizados
interface ColorSelectorProps {
  label: string;
  currentColor: string;
  presets: string[];
  onColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ label, currentColor, presets, onColorChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="block text-xs font-bold text-slate-500">{label}</label>
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1.5">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
              currentColor.toLowerCase() === color.toLowerCase()
                ? 'border-slate-800 scale-110 shadow-md ring-1 ring-slate-400'
                : 'border-slate-200 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <label className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center bg-white hover:bg-slate-100 active:scale-95 transition-all cursor-pointer text-slate-500 text-sm font-bold shadow-sm">
        +
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="sr-only"
        />
      </label>
      <span className="text-[10px] font-mono font-extrabold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 shadow-sm">
        {currentColor.toUpperCase()}
      </span>
    </div>
  </div>
);

export default function GestionarContenidoPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados inicializados con fallbacks seguros para evitar errores de hidratación SSR
  const [logoPreview, setLogoPreview] = useState<string>('/logo-clean.png');
  const [aboutImagePreview, setAboutImagePreview] = useState<string>('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400');
  const [siteName, setSiteName] = useState('Mi Tienda K-Beauty');
  const [aboutText, setAboutText] = useState('');

  const [buttonColor, setButtonColor] = useState('#8EB8B2');
  const [mainTextColor, setMainTextColor] = useState('#1F2937');
  const [boxBgColor, setBoxBgColor] = useState('#FFFFFF');

  const [presetButtons, setPresetButtons] = useState(['#FF9494', '#A8E6CF', '#8EB8B2', '#DED2F9']);
  const [presetTexts, setPresetTexts] = useState(['#1F2937', '#4B5563', '#111827', '#374151']);
  const [presetBackgrounds, setPresetBackgrounds] = useState(['#FFFFFF', '#F9FAFB', '#F3F4F6', '#FFF5F5']);

  const [headerPreview, setHeaderPreview] = useState<string>('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400');
  const [bgPreview, setBgPreview] = useState<string>('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400');
  const [fontFamily, setFontFamily] = useState('Geist Sans');
  const [fontSize, setFontSize] = useState('14px');
  const [fontColor, setFontColor] = useState('#4B5563');
  const [phone, setPhone] = useState('+569 ');
  const [email, setEmail] = useState('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const aboutImgInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Carga segura y unificada asíncrona en el cliente
  useEffect(() => {
    setLogoPreview(localStorage.getItem('web_logo') || '/logo-clean.png');
    setAboutImagePreview(localStorage.getItem('web_about_img') || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400');
    setSiteName(localStorage.getItem('web_site_name') || 'Mi Tienda K-Beauty');
    setAboutText(localStorage.getItem('web_about_text') || '');
    setHeaderPreview(localStorage.getItem('web_header_img') || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400');
    setBgPreview(localStorage.getItem('web_bg_img') || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400');
    setFontFamily(localStorage.getItem('web_font') || 'Geist Sans');
    setFontSize(localStorage.getItem('web_font_size') || '14px');
    setFontColor(localStorage.getItem('web_font_color') || '#4B5563');
    setPhone(localStorage.getItem('web_phone') || '+569 ');
    setEmail(localStorage.getItem('web_email') || 'ejemplo@tienda.com');

    setButtonColor(localStorage.getItem('web_button_color') || '#8EB8B2');
    setMainTextColor(localStorage.getItem('web_main_text_color') || '#1F2937');
    setBoxBgColor(localStorage.getItem('web_box_bg_color') || '#FFFFFF');

    const savedButtonHistory = localStorage.getItem('history_buttons');
    const savedTextHistory = localStorage.getItem('history_texts');
    const savedBgHistory = localStorage.getItem('history_backgrounds');

    if (savedButtonHistory) setPresetButtons(JSON.parse(savedButtonHistory));
    if (savedTextHistory) setPresetTexts(JSON.parse(savedTextHistory));
    if (savedBgHistory) setPresetBackgrounds(JSON.parse(savedBgHistory));
  }, []);

  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleColorSelection = (
    newColor: string,
    activeKey: string,
    setActiveState: React.Dispatch<React.SetStateAction<string>>,
    currentHistory: string[],
    setHistory: React.Dispatch<React.SetStateAction<string[]>>,
    historyKey: string
  ) => {
    setActiveState(newColor);
    localStorage.setItem(activeKey, newColor);

    const filtered = currentHistory.filter(color => color.toLowerCase() !== newColor.toLowerCase());
    const updated = [newColor, ...filtered].slice(0, 4);
    setHistory(updated);
    localStorage.setItem(historyKey, JSON.stringify(updated));

    triggerNotification("Color modificado y guardado.");
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string>>,
    storageKey: string,
    sectionName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        localStorage.setItem(storageKey, base64String);
        triggerNotification(`${sectionName} actualizada en tiempo real.`);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('web_site_name', siteName);
    localStorage.setItem('web_about_text', aboutText);
    localStorage.setItem('web_font', fontFamily);
    localStorage.setItem('web_font_size', fontSize);
    localStorage.setItem('web_font_color', fontColor);
    localStorage.setItem('web_phone', phone);
    localStorage.setItem('web_email', email);

    triggerNotification('¡Estructura de textos y fuentes propagada con éxito!');
  };

  return (
    <div className="w-full text-slate-800">
      <input type="file" accept="image/*" ref={logoInputRef} className="hidden" onChange={(e) => handleImageChange(e, setLogoPreview, 'web_logo', 'Imagen de Logo')} />
      <input type="file" accept="image/*" ref={aboutImgInputRef} className="hidden" onChange={(e) => handleImageChange(e, setAboutImagePreview, 'web_about_img', 'Imagen Sobre Nosotros')} />
      <input type="file" accept="image/*" ref={headerInputRef} className="hidden" onChange={(e) => handleImageChange(e, setHeaderPreview, 'web_header_img', 'Imagen de Cabecera')} />
      <input type="file" accept="image/*" ref={bgInputRef} className="hidden" onChange={(e) => handleImageChange(e, setBgPreview, 'web_bg_img', 'Imagen de Fondo')} />

      <main className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Gestionar Contenido</h2>
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl shadow-sm animate-fade-in">
              ✅ {successMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSaveChanges} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* COLUMNA IZQUIERDA: GESTIÓN DE MARCA */}
          <div className="bg-slate-50/50 p-6 rounded-[28px] border border-slate-200/60 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">Gestión de marca</h3>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="space-y-2 flex-shrink-0">
                <div className="w-40 h-24 rounded-xl border bg-white overflow-hidden relative shadow-inner flex items-center justify-center">
                  <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                </div>
                <button type="button" onClick={() => logoInputRef.current?.click()} className="w-40 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-800 font-extrabold text-xs transition-colors">
                  Actualizar Logo
                </button>
              </div>

              <div className="flex-1 space-y-5 w-full">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del sitio:</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => { setSiteName(e.target.value); localStorage.setItem('web_site_name', e.target.value); }}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
                  />
                </div>

                <ColorSelector
                  label="Color de Botones y Acciones:"
                  currentColor={buttonColor}
                  presets={presetButtons}
                  onColorChange={(color) => handleColorSelection(color, 'web_button_color', setButtonColor, presetButtons, setPresetButtons, 'history_buttons')}
                />

                <ColorSelector
                  label="Color de Títulos y Textos Principales:"
                  currentColor={mainTextColor}
                  presets={presetTexts}
                  onColorChange={(color) => handleColorSelection(color, 'web_main_text_color', setMainTextColor, presetTexts, setPresetTexts, 'history_texts')}
                />

                <ColorSelector
                  label="Color de Casillas, Cuadrados y Fondos:"
                  currentColor={boxBgColor}
                  presets={presetBackgrounds}
                  onColorChange={(color) => handleColorSelection(color, 'web_box_bg_color', setBoxBgColor, presetBackgrounds, setPresetBackgrounds, 'history_backgrounds')}
                />
              </div>
            </div>

            {/* Sección Sobre Nosotros */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <label className="block text-xs font-extrabold uppercase tracking-wide text-slate-500">Sección sobre nosotros:</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="space-y-2 flex-shrink-0">
                  <div className="w-40 h-28 rounded-xl border bg-white overflow-hidden shadow-inner">
                    <img src={aboutImagePreview} alt="Sobre nosotros" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => aboutImgInputRef.current?.click()} className="w-40 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-800 font-extrabold text-xs text-center">
                    Subir Imágenes
                  </button>
                </div>
                <div className="flex-1 w-full">
                  <textarea
                    rows={4}
                    placeholder="Escribe el texto corporativo de presentación..."
                    value={aboutText}
                    onChange={(e) => { setAboutText(e.target.value); localStorage.setItem('web_about_text', e.target.value); }}
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ESTILO VISUAL Y CONTACTO */}
          <div className="bg-slate-50/50 p-6 rounded-[28px] border border-slate-200/60 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 border-b pb-2">Estilo visual</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-500">Previsualizar Cabecera:</span>
                  <div className="w-full h-20 rounded-xl border bg-white overflow-hidden shadow-inner">
                    <img src={headerPreview} alt="Cabecera" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => headerInputRef.current?.click()} className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-800 font-extrabold text-xs">
                    Actualizar Cabecera
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="block text-xs font-bold text-slate-500">Previsualizar Fondo:</span>
                  <div className="w-full h-20 rounded-xl border bg-white overflow-hidden shadow-inner">
                    <img src={bgPreview} alt="Fondo" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => bgInputRef.current?.click()} className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-800 font-extrabold text-xs">
                    Actualizar Fondo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Seleccionar fuente:</label>
                  <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); localStorage.setItem('web_font', e.target.value); }} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none">
                    <option value="Geist Sans">Geist Sans</option>
                    <option value="Inter">Inter (Global)</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tamaño de fuente:</label>
                  <select value={fontSize} onChange={(e) => { setFontSize(e.target.value); localStorage.setItem('web_font_size', e.target.value); }} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none">
                    <option value="12px">Pequeño (12px)</option>
                    <option value="14px">Mediano (14px)</option>
                    <option value="16px">Grande (16px)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-xs font-bold text-slate-500">Color de Fuente:</label>
                <div className="flex items-center gap-2.5">
                  <label className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center bg-white hover:bg-slate-100 active:scale-95 transition-all cursor-pointer text-slate-500 text-sm font-bold shadow-sm">
                    +
                    <input type="color" value={fontColor} onChange={(e) => { setFontColor(e.target.value); localStorage.setItem('web_font_color', e.target.value); }} className="sr-only" />
                  </label>
                  <span className="text-[10px] font-mono font-extrabold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 shadow-sm">
                    {fontColor.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">Datos de contacto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Número:</label>
                    <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value); localStorage.setItem('web_phone', e.target.value); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Correo:</label>
                    <input type="email" placeholder="ejemplo@tienda.com" value={email} onChange={(e) => { setEmail(e.target.value); localStorage.setItem('web_email', e.target.value); }} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button type="submit" className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-full shadow-sm transition-transform active:scale-95 cursor-pointer">
                Guardar todo
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}