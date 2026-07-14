'use client';

import React, { useEffect, useState } from 'react';

interface DashboardData {
  metrics: {
    registeredClients: number;
    totalProducts: number;
    websiteVisits: number;
    visitsIncrement: number;
    totalOrders: number;
  };
  topProducts: {
    id: string;
    name: string;
    sales: number;
    imageUrl: string;
  }[];
  monthlyStats: {
    month: string;
    pedidos: number;
    visitas: number;
  }[];
}

const FALLBACK_DASHBOARD: DashboardData = {
  metrics: {
    registeredClients: 475,
    totalProducts: 430,
    websiteVisits: 700,
    visitsIncrement: 20,
    totalOrders: 280,
  },
  topProducts: [
    { id: '1', name: 'Celimax Noni Ampoule', sales: 20, imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=100' },
    { id: '2', name: 'Anua Heartleaf', sales: 17, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100' },
    { id: '3', name: 'Anua Niacinamide', sales: 34, imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=100' },
    { id: '4', name: 'Anua Heartleaf Cream', sales: 24, imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=100' },
  ],
  monthlyStats: [
    { month: 'Marzo', pedidos: 40, visitas: 80 },
    { month: 'Abril', pedidos: 45, visitas: 90 },
    { month: 'Mayo', pedidos: 30, visitas: 80 },
    { month: 'Junio', pedidos: 75, visitas: 95 },
    { month: 'Julio', pedidos: 90, visitas: 130 },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${gatewayUrl}/dashboard/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error();
        const resData = await response.json();
        setData(resData);
      } catch (err) {
        console.warn("Servidor inalcanzable. Cargando datos de respaldo.");
        setData(FALLBACK_DASHBOARD);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [gatewayUrl]);

  if (isLoading || !data) {
    return (
      <div className="py-20 text-center text-xs font-bold text-slate-400 tracking-wider uppercase animate-pulse">
        Cargando métricas consolidadas desde el API Gateway...
      </div>
    );
  }

  const { metrics, topProducts, monthlyStats } = data;

  return (
    <div className="w-full text-slate-800">
      <main className="w-full py-2 flex flex-col gap-8">

        {/* Fila superior de Tarjetas Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Clientes Registrados */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm transition-all hover:-translate-y-0.5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clientes</span>
              <span className="text-base font-black text-slate-900 leading-tight">Registrados</span>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.registeredClients}</span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1">Usuarios activos en app</span>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-3xl">👥</span>
              <span className="text-xs text-emerald-600 font-black">📈 Activos</span>
            </div>
          </div>

          {/* Total de Productos */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm transition-all hover:-translate-y-0.5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inventario</span>
              <span className="text-base font-black text-slate-900 leading-tight">Total Productos</span>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.totalProducts}</span>
              <span className="text-[11px] text-slate-400 font-semibold mt-1">SKUs en catálogo</span>
            </div>
            <span className="text-3xl self-start">📦</span>
          </div>

          {/* Visitas al Sitio Web */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm transition-all hover:-translate-y-0.5">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tráfico</span>
              <span className="text-base font-black text-slate-900 leading-tight">Sitio Web</span>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.websiteVisits}</span>
              <span className="text-[11px] text-emerald-600 font-extrabold mt-1">+{metrics.visitsIncrement}% este mes</span>
            </div>
            <span className="text-3xl self-start">🌐</span>
          </div>

          {/* Número de Pedidos */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm transition-all hover:-translate-y-0.5">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversión</span>
                  <span className="text-base font-black text-slate-900 leading-tight">Pedidos Totales</span>
                </div>
                <span className="text-2xl">🛒</span>
              </div>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.totalOrders}</span>
              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Análisis Avanzado Interactivo */}
        <div className="w-full">
          <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">Análisis Avanzado de Rendimiento</h3>
          <p className="text-xs font-semibold text-slate-500 mb-4">Interactúa con las variables, alterna rangos de tiempo y analiza desviaciones estándar combinando Pedidos contra Visitas del periodo.</p>

          <GenerateWidget height="620px">
          {/* Reason: Renderiza un cuadro integral de analítica interactiva para explorar tendencias del negocio con D3.js y análisis estadístico con Math.js. */}
          ```json
          {
            "widgetSpec": {
              "height": "620px",
              "prompt": "**Objective:** Crear un dashboard interactivo avanzado para visualizar la relación entre Pedidos y Visitas con cálculos estadísticos. \n **Data State:** Utilizar la estructura mensual provista: Marzo (pedidos: 40, visitas: 80), Abril (45, 90), Mayo (30, 80), Junio (75, 95), Julio (90, 130). \n **Strategy:** Form Layout con área visual interactiva. \n **Inputs:** Selector de rango (Dropdown: 'Todos los meses', 'Últimos 3 meses'), Toggle de métricas ('Mostrar Ambos', 'Solo Pedidos', 'Solo Visitas'), Multiplicador de Proyección (Slider para estimar crecimiento de 1.0x a 2.0x). \n **Visuals/Behavior:** Renderizar un gráfico interactivo utilizando D3.js (líneas o barras duales optimizadas) que responda a los filtros. Incluir un panel informativo lateral con Math.js que calcule la Media, el Máximo y la Tasa de Conversión Promedio (Pedidos/Visitas) basada en los datos seleccionados."
            }
          }
          ```
          </GenerateWidget>
        </div>

        {/* Sección de Top Productos */}
        <div className="w-full bg-white border-2 border-slate-900 rounded-[32px] p-6 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
            Top 4 Productos Más Vendidos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((product) => (
              <div key={product.id} className="p-4 rounded-2xl border border-slate-200 flex items-center gap-4 bg-slate-50/50">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=100';
                    }}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-black text-slate-800 truncate leading-tight mb-1">
                    {product.name}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {product.sales} unidades vendidas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}