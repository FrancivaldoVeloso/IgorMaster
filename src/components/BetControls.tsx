// ============================================================================
// COMPONENTE BETCONTROLS - SALDO, GANHO ANIMADO, APOSTA, GIRO, TURBO E AUTO
// ============================================================================

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  RotateCw,
  Volume2,
  VolumeX,
  BookOpen,
  History as HistoryIcon,
  Plus,
  Minus,
  Coins,
  RefreshCw,
  Square,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { AUTO_SPIN_OPTIONS, BET_VALUES } from '../lib/config';
import { soundManager } from '../lib/audio';

export const BetControls: React.FC = () => {
  const balance = useGameStore((s) => s.balance);
  const bet = useGameStore((s) => s.bet);
  const betIndex = useGameStore((s) => s.betIndex);
  const lastWin = useGameStore((s) => s.lastWin);
  const winTier = useGameStore((s) => s.winTier);
  const isSpinning = useGameStore((s) => s.isSpinning);
  const turboMode = useGameStore((s) => s.turboMode);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const autoSpinCount = useGameStore((s) => s.autoSpinCount);

  const spin = useGameStore((s) => s.spin);
  const increaseBet = useGameStore((s) => s.increaseBet);
  const decreaseBet = useGameStore((s) => s.decreaseBet);
  const rechargeBalance = useGameStore((s) => s.rechargeBalance);
  const toggleTurbo = useGameStore((s) => s.toggleTurbo);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const startAutoSpin = useGameStore((s) => s.startAutoSpin);
  const stopAutoSpin = useGameStore((s) => s.stopAutoSpin);
  const setPayTableOpen = useGameStore((s) => s.setPayTableOpen);
  const setHistoryOpen = useGameStore((s) => s.setHistoryOpen);

  const [displayedWin, setDisplayedWin] = useState(0);
  const [showAutoMenu, setShowAutoMenu] = useState(false);

  // Contagem animada do display de "Ganho" subindo
  useEffect(() => {
    if (lastWin <= 0) {
      setDisplayedWin(0);
      return;
    }

    let start = 0;
    const duration = Math.min(1200, Math.max(450, lastWin * 8));
    const startTime = performance.now();
    let lastSoundTick = 0;

    let rafId: number;
    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(start + (lastWin - start) * eased);
      setDisplayedWin(currentVal);

      if (now - lastSoundTick > 90 && progress < 1) {
        soundManager.play('coins');
        lastSoundTick = now;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animateCount);
      } else {
        setDisplayedWin(lastWin);
      }
    };

    rafId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(rafId);
  }, [lastWin]);

  // Atalho de barra de espaço para girar no desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpinning) {
        e.preventDefault();
        spin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, spin]);

  const needsRecharge = balance < bet || balance === 0;

  return (
    <div className="w-full px-2.5 sm:px-3 pt-2 pb-1 flex flex-col gap-2.5 z-10">
      {/* Banner rápido "BOA!" para vitórias normais (sem bloquear o ritmo) */}
      <AnimatePresence>
        {lastWin > 0 && !isSpinning && (
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="mx-auto px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 border-2 border-white shadow-[0_0_20px_rgba(255,215,0,0.85)] flex items-center gap-2"
          >
            <span className="text-xs sm:text-sm font-black text-red-950 uppercase tracking-wider">
              {winTier === 'igormaster'
                ? '👑 IGOR MASTER 10X!'
                : winTier === 'epic'
                ? '🔥 VITÓRIA ÉPICA!'
                : winTier === 'big'
                ? '🎉 GRANDE VITÓRIA!'
                : '✨ BOA!'}
            </span>
            <span className="text-sm sm:text-base font-black text-red-900">
              +{displayedWin} IgorCoins
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Painel triplo estilo Fortune Tiger: Carteira (IgorCoins) | Aposta | Ganho */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-gradient-to-b from-red-950/95 to-[#1f0202]/95 p-2 rounded-2xl border-2 border-amber-500/70 shadow-lg">
        {/* Saldo em IgorCoins */}
        <div className="flex flex-col items-center justify-center bg-black/40 rounded-xl py-1.5 px-2 border border-amber-500/30 relative">
          <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider flex items-center gap-1">
            <Coins className="w-3 h-3 text-yellow-400" /> IgorCoins
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-sm sm:text-base font-black text-yellow-300 tabular-nums">
              {balance.toLocaleString('pt-BR')}
            </span>
            <button
              onClick={rechargeBalance}
              title="Recarregar +1.000 IgorCoins Grátis"
              className="ml-0.5 p-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-red-950 font-bold shadow transition-transform active:scale-90"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Aposta Atual */}
        <div className="flex flex-col items-center justify-center bg-black/40 rounded-xl py-1.5 px-2 border border-amber-500/30">
          <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
            Aposta
          </span>
          <span className="text-sm sm:text-base font-black text-white tabular-nums mt-0.5">
            {bet} <span className="text-[10px] text-amber-300 font-semibold">IC</span>
          </span>
        </div>

        {/* Ganho com Contagem Animada */}
        <div
          className={`flex flex-col items-center justify-center rounded-xl py-1.5 px-2 border transition-colors ${
            displayedWin > 0
              ? 'bg-gradient-to-b from-amber-500/30 to-yellow-600/30 border-yellow-300 shadow-[0_0_12px_rgba(255,215,0,0.4)]'
              : 'bg-black/40 border-amber-500/30'
          }`}
        >
          <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
            Ganho
          </span>
          <span
            className={`text-sm sm:text-base font-black tabular-nums mt-0.5 ${
              displayedWin > 0 ? 'text-yellow-300 scale-105' : 'text-amber-100/60'
            }`}
          >
            {displayedWin.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Botão de Recarregar em destaque quando zerar ou saldo menor que a aposta */}
      <AnimatePresence>
        {needsRecharge && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={rechargeBalance}
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 text-red-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.8)] border-2 border-white flex items-center justify-center gap-2 animate-bounce"
          >
            <RefreshCw className="w-4 h-4 stroke-[3]" />
            Saldo Baixo! Recarregar +1.000 IgorCoins (Grátis)
          </motion.button>
        )}
      </AnimatePresence>

      {/* Linha Principal de Controles: TURBO | - | GIRAR | + | AUTO */}
      <div className="relative flex items-center justify-between px-1 sm:px-2 py-1">
        {/* Botão TURBO */}
        <button
          onClick={toggleTurbo}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl border-2 font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
            turboMode
              ? 'bg-gradient-to-b from-amber-400 to-orange-600 border-yellow-100 text-red-950 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
              : 'bg-red-950/90 border-amber-600/60 text-amber-200 hover:border-amber-400'
          }`}
        >
          <Zap
            className={`w-4 h-4 mb-0.5 ${
              turboMode ? 'fill-red-950 text-red-950 animate-pulse' : 'text-amber-400'
            }`}
          />
          Turbo
        </button>

        {/* Botão Diminuir Aposta (-) */}
        <button
          onClick={decreaseBet}
          disabled={isSpinning || betIndex === 0}
          aria-label="Diminuir aposta"
          className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 border-2 border-yellow-100 text-red-950 flex items-center justify-center shadow-lg disabled:opacity-40 active:scale-90 transition-transform"
        >
          <Minus className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Botão Central Grande e Redondo de GIRAR */}
        <motion.button
          whileTap={{ scale: 0.91 }}
          onClick={spin}
          disabled={isSpinning && autoSpinCount === 0}
          aria-label="Girar rolos"
          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1.5 gold-border-ornate shadow-gold-intense flex items-center justify-center group focus:outline-none"
        >
          <div
            className={`w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-yellow-200 shadow-inner transition-all ${
              isSpinning
                ? 'bg-gradient-to-b from-amber-600 via-red-700 to-red-900'
                : 'bg-gradient-to-b from-emerald-400 via-emerald-600 to-teal-900 group-hover:brightness-110'
            }`}
          >
            <RotateCw
              className={`w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${
                isSpinning ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'
              }`}
            />
            <span className="text-[10px] font-black tracking-widest text-yellow-100 uppercase mt-0.5 drop-shadow">
              {isSpinning ? '...' : 'GIRAR'}
            </span>
          </div>
        </motion.button>

        {/* Botão Aumentar Aposta (+) */}
        <button
          onClick={increaseBet}
          disabled={isSpinning || betIndex === BET_VALUES.length - 1}
          aria-label="Aumentar aposta"
          className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 border-2 border-yellow-100 text-red-950 flex items-center justify-center shadow-lg disabled:opacity-40 active:scale-90 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Botão AUTO-GIRO (10, 25, 50, 100 ou PARAR) */}
        <div className="relative">
          {autoSpinCount > 0 ? (
            <button
              onClick={stopAutoSpin}
              className="flex flex-col items-center justify-center w-14 h-12 rounded-xl bg-gradient-to-b from-rose-500 to-red-800 border-2 border-yellow-200 text-white font-black text-[10px] uppercase shadow-[0_0_15px_rgba(244,63,94,0.8)] active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-white mb-0.5" />
              <span>Parar ({autoSpinCount})</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAutoMenu((v) => !v)}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl border-2 font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                showAutoMenu
                  ? 'bg-amber-500 text-red-950 border-white'
                  : 'bg-red-950/90 border-amber-600/60 text-amber-200 hover:border-amber-400'
              }`}
            >
              <RefreshCw className="w-4 h-4 mb-0.5 text-amber-400" />
              Auto
            </button>
          )}

          {/* Menu Popover de quantidade de Giros Automáticos */}
          <AnimatePresence>
            {showAutoMenu && autoSpinCount === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                className="absolute bottom-14 right-0 z-30 bg-red-950 border-2 border-amber-400 rounded-xl p-2 shadow-2xl flex flex-col gap-1.5 min-w-[115px]"
              >
                <span className="text-[10px] font-extrabold text-amber-200 text-center uppercase border-b border-amber-500/30 pb-1">
                  Auto-Giro
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {AUTO_SPIN_OPTIONS.map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setShowAutoMenu(false);
                        startAutoSpin(count);
                      }}
                      className="py-1.5 px-2 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-red-950 font-black text-xs shadow active:scale-95"
                    >
                      {count}x
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Barra Secundária: Som | Tabela de Pagamento (Regras) | Histórico | Recarga Rápida */}
      <div className="flex items-center justify-between px-2 pt-0.5 text-xs text-amber-200/90">
        <button
          onClick={toggleSound}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-amber-500/30 transition-colors"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-semibold">Som: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[11px] font-semibold text-red-300">Mudo</span>
            </>
          )}
        </button>

        <button
          onClick={() => setPayTableOpen(true)}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-amber-500/30 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-semibold">Tabela / Regras</span>
        </button>

        <button
          onClick={() => setHistoryOpen(true)}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-amber-500/30 transition-colors"
        >
          <HistoryIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-semibold">Histórico</span>
        </button>
      </div>
    </div>
  );
};

