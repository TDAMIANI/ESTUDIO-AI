import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Lightbulb, DollarSign, TrendingUp, Users } from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Card, SpeakerNote } from './Shared';

const monthlyData = [
  { name: 'Ene', ingresos: 4500000, gastos: 3200000, rentabilidad: 1300000 },
  { name: 'Feb', ingresos: 5200000, gastos: 3400000, rentabilidad: 1800000 },
  { name: 'Mar', ingresos: 4800000, gastos: 3100000, rentabilidad: 1700000 },
  { name: 'Abr', ingresos: 6100000, gastos: 3800000, rentabilidad: 2300000 },
  { name: 'May', ingresos: 5900000, gastos: 3600000, rentabilidad: 2300000 },
  { name: 'Jun', ingresos: 7200000, gastos: 4100000, rentabilidad: 3100000 },
];

const clientData = [
  { name: 'Responsables Inscriptos', value: 45 },
  { name: 'Monotributistas', value: 120 },
  { name: 'Convenio Multilateral', value: 35 },
  { name: 'Empleadores', value: 60 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DashboardSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-48 mb-8">
        <img 
          src="https://picsum.photos/seed/data-dashboard-analytics/1200/300" 
          alt="Data Analytics" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-amber-900/70 flex items-center justify-between p-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              De Datos a Decisiones
            </h2>
            <p className="text-amber-100 text-lg">Cómo Gemini Advanced transforma tus Excels en Dashboards visuales.</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
        <Lightbulb className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900 text-lg">El poder del Análisis de Datos con IA</h4>
          <p className="text-amber-800 mt-1">
            No necesitas ser un experto en PowerBI. Podés subir un archivo Excel o CSV a Gemini Advanced y pedirle: <em>"Analizá esta facturación, creá gráficos de tendencia y decime qué mes fue el más rentable y por qué."</em> El resultado es similar a lo que ves abajo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Ingresos Totales (Semestre)</h3>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">$33.7M</p>
          <p className="text-sm text-emerald-600 flex items-center gap-1 mt-2 font-medium">
            <TrendingUp className="w-4 h-4" /> +12% vs semestre anterior
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Rentabilidad Promedio</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">36.5%</p>
          <p className="text-sm text-blue-600 flex items-center gap-1 mt-2 font-medium">
            <TrendingUp className="w-4 h-4" /> +2.4% vs semestre anterior
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Clientes Activos</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">260</p>
          <p className="text-sm text-slate-500 mt-2">Distribuidos en 4 categorías</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-bold text-slate-900 mb-6">Evolución Mensual de Ingresos y Gastos</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${value/1000000}M`} />
                <RechartsTooltip 
                  formatter={(value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorGastos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-900 mb-6">Distribución de Clientes por Categoría</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <SpeakerNote text="Finalmente, la visualización de datos. Herramientas como Gemini Advanced nos permiten transformar planillas de cálculo complejas en dashboards interactivos en cuestión de segundos. Esto nos facilita la presentación de informes gerenciales y nos posiciona como asesores estratégicos ante nuestros clientes, aportando claridad visual a los números." />
    </motion.div>
  );
}
