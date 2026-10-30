// ============================================================================
// COMPONENTE PAYTABLE - MODAL DE REGRAS, TABELA DE PAGAMENTO E 5 LINHAS
// ============================================================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Flame } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PAYLINES, SYMBOL_LIST } from '../lib/config';
import igorWildImg from '../assets/igor/igor-wild.png';

export const PayTable: React.FC = () => {
  const isOpen = useGameStore((s) => s.isPayTableOpen);
  const setOpen = useGameStore((s) => s.setPayTableOpen);
  const bet = useGameStore((s) => s.bet);

  // Ordena do maior para o menor multiplicador para exibir na tabela
  const sortedSymbols = [...SYMBOL_LIST].sort(
    (a, b) => b.multiplier - a.multiplier
  );

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
            className="w-full max-w-[420px] max-h-[88vh] rounded-2xl p-1.5 gold-border-ornate shadow-2xl flex flex-col"
          >
            <div className="bg-gradient-to-b from-red-950 via-[#2a0303] to-[#170101] rounded-xl p-4 overflow-y-auto flex flex-col gap-4 text-amber-100">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-2.5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="font-display text-lg font-black gold-text uppercase">
                    Regras & Pagamentos
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg bg-red-900/80 hover:bg-red-800 text-amber-200 border border-amber-500/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mecânicas Especiais do IgorMaster */}
              <div className="space-y-2 text-xs bg-black/40 p-3 rounded-xl border border-amber-500/40">
                <div className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-yellow-300">WILD DO IGOR + RESPIN GRÁTIS:</strong>{' '}
                    Quando o Igor Wild aparece em uma coluna, ele <strong>expande para ocupar a coluna inteira</strong>, substitui qualquer símbolo e dispara um <strong>RESPIN GRÁTIS</strong> com a coluna travada!
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-yellow-300">IGOR MASTER 10X (TELA CHEIA):</strong>{' '}
                    Se todos os 9 espaços da grade 3x3 fecharem com o mesmo símbolo (ou combinados com Wilds), o ganho total de todas as linhas é <strong>MULTIPLICADO POR 10X!</strong>
                  </p>
                </div>
              </div>

              {/* Tabela de Símbolos (Multiplicadores sobre a aposta) */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-2">
                  3 Símbolos Iguais na Linha (Aposta atual: {bet} IC)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {sortedSymbols.map((sym) => (
                    <div
                      key={sym.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-amber-500/30"
                    >
                      <div className="flex items-center gap-2.5">
                        {sym.isWild ? (
                          <img
                            src={igorWildImg}
                            alt="Igor Wild"
                            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-red-900/70 border border-amber-400/50 flex items-center justify-center text-2xl">
                            {sym.emoji}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-black text-yellow-200">
                            {sym.name}
                          </div>
                          <div className="text-[11px] text-amber-200/75">
                            {sym.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-sm font-black text-yellow-300">
                          {sym.multiplier}x
                        </div>
                        <div className="text-[10px] text-emerald-300 font-bold">
                          = {sym.multiplier * bet} IC
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagrama das 5 Linhas de Pagamento */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-2">
                  5 Linhas de Pagamento (3 Horizontais + 2 Diagonais)
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {PAYLINES.map((line) => (
                    <div
                      key={line.id}
                      className="bg-black/50 p-1.5 rounded-lg border border-amber-500/30 flex flex-col items-center"
                    >
                      <span className="text-[10px] font-bold text-amber-200 mb-1">
                        #{line.id}
                      </span>
                      <div className="grid grid-cols-3 gap-0.5 w-full aspect-square">
                        {[0, 1, 2].map((row) =>
                          [0, 1, 2].map((col) => {
                            const active = line.coords.some(
                              ([c, r]) => c === col && r === row
                            );
                            return (
                              <div
                                key={`${col}-${row}`}
                                className="rounded-[2px]"
                                style={{
                                  backgroundColor: active
                                    ? line.color
                                    : 'rgba(255,255,255,0.1)',
                                }}
                              />
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-red-950 font-black text-xs uppercase tracking-wider shadow"
              >
                Entendi, Bora Girar!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

