// ============================================================================
// COMPONENTE WINBANNER - SHOW DE CELEBRAÇÃO (GRANDE VITÓRIA, ÉPICA, IGOR MASTER)
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import igorWinImg from '../assets/igor/igor-win.png';
import { soundManager } from '../lib/audio';

export const WinBanner: React.FC = () => {
  const showWinBanner = useGameStore((s) => s.showWinBanner);
  const lastWin = useGameStore((s) => s.lastWin);
  const bet = useGameStore((s) => s.bet);
  const winTier = useGameStore((s) => s.winTier);
  const isFullGridBonus = useGameStore((s) => s.isFullGridBonus);
  const dismissWinBanner = useGameStore((s) => s.dismissWinBanner);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!showWinBanner || lastWin <= 0) return;

    // Dispara fogos de confete dourados e vermelhos!
    try {
      confetti({
        particleCount: winTier === 'igormaster' ? 140 : 85,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FFD700', '#F59E0B', '#EF4444', '#FEF08A'],
      });
    } catch {
      // Ignora em ambientes sem canvas
    }

    let raf: number;
    const duration = 1500;
    const start = performance.now();
    let lastTick = 0;

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.floor(lastWin * eased));

      if (now - lastTick > 85 && progress < 1) {
        soundManager.play('coins');
        lastTick = now;
      }

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCounter(lastWin);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [showWinBanner, lastWin, winTier]);

  const titleConfig = {
    none: { title: 'BOA!', subtitle: 'O Igor liberou as moedas!' },
    normal: { title: 'BOA!', subtitle: 'O Igor tá de bom humor!' },
    big: {
      title: 'GRANDE VITÓRIA!',
      subtitle: 'O Igor abriu o cofre imperial! 🤑',
    },
    epic: {
      title: 'VITÓRIA ÉPICA!',
      subtitle: 'CHAMA OS BOMBEIROS QUE O IGOR TÁ ON FIRE! 🔥',
    },
    igormaster: {
      title: 'IGOR MASTER!',
      subtitle: 'TELA INTEIRA FECHADA! BÔNUS MULTIPLICADOR X10! 👑🐯',
    },
  }[winTier];

  const mult = bet > 0 ? Math.round(lastWin / bet) : 0;

  return (
    <AnimatePresence>
      {showWinBanner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissWinBanner}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.4, rotate: -6, y: 40 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={(e) => {
              e.stopPropagation();
              dismissWinBanner();
            }}
            className="relative w-full max-w-[380px] rounded-3xl p-6 text-center gold-border-ornate shadow-[0_0_60px_rgba(255,215,0,0.95)] overflow-hidden"
          >
            <div className="rounded-2xl bg-gradient-to-b from-red-900 via-red-950 to-[#1f0202] p-5 border-2 border-yellow-300 relative overflow-hidden">
              {/* Raios solares girando ao fundo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-20 bg-[conic-gradient(from_0deg,transparent_0_30deg,rgba(255,215,0,0.22)_30_60deg,transparent_60_90deg,rgba(255,215,0,0.22)_90_120deg,transparent_120_150deg,rgba(255,215,0,0.22)_150_180deg,transparent_180_210deg,rgba(255,215,0,0.22)_210_240deg,transparent_240_270deg,rgba(255,215,0,0.22)_270_300deg,transparent_300_330deg,rgba(255,215,0,0.22)_330_360deg)] pointer-events-none"
              />

              {/* Foto do Igor Comemorando */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="relative z-10 mx-auto w-28 h-28 rounded-full border-4 border-yellow-300 shadow-[0_0_30px_#ffd700] overflow-hidden bg-red-900 mb-3"
              >
                <img
                  src={igorWinImg}
                  alt="Igor Comemorando"
                  className="w-full h-full object-cover scale-110 contrast-115"
                />
                <div className="absolute top-0 inset-x-0 text-center text-2xl">
                  👑
                </div>
              </motion.div>

              {isFullGridBonus && (
                <div className="relative z-10 inline-block mb-1 px-3 py-0.5 rounded-full bg-yellow-400 text-red-950 font-black text-xs uppercase tracking-widest shadow">
                  🔥 BÔNUS 10X TELA CHEIA 🔥
                </div>
              )}

              {/* Título Principal */}
              <h2 className="relative z-10 font-display text-2xl sm:text-3xl font-black gold-text tracking-wider uppercase">
                {titleConfig.title}
              </h2>
              <p className="relative z-10 text-xs text-amber-200 font-semibold mt-1">
                {titleConfig.subtitle}
              </p>

              {/* Contador gigante de IgorCoins */}
              <div className="relative z-10 my-4 py-3 px-4 rounded-2xl bg-black/50 border-2 border-yellow-400 shadow-inner">
                <div className="text-[11px] uppercase font-bold text-amber-300 tracking-widest">
                  Prêmio Total ({mult}x a aposta)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-yellow-300 tabular-nums drop-shadow-[0_2px_10px_rgba(255,215,0,0.8)] mt-0.5">
                  +{counter.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs font-extrabold text-amber-400 uppercase">
                  IgorCoins Fictícias
                </div>
              </div>

              <button
                onClick={dismissWinBanner}
                className="relative z-10 w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-red-950 font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Coletar Moedas de Mentira 😄
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

