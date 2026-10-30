// ============================================================================
// COMPONENTE REEL (COLUNA DOS ROLOS) - ANIMAÇÃO VERTICAL, BOUNCE E WILD EXPANDIDO
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYMBOL_LIST, SymbolId } from '../lib/config';
import { ReelStatus } from '../store/gameStore';
import { SymbolCard } from './Symbol';
import igorWildImg from '../assets/igor/igor-wild.png';

interface ReelProps {
  colIndex: number;
  symbols: [SymbolId, SymbolId, SymbolId];
  status: ReelStatus;
  isExpanded: boolean;
  isLocked: boolean;
  isNearMissSuspense: boolean;
  highlightedRows: number[];
  hasAnyWin: boolean;
}

export const Reel: React.FC<ReelProps> = ({
  colIndex,
  symbols,
  status,
  isExpanded,
  isLocked,
  isNearMissSuspense,
  highlightedRows,
  hasAnyWin,
}) => {
  // Lista duplicada para criar a faixa de rolagem vertical contínua enquanto gira
  const spinStrip = [...SYMBOL_LIST, ...SYMBOL_LIST, ...SYMBOL_LIST];

  return (
    <div
      className={`relative flex-1 h-[268px] sm:h-[298px] rounded-xl bg-gradient-to-b from-[#2a0303] via-[#450606] to-[#240202] p-1.5 overflow-hidden shadow-reel-inset border transition-all duration-300 ${
        isNearMissSuspense
          ? 'border-yellow-300 shadow-[0_0_25px_rgba(255,215,0,0.95),inset_0_0_20px_rgba(255,215,0,0.5)]'
          : isLocked
          ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
          : 'border-amber-700/60'
      }`}
    >
      {/* Efeito de suspense "Quase lá!" (Near Miss) na 3ª coluna */}
      {isNearMissSuspense && status === 'spinning' && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between py-2 animate-pulse bg-gradient-to-b from-yellow-400/25 via-transparent to-yellow-400/25">
          <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-red-950 font-black text-[10px] uppercase tracking-wider shadow">
            🔥 VEM IGOR?! 🔥
          </span>
          <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-red-950 font-black text-[10px] uppercase tracking-wider shadow">
            ⚡ QUASE LÁ! ⚡
          </span>
        </div>
      )}

      {/* Quando a coluna está girando: faixa vertical em alta velocidade */}
      {status === 'spinning' ? (
        <motion.div
          initial={{ y: -420 }}
          animate={{ y: [0, -520] }}
          transition={{
            duration: isNearMissSuspense ? 0.55 : 0.26,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex flex-col gap-1.5 filter blur-[1.5px]"
        >
          {spinStrip.map((sym, idx) => (
            <div key={`${colIndex}-spin-${idx}`} className="w-full">
              <SymbolCard symbolId={sym.id} />
            </div>
          ))}
        </motion.div>
      ) : (
        /* Quando a coluna para: efeito de bounce elástico de cima para baixo */
        <motion.div
          key={`stopped-${colIndex}-${symbols.join('-')}`}
          initial={{ y: -55, scaleY: 1.06 }}
          animate={{ y: 0, scaleY: 1 }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 18,
            mass: 0.9,
          }}
          className="flex flex-col justify-between h-full gap-1.5 relative"
        >
          {symbols.map((symId, rowIndex) => {
            const isHighlighted = highlightedRows.includes(rowIndex);
            const isDimmed = hasAnyWin && !isHighlighted;
            return (
              <SymbolCard
                key={`${colIndex}-${rowIndex}-${symId}`}
                symbolId={symId}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
              />
            );
          })}
        </motion.div>
      )}

      {/* Overlay especial quando o WILD DO IGOR expande para ocupar a coluna inteira! */}
      <AnimatePresence>
        {isExpanded && status === 'idle' && (
          <motion.div
            initial={{ scaleY: 0.2, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="absolute inset-1 z-10 rounded-lg overflow-hidden border-2 border-yellow-200 shadow-[0_0_25px_rgba(255,215,0,0.9)] bg-gradient-to-b from-amber-400 via-red-700 to-amber-900 flex flex-col items-center justify-between p-1.5"
          >
            {/* Foto grande do Igor ocupando a coluna toda */}
            <div className="absolute inset-0 opacity-90">
              <img
                src={igorWildImg}
                alt="Coluna Igor Wild Expandido"
                className="w-full h-full object-cover object-center contrast-115 saturate-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-yellow-500/30" />
            </div>

            {/* Topo do banner da coluna expandida */}
            <div className="relative z-10 px-2 py-0.5 rounded-full bg-yellow-400 text-red-950 font-black text-[10px] tracking-wider uppercase shadow-md border border-white">
              🐯 COLUNA IGOR 🐯
            </div>

            {/* Centro brilhante */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="relative z-10 my-auto bg-black/55 backdrop-blur-[2px] px-2.5 py-1 rounded-xl border border-yellow-300 text-center"
            >
              <div className="text-xs sm:text-sm font-black text-yellow-300 drop-shadow">
                WILD
              </div>
              <div className="text-[10px] font-bold text-white">100x</div>
            </motion.div>

            {/* Rodapé indicando coluna travada para Respin */}
            <div className="relative z-10 w-full text-center py-0.5 rounded bg-gradient-to-r from-red-800 via-amber-500 to-red-800 border border-yellow-200 shadow">
              <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider">
                {isLocked ? '🔒 TRAVADO RESPIN' : '✨ EXPANDIDO ✨'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

