// ============================================================================
// COMPONENTE MASCOTE (IGOR) - ANIMAÇÕES IDLE, WIN, LOSE, WILD + BALÃO DE FALA
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getMensagemSeca } from '../lib/frases';

import igorIdle from '../assets/igor/igor-idle.png';
import igorWin from '../assets/igor/igor-win.png';
import igorLose from '../assets/igor/igor-lose.png';
import igorWild from '../assets/igor/igor-wild.png';

export const Mascot: React.FC = () => {
  const mascotMood = useGameStore((s) => s.mascotMood);
  const igorQuote = useGameStore((s) => s.igorQuote);
  const losingStreak = useGameStore((s) => s.losingStreak);
  const isRespinning = useGameStore((s) => s.isRespinning);
  const triggerPokeIgor = useGameStore((s) => s.triggerPokeIgor);

  const moodImage = {
    idle: igorIdle,
    win: igorWin,
    lose: igorLose,
    wild: igorWild,
  }[mascotMood];

  const secaMessage = getMensagemSeca(losingStreak);

  return (
    <div className="relative flex flex-col items-center w-full pt-1 pb-2 select-none z-10">
      {/* Balão de fala engraçado do Igor */}
      <AnimatePresence mode="wait">
        <motion.div
          key={igorQuote}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.92 }}
          transition={{ duration: 0.22 }}
          onClick={triggerPokeIgor}
          className="cursor-pointer mb-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-amber-100 to-yellow-200 border-2 border-yellow-500 shadow-[0_4px_15px_rgba(0,0,0,0.5)] max-w-[92%] text-center relative"
        >
          <p className="text-xs sm:text-sm font-bold text-red-950 leading-tight">
            “{igorQuote}”
          </p>
          {/* Pontinha do balão */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-3.5 bg-yellow-200 border-r-2 border-b-2 border-yellow-500 rotate-45" />
        </motion.div>
      </AnimatePresence>

      {/* Container do Mascote Igor estilo Tigrinho Imperial */}
      <div
        onClick={triggerPokeIgor}
        title="Clique no Igor para ouvir outra pérola!"
        className="relative cursor-pointer group flex items-center justify-center"
      >
        {/* Aura radiante atrás do Igor */}
        <motion.div
          animate={
            mascotMood === 'win' || mascotMood === 'wild'
              ? { scale: [1, 1.22, 1], rotate: [0, 180, 360], opacity: [0.7, 1, 0.7] }
              : { scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }
          }
          transition={{ duration: mascotMood === 'win' ? 1.5 : 3, repeat: Infinity }}
          className={`absolute w-28 h-28 rounded-full blur-md pointer-events-none ${
            mascotMood === 'win' || mascotMood === 'wild'
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-red-500'
              : mascotMood === 'lose'
              ? 'bg-gradient-to-r from-blue-500/40 via-slate-500/30 to-red-900/40'
              : 'bg-gradient-to-r from-yellow-500/50 via-amber-500/40 to-red-600/50'
          }`}
        />

        {/* Orelhinhas de Tigrinho Douradas no topo da cabeça do Igor */}
        <div className="absolute -top-2.5 w-24 flex justify-between px-1 z-0 pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-amber-400 to-orange-700 border-2 border-yellow-200 shadow-md -rotate-12 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-red-900/80" />
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-amber-400 to-orange-700 border-2 border-yellow-200 shadow-md rotate-12 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-red-900/80" />
          </div>
        </div>

        {/* Moldura Redonda Dourada com a cara do Igor */}
        <motion.div
          animate={
            mascotMood === 'win'
              ? {
                  y: [0, -10, 0, -8, 0],
                  scale: [1, 1.12, 1, 1.1, 1],
                  rotate: [0, -6, 6, -4, 0],
                }
              : mascotMood === 'wild'
              ? {
                  scale: [1, 1.16, 1.05, 1.16, 1],
                  rotate: [0, 5, -5, 5, 0],
                }
              : mascotMood === 'lose'
              ? {
                  x: [0, -4, 4, -3, 3, 0],
                  y: [0, 3, 0],
                }
              : {
                  y: [0, -4, 0],
                  scale: [1, 1.02, 1],
                }
          }
          transition={{
            duration: mascotMood === 'idle' ? 2.4 : 0.75,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 gold-border-ornate shadow-gold-glow flex items-center justify-center ${
            mascotMood === 'lose' ? 'grayscale-[35%]' : ''
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-red-900 bg-red-950 relative">
            <img
              src={moodImage}
              alt="Mascote Igor"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                mascotMood === 'win' || mascotMood === 'wild'
                  ? 'scale-110 contrast-110 saturate-125'
                  : mascotMood === 'lose'
                  ? 'scale-95 brightness-90'
                  : 'scale-105'
              }`}
            />

            {/* Acessórios visuais de acordo com o humor (para ficar ainda mais engraçado mesmo com a mesma foto!) */}
            {mascotMood === 'win' && (
              <>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-bounce">
                  👑
                </div>
                <div className="absolute bottom-1 right-1 text-lg animate-ping">
                  🤑
                </div>
              </>
            )}

            {mascotMood === 'wild' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/35 via-transparent to-yellow-300/25 mix-blend-overlay" />
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-xl animate-bounce">
                  🔥🐯🔥
                </div>
              </>
            )}

            {mascotMood === 'lose' && (
              <>
                {/* Lágrimas cômicas caindo quando perde */}
                <motion.span
                  animate={{ y: [0, 18], opacity: [1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                  className="absolute top-10 left-4 text-base pointer-events-none select-none"
                >
                  💧
                </motion.span>
                <motion.span
                  animate={{ y: [0, 18], opacity: [1, 0] }}
                  transition={{ duration: 0.9, delay: 0.4, repeat: Infinity }}
                  className="absolute top-10 right-4 text-base pointer-events-none select-none"
                >
                  💧
                </motion.span>
                <div className="absolute bottom-1 right-1 text-base">😭</div>
              </>
            )}
          </div>

          {/* Faixa inferior no mascote */}
          <div className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-red-800 via-red-600 to-red-800 border border-yellow-300 shadow-md">
            <span className="text-[10px] font-extrabold tracking-wider text-yellow-200 uppercase whitespace-nowrap">
              {isRespinning
                ? '🔥 MODO RESPIN 🔥'
                : mascotMood === 'win'
                ? '🐯 TÁ PAGANDO!'
                : mascotMood === 'wild'
                ? '⚡ IGOR SELVAGEM'
                : mascotMood === 'lose'
                ? '🤡 IGOR CHORANDO'
                : '🐯 IGOR DA SORTE'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Contador de "giros sem ganhar" com mensagem zoeira */}
      <AnimatePresence>
        {secaMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 px-3 py-1 rounded-full bg-red-950/90 border border-amber-500/40 text-amber-200 text-[11px] font-semibold shadow-inner text-center max-w-[92%]"
          >
            {secaMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

