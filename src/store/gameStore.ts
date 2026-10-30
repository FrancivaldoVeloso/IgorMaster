// ============================================================================
// ESTADO GLOBAL DO JOGO (ZUSTAND) - SALDO NO LOCALSTORAGE, GIRO, RESPIN E AUTO-GIRO
// ============================================================================

import { create } from 'zustand';
import {
  BET_VALUES,
  INITIAL_BALANCE,
} from '../lib/config';
import {
  executeSpin,
  GridMatrix,
  WinningLineResult,
} from '../lib/engine';
import { sortearFrase } from '../lib/frases';
import { soundManager } from '../lib/audio';

const STORAGE_KEY_BALANCE = 'igormaster_balance_v1';
const STORAGE_KEY_HISTORY = 'igormaster_history_v1';

export type ReelStatus = 'idle' | 'spinning';
export type MascotMood = 'idle' | 'win' | 'lose' | 'wild';

export interface SpinHistoryItem {
  id: string;
  time: string;
  bet: number;
  win: number;
  multiplier: number;
  hadRespin: boolean;
  isFullGrid: boolean;
}

interface GameState {
  // Saldo e Aposta
  balance: number;
  betIndex: number;
  bet: number;

  // Estado dos Rolos e Grade 3x3
  grid: GridMatrix;
  reelStatus: [ReelStatus, ReelStatus, ReelStatus];
  isSpinning: boolean;
  isRespinning: boolean;
  expandedCols: number[];
  lockedCols: number[];
  nearMissCol2: boolean;

  // Resultado e Premiação
  lastWin: number;
  winningLines: WinningLineResult[];
  isFullGridBonus: boolean;
  winTier: 'none' | 'normal' | 'big' | 'epic' | 'igormaster';
  showWinBanner: boolean;

  // Mascote Igor, Frases e Contador de Seca
  mascotMood: MascotMood;
  igorQuote: string;
  losingStreak: number;

  // Controles de Jogo
  turboMode: boolean;
  soundEnabled: boolean;
  autoSpinCount: number;

  // Histórico e Modais
  history: SpinHistoryItem[];
  isPayTableOpen: boolean;
  isHistoryOpen: boolean;

  // Ações
  spin: () => Promise<void>;
  increaseBet: () => void;
  decreaseBet: () => void;
  rechargeBalance: () => void;
  toggleTurbo: () => void;
  toggleSound: () => void;
  startAutoSpin: (count: number) => void;
  stopAutoSpin: () => void;
  dismissWinBanner: () => void;
  setPayTableOpen: (open: boolean) => void;
  setHistoryOpen: (open: boolean) => void;
  triggerPokeIgor: () => void;
}

function loadInitialBalance(): number {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
    if (saved !== null) {
      const parsed = Number(saved);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback caso localStorage esteja indisponível
  }
  return INITIAL_BALANCE;
}

function saveBalance(balance: number) {
  try {
    localStorage.setItem(STORAGE_KEY_BALANCE, String(Math.floor(balance)));
  } catch {
    // Ignora erro de escrita
  }
}

function loadHistory(): SpinHistoryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignora erro
  }
  return [];
}

function saveHistory(items: SpinHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(items.slice(0, 30)));
  } catch {
    // Ignora erro
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const INITIAL_GRID: GridMatrix = [
  ['laranja', 'lingote', 'jade'],
  ['envelope', 'wild', 'saco'],
  ['rojao', 'lingote', 'laranja'],
];

export const useGameStore = create<GameState>((set, get) => ({
  balance: loadInitialBalance(),
  betIndex: 2, // Começa apostando 5 IgorCoins
  bet: BET_VALUES[2],

  grid: INITIAL_GRID,
  reelStatus: ['idle', 'idle', 'idle'],
  isSpinning: false,
  isRespinning: false,
  expandedCols: [],
  lockedCols: [],
  nearMissCol2: false,

  lastWin: 0,
  winningLines: [],
  isFullGridBonus: false,
  winTier: 'none',
  showWinBanner: false,

  mascotMood: 'idle',
  igorQuote: 'Confia no Igor! Dá um giro pra forrar de IgorCoins! 😎',
  losingStreak: 0,

  turboMode: false,
  soundEnabled: true,
  autoSpinCount: 0,

  history: loadHistory(),
  isPayTableOpen: false,
  isHistoryOpen: false,

  increaseBet: () => {
    const { betIndex, isSpinning } = get();
    if (isSpinning) return;
    soundManager.play('click');
    const nextIndex = Math.min(BET_VALUES.length - 1, betIndex + 1);
    set({
      betIndex: nextIndex,
      bet: BET_VALUES[nextIndex],
    });
  },

  decreaseBet: () => {
    const { betIndex, isSpinning } = get();
    if (isSpinning) return;
    soundManager.play('click');
    const prevIndex = Math.max(0, betIndex - 1);
    set({
      betIndex: prevIndex,
      bet: BET_VALUES[prevIndex],
    });
  },

  rechargeBalance: () => {
    soundManager.play('winNormal');
    const newBalance = get().balance + INITIAL_BALANCE;
    saveBalance(newBalance);
    set({
      balance: newBalance,
      mascotMood: 'win',
      igorQuote: 'Pix de mentira caiu! +1.000 IgorCoins na faixa! 🤑',
    });
  },

  toggleTurbo: () => {
    soundManager.play('click');
    set((state) => ({
      turboMode: !state.turboMode,
      igorQuote: !state.turboMode
        ? 'MODO TURBO ATIVADO! Velocidade máxima do Igor! ⚡'
        : 'Modo normal: apreciando cada careta do Igor 😎',
    }));
  },

  toggleSound: () => {
    const nextSound = !get().soundEnabled;
    soundManager.setMuted(!nextSound);
    if (nextSound) soundManager.play('click');
    set({ soundEnabled: nextSound });
  },

  startAutoSpin: (count: number) => {
    soundManager.play('click');
    set({ autoSpinCount: count });
    if (!get().isSpinning) {
      get().spin();
    }
  },

  stopAutoSpin: () => {
    soundManager.play('click');
    set({ autoSpinCount: 0 });
  },

  dismissWinBanner: () => {
    soundManager.play('click');
    set({ showWinBanner: false });
  },

  setPayTableOpen: (open: boolean) => {
    soundManager.play('click');
    set({ isPayTableOpen: open });
  },

  setHistoryOpen: (open: boolean) => {
    soundManager.play('click');
    set({ isHistoryOpen: open });
  },

  triggerPokeIgor: () => {
    if (get().isSpinning) return;
    soundManager.play('click');
    set({
      igorQuote: sortearFrase('idle'),
    });
  },

  spin: async () => {
    const state = get();
    if (state.isSpinning) return;

    // Verifica saldo suficiente
    if (state.balance < state.bet) {
      set({
        autoSpinCount: 0,
        mascotMood: 'lose',
        igorQuote: 'Acabaram as IgorCoins! Clica em "Recarregar Grátis" ali em cima! 😂',
      });
      return;
    }

    // Desconta a aposta e inicia o giro
    const balanceAfterBet = state.balance - state.bet;
    saveBalance(balanceAfterBet);

    const isTurbo = state.turboMode;
    const baseDelay = isTurbo ? 180 : 420;

    soundManager.play('spin');

    set({
      balance: balanceAfterBet,
      isSpinning: true,
      isRespinning: false,
      reelStatus: ['spinning', 'spinning', 'spinning'],
      expandedCols: [],
      lockedCols: [],
      nearMissCol2: false,
      winningLines: [],
      isFullGridBonus: false,
      showWinBanner: false,
      winTier: 'none',
      mascotMood: 'idle',
      igorQuote: sortearFrase('idle'),
    });

    // Calcula todo o resultado no motor desacoplado (engine.ts)
    const result = executeSpin(state.bet);

    // Parada sequencial Coluna 0 (Esquerda)
    await sleep(baseDelay);
    soundManager.play('reelStop', 0);
    set((prev) => ({
      grid: [result.rawGrid[0], prev.grid[1], prev.grid[2]],
      reelStatus: ['idle', 'spinning', 'spinning'],
    }));

    // Parada sequencial Coluna 1 (Meio)
    await sleep(baseDelay);
    soundManager.play('reelStop', 1);
    set((prev) => ({
      grid: [result.rawGrid[0], result.rawGrid[1], prev.grid[2]],
      reelStatus: ['idle', 'idle', 'spinning'],
    }));

    // Se houver efeito "Quase lá" (Near Miss: 2 primeiras colunas com Wild ou combinação forte),
    // a 3ª coluna gira mais devagar com brilho dourado e suspense!
    if (result.isNearMiss && !isTurbo) {
      soundManager.play('nearMiss');
      set({
        nearMissCol2: true,
        igorQuote: 'SEGURA O CORAÇÃO! VEM IGOR NA TERCEIRA COLUNA?! 😱🔥',
      });
      await sleep(1150);
    } else {
      await sleep(baseDelay);
    }

    // Parada sequencial Coluna 2 (Direita)
    soundManager.play('reelStop', 2);
    set({
      grid: result.rawGrid,
      reelStatus: ['idle', 'idle', 'idle'],
      nearMissCol2: false,
    });

    // Se apareceu WILD do Igor em alguma coluna: expande o Wild para ocupar a coluna toda!
    if (result.expandedCols.length > 0) {
      await sleep(isTurbo ? 150 : 320);
      soundManager.play('wildExpand');
      set({
        grid: result.finalGrid,
        expandedCols: result.expandedCols,
        mascotMood: 'wild',
        igorQuote: sortearFrase('wild'),
      });

      // E se disparou o RESPIN GRÁTIS (igual ao Tigrinho): trava as colunas com Wild e gira as outras!
      if (result.triggeredRespin && result.respinGrid) {
        await sleep(isTurbo ? 380 : 750);
        const spinningReels: [ReelStatus, ReelStatus, ReelStatus] = [
          result.expandedCols.includes(0) ? 'idle' : 'spinning',
          result.expandedCols.includes(1) ? 'idle' : 'spinning',
          result.expandedCols.includes(2) ? 'idle' : 'spinning',
        ];

        soundManager.play('spin');
        set({
          isRespinning: true,
          lockedCols: result.expandedCols,
          reelStatus: spinningReels,
          igorQuote: '🐯 RESPIN GRÁTIS DO IGOR! Coluna travada! 🔥',
        });

        await sleep(isTurbo ? 350 : 850);

        // Para as colunas do Respin
        for (let col = 0; col < 3; col++) {
          if (!result.expandedCols.includes(col)) {
            soundManager.play('reelStop', col);
          }
        }

        if (
          result.respinExpandedCols &&
          result.respinExpandedCols.length > result.expandedCols.length
        ) {
          soundManager.play('wildExpand');
        }

        set({
          grid: result.respinGrid,
          reelStatus: ['idle', 'idle', 'idle'],
          expandedCols: result.respinExpandedCols ?? result.expandedCols,
          isRespinning: false,
          lockedCols: [],
        });
      }
    }

    // Processa ganhos ou derrota
    if (result.totalWin > 0) {
      const updatedBalance = balanceAfterBet + result.totalWin;
      saveBalance(updatedBalance);

      const isBig =
        result.winTier === 'big' ||
        result.winTier === 'epic' ||
        result.winTier === 'igormaster';

      soundManager.play(isBig ? 'winBig' : 'winNormal');

      const newHistoryItem: SpinHistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        bet: state.bet,
        win: result.totalWin,
        multiplier: Number(result.totalMultiplier.toFixed(1)),
        hadRespin: result.triggeredRespin,
        isFullGrid: result.isFullGridBonus,
      };
      const updatedHistory = [newHistoryItem, ...get().history].slice(0, 30);
      saveHistory(updatedHistory);

      set({
        balance: updatedBalance,
        lastWin: result.totalWin,
        winningLines: result.winningLines,
        isFullGridBonus: result.isFullGridBonus,
        winTier: result.winTier,
        showWinBanner: isBig,
        mascotMood: 'win',
        igorQuote: result.isFullGridBonus
          ? sortearFrase('igorMaster')
          : sortearFrase('win'),
        losingStreak: 0,
        isSpinning: false,
        history: updatedHistory,
      });
    } else {
      const newStreak = state.losingStreak + 1;
      const newHistoryItem: SpinHistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        bet: state.bet,
        win: 0,
        multiplier: 0,
        hadRespin: result.triggeredRespin,
        isFullGrid: false,
      };
      const updatedHistory = [newHistoryItem, ...get().history].slice(0, 30);
      saveHistory(updatedHistory);

      set({
        lastWin: 0,
        winningLines: [],
        isFullGridBonus: false,
        winTier: 'none',
        showWinBanner: false,
        mascotMood: 'lose',
        igorQuote: sortearFrase('lose'),
        losingStreak: newStreak,
        isSpinning: false,
        history: updatedHistory,
      });
    }

    // Continua o Giro Automático caso esteja ativo
    const remainingAuto = get().autoSpinCount;
    if (remainingAuto > 0) {
      const nextCount = remainingAuto - 1;
      set({ autoSpinCount: nextCount });

      if (nextCount > 0 && get().balance >= get().bet) {
        await sleep(isTurbo ? 350 : 800);
        // Fecha banner de vitória automaticamente no auto-giro após exibir um pouco
        if (get().showWinBanner) {
          await sleep(1100);
          set({ showWinBanner: false });
        }
        if (get().autoSpinCount > 0) {
          get().spin();
        }
      } else {
        set({ autoSpinCount: 0 });
      }
    }
  },
}));

