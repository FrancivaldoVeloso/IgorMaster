// ============================================================================
// COMPONENTE SLOT (MOLDURA DOURADA ORNAMENTADA 3X3 + LINHAS VENCEDORAS)
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Reel } from './Reel';
import { SYMBOLS } from '../lib/config';

// Coordenadas percentuais aproximadas do centro de cada célula (col 0..2, row 0..2)
// para desenhar as linhas vencedoras em SVG sobre a grade 3x3
const COL_CENTERS = [16.66, 50, 83.33];
const ROW_CENTERS = [16.66, 50, 83.33];

export const Slot: React.FC = () => {
  const grid = useGameStore((s) => s.grid);
  const reelStatus = useGameStore((s) => s.reelStatus);
  const expandedCols = useGameStore((s) => s.expandedCols);
  const lockedCols = useGameStore((s) => s.lockedCols);
  const nearMissCol2 = useGameStore((s) => s.nearMissCol2);
  const winningLines = useGameStore((s) => s.winningLines);
  const isRespinning = useGameStore((s) => s.isRespinning);
  const isFullGridBonus = useGameStore((s) => s.isFullGridBonus);

  // Calcula quais linhas de cada coluna estão destacadas em alguma linha vencedora
  const getHighlightedRowsForCol = (colIndex: number): number[] => {
    const rows = new Set<number>();
    for (const line of winningLines) {
      for (const [c, r] of line.coords) {
        if (c === colIndex) rows.add(r);
      }
    }
    return Array.from(rows);
  };

  const hasAnyWin = winningLines.length > 0;

  return (
    <div className="relative w-full px-2 sm:px-3 z-10">
      {/* Faixa superior da moldura indicando 5 Linhas e Bônus 10x */}
      <div className="mx-auto w-[92%] py-1 px-3 rounded-t-2xl bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 border-t-2 border-x-2 border-yellow-200 flex items-center justify-between shadow-md">
        <span className="text-[10px] sm:text-xs font-black text-red-950 uppercase tracking-wider">
          🐯 5 Linhas de Pagamento
        </span>
        <span className="text-[10px] sm:text-xs font-black text-red-950 uppercase tracking-wider">
          Tela Cheia = x10! 🔥
        </span>
      </div>

      {/* Moldura dourada ornamentada estilo Fortune Tiger */}
      <div className="relative rounded-2xl p-2 sm:p-2.5 gold-border-ornate shadow-gold-glow">
        {/* Cantoneiras ornamentais chinesas nos 4 cantos */}
        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-tl-xl border-t-4 border-l-4 border-yellow-100 pointer-events-none" />
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-tr-xl border-t-4 border-r-4 border-yellow-100 pointer-events-none" />
        <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-bl-xl border-b-4 border-l-4 border-yellow-100 pointer-events-none" />
        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-br-xl border-b-4 border-r-4 border-yellow-100 pointer-events-none" />

        {/* Interior vermelho escuro abrigando as 3 colunas */}
        <div className="relative rounded-xl bg-[#1a0101] p-1.5 sm:p-2 border-2 border-red-950 flex gap-1.5 sm:gap-2 items-center justify-between overflow-hidden">
          {[0, 1, 2].map((colIdx) => (
            <Reel
              key={colIdx}
              colIndex={colIdx}
              symbols={grid[colIdx]}
              status={reelStatus[colIdx]}
              isExpanded={expandedCols.includes(colIdx)}
              isLocked={lockedCols.includes(colIdx)}
              isNearMissSuspense={colIdx === 2 && nearMissCol2}
              highlightedRows={getHighlightedRowsForCol(colIdx)}
              hasAnyWin={hasAnyWin}
            />
          ))}

          {/* Overlay SVG destacando visualmente as linhas vencedoras */}
          {hasAnyWin && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            >
              {winningLines.map((line) => {
                const [p0, p1, p2] = line.coords;
                const points = `${COL_CENTERS[p0[0]]},${ROW_CENTERS[p0[1]]} ${COL_CENTERS[p1[0]]},${ROW_CENTERS[p1[1]]} ${COL_CENTERS[p2[0]]},${ROW_CENTERS[p2[1]]}`;

                return (
                  <g key={line.paylineId}>
                    {/* Brilho externo da linha */}
                    <motion.polyline
                      points={points}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0.5, 0.95, 0.5] }}
                      transition={{
                        pathLength: { duration: 0.35 },
                        opacity: { duration: 0.9, repeat: Infinity },
                      }}
                    />
                    {/* Linha colorida principal */}
                    <motion.polyline
                      points={points}
                      fill="none"
                      stroke={line.color}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.35 }}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Faixa flutuante quando dispara RESPIN GRÁTIS do Wild */}
          <AnimatePresence>
            {isRespinning && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none bg-gradient-to-r from-red-700 via-amber-500 to-red-700 border-2 border-yellow-200 px-4 py-1.5 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.95)]"
              >
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest whitespace-nowrap drop-shadow">
                  🐯 RESPIN GRÁTIS DO IGOR! 🐯
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chips das linhas vencedoras logo abaixo dos rolos */}
        <AnimatePresence>
          {hasAnyWin && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 flex flex-wrap items-center justify-center gap-1.5"
            >
              {isFullGridBonus && (
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-red-950 font-black text-xs shadow animate-bounce">
                  👑 TELA CHEIA: MULTIPLICADOR X10 ATIVADO!
                </span>
              )}
              {winningLines.map((line) => (
                <span
                  key={line.paylineId}
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white border border-yellow-200/80 shadow flex items-center gap-1"
                  style={{ backgroundColor: line.color }}
                >
                  <span>{SYMBOLS[line.symbol].emoji}</span>
                  <span>{line.name}:</span>
                  <span className="font-black text-yellow-200">
                    +{line.payout} ({line.multiplier}x)
                  </span>
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

