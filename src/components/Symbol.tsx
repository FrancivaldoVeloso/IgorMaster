// ============================================================================
// COMPONENTE SÍMBOLO (ÍCONE INDIVIDUAL DOS ROLOS)
// ============================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { SYMBOLS, SymbolId } from '../lib/config';
import igorWildImg from '../assets/igor/igor-wild.png';

interface SymbolProps {
  symbolId: SymbolId;
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export const SymbolCard: React.FC<SymbolProps> = ({
  symbolId,
  isHighlighted = false,
  isDimmed = false,
}) => {
  const sym = SYMBOLS[symbolId];

  return (
    <motion.div
      animate={
        isHighlighted
          ? {
              scale: [1, 1.09, 1],
              rotate: [0, -3, 3, 0],
            }
          : { scale: 1, rotate: 0 }
      }
      transition={
        isHighlighted
          ? { duration: 0.75, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
      className={`relative w-full h-[84px] sm:h-[94px] rounded-xl p-1 select-none flex flex-col items-center justify-center overflow-hidden transition-opacity duration-200 ${
        isDimmed ? 'opacity-40 scale-95' : 'opacity-100'
      }`}
    >
      {/* Fundo e moldura do card do símbolo */}
      <div
        className={`w-full h-full rounded-lg bg-gradient-to-b ${sym.bgGradient} border-2 flex flex-col items-center justify-center relative overflow-hidden shadow-md`}
        style={{
          borderColor: isHighlighted ? '#FFFFFF' : sym.borderColor,
          boxShadow: isHighlighted
            ? '0 0 18px rgba(255, 215, 0, 0.95), inset 0 0 12px rgba(255, 255, 255, 0.6)'
            : 'inset 0 2px 6px rgba(255,255,255,0.2)',
        }}
      >
        {/* Brilho de fundo radial */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,transparent_70%)] pointer-events-none" />

        {sym.isWild ? (
          // Símbolo especial WILD: a cara do Igor!
          <div className="relative w-full h-full flex flex-col items-center justify-center p-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-yellow-200 overflow-hidden shadow-[0_0_12px_#ffd700] bg-red-900">
              <img
                src={igorWildImg}
                alt="Igor Wild"
                className="w-full h-full object-cover scale-110 contrast-110"
              />
            </div>
            <div className="mt-0.5 px-2 py-0.2 rounded-full bg-gradient-to-r from-red-700 via-amber-500 to-red-700 border border-yellow-100 shadow">
              <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-white drop-shadow">
                WILD 100x
              </span>
            </div>
          </div>
        ) : (
          // Símbolos normais do Tigrinho com arte ornamentada e multiplicador discreto
          <div className="relative flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl filter drop-shadow-[0_3px_4px_rgba(0,0,0,0.65)] transform transition-transform">
              {sym.emoji}
            </span>
            <span className="mt-0.5 text-[10px] font-bold tracking-tight text-yellow-100/95 bg-black/35 px-1.5 rounded-full border border-white/15">
              {sym.name.split(' ')[0]} {sym.multiplier}x
            </span>
          </div>
        )}

        {/* Destaque pulsante quando faz parte de linha vencedora */}
        {isHighlighted && (
          <motion.div
            animate={{ opacity: [0.2, 0.65, 0.2] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="absolute inset-0 rounded-lg border-2 border-yellow-200 bg-yellow-300/15 pointer-events-none"
          />
        )}
      </div>
    </motion.div>
  );
};

