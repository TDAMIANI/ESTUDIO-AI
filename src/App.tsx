import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit, MessageSquare, LayoutDashboard, Presentation,
  ChevronRight, PlayCircle, FileText, CheckCircle2,
  AlertCircle, Sparkles, Database,
  TrendingUp, Users, DollarSign, ArrowUpRight, Volume2,
  Bot, BookOpen, Target, Lightbulb, FileCheck, HardDrive,
  Mic, StopCircle, Zap, Download, Layers
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

// --- DATOS PARA EL DASHBOARD ---
const monthlyData = [
  { name: 'Ene', ingresos: 4500000, gastos: 3200000, rentabilidad: 1300000 },
  { name: 'Feb', ingresos: 5200000, gastos: 3400000, rentabilidad: 1800000 },
  { name: 'Mar', ingresos: 4800000, gastos: 3100000, rentabilidad: 1700000 },
  { name: 'Abr', ingresos: 6100000, gastos: 3800000, rentabilidad: 2300000 },
  { name: 'May', ingresos: 5900000, gastos: 3600000, rentabilidad: 2300000 },
  { name: 'Jun', ingresos: 7200000, gastos: 4100000, rentabilidad: 3100000 },
];

const handleDownloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const clientData = [
  { name: 'Responsables Inscriptos', value: 45 },
  { name: 'Monotributistas', value: 120 },
  { name: 'Convenio Multilateral', value: 35 },
  { name: 'Empleadores', value: 60 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

// --- COMPONENTES UI REUTILIZABLES ---
const SpeakerNote = ({ text }: { text: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = 1.15; // Más rápido para darle dinamismo juvenil
    utterance.pitch = 1.4; // Tono más alto para hacerla más femenina
    
    // Intentar buscar una voz femenina argentina o en español si está disponible
    const voices = window.speechSynthesis.getVoices();
    const femaleNames = ['sabina', 'helena', 'laura', 'monica', 'paulina', 'luciana', 'victoria', 'mia', 'sofia'];
    
    let selectedVoice = voices.find(v => v.lang === 'es-AR' && femaleNames.some(name => v.name.toLowerCase().includes(name)));
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('es') && femaleNames.some(name => v.name.toLowerCase().includes(name)));
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === 'es-AR' && v.name.includes('Google')) || 
                      voices.find(v => v.lang === 'es-AR') ||
                      voices.find(v => v.lang.startsWith('es'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Cargar voces al inicio para que estén listas
    window.speechSynthesis.getVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="relative bg-indigo-50/80 p-6 rounded-2xl border border-indigo-100 group hover:border-indigo-300 transition-all shadow-sm mt-8">
      <div className="flex items-start gap-4">
        <button
          onClick={handlePlay}
          className={`shrink-0 p-4 rounded-full shadow-md border transition-all ${
            isPlaying 
              ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse scale-110' 
              : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:scale-105'
          }`}
          title="Escuchar nota del speaker"
        >
          {isPlaying ? <StopCircle className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
        <div>
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Mic className="w-4 h-4" /> Notas del Speaker (Voz Argentina)
          </span>
          <p className="text-base text-slate-800 font-medium italic leading-relaxed">"{text}"</p>
        </div>
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 ${className}`}>
    {children}
  </div>
);

// --- COMPONENTES DE PESTAÑAS ---

const IntroSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-8"
  >
    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
      <img 
        src="https://picsum.photos/seed/accounting-future-tech/1200/400" 
        alt="Futuro Contable" 
        className="w-full h-[400px] object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent flex flex-col justify-center p-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold mb-6 border border-blue-500/30 backdrop-blur-sm w-fit">
          <Sparkles className="w-4 h-4" />
          MASTERCLASS EXCLUSIVA
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          El Estudio Contable <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Impulsado por IA</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
          Descubrí cómo integrar Gemini y NotebookLM para automatizar tareas, eliminar errores y transformar los datos en decisiones estratégicas.
        </p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/30">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Gemini</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Tu analista junior disponible 24/7. Redacta correos, resume resoluciones de AFIP y analiza hojas de cálculo en segundos.
        </p>
        <ul className="space-y-3 text-sm font-medium text-slate-700">
          <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Creación de contenido y mails</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Análisis rápido de datos</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Asistencia diaria general</li>
        </ul>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-600/30">
          <BrainCircuit className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">2. NotebookLM</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Tu socio auditor experto. Un "Segundo Cerebro" que solo responde basándose en las leyes, manuales y balances que vos le cargás. Cero alucinaciones.
        </p>
        <ul className="space-y-3 text-sm font-medium text-slate-700">
          <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Respuestas 100% fundamentadas</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Citas exactas a la normativa</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Privacidad total de tus documentos</li>
        </ul>
      </Card>
    </div>

    <SpeakerNote text="Bienvenidos, colegas. En esta sesión analizaremos cómo la inteligencia artificial puede optimizar nuestra práctica profesional. Exploraremos cómo herramientas como Gemini y NotebookLM pueden asistirnos en el análisis de datos y la auditoría, permitiéndonos enfocar nuestro tiempo en el asesoramiento estratégico." />
  </motion.div>
);

const GeminiSection = () => {
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    {
      id: 1,
      title: "Resumir Normativa",
      description: "Sintetiza textos legales extensos en viñetas claras para clientes.",
      icon: <FileText className="w-5 h-5" />,
      prompt: "Actúa como un asesor fiscal experto. Sintetiza los 3 puntos clave de la nueva moratoria de AFIP para enviarlo a un cliente del sector comercial. Utiliza un tono profesional pero accesible, evitando tecnicismos innecesarios.",
      response: "Estimado cliente, le comparto los puntos clave de la nueva moratoria fiscal:\n\n1. 📉 **Condonación de intereses y multas:** Se establece una reducción significativa de recargos para obligaciones vencidas.\n2. 📅 **Planes de facilidad:** Posibilidad de financiar la deuda en hasta 120 cuotas fijas, facilitando la planificación financiera.\n3. ⏳ **Plazo de adhesión:** La fecha límite para acogerse a estos beneficios es el 30 del próximo mes.\n\nQuedo a su disposición para analizar la conveniencia de adherir su empresa a este régimen."
    },
    {
      id: 2,
      title: "Redactar Comunicación Formal",
      description: "Crea comunicaciones formales y empáticas para situaciones delicadas.",
      icon: <MessageSquare className="w-5 h-5" />,
      prompt: "Redactá un mail formal pero empático a un cliente (Juan) informándole que sus honorarios contables aumentarán un 25% a partir del próximo mes debido a la inflación y al aumento de la complejidad de sus liquidaciones.",
      response: "Asunto: Actualización de honorarios profesionales - Próximo mes\n\nEstimado Juan,\n\nEspero que te encuentres muy bien.\n\nTe escribo para comentarte que, debido al contexto económico actual y al incremento en la complejidad de las liquidaciones y presentaciones que venimos realizando para tu empresa, nos vemos en la necesidad de actualizar nuestros honorarios profesionales.\n\nA partir del próximo mes, el abono mensual tendrá un ajuste del 25%.\n\nValoramos mucho nuestra relación de trabajo y nuestro compromiso sigue siendo brindarte el mejor asesoramiento para que tu negocio siga creciendo sin contingencias fiscales.\n\nCualquier duda, estoy a tu disposición para conversarlo.\n\nSaludos cordiales,"
    },
    {
      id: 3,
      title: "Análisis de Erogaciones",
      description: "Categoriza y suma listas de gastos desordenadas automáticamente.",
      icon: <Zap className="w-5 h-5" />,
      prompt: "A continuación presento una lista de erogaciones: 'Cena cliente $15000, resmas A4 $5000, taxi $3000, almuerzo equipo $25000, cartuchos tinta $12000'. Por favor, clasifícalos en una tabla bajo las categorías Viáticos, Librería y Representación, e indica el total general.",
      response: "A continuación, presento la clasificación de las erogaciones solicitadas:\n\n| Categoría | Concepto | Monto |\n|---|---|---|\n| **Representación** | Cena cliente | $15.000 |\n| **Representación** | Almuerzo equipo | $25.000 |\n| **Librería** | Resmas A4 | $5.000 |\n| **Librería** | Cartuchos tinta | $12.000 |\n| **Viáticos** | Taxi | $3.000 |\n\n**TOTAL GENERAL: $60.000**\n\n*Desglose por categoría:*\n- Representación: $40.000\n- Librería: $17.000\n- Viáticos: $3.000"
    },
    {
      id: 4,
      title: "Responder Intimación",
      description: "Redacta descargos formales para AFIP con justificaciones técnicas.",
      icon: <AlertCircle className="w-5 h-5" />,
      prompt: "Redactá un descargo formal para AFIP explicando que la falta de presentación de la DDJJ de IVA se debió a una caída comprobable de su servicio web. Solicitá la eximición de la multa.",
      response: "Lugar y fecha: [Ciudad], [Fecha]\n\nSeñores\nAdministración Federal de Ingresos Públicos (AFIP)\nAgencia [Número/Nombre]\nS. / D.\n\nRef: Descargo por falta de presentación DDJJ IVA - CUIT [Número]\n\nDe mi mayor consideración:\n\nPor la presente, me dirijo a Uds. en mi carácter de [Titular/Apoderado] de la firma [Nombre de la empresa], a fin de presentar formal descargo frente a la intimación recibida por la falta de presentación de la Declaración Jurada de IVA correspondiente al período [Mes/Año].\n\nAl respecto, informo que la omisión no se debió a negligencia ni dolo, sino a una caída generalizada y comprobable de los servicios web de vuestro organismo durante los días de vencimiento, lo cual nos impidió acceder al sistema con Clave Fiscal.\n\nPor lo expuesto, solicito se tenga por presentado este descargo y se proceda a la eximición de las multas automáticas correspondientes.\n\nSin otro particular, saludo a Uds. atentamente."
    },
    {
      id: 5,
      title: "Clasificar Facturas",
      description: "Determina el tratamiento impositivo (IVA) de diferentes conceptos.",
      icon: <FileCheck className="w-5 h-5" />,
      prompt: "Clasificá estos conceptos en Gravado, No Gravado o Exento para IVA: 1. Venta de libros escolares. 2. Honorarios médicos. 3. Exportación de software. 4. Venta de indumentaria.",
      response: "A continuación, se detalla el tratamiento impositivo en el Impuesto al Valor Agregado (IVA) para los conceptos indicados:\n\n1. **Venta de libros escolares:** EXENTO (Art. 7 inc. a de la Ley de IVA).\n2. **Honorarios médicos:** GRAVADO (Tasa general del 21%, con excepciones para ciertas prestaciones a obras sociales/prepagas).\n3. **Exportación de software:** EXENTO / NO ALCANZADO (Las exportaciones están exentas de IVA, permitiendo el recupero del crédito fiscal vinculado).\n4. **Venta de indumentaria:** GRAVADO (Tasa general del 21%)."
    },
    {
      id: 6,
      title: "Armar Cronograma",
      description: "Genera tablas de vencimientos impositivos según el perfil del cliente.",
      icon: <LayoutDashboard className="w-5 h-5" />,
      prompt: "Armá un cronograma de vencimientos impositivos para el mes que viene para un Responsable Inscripto. Incluí IVA, Ganancias y Cargas Sociales. Formato tabla.",
      response: "A continuación, presento el cronograma estimado de vencimientos para un Responsable Inscripto (las fechas exactas dependerán de la terminación de la CUIT):\n\n| Impuesto / Obligación | Fecha Estimada | Observaciones |\n|---|---|---|\n| **Cargas Sociales (F.931)** | 9 al 11 del mes | Aportes y contribuciones del mes anterior |\n| **Anticipos Ganancias** | 13 al 15 del mes | Si corresponde el ingreso de anticipos |\n| **IVA (DDJJ F.2002)** | 18 al 22 del mes | Declaración y pago del período anterior |\n| **SICORE (Retenciones)** | 20 al 22 del mes | 1ra quincena del mes en curso |\n\n*Nota: Es imperativo verificar el calendario oficial de vencimientos publicado por AFIP.*"
    },
    {
      id: 7,
      title: "Estrategia de Comunicación",
      description: "Propone contenido profesional para redes sociales orientado a captar clientes.",
      icon: <Lightbulb className="w-5 h-5" />,
      prompt: "Proporciona 3 ideas de contenido para las redes sociales de un estudio contable, orientadas a captar la atención de nuevos emprendedores y startups.",
      response: "Aquí presento 3 propuestas de contenido orientadas a emprendedores y startups:\n\n1. 📊 **Infografía Educativa:** 'Estructuras Societarias para Startups'. Una comparación visual entre SAS, SA y SRL, destacando ventajas operativas y responsabilidades legales.\n2. 💡 **Carrusel de Buenas Prácticas:** '3 Errores Financieros Comunes al Iniciar un Negocio'. Abordar temas como la mezcla de finanzas personales y comerciales, la falta de previsión impositiva y la incorrecta categorización fiscal.\n3. 📅 **Calendario Fiscal del Emprendedor:** Una publicación destacando las fechas clave del mes para Monotributistas y Responsables Inscriptos, enfatizando la importancia de la planificación anticipada."
    }
  ];

  const handleRunPrompt = (id: number) => {
    setActivePrompt(id);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-48 mb-8">
        <img 
          src="https://picsum.photos/seed/ai-chat-office/1200/300" 
          alt="Gemini Assistant" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-blue-900/60 flex items-center justify-between p-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500 text-white rounded-xl shadow-lg">
                <Bot className="w-8 h-8" />
              </div>
              Gemini: Tu Analista Junior
            </h2>
            <p className="text-blue-100 text-lg">El asistente conversacional para tus tareas diarias.</p>
          </div>
          <a 
            href="https://gemini.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex bg-white text-blue-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors items-center gap-2 shadow-lg"
          >
            ABRIR GEMINI <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> Casos de Uso Rápidos
          </h3>
          {prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => handleRunPrompt(p.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                activePrompt === p.id 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30 scale-[1.02]' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={`p-2 rounded-lg shrink-0 ${activePrompt === p.id ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight mb-1">{p.title}</h3>
                  <p className={`text-sm ${activePrompt === p.id ? 'text-blue-100' : 'text-slate-600'}`}>
                    {p.description}
                  </p>
                </div>
              </div>
              <p className={`text-xs italic line-clamp-2 mt-3 pt-3 border-t ${activePrompt === p.id ? 'border-blue-500/50 text-blue-200' : 'border-slate-100 text-slate-400'}`}>
                Prompt: "{p.prompt}"
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7">
          <Card className="h-full min-h-[500px] flex flex-col bg-slate-50 border-slate-200">
            {activePrompt ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 self-end max-w-[85%]">
                  <p className="text-sm text-slate-700 font-medium">
                    {prompts.find(p => p.id === activePrompt)?.prompt}
                  </p>
                </div>
                
                <div className="flex items-start gap-4 max-w-[95%]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
                    {isTyping ? (
                      <div className="flex gap-2 items-center h-6">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                        {prompts.find(p => p.id === activePrompt)?.response}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 relative overflow-hidden rounded-2xl">
                <img src="https://picsum.photos/seed/ai-assistant-waiting/800/600" alt="Waiting" className="absolute inset-0 w-full h-full object-cover opacity-10" referrerPolicy="no-referrer" />
                <div className="relative z-10">
                  <Bot className="w-16 h-16 mb-4 text-blue-300 mx-auto" />
                  <p className="text-lg font-medium text-slate-600">Seleccioná un caso de uso de la izquierda</p>
                  <p className="text-sm mt-2 text-slate-500">Para ver cómo Gemini resuelve tareas cotidianas en segundos.</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <SpeakerNote text="Gemini funciona como un asistente analítico de disponibilidad continua. Puede procesar grandes volúmenes de datos no estructurados, redactar descargos formales ante organismos de contralor o sintetizar normativas extensas para su comunicación a clientes. La clave de su eficacia reside en la correcta estructuración del 'Prompt': definir el rol, el objetivo y el tono deseado." />
    </motion.div>
  );
};

const NotebookLMSection = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="relative rounded-3xl overflow-hidden shadow-lg h-48 mb-8">
      <img 
        src="https://picsum.photos/seed/documents-ai-audit/1200/300" 
        alt="NotebookLM Documents" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-emerald-900/70 flex items-center justify-between p-8">
        <div>
          <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg">
              <BrainCircuit className="w-8 h-8" />
            </div>
            NotebookLM: El Segundo Cerebro
          </h2>
          <p className="text-emerald-100 text-lg">Tu socio auditor basado 100% en tus propios documentos.</p>
        </div>
        <a 
          href="https://notebooklm.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex bg-white text-emerald-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors items-center gap-2 shadow-lg"
        >
          ABRIR NOTEBOOKLM <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>

    <Card className="bg-slate-900 text-white border-slate-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white/10 text-emerald-400 rounded-xl border border-white/10">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">¿Por qué NotebookLM es diferente? (Tecnología RAG)</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <HardDrive className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">1. Tus Datos</h4>
            <p className="text-sm text-slate-400">Subís tus PDFs, leyes, balances y manuales. La IA no busca en internet, solo lee esto.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">2. Recuperación</h4>
            <p className="text-sm text-slate-400">Al preguntar, el sistema busca los fragmentos exactos en tus documentos que responden la duda.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg mb-2">3. Respuesta Precisa</h4>
            <p className="text-sm text-slate-400">Genera una respuesta citando la página exacta del documento. Sin inventar nada.</p>
          </div>
        </div>
      </div>
    </Card>

    <Card className="border-emerald-100">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-6 border border-emerald-200">
        <PlayCircle className="w-4 h-4" /> CASO PRÁCTICO EN VIVO
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-6">Auditoría de Estados Contables</h3>
      <p className="text-slate-600 mb-8 text-lg">
        Vamos a simular que NotebookLM es nuestro Auditor Senior. Le cargamos 4 documentos clave y le pedimos que revise un balance con errores.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { 
            title: "Archivo 1: Resumen RT 54", 
            desc: "La norma técnica vigente.", 
            color: "text-blue-500", 
            bg: "bg-blue-50", 
            border: "border-blue-100",
            filename: "Resumen_RT_54.txt",
            content: "RESOLUCIÓN TÉCNICA N° 54\n\nNORMAS CONTABLES PROFESIONALES: NORMA UNIFICADA ARGENTINA DE CONTABILIDAD\n\nAlcance: Esta norma establece los criterios de reconocimiento, medición, presentación y revelación de los elementos de los estados contables.\n\nBienes de Uso: Se medirán a su costo original menos depreciaciones acumuladas. No se permite la revaluación de bienes de uso en el modelo base.\n\nBienes de Cambio: Se medirán a su costo de reposición o valor neto de realización, el menor.\n\nExposición: Los activos y pasivos deben clasificarse en corrientes y no corrientes según el plazo de realización o exigibilidad (12 meses desde la fecha de cierre)."
          },
          { 
            title: "Archivo 2: Ley de Ganancias", 
            desc: "Para detectar diferencias impositivas.", 
            color: "text-emerald-500", 
            bg: "bg-emerald-50", 
            border: "border-emerald-100",
            filename: "Ley_de_Ganancias.txt",
            content: "LEY DE IMPUESTO A LAS GANANCIAS\n\nArtículo 1: Todas las ganancias obtenidas por personas humanas, jurídicas o demás sujetos indicados en esta ley, quedan sujetos al gravamen de emergencia que establece esta ley.\n\nAmortizaciones: A los fines impositivos, las amortizaciones de bienes muebles se calcularán dividiendo el costo de adquisición por los años de vida útil estimada.\n\nGastos de Representación: Serán deducibles hasta el límite del 1,5% del total de remuneraciones pagadas en el ejercicio al personal en relación de dependencia.\n\nHonorarios de Directores: Serán deducibles hasta el mayor entre el 25% de las utilidades contables o el monto fijo establecido por la reglamentación."
          },
          { 
            title: "Archivo 3: Borrador EECC", 
            desc: "El balance del cliente (con errores ocultos).", 
            color: "text-red-500", 
            bg: "bg-red-50", 
            border: "border-red-100",
            filename: "Borrador_EECC.txt",
            content: "CHUBUT LOGÍSTICA S.A.\nESTADOS CONTABLES AL 31/12/2025\n\nACTIVO\nCaja y Bancos: $ 1.500.000\nInversiones (Plazo Fijo a 180 días): $ 5.000.000\nCréditos por Ventas: $ 12.000.000\nBienes de Cambio (Medidos a Valor de Venta): $ 8.500.000\nBienes de Uso (Revaluados): $ 45.000.000\nTotal Activo: $ 72.000.000\n\nPASIVO\nDeudas Comerciales: $ 15.000.000\nDeudas Bancarias (Vencimiento 2028, clasificado como Corriente): $ 20.000.000\nTotal Pasivo: $ 35.000.000\n\nPATRIMONIO NETO\nCapital Social: $ 10.000.000\nResultados Acumulados: $ 27.000.000\nTotal Patrimonio Neto: $ 37.000.000\n\nNOTAS:\n1. Los bienes de uso fueron revaluados este año para mejorar la posición patrimonial.\n2. El préstamo bancario vence en 3 años, pero se expone como corriente por política de la empresa."
          },
          { 
            title: "Archivo 4: Manual del Estudio", 
            desc: "Nuestras reglas internas de revisión.", 
            color: "text-purple-500", 
            bg: "bg-purple-50", 
            border: "border-purple-100",
            filename: "Manual_del_Estudio.txt",
            content: "MANUAL DE PROCEDIMIENTOS DE AUDITORÍA - ESTUDIO CONTABLE\n\n1. REVISIÓN DE EXPOSICIÓN (RT 54)\n- Verificar estrictamente la clasificación Corriente / No Corriente. Cualquier deuda con vencimiento mayor a 12 meses DEBE ser No Corriente.\n- Validar criterios de medición. Si el cliente usa Revalúo de Bienes de Uso sin justificación técnica, proponer ajuste.\n- Bienes de Cambio: Verificar que no superen el Valor Neto de Realización.\n\n2. REVISIÓN IMPOSITIVA\n- Controlar el límite de deducción de honorarios de directores.\n- Verificar que los gastos de representación no superen el tope legal del 1,5%.\n\n3. INFORME DE AUDITORÍA\n- Todo error de exposición significativo debe ser reportado a la gerencia antes de emitir el informe final.\n- Si el cliente se niega a corregir un error material, evaluar salvedad en el dictamen."
          },
        ].map((file, i) => (
          <div key={i} className={`${file.bg} border ${file.border} rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div className="flex items-start gap-4">
              <FileText className={`w-8 h-8 ${file.color} shrink-0`} />
              <div>
                <h5 className="font-bold text-slate-900">{file.title}</h5>
                <p className="text-sm text-slate-600 mt-1">{file.desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadFile(file.filename, file.content)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors border ${file.border} ${file.color} hover:bg-white bg-white/50 shrink-0`}
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 block">El Prompt Maestro (Copiar y Pegar en NotebookLM)</span>
        <p className="text-lg text-white font-medium leading-relaxed">
          "Actúa como la Socia Senior del Estudio. Basándote en nuestra norma interna y la RT 54, revisa el balance de 'Chubut Logística S.A.'. Identifica los 3 errores de exposición más graves, cítame la página de la RT 54 que se incumple y dime qué ajuste pedirle al cliente."
        </p>
      </div>
    </Card>

    <div className="mt-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        Más Ejemplos de Cuadernos
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-all overflow-hidden group">
          <img src="https://picsum.photos/seed/tax-law/400/200" alt="Impuestos" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="p-6">
            <BookOpen className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-bold text-lg mb-2">Cuaderno de Impuestos</h4>
            <p className="text-sm text-slate-600">Cargá la Ley de IVA, Ganancias y las últimas resoluciones de AFIP. Preguntale: "¿Cómo afecta la nueva resolución a un responsable inscripto que exporta servicios?"</p>
          </div>
        </Card>
        <Card className="p-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-all overflow-hidden group">
          <img src="https://picsum.photos/seed/hr-manual/400/200" alt="RRHH" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="p-6">
            <Users className="w-8 h-8 text-emerald-500 mb-4" />
            <h4 className="font-bold text-lg mb-2">Manual del Empleador</h4>
            <p className="text-sm text-slate-600">Subí la LCT y los convenios colectivos (Comercio, UOCRA). Pedile: "Calculá la liquidación final por despido sin causa de un empleado con 5 años de antigüedad según Comercio."</p>
          </div>
        </Card>
        <Card className="p-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition-all overflow-hidden group">
          <img src="https://picsum.photos/seed/startup-advice/400/200" alt="Emprendedores" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          <div className="p-6">
            <Target className="w-8 h-8 text-purple-500 mb-4" />
            <h4 className="font-bold text-lg mb-2">Asesor de Emprendedores</h4>
            <p className="text-sm text-slate-600">Ingresá normativas de Monotributo y SAS. Usalo para responder rápido: "¿Qué categoría de monotributo le corresponde a un local de ropa que factura 2 millones al mes?"</p>
          </div>
        </Card>
      </div>
    </div>

    <SpeakerNote text="Acá es donde explota todo. NotebookLM no es ChatGPT buscando en internet y mandando fruta. Es una caja fuerte. Vos le subís tus PDFs, la RT 54, la Ley de Ganancias, y le preguntás. La IA te responde citando la página exacta de tu documento. Cero chamuyo, cero alucinaciones. Podés armar cuadernos de impuestos, de sueldos, de lo que quieras. Es tu socio auditor perfecto." />
  </div>
);

const AdditionalToolsSection = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-12"
  >
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
        Ecosistema de IA para Contadores
      </h2>
      <p className="text-xl text-slate-600">
        Más allá de Gemini y NotebookLM, existen herramientas específicas para potenciar cada área del estudio contable.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {/* II. Procesamiento de Datos */}
      <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Procesamiento de Datos</h3>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Google AI Studio</p>
          </div>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-blue-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Visión Artificial:</strong> Lectura automatizada de comprobantes y facturas físicas o en imagen.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-blue-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Extracción Estructurada:</strong> Transformación de PDFs escaneados a tablas de Excel/CSV listas para importar al sistema contable.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-blue-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Análisis Masivo:</strong> Procesamiento de grandes volúmenes de datos superando los límites de contexto de los chats tradicionales.</span>
          </li>
        </ul>
      </Card>

      {/* III. Personalización */}
      <Card className="border-t-4 border-t-purple-500 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Asistentes Personalizados</h3>
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Custom GPTs / Gems</p>
          </div>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-purple-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Instrucciones de Sistema:</strong> Creación de un asistente que responda exactamente con el tono y las reglas del estudio.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-purple-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Entrenamiento Propio:</strong> Carga de manuales de procedimientos internos y escalas de honorarios actualizadas.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-purple-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Atención al Cliente:</strong> Automatización de respuestas precisas para las consultas más frecuentes.</span>
          </li>
        </ul>
      </Card>

      {/* IV. Planificación */}
      <Card className="border-t-4 border-t-emerald-500 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Presentation className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Comunicación Profesional</h3>
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">ChatGPT / Claude</p>
          </div>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Gestión de Tiempos:</strong> Armado automático de cronogramas de vencimientos y planificación de tareas mensuales.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Redacción Técnica:</strong> Elaboración de informes de gestión, notas a los estados contables y minutas estructuradas.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-emerald-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Traducción de Jerga:</strong> Adaptación de lenguaje técnico contable a explicaciones simples para el cliente final.</span>
          </li>
        </ul>
      </Card>

      {/* V. Seguridad */}
      <Card className="border-t-4 border-t-red-500 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Seguridad y Ética</h3>
            <p className="text-sm font-semibold text-red-600 uppercase tracking-wider">Protección de Datos</p>
          </div>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-red-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Configuración de Privacidad:</strong> Desactivar el uso de nuestros datos para el entrenamiento de los modelos públicos.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-red-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Anonimización:</strong> Tratamiento adecuado de datos sensibles (nombres, CUITs, montos) antes de enviarlos a la IA.</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-red-100 p-1 rounded-full shrink-0">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Validación Humana:</strong> Prevención de "alucinaciones" mediante la revisión obligatoria de normativas y cálculos.</span>
          </li>
        </ul>
      </Card>
    </div>

    <SpeakerNote text="Para escalar el uso de IA en el estudio, debemos ir más allá del chat básico. Google AI Studio nos permite procesar miles de facturas en segundos. Los Custom GPTs actúan como asistentes entrenados con nuestros propios manuales. Y, por supuesto, todo esto debe estar enmarcado en estrictas políticas de privacidad y anonimización de datos de nuestros clientes." />
  </motion.div>
);

const DashboardSection = () => (
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
        <h3 className="text-lg font-bold text-slate-900 mb-6">Evolución Financiera</h3>
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
        <h3 className="text-lg font-bold text-slate-900 mb-6">Distribución de Clientes</h3>
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

const CierreSection = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
    className="space-y-8"
  >
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 text-center py-24 px-6">
      <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/success-future/1200/800')] bg-cover bg-center mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20 rotate-12">
          <Target className="w-10 h-10 text-white -rotate-12" />
        </div>
        
        <h2 className="text-5xl font-extrabold text-white leading-tight">
          El futuro del contador no es cargar datos. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Es el asesoramiento estratégico.</span>
        </h2>
        
        <p className="text-xl text-slate-300">
          Gemini y NotebookLM no vienen a reemplazarnos. Vienen a liberarnos del trabajo operativo para que podamos enfocarnos en lo que realmente aporta valor al cliente.
        </p>

        <div className="pt-8">
          <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            ¿Preguntas?
          </button>
        </div>
      </div>
    </div>

    <SpeakerNote text="En conclusión, la inteligencia artificial no viene a reemplazar el criterio profesional del contador, sino a potenciarlo. Al automatizar las tareas operativas y el análisis preliminar de datos, ganamos el tiempo necesario para brindar un asesoramiento estratégico de alto valor. El futuro de la profesión pertenece a quienes integren estas tecnologías en su práctica diaria. Muchas gracias por su atención." />
  </motion.div>
);

// --- COMPONENTE PRINCIPAL ---

function App() {
  const [activeTab, setActiveTab] = useState('intro');

  const navItems = [
    { id: 'intro', label: 'Inicio', icon: Presentation },
    { id: 'gemini', label: 'Gemini', icon: Bot },
    { id: 'notebooklm', label: 'NotebookLM', icon: BrainCircuit },
    { id: 'ecosistema', label: 'Ecosistema IA', icon: Layers },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cierre', label: 'Cierre', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-200 selection:text-blue-900">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">IA Contable</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-wider uppercase ml-13">Masterclass</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 m-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Modo Speaker</p>
              <p className="text-xs text-slate-400">Tania Damiani</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 lg:p-16 max-w-7xl">
        {activeTab === 'intro' && <IntroSection />}
        {activeTab === 'gemini' && <GeminiSection />}
        {activeTab === 'notebooklm' && <NotebookLMSection />}
        {activeTab === 'ecosistema' && <AdditionalToolsSection />}
        {activeTab === 'dashboard' && <DashboardSection />}
        {activeTab === 'cierre' && <CierreSection />}
      </main>
    </div>
  );
}

export default App;
