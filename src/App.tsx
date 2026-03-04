import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, FileSearch, Bot, MessageSquareText, ShieldCheck,
  UploadCloud, Send, Loader2, FileText, CheckCircle2, AlertCircle,
  Calendar, Clock, FileSpreadsheet, Download, Sparkles, LayoutDashboard,
  Menu, X, ChevronRight, User, TrendingUp, Users, FileCheck, ExternalLink,
  Plus, Search, Filter, MoreHorizontal, Cloud, HardDrive, Trash2, RefreshCw
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import Markdown from 'react-markdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock Data for Visuals
const statsData = [
  { name: 'Lun', facturas: 12, consultas: 45 },
  { name: 'Mar', facturas: 19, consultas: 52 },
  { name: 'Mie', facturas: 15, consultas: 48 },
  { name: 'Jue', facturas: 22, consultas: 61 },
  { name: 'Vie', facturas: 30, consultas: 55 },
  { name: 'Sab', facturas: 8, consultas: 20 },
  { name: 'Dom', facturas: 5, consultas: 15 },
];

const distributionData = [
  { name: 'IVA', value: 400, color: '#10b981' },
  { name: 'Ganancias', value: 300, color: '#3b82f6' },
  { name: 'Monotributo', value: 300, color: '#f59e0b' },
  { name: 'Sueldos', value: 200, color: '#8b5cf6' },
];

// Helper: File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- Components for each Tab ---

const DashboardHome = ({ setTab }: { setTab: (id: string) => void }) => {
  const modules = [
    { id: 'cerebro', title: 'Segundo Cerebro', desc: 'NotebookLM: Normativa técnica y leyes.', icon: BrainCircuit, color: 'text-blue-600 bg-blue-100', border: 'border-blue-200' },
    { id: 'extractor', title: 'Extractor de Datos', desc: 'AI Studio: Facturas y comprobantes.', icon: FileSearch, color: 'text-emerald-600 bg-emerald-100', border: 'border-emerald-200' },
    { id: 'asistente', title: 'Asistente Virtual', desc: 'Custom GPT: Respuestas automáticas.', icon: Bot, color: 'text-purple-600 bg-purple-100', border: 'border-purple-200' },
    { id: 'planificador', title: 'Planificador', desc: 'Claude/GPT: Informes y cronogramas.', icon: MessageSquareText, color: 'text-amber-600 bg-amber-100', border: 'border-amber-200' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Panel de Control Inteligente</h2>
          <p className="text-slate-500 mt-1">Monitoreo en tiempo real de la automatización de tu estudio.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
              +5
            </div>
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Compartir
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Documentos Procesados', value: '1,284', change: '+12%', icon: FileCheck, color: 'text-emerald-600' },
          { label: 'Consultas IA', value: '4,520', change: '+24%', icon: MessageSquareText, color: 'text-blue-600' },
          { label: 'Tiempo Ahorrado', value: '124h', change: '+8%', icon: Clock, color: 'text-purple-600' },
          { label: 'Clientes Activos', value: '85', change: '+2', icon: Users, color: 'text-amber-600' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-slate-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Actividad Semanal</h3>
              <p className="text-xs text-slate-500">Volumen de procesamiento y consultas</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Consultas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Facturas</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData}>
                <defs>
                  <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFacturas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="consultas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorConsultas)" />
                <Area type="monotone" dataKey="facturas" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFacturas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Distribución de Tareas</h3>
          <p className="text-xs text-slate-500 mb-8">Áreas con mayor automatización</p>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">72%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Eficiencia</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {distributionData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{Math.round(item.value / 1200 * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setTab(mod.id)}
            className={cn(
              "flex flex-col items-start gap-4 p-6 bg-white border rounded-2xl transition-all text-left group hover:shadow-xl hover:-translate-y-1",
              mod.border
            )}
          >
            <div className={cn("p-3 rounded-xl shrink-0", mod.color)}>
              <mod.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{mod.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-snug">{mod.desc}</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-brand-500">
              EXPLORAR <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Integration Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-400 text-xs font-bold mb-4 border border-white/10">
              <Sparkles className="w-3 h-3" />
              NUEVA INTEGRACIÓN
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">Google Workspace + NotebookLM</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Conectá tus carpetas de Drive directamente con nuestro Segundo Cerebro. Sincronizá normativas, leyes y manuales de procedimiento en tiempo real para consultas instantáneas.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/20">
                Conectar Drive
              </button>
              <button className="text-slate-300 hover:text-white text-sm font-bold transition-colors">
                Ver documentación
              </button>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-4">
            {[
              { label: 'Docs', icon: 'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png' },
              { label: 'Sheets', icon: 'https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png' },
              { label: 'Drive', icon: 'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png' },
              { label: 'Gmail', icon: 'https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png' },
              { label: 'Calendar', icon: 'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png' },
              { label: 'Meet', icon: 'https://www.gstatic.com/images/branding/product/2x/meet_2020q4_48dp.png' },
            ].map((app, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <img src={app.icon} alt={app.label} className="w-8 h-8" referrerPolicy="no-referrer" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{app.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const GoogleDriveManager = ({ onFileSelect }: { onFileSelect: (content: string, name: string) => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      if (data.isAuthenticated) fetchFiles();
    } catch (err) {
      console.error("Error checking auth status", err);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/drive/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error fetching files", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      const authWindow = window.open(url, 'google_oauth', 'width=600,height=700');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          setIsAuthenticated(true);
          fetchFiles();
          window.removeEventListener('message', handleMessage);
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (err) {
      console.error("Error connecting to Google Drive", err);
    }
  };

  const handleFileClick = async (fileId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/drive/file/${fileId}`);
      const { content, name } = await res.json();
      onFileSelect(content, name);
      setShowModal(false);
    } catch (err) {
      console.error("Error fetching file content", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="space-y-4">
      {!isAuthenticated ? (
        <button
          onClick={handleConnect}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
        >
          <img src="https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png" alt="Drive" className="w-6 h-6" referrerPolicy="no-referrer" />
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">Conectar Google Drive</p>
            <p className="text-xs text-slate-500">Importá normativas directamente desde tu nube.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png" alt="Drive" className="w-5 h-5" referrerPolicy="no-referrer" />
              <h3 className="text-sm font-bold text-slate-900">Google Drive Conectado</h3>
            </div>
            <button onClick={fetchFiles} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-3 h-3" /> BUSCAR NORMATIVA EN DRIVE
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <img src="https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png" alt="Drive" className="w-6 h-6" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">Tus Documentos de Drive</h3>
                    <p className="text-xs text-slate-500">Seleccioná una ley o normativa para cargar al Segundo Cerebro.</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading && files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Accediendo a Drive...</p>
                  </div>
                ) : files.length > 0 ? (
                  files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileClick(file.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all text-left border border-transparent hover:border-slate-100 group"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                        {file.mimeType === 'application/pdf' ? (
                          <FileText className="w-5 h-5 text-red-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{file.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                          {file.mimeType.split('.').pop()?.toUpperCase() || 'DOCUMENTO'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Cloud className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-900">No se encontraron documentos</p>
                    <p className="text-xs text-slate-500 max-w-[200px] mt-1">Asegurate de tener archivos con nombres como "AFIP", "Ley" o PDFs en tu Drive.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SegundoCerebro = () => {
  const [context, setContext] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSources, setActiveSources] = useState<{name: string, id: string}[]>([]);

  const examples = [
    { title: 'Ley de Alquileres', content: 'Resumen de la Ley 27.551 y sus modificaciones sobre plazos, ajustes y garantías...' },
    { title: 'Resolución AFIP 5364', content: 'Procedimiento para la solicitud de devolución de percepciones por operaciones en moneda extranjera...' },
    { title: 'Convenio Comercio', content: 'Escalas salariales vigentes para CCT 130/75, categorías maestranza, administrativo y ventas...' },
  ];

  const handleFileSelect = (content: string, name: string) => {
    setContext(prev => prev + `\n\n--- FUENTE: ${name} ---\n${content}`);
    setActiveSources(prev => [...prev, { name, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeSource = (id: string, name: string) => {
    setActiveSources(prev => prev.filter(s => s.id !== id));
    // In a real app, we'd rebuild the context string properly. 
    // For this demo, we'll just keep the text but remove the visual tag.
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const prompt = context.trim() 
        ? `Contexto normativo:\n${context}\n\nPregunta: ${query}\n\nResponde basándote estrictamente en el contexto proporcionado. Si la respuesta no está en el contexto, indícalo.`
        : `Pregunta contable/impositiva: ${query}\n\nResponde como un experto contable de Argentina.`;
      
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setResponse(res.text || '');
    } catch (err) {
      setResponse('Error al consultar la normativa. Por favor, intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            Segundo Cerebro (NotebookLM)
          </h2>
          <p className="text-slate-500 mt-1">Consultas transversales sobre normativa técnica y doctrina contable.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
            HISTORIAL
          </button>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" /> NUEVA FUENTE
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GoogleDriveManager onFileSelect={handleFileSelect} />

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Fuentes Sugeridas</h3>
            <div className="space-y-3">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleFileSelect(ex.content, ex.title)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600">{ex.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">Cargar contexto de ejemplo...</p>
                </button>
              ))}
            </div>
          </div>

          {activeSources.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Fuentes Cargadas</h3>
              <div className="space-y-2">
                {activeSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-xs font-medium text-blue-700 truncate max-w-[150px]">{source.name}</span>
                    <button onClick={() => removeSource(source.id, source.name)} className="text-blue-400 hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
            <h3 className="font-bold mb-2">Tip Profesional</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Podés subir múltiples PDFs. La IA cruzará la información para darte una respuesta integral sobre diferentes normativas.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Contexto Activo (Fuentes de Conocimiento)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Pegá aquí el texto de la ley, resolución o manual de procedimiento..."
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm font-mono"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {context.length} caracteres cargados
              </span>
              <button 
                onClick={() => setContext('')}
                className="text-[10px] text-red-500 font-bold uppercase hover:underline"
              >
                Limpiar fuentes
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              ¿Qué necesitás saber?
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  placeholder="Ej: ¿Cómo afecta la nueva ley a los contratos vigentes?"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={loading || !query.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                CONSULTAR
              </button>
            </div>
          </div>

          <AnimatePresence>
            {response && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Análisis de Inteligencia Artificial
                  </h4>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">COPIAR</button>
                </div>
                <div className="p-6 prose prose-blue prose-sm max-w-none text-slate-700 leading-relaxed">
                  <Markdown>{response}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ExtractorDatos = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      setData([]);
      setError('');
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type;
      const dataStr = base64.split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType, data: dataStr } },
            { text: 'Extrae los datos de este comprobante o factura. Devuelve un array JSON con los siguientes campos: fecha (YYYY-MM-DD), cuit_emisor, razon_social, concepto, neto (número), iva (número), total (número).' }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fecha: { type: Type.STRING },
                cuit_emisor: { type: Type.STRING },
                razon_social: { type: Type.STRING },
                concepto: { type: Type.STRING },
                neto: { type: Type.NUMBER },
                iva: { type: Type.NUMBER },
                total: { type: Type.NUMBER }
              }
            }
          }
        }
      });

      const jsonStr = response.text || '[]';
      setData(JSON.parse(jsonStr));
    } catch (err: any) {
      setError(err.message || 'Error al procesar el documento. Asegurate de subir una imagen clara.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-emerald-600" />
            Extractor de Datos (Vision AI)
          </h2>
          <p className="text-slate-500 mt-1">Digitalización automática de comprobantes físicos y digitales.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
            <TrendingUp className="w-3 h-3" /> 98.4% Precisión
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Carga de Documento</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors relative group">
              <input 
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-slate-300 mx-auto mb-3 group-hover:text-emerald-500 transition-colors" />
              <p className="text-xs font-bold text-slate-600">ARRASTRÁ O HACÉ CLIC</p>
              <p className="text-[10px] text-slate-400 mt-1">Facturas, Tickets, Recibos</p>
            </div>

            {preview && (
              <div className="mt-6 space-y-4">
                <div className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  {file?.type.startsWith('image/') ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-300" />
                      <span className="text-xs font-bold text-slate-400 mt-2 uppercase">{file?.name}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => { setFile(null); setPreview(''); }}
                      className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleExtract}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  PROCESAR AHORA
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-start gap-3 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Resultados del Escaneo</h3>
                {data.length > 0 && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">
                    {data.length} items
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {data.length > 0 ? (
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] text-slate-400 uppercase font-bold bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Emisor / CUIT</th>
                      <th className="px-6 py-4">Concepto</th>
                      <th className="px-6 py-4 text-right">Neto</th>
                      <th className="px-6 py-4 text-right">IVA</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">{row.fecha}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{row.razon_social}</div>
                          <div className="font-mono text-[10px] text-slate-400 mt-0.5">{row.cuit_emisor}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 max-w-[150px] truncate">{row.concepto || 'Compra de mercadería'}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-600">${row.neto?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-medium text-slate-600">${row.iva?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-slate-900">${row.total?.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <FileSearch className="w-8 h-8 opacity-20" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Sin datos procesados</h4>
                  <p className="text-xs max-w-[200px] mx-auto leading-relaxed">
                    Subí un documento para ver la extracción automática de datos impositivos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AsistenteVirtual = () => {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: 'Hola, soy el asistente virtual del estudio. Estoy entrenado con nuestros manuales de procedimiento y normativa vigente. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '¿Cómo liquidar SAC proporcional?',
    'Topes Monotributo 2026',
    'Vencimientos IVA este mes',
    'Procedimiento alta empleado',
  ];

  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Eres un asistente experto para un estudio contable en Argentina. Respondes consultas sobre AFIP, liquidación de sueldos, impuestos, y procedimientos internos. Tu tono es profesional, claro, preciso y empático. Si no sabes algo, indica que el usuario debe consultar con un contador senior del estudio.',
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msgToSend = text || input;
    if (!msgToSend.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msgToSend }]);
    setLoading(true);
    
    try {
      const res = await chatRef.current.sendMessage({ message: msgToSend });
      setMessages(prev => [...prev, { role: 'model', text: res.text || '' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error de conexión con el asistente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-600" />
            Asistente Experto (Custom GPT)
          </h2>
          <p className="text-slate-500 mt-1">Consultas rápidas sobre procedimientos y normativa del estudio.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Línea</span>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("flex gap-4", msg.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-100 text-purple-600'
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "max-w-[85%] rounded-3xl p-5 shadow-sm",
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'
              )}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 prose-strong:text-slate-900">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl rounded-tl-none p-5 flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-purple-300 hover:text-purple-600 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribí tu consulta aquí..."
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Planificador = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('email');
  const [tone, setTone] = useState('profesional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setTopic('');
    setLoading(true);
    try {
      let prompt = '';
      if (type === 'cronograma') {
        prompt = `Actúa como un contador público. Genera un cronograma de vencimientos o planificación de tareas mensuales para el siguiente tema/cliente: "${topic}". Presentalo en formato de lista o tabla clara.`;
      } else {
        prompt = `Actúa como un contador público. Redacta un ${type} sobre el siguiente tema: "${topic}". El tono debe ser ${tone}. Asegúrate de usar lenguaje técnico apropiado pero comprensible para el cliente o destinatario.`;
      }

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setResult(res.text || '');
    } catch (err) {
      setResult('Error al generar el documento. Por favor, intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareText className="w-6 h-6 text-amber-600" />
            Planificación y Comunicación Profesional
          </h2>
          <p className="text-slate-500 mt-1">Generación inteligente de informes, notas y cronogramas.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Configuración</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tipo de Documento</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'email', label: 'Email' },
                  { id: 'informe', label: 'Informe' },
                  { id: 'nota', label: 'Nota Contable' },
                  { id: 'cronograma', label: 'Cronograma' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                      type === t.id ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {type !== 'cronograma' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tono</label>
                <div className="flex flex-wrap gap-2">
                  {['profesional', 'didactico', 'formal', 'amigable'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase transition-all",
                        tone === t ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Instrucciones</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: Pedido de documentación para cierre de ejercicio 2025..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              GENERAR BORRADOR
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[600px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Vista Previa del Documento</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Borrador generado por IA</p>
                </div>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-12 flex-1 overflow-y-auto bg-white relative">
              {/* Letterhead simulation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-200" />
              
              {result ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="prose prose-slate max-w-none text-slate-700 prose-headings:text-slate-900 prose-strong:text-slate-900"
                >
                  <div className="mb-12 flex justify-between items-start">
                    <div className="font-display font-bold text-xl text-slate-900">ESTUDIO DAMIANI</div>
                    <div className="text-[10px] text-slate-400 text-right uppercase font-bold leading-tight">
                      Contabilidad & Auditoría<br />
                      Mendoza, Argentina
                    </div>
                  </div>
                  <Markdown>{result}</Markdown>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <MessageSquareText className="w-10 h-10 opacity-10" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Listo para redactar</h4>
                  <p className="text-xs max-w-[250px] mx-auto leading-relaxed">
                    Completá las instrucciones a la izquierda para generar un borrador profesional adaptado a tus necesidades.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: LayoutDashboard },
    { id: 'cerebro', label: 'Segundo Cerebro', icon: BrainCircuit },
    { id: 'extractor', label: 'Extractor de Datos', icon: FileSearch },
    { id: 'asistente', label: 'Asistente Virtual', icon: Bot },
    { id: 'planificador', label: 'Planificador', icon: MessageSquareText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio': return <DashboardHome setTab={setActiveTab} />;
      case 'cerebro': return <SegundoCerebro />;
      case 'extractor': return <ExtractorDatos />;
      case 'asistente': return <AsistenteVirtual />;
      case 'planificador': return <Planificador />;
      default: return <DashboardHome setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 fixed inset-y-0 left-0 z-20">
        <div className="p-6 flex items-center gap-3 text-white font-display font-bold text-xl border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Estudio IA
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-brand-500/10 text-brand-400' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Tania Damiani</p>
              <p className="text-xs text-slate-500">Contadora Pública</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 font-display font-bold">
          <Sparkles className="w-5 h-5 text-brand-400" />
          Estudio IA
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 z-20 p-4 space-y-2 shadow-xl"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'bg-brand-500/10 text-brand-400' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-8 p-4 md:p-8 min-h-screen">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}

