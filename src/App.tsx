// ============================================================================
// APP PRINCIPAL - LAYOUT MOBILE-FIRST ORIENTAL (ESTILO FORTUNE TIGER)
// ============================================================================

import React from 'react';
import { Mascot } from './components/Mascot';
import { Slot } from './components/Slot';
import { BetControls } from './components/BetControls';
import { WinBanner } from './components/WinBanner';
import { PayTable } from './components/PayTable';
import { History } from './components/History';

// Partículas de moedas e brilhos dourados caindo no fundo
const FALLING_COINS = [
  { left: '6%', delay: '0s', duration: '7s', emoji: '🪙' },
  { left: '18%', delay: '2.2s', duration: '8.5s', emoji: '✨' },
  { left: '32%', delay: '1.1s', duration: '6.8s', emoji: '🪙' },
  { left: '48%', delay: '3.5s', duration: '9s', emoji: '🧧' },
  { left: '64%', delay: '0.7s', duration: '7.4s', emoji: '🪙' },
  { left: '79%', delay: '2.8s', duration: '8.1s', emoji: '✨' },
  { left: '91%', delay: '1.6s', duration: '6.9s', emoji: '🪙' },
];

export const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-2 sm:py-4 px-2 relative overflow-hidden">
      {/* Brilho ambiente externo para desktop */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(220,38,38,0.28)_0%,transparent_65%)]" />

      {/* Container Mobile-First centralizado (max-width ~430px) */}
      <main className="relative w-full max-w-[430px] rounded-[28px] imperial-pattern border-4 border-amber-500/80 shadow-[0_0_55px_rgba(185,28,28,0.75),inset_0_0_30px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col justify-between pb-2.5">
        {/* Moedas e partículas douradas caindo continuamente ao fundo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {FALLING_COINS.map((coin, idx) => (
            <span
              key={idx}
              style={{
                left: coin.left,
                animationDelay: coin.delay,
                animationDuration: coin.duration,
              }}
              className="absolute -top-10 text-base sm:text-lg opacity-60 animate-coin-fall select-none"
            >
              {coin.emoji}
            </span>
          ))}
        </div>

        {/* Lanternas Orientais Penduradas no Topo Esquerdo e Direito */}
        <div className="absolute top-1 left-2.5 z-20 pointer-events-none flex flex-col items-center animate-lantern">
          <div className="w-0.5 h-3 bg-yellow-400" />
          <div className="text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]">
            🏮
          </div>
        </div>
        <div
          style={{ animationDelay: '1.4s' }}
          className="absolute top-1 right-2.5 z-20 pointer-events-none flex flex-col items-center animate-lantern"
        >
          <div className="w-0.5 h-3 bg-yellow-400" />
          <div className="text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]">
            🏮
          </div>
        </div>

        {/* Cabeçalho com Título "IgorMaster" em Fonte Grossa Dourada com Brilho */}
        <header className="relative z-10 pt-3 pb-1 text-center px-10">
          <div className="inline-block px-3 py-0.5 rounded-full bg-red-950/80 border border-amber-400/50 text-[10px] font-bold text-amber-300 tracking-widest uppercase mb-0.5">
            ✨ O Tigrinho Oficial da Galera ✨
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider gold-text uppercase">
            IgorMaster
          </h1>
        </header>

        {/* Mascote Igor com animações e balão de fala */}
        <Mascot />

        {/* Grade 3x3 com Moldura Dourada Ornamentada */}
        <Slot />

        {/* Controles de Aposta, Giro, Auto-Giro e Modais */}
        <BetControls />

        {/* Aviso discreto obrigatório no rodapé */}
        <footer className="relative z-10 mt-1.5 pt-1.5 border-t border-amber-500/20 text-center px-3">
          <p className="text-[11px] text-amber-200/75 font-medium tracking-wide">
            Jogo de brincadeira. Moedas fictícias. Não vale nada 😄
          </p>
        </footer>

        {/* Modais e Overlays */}
        <WinBanner />
        <PayTable />
        <History />
      </main>
    </div>
  );
};

export default App;

