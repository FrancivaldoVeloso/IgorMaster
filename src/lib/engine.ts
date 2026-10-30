// ============================================================================
// MOTOR DO JOGO (ENGINE) - SORTEIO, EXPANSÃO DE WILD, RESPIN E CÁLCULO DE LINHAS
// Não depende de UI para facilitar testes e manutenção limpa
// ============================================================================

import {
  FULL_GRID_BONUS_MULTIPLIER,
  LUCKY_BOOST_CHANCE,
  PAYLINES,
  REEL_WEIGHTS,
  SYMBOLS,
  SymbolId,
} from './config';

// A grade é representada como 3 colunas, cada uma com 3 linhas: Grid[col][row]
export type GridMatrix = [
  [SymbolId, SymbolId, SymbolId],
  [SymbolId, SymbolId, SymbolId],
  [SymbolId, SymbolId, SymbolId]
];

export interface WinningLineResult {
  paylineId: number;
  name: string;
  symbol: SymbolId;
  multiplier: number;
  payout: number;
  coords: [[number, number], [number, number], [number, number]];
  color: string;
}

export interface SpinEvaluation {
  rawGrid: GridMatrix;          // Grade sorteada originalmente
  finalGrid: GridMatrix;        // Grade após expansão do Wild do Igor nas colunas
  expandedCols: number[];       // Quais colunas (0, 1, 2) têm Wild expandido
  triggeredRespin: boolean;     // Se apareceu um NOVO Wild que dispara Respin grátis
  respinGrid?: GridMatrix;      // Caso tenha disparado Respin, a grade final após o Respin
  respinExpandedCols?: number[];// Colunas com Wild após o Respin
  winningLines: WinningLineResult[];
  isFullGridBonus: boolean;     // Se fechou a grade inteira (3x3) e ganhou x10 extra
  baseWin: number;              // Ganho somado das linhas antes do bônus x10
  totalWin: number;             // Ganho final total
  totalMultiplier: number;      // Multiplicador total equivalente (totalWin / bet)
  isNearMiss: boolean;          // Se as 2 primeiras colunas têm Wild ou ameaçam grande prêmio
  winTier: 'none' | 'normal' | 'big' | 'epic' | 'igormaster';
}

/**
 * Sorteia um símbolo para uma coluna específica usando os pesos configurados em config.ts
 */
export function pickWeightedSymbol(
  colIndex: number,
  excludeWild = false
): SymbolId {
  const weights = { ...REEL_WEIGHTS[colIndex] };
  if (excludeWild) {
    weights.wild = 0;
  }

  const entries = Object.entries(weights) as [SymbolId, number][];
  const totalWeight = entries.reduce((acc, [, weight]) => acc + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [symbolId, weight] of entries) {
    if (random < weight) {
      return symbolId;
    }
    random -= weight;
  }

  return 'laranja';
}

/**
 * Gera uma coluna de 3 símbolos
 */
export function generateColumn(
  colIndex: number,
  excludeWild = false
): [SymbolId, SymbolId, SymbolId] {
  return [
    pickWeightedSymbol(colIndex, excludeWild),
    pickWeightedSymbol(colIndex, excludeWild),
    pickWeightedSymbol(colIndex, excludeWild),
  ];
}

/**
 * Clona uma matriz 3x3
 */
export function cloneGrid(grid: GridMatrix): GridMatrix {
  return [
    [...grid[0]] as [SymbolId, SymbolId, SymbolId],
    [...grid[1]] as [SymbolId, SymbolId, SymbolId],
    [...grid[2]] as [SymbolId, SymbolId, SymbolId],
  ];
}

/**
 * Expande qualquer coluna que contenha pelo menos 1 'wild' para ficar com 3 'wild's
 */
export function applyWildExpansion(grid: GridMatrix): {
  expandedGrid: GridMatrix;
  expandedCols: number[];
} {
  const expandedGrid = cloneGrid(grid);
  const expandedCols: number[] = [];

  for (let col = 0; col < 3; col++) {
    if (expandedGrid[col].includes('wild')) {
      expandedGrid[col] = ['wild', 'wild', 'wild'];
      expandedCols.push(col);
    }
  }

  return { expandedGrid, expandedCols };
}

/**
 * Verifica se 3 símbolos em uma linha de pagamento formam uma combinação vencedora.
 * Como o 'wild' substitui qualquer símbolo e também paga sozinho:
 * - Se todos os 3 forem 'wild', paga o multiplicador do 'wild' (x100)
 * - Se houver mistura de um único símbolo + 'wild'(s), paga o multiplicador daquele símbolo
 */
export function evaluateLineSymbols(
  s1: SymbolId,
  s2: SymbolId,
  s3: SymbolId
): SymbolId | null {
  const symbols = [s1, s2, s3];
  const nonWilds = symbols.filter((s) => s !== 'wild');

  // Todos os 3 são Wild do Igor!
  if (nonWilds.length === 0) {
    return 'wild';
  }

  // Todos os símbolos não-wild precisam ser iguais entre si
  const targetSymbol = nonWilds[0];
  const allMatch = nonWilds.every((s) => s === targetSymbol);

  return allMatch ? targetSymbol : null;
}

/**
 * Calcula todas as linhas vencedoras e verifica se a grade inteira (3x3) fechou
 * com o mesmo símbolo (ou wilds), aplicando o multiplicador x10 extra do Tigrinho!
 */
export function calculateGridPayout(
  grid: GridMatrix,
  bet: number
): {
  winningLines: WinningLineResult[];
  isFullGridBonus: boolean;
  baseWin: number;
  totalWin: number;
} {
  const winningLines: WinningLineResult[] = [];

  for (const payline of PAYLINES) {
    const [c0, c1, c2] = payline.coords;
    const sym0 = grid[c0[0]][c0[1]];
    const sym1 = grid[c1[0]][c1[1]];
    const sym2 = grid[c2[0]][c2[1]];

    const matchedSymbol = evaluateLineSymbols(sym0, sym1, sym2);
    if (matchedSymbol) {
      const multiplier = SYMBOLS[matchedSymbol].multiplier;
      const payout = bet * multiplier;
      winningLines.push({
        paylineId: payline.id,
        name: payline.name,
        symbol: matchedSymbol,
        multiplier,
        payout,
        coords: payline.coords,
        color: payline.color,
      });
    }
  }

  // Verifica se a grade inteira 3x3 é do mesmo símbolo (ou combinada com Wilds)
  const allCells: SymbolId[] = [
    ...grid[0],
    ...grid[1],
    ...grid[2],
  ];
  const nonWildCells = allCells.filter((s) => s !== 'wild');
  const isFullGridBonus =
    winningLines.length === 5 &&
    (nonWildCells.length === 0 ||
      nonWildCells.every((s) => s === nonWildCells[0]));

  const baseWin = winningLines.reduce((sum, line) => sum + line.payout, 0);
  const totalWin = isFullGridBonus
    ? baseWin * FULL_GRID_BONUS_MULTIPLIER
    : baseWin;

  return {
    winningLines,
    isFullGridBonus,
    baseWin,
    totalWin,
  };
}

/**
 * Detecta efeito "Quase lá" (Near Miss):
 * - Quando as 2 primeiras colunas têm Wild, OU
 * - Quando as 2 primeiras colunas têm o mesmo símbolo alinhado em alguma linha
 */
export function checkNearMiss(
  rawGrid: GridMatrix,
  expandedCols: number[]
): boolean {
  // Se as duas primeiras colunas têm Wild!
  if (expandedCols.includes(0) && expandedCols.includes(1)) {
    return true;
  }

  // Ou se alguma linha de pagamento tem símbolos fortes ou iguais nas colunas 0 e 1
  for (const payline of PAYLINES) {
    const [c0, c1] = payline.coords;
    const s0 = rawGrid[c0[0]][c0[1]];
    const s1 = rawGrid[c1[0]][c1[1]];
    if (s0 === s1 || s0 === 'wild' || s1 === 'wild') {
      const target = s0 === 'wild' ? s1 : s0;
      if (target === 'wild' || SYMBOLS[target].multiplier >= 10) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Classifica o nível de vitória para exibir o banner correto:
 * - "BOA!" (normal: > 0 até < 15x)
 * - "GRANDE VITÓRIA!" (big: >= 15x até < 50x)
 * - "VITÓRIA ÉPICA!" (epic: >= 50x)
 * - "IGOR MASTER!" (igormaster: grade inteira fechada com bônus x10)
 */
export function classifyWinTier(
  totalWin: number,
  bet: number,
  isFullGridBonus: boolean
): 'none' | 'normal' | 'big' | 'epic' | 'igormaster' {
  if (totalWin <= 0) return 'none';
  if (isFullGridBonus) return 'igormaster';
  const mult = totalWin / bet;
  if (mult >= 50) return 'epic';
  if (mult >= 15) return 'big';
  return 'normal';
}

/**
 * Executa um giro completo (incluindo expansão de Wild e Respin automático quando Wild aparece!)
 */
export function executeSpin(bet: number): SpinEvaluation {
  // Pequena chance divertida de "Sorte do Igor" para facilitar combinações e telas cheias no meme
  let rawGrid: GridMatrix;

  if (Math.random() < LUCKY_BOOST_CHANCE) {
    const luckySymbol = pickWeightedSymbol(0, true);
    rawGrid = [
      [luckySymbol, luckySymbol, luckySymbol],
      [luckySymbol, Math.random() < 0.65 ? 'wild' : luckySymbol, luckySymbol],
      [
        luckySymbol,
        luckySymbol,
        Math.random() < 0.7 ? luckySymbol : pickWeightedSymbol(2, true),
      ],
    ];
  } else {
    rawGrid = [
      generateColumn(0),
      generateColumn(1),
      generateColumn(2),
    ];
  }

  // Verifica expansão de Wild no giro inicial
  const { expandedGrid, expandedCols } = applyWildExpansion(rawGrid);

  // Igual ao Tigrinho: se apareceu pelo menos 1 coluna com Wild (e não fechou 3 colunas de Wild de cara),
  // o Wild expande na coluna toda, trava aquela(s) coluna(s) e dispara um RESPIN GRÁTIS nas outras colunas!
  const triggeredRespin = expandedCols.length > 0 && expandedCols.length < 3;

  let respinGrid: GridMatrix | undefined;
  let respinExpandedCols: number[] | undefined;
  let evaluationGrid = expandedGrid;

  if (triggeredRespin) {
    const nextRaw = cloneGrid(expandedGrid);
    for (let col = 0; col < 3; col++) {
      if (!expandedCols.includes(col)) {
        nextRaw[col] = generateColumn(col);
      }
    }
    const afterRespin = applyWildExpansion(nextRaw);
    respinGrid = afterRespin.expandedGrid;
    respinExpandedCols = afterRespin.expandedCols;
    evaluationGrid = respinGrid;
  }

  const { winningLines, isFullGridBonus, baseWin, totalWin } =
    calculateGridPayout(evaluationGrid, bet);

  const isNearMiss = checkNearMiss(rawGrid, expandedCols);
  const totalMultiplier = bet > 0 ? totalWin / bet : 0;
  const winTier = classifyWinTier(totalWin, bet, isFullGridBonus);

  return {
    rawGrid,
    finalGrid: expandedGrid,
    expandedCols,
    triggeredRespin,
    respinGrid,
    respinExpandedCols,
    winningLines,
    isFullGridBonus,
    baseWin,
    totalWin,
    totalMultiplier,
    isNearMiss,
    winTier,
  };
}

