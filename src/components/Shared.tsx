import React, { useState, useEffect } from 'react';
import { Mic, StopCircle, Volume2 } from 'lucide-react';

export const SpeakerNote = ({ text }: { text: string }) => {
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

export const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 ${className}`}>
    {children}
  </div>
);
