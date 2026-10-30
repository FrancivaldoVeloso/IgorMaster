// ============================================================================
// COMPONENTE HISTORY - MODAL COM HISTÓRICO DOS ÚLTIMOS GIROS
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History as HistoryIcon } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const History: React.FC = () => {
  const isOpen = useGameStore((s) => s.isHistoryOpen);
  const setOpen = useGameStore((s) => s.setHistoryOpen);
  const history = useGameStore((s) => s.history);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] max-h-[82vh] rounded-2xl p-1.5 gold-border-ornate shadow-2xl flex flex-col"
          >
            <div className="bg-gradient-to-b from-red-950 via-[#2a0303] to-[#170101] rounded-xl p-4 overflow-y-auto flex flex-col gap-3 text-amber-100">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5 text-yellow-400" />
                  <h2 className="font-display text-lg font-black gold-text uppercase">
                    Histórico de Giros
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg bg-red-900/80 hover:bg-red-800 text-amber-200 border border-amber-500/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="py-10 text-center text-xs text-amber-200/60">
                  Nenhum giro registrado ainda. Dê o primeiro giro no IgorMaster! 🐯
                </div>
              ) : (
                <div className="space-y-1.5">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs ${
                        item.win > 0
                          ? 'bg-amber-500/15 border-yellow-400/50'
                          : 'bg-black/35 border-amber-500/20 opacity-80'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-amber-200 flex items-center gap-1.5">
                          <span>🕒 {item.time}</span>
                          {item.hadRespin && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-red-950 font-black text-[9px] uppercase">
                              Wild Respin
                            </span>
                          )}
                          {item.isFullGrid && (
                            <span className="px-1.5 py-0.2 rounded bg-yellow-300 text-red-950 font-black text-[9px] uppercase">
                              10x Master
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-amber-200/70">
                          Aposta: {item.bet} IC
                        </div>
                      </div>

                      <div className="text-right">
                        {item.win > 0 ? (
                          <>
                            <div className="font-black text-emerald-300 text-sm">
                              +{item.win} IC
                            </div>
                            <div className="text-[10px] font-bold text-yellow-300">
                              {item.multiplier}x
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-amber-200/50">
                            0 IC
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

