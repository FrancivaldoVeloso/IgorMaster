// ============================================================================
// CONFIGURAÇÃO DO JOGO IGORMASTER (SÍMBOLOS, PESOS, MULTIPLICADORES E APOSTAS)
// ============================================================================

export type SymbolId =
  | 'laranja'
  | 'rojao'
  | 'envelope'
  | 'lingote'
  | 'saco'
  | 'jade'
  | 'wild';

export interface SymbolConfig {
  id: SymbolId;
  name: string;
  multiplier: number; // Multiplicador sobre o valor da aposta ao alinhar 3 símbolos
  emoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  isWild?: boolean;
}

// Valores de aposta permitidos no seletor (+ e -)
export const BET_VALUES = [1, 2, 5, 10, 20, 50, 100] as const;

// Opções de Giro Automático
export const AUTO_SPIN_OPTIONS = [10, 25, 50, 100] as const;

// Saldo inicial em IgorCoins
export const INITIAL_BALANCE = 1000;

// Multiplicador extra quando a grade inteira (3x3) fecha com o mesmo símbolo (ou wilds)
export const FULL_GRID_BONUS_MULTIPLIER = 10;

// Definição de todos os 7 símbolos do menor ao maior valor
export const SYMBOLS: Record<SymbolId, SymbolConfig> = {
  laranja: {
    id: 'laranja',
    name: 'Laranja da Sorte',
    multiplier: 2,
    emoji: '🍊',
    color: '#fb923c',
    bgGradient: 'from-orange-900/90 via-orange-700/80 to-amber-900/90',
    borderColor: '#fdba74',
    description: 'Laranja imperial fresquinha para começar o giro.',
  },
  rojao: {
    id: 'rojao',
    name: 'Rojão de Ano Novo',
    multiplier: 3,
    emoji: '🧨',
    color: '#f87171',
    bgGradient: 'from-red-900/90 via-rose-700/80 to-red-950/90',
    borderColor: '#fca5a5',
    description: 'Estoura na tela anunciando que o Igor acordou!',
  },
  envelope: {
    id: 'envelope',
    name: 'Envelope Vermelho',
    multiplier: 5,
    emoji: '🧧',
    color: '#ef4444',
    bgGradient: 'from-red-800/90 via-red-600/85 to-amber-900/90',
    borderColor: '#fde047',
    description: 'Hongbao recheado de IgorCoins fictícias.',
  },
  lingote: {
    id: 'lingote',
    name: 'Lingote de Ouro',
    multiplier: 10,
    emoji: '🪙',
    color: '#facc15',
    bgGradient: 'from-amber-900/90 via-yellow-600/85 to-amber-950/90',
    borderColor: '#fef08a',
    description: 'Barca de ouro chinês brilhando forte.',
  },
  saco: {
    id: 'saco',
    name: 'Saco de IgorCoins',
    multiplier: 20,
    emoji: '💰',
    color: '#eab308',
    bgGradient: 'from-yellow-900/90 via-amber-500/85 to-yellow-950/90',
    borderColor: '#fef9c3',
    description: 'Saco transbordando moedas que não valem nada na vida real!',
  },
  jade: {
    id: 'jade',
    name: 'Amuleto de Jade',
    multiplier: 50,
    emoji: '🐉',
    color: '#34d399',
    bgGradient: 'from-emerald-950/95 via-emerald-600/85 to-teal-950/95',
    borderColor: '#6ee7b7',
    description: 'Relíquia ancestral suprema do Império do Igor.',
  },
  wild: {
    id: 'wild',
    name: 'IGOR WILD',
    multiplier: 100,
    emoji: '🐯',
    color: '#ffd700',
    bgGradient: 'from-yellow-500 via-amber-500 to-red-700',
    borderColor: '#ffffff',
    description: 'Substitui qualquer símbolo, EXPANDE na coluna toda e dá RESPIN GRÁTIS!',
    isWild: true,
  },
};

export const SYMBOL_LIST: SymbolConfig[] = [
  SYMBOLS.laranja,
  SYMBOLS.rojao,
  SYMBOLS.envelope,
  SYMBOLS.lingote,
  SYMBOLS.saco,
  SYMBOLS.jade,
  SYMBOLS.wild,
];

// ============================================================================
// PESOS DE PROBABILIDADE POR COLUNA (FÁCIL DE AJUSTAR)
// ============================================================================
// Quanto maior o número, mais frequente o símbolo aparece naquela coluna (0, 1, 2).
// Calibrado para ser divertido, ter bastante emoção, near-misses e respins do Igor!
export const REEL_WEIGHTS: [Record<SymbolId, number>, Record<SymbolId, number>, Record<SymbolId, number>] = [
  // Coluna 1 (Esquerda)
  {
    laranja: 30,
    rojao: 25,
    envelope: 20,
    lingote: 14,
    saco: 9,
    jade: 5,
    wild: 6, // Chance generosa de Wild para ativar expansão + respin
  },
  // Coluna 2 (Meio)
  {
    laranja: 30,
    rojao: 25,
    envelope: 20,
    lingote: 14,
    saco: 9,
    jade: 5,
    wild: 6,
  },
  // Coluna 3 (Direita)
  {
    laranja: 30,
    rojao: 24,
    envelope: 19,
    lingote: 14,
    saco: 9,
    jade: 5,
    wild: 5,
  },
];

// Chance extra (em %) de "forçar" uma tela cheia ou combinação divertida em giros de sorte
export const LUCKY_BOOST_CHANCE = 0.08;

// Definição das 5 linhas de pagamento (3 horizontais + 2 diagonais)
// Coordenadas no formato [coluna, linha] onde coluna ∈ {0,1,2} e linha ∈ {0,1,2}
export interface PaylineDefinition {
  id: number;
  name: string;
  coords: [[number, number], [number, number], [number, number]];
  color: string;
}

export const PAYLINES: PaylineDefinition[] = [
  {
    id: 1,
    name: 'Linha Central',
    coords: [[0, 1], [1, 1], [2, 1]],
    color: '#fbbf24', // Amarelo Ouro
  },
  {
    id: 2,
    name: 'Linha Superior',
    coords: [[0, 0], [1, 0], [2, 0]],
    color: '#ef4444', // Vermelho
  },
  {
    id: 3,
    name: 'Linha Inferior',
    coords: [[0, 2], [1, 2], [2, 2]],
    color: '#10b981', // Verde Jade
  },
  {
    id: 4,
    name: 'Diagonal Descendente (↘)',
    coords: [[0, 0], [1, 1], [2, 2]],
    color: '#3b82f6', // Azul
  },
  {
    id: 5,
    name: 'Diagonal Ascendente (↗)',
    coords: [[0, 2], [1, 1], [2, 0]],
    color: '#d946ef', // Magenta
  },
];

