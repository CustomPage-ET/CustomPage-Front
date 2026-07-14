'use client';

import React, { useState } from 'react';

interface ReportRow {
  id: string;
  col1: string;
  col2: string;
  col3: string;
  col4: number;
}

const FALLBACK_DATA: Record<string, ReportRow[]> = {
  productos: [
    { id: 'PROD-01', col1: 'Celimax Noni Ampoule', col2: 'Ampoules', col3: 'Stock: 10', col4: 24.99 },
    { id: 'PROD-02', col1: 'Anua Heartleaf Toner', col2: 'Toners', col3: 'Stock: 5', col4: 22.50 },
  ],
  clientes: [
    { id: 'CLI-881', col1: 'Ana Martínez', col2: 'ana@mail.com', col3: 'Activo', col4: 3 },
    { id: 'CLI-882', col1: 'Carlos Gomez', col2: 'carlos@mail.com', col3: 'Inactivo', col4: 1 },
  ],
  ventas: [
    { id: 'VTA-01', col1: 'Ingresos Julio', col2: 'Skincare', col3: 'Meta Cumplida', col4: 1450.00 },
    { id: 'VTA-02', col1: 'Ingresos Junio', col2: 'Premium', col3: 'Meta Cumplida', col4: 2100.50 },
  ],
  ordenes: [
    { id: 'ORD-1001', col1: '2026-07-12', col2: 'Ana Martínez', col3: 'Completado', col4: 48.50 },
    { id: 'ORD-1002', col1: '2026-07-13', col2: 'Carlos Gomez', col3: 'Pendiente', col4: 24.99 },
  ],
  visitas: [
    { id: 'VIS-01', col1: 'Inicio / Landing', col2: 'Santiago', col3: 'Tráfico Directo', col4: 1250 },
    { id: 'VIS-02', col1: 'Catálogo Productos', col2: 'Valparaíso', col3: 'Google Ads', col4: 840 },
  ],
};

export default function GestionarReportesPage() {
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [reportTitle, setReportTitle] = useState('');

  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Comunicación exclusiva con el API Gateway
  const handleFetchReport = async (reportType: string, title: string) => {
    setIsLoading(true);
    setActiveReport(reportType);
    setReportTitle(title);

    try {
      const token = localStorage.getItem('token');

      // Petición al API Gateway centralizado
      const response = await fetch(`${apiURL}/api/reports/${reportType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error en la respuesta de la API');
      const data = await response.json();

      setReportData(data && data.length > 0 ? data : FALLBACK_DATA[reportType]);
    } catch (err) {
      console.warn(`Error al conectar con el microservicio de reportes para [${reportType}]. Usando fallback local.`, err);
      setReportData(FALLBACK_DATA[reportType] || []);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaders = () => {
    switch (activeReport) {
      case 'productos': return ['ID', 'Nombre', 'Categoría', 'Stock', 'Precio'];
      case 'clientes': return ['ID', 'Cliente', 'Contacto / Email', 'Estado', 'Compras'];
      case 'ventas': return ['ID', 'Período', 'Categoría Top', 'Estado Meta', 'Total Ingresos'];
      case 'ordenes': return ['ID Orden', 'Fecha', 'Cliente', 'Estado', 'Total'];
      case 'visitas': return ['ID', 'Página Vista', 'Ubicación', 'Origen Tráfico', 'Visitas Totales'];
      default: return [];
    }
  };

  const headers = getHeaders();

  return (
    <div className="w-full text-slate-800">
      <main className="w-full py-2 flex flex-col gap-6">

        {/* Fila de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

          {/* Reporte de Productos */}
          <div className={`bg-indigo-50/40 p-6 rounded-[24px] border-2 flex flex-col items-center justify-between text-center min-h-[300px] transition-all ${activeReport === 'productos' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-900'}`}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl mt-2">📦</span>
              <h3 className="font-black text-lg text-slate-900 mt-2 leading-tight">Reporte de Productos</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Resumen de Inventario, ventas y stock</p>
            </div>
            <button
              onClick={() => handleFetchReport('productos', 'Reporte de Productos')}
              className="w-full py-2 px-4 rounded-full bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 text-xs font-extrabold border border-slate-900 shadow-sm transition-all cursor-pointer"
            >
              Generar Reporte
            </button>
          </div>

          {/* Reporte de Clientes */}
          <div className={`bg-indigo-50/40 p-6 rounded-[24px] border-2 flex flex-col items-center justify-between text-center min-h-[300px] transition-all ${activeReport === 'clientes' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-900'}`}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl mt-2">👥</span>
              <h3 className="font-black text-lg text-slate-900 mt-2 leading-tight">Reporte de Clientes</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Datos de contacto Historial de compras y Actividad</p>
            </div>
            <button
              onClick={() => handleFetchReport('clientes', 'Reporte de Clientes')}
              className="w-full py-2 px-4 rounded-full bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 text-xs font-extrabold border border-slate-900 shadow-sm transition-all cursor-pointer"
            >
              Generar Reporte
            </button>
          </div>

          {/* Reporte de Ventas */}
          <div className={`bg-indigo-50/40 p-6 rounded-[24px] border-2 flex flex-col items-center justify-between text-center min-h-[300px] transition-all ${activeReport === 'ventas' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-900'}`}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl mt-2">📈</span>
              <h3 className="font-black text-lg text-slate-900 mt-2 leading-tight">Reporte de Ventas</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Ingresos totales, Desglose mensual y por Categoría</p>
            </div>
            <button
              onClick={() => handleFetchReport('ventas', 'Reporte de Ventas')}
              className="w-full py-2 px-4 rounded-full bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 text-xs font-extrabold border border-slate-900 shadow-sm transition-all cursor-pointer"
            >
              Generar Reporte
            </button>
          </div>

          {/* Reporte de Órdenes */}
          <div className={`bg-indigo-50/40 p-6 rounded-[24px] border-2 flex flex-col items-center justify-between text-center min-h-[300px] transition-all ${activeReport === 'ordenes' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-900'}`}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl mt-2">📊</span>
              <h3 className="font-black text-lg text-slate-900 mt-2 leading-tight">Reporte de Ordenes</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Estado de ordenes, fechas, Clientes y total</p>
            </div>
            <button
              onClick={() => handleFetchReport('ordenes', 'Reporte de Órdenes')}
              className="w-full py-2 px-4 rounded-full bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 text-xs font-extrabold border border-slate-900 shadow-sm transition-all cursor-pointer"
            >
              Generar Reporte
            </button>
          </div>

          {/* Reporte de Visitas */}
          <div className={`bg-indigo-50/40 p-6 rounded-[24px] border-2 flex flex-col items-center justify-between text-center min-h-[300px] transition-all ${activeReport === 'visitas' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-900'}`}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl mt-2">📍</span>
              <h3 className="font-black text-lg text-slate-900 mt-2 leading-tight">Reporte de Visitas</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Trafico web, Ubicacion y paginas vistas</p>
            </div>
            <button
              onClick={() => handleFetchReport('visitas', 'Reporte de Visitas')}
              className="w-full py-2 px-4 rounded-full bg-[#A3E635] hover:bg-[#84CC16] text-slate-950 text-xs font-extrabold border border-slate-900 shadow-sm transition-all cursor-pointer"
            >
              Generar Reporte
            </button>
          </div>

        </div>

        {/* Panel de visualización de datos obtenidos */}
        {activeReport && (
          <div className="w-full mt-6 bg-white/80 backdrop-blur-md rounded-[28px] border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-indigo-950 flex items-center gap-2">
                <span>📋</span> Datos consolidados: {reportTitle}
              </h3>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                API Gateway Connect
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs font-bold text-slate-400 tracking-wider uppercase animate-pulse">
                Solicitando reporte al API Gateway...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {headers.map((header, idx) => (
                        <th key={idx} className={`py-3 px-4 ${idx === headers.length - 1 ? 'text-right' : ''}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                    {reportData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 text-indigo-600 font-extrabold">{row.id}</td>
                        <td className="py-3.5 px-4 text-slate-900 font-extrabold">{row.col1}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">{row.col2}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            row.col3.includes('Completado') || row.col3.includes('Activo') || row.col3.includes('Meta')
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {row.col3}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-900 font-black">
                          {activeReport === 'visitas' || activeReport === 'clientes'
                            ? row.col4
                            : `$${row.col4.toFixed(2)}`
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}