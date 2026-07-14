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
    { id: '1', name: 'Celimax Noni Ampoule', sales: 20, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100' },
    { id: '2', name: 'Anua Heartleaf', sales: 17, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100' },
    { id: '3', name: 'Anua Niacinamide', sales: 34, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100' },
    { id: '4', name: 'Anua Heartleaf Cream', sales: 24, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=100' },
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

  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Petición directa al API Gateway que procesa la agregación vía BFF
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
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase">Clientes</span>
              <span className="text-base font-black text-slate-900 leading-tight">Registrados</span>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.registeredClients}</span>
              <span className="text-[11px] text-slate-500 font-bold mt-1">{metrics.registeredClients} Registrados</span>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-3xl">👥</span>
              <span className="text-xs text-emerald-600 font-black">📈 ~</span>
            </div>
          </div>

          {/* Total de Productos */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase">Total De</span>
              <span className="text-base font-black text-slate-900 leading-tight">Productos</span>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.totalProducts}</span>
              <span className="text-[11px] text-slate-500 font-bold mt-1">{metrics.totalProducts} Productos</span>
            </div>
            <span className="text-3xl self-start">Box</span>
          </div>

          {/* Visitas al Sitio Web */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-500 uppercase">Visitas Al</span>
              <span className="text-base font-black text-slate-900 leading-tight">Sitio WEB</span>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.websiteVisits}</span>
              <span className="text-[11px] text-emerald-600 font-extrabold mt-1">{metrics.visitsIncrement}% De Incremento</span>
            </div>
            <span className="text-3xl self-start">🌐</span>
          </div>

          {/* Número de Pedidos */}
          <div className="bg-white border-2 border-slate-900 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase">Número De</span>
                  <span className="text-base font-black text-slate-900 leading-tight">Pedidos</span>
                </div>
                <span className="text-2xl">🛒</span>
              </div>
              <span className="text-3xl font-black text-slate-900 mt-2">{metrics.totalOrders}</span>
              <div className="w-full bg-slate-100 h-2.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Sección de Gráfico y Top Productos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Gráfico de Pedidos vs Visitas */}
          <div className="lg:col-span-7 bg-white/40 p-6 rounded-[28px] border border-slate-100 flex flex-col">
            <h3 className="text-center text-xs font-black text-slate-700 tracking-wider uppercase mb-6">
              Pedidos VS Visitas Por Mes
            </h3>

            <div className="flex h-64 items-end justify-between px-4 border-b border-slate-300 pb-2 relative">
              {/* Líneas de escala de fondo simuladas */}
              <div className="absolute left-0 right-0 bottom-[0%] border-b border-slate-200/60 pointer-events-none"></div>
              <div className="absolute left-0 right-0 bottom-[25%] border-b border-slate-200/60 pointer-events-none"></div>
              <div className="absolute left-0 right-0 bottom-[50%] border-b border-slate-200/60 pointer-events-none"></div>
              <div className="absolute left-0 right-0 bottom-[75%] border-b border-slate-200/60 pointer-events-none"></div>

              {monthlyStats.map((stat, idx) => {
                const colors = [
                  ['bg-blue-400', 'bg-blue-500'],
                  ['bg-purple-300', 'bg-purple-400'],
                  ['bg-orange-300', 'bg-orange-400'],
                  ['bg-yellow-400', 'bg-yellow-500'],
                  ['bg-red-400', 'bg-red-500'],
                ];
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group z-10">
                    <div className="flex gap-1.5 items-end h-48 w-full justify-center">
                      {/* Barra Pedidos */}
                      <div
                        className={`w-4 sm:w-6 ${colors[idx % colors.length][0]} rounded-t-sm transition-all duration-500`}
                        style={{ height: `${(stat.pedidos / 140) * 100}%` }}
                        title={`Pedidos: ${stat.pedidos}`}
                      ></div>
                      {/* Barra Visitas */}
                      <div
                        className={`w-4 sm:w-6 ${colors[idx % colors.length][1]} rounded-t-sm transition-all duration-500`}
                        style={{ height: `${(stat.visitas / 140) * 100}%` }}
                        title={`Visitas: ${stat.visitas}`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Eje X Etiquetas de Meses */}
            <div className="flex justify-between px-4 pt-2 text-[11px] font-black text-slate-500">
              {monthlyStats.map((stat, idx) => (
                <span key={idx} className="flex-1 text-center">{stat.month}</span>
              ))}
            </div>
          </div>

          {/* Top 4 Productos Más Vendidos */}
          <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-[32px] p-6 shadow-sm flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
              Top 4 Productos Mas Vendidos
            </h3>

            <div className="flex flex-col divide-y-2 divide-slate-900 border-b-2 border-slate-900">
              {topProducts.map((product) => (
                <div key={product.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-black text-slate-800 leading-tight">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-xl font-black text-slate-900 pr-2">
                    {product.sales}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}