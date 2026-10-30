// ============================================================================
// FRASES MEME DO IGOR E MENSAGENS DE SECA (CONFIGURÁVEIS)
// ============================================================================

export const FRASES_IGOR = {
  // Frases exibidas enquanto está esperando ou durante o giro
  idle: [
    'Confia no Igor! 😎',
    'Tá pagando muito hoje!',
    'Horario bugado das 22h ativado! 🐯',
    'Só mais uma rodada, eu juro...',
    'O Igor tá chegando com o saco de moedas!',
    'Aumenta a aposta que o Igor gosta! 🔥',
    'Solta a carta, Igorzão!',
    'Hoje o lanche é por conta do IgorCoins!',
    'Quem não gira não vira lenda!',
  ],

  // Frases quando o jogador ganha uma rodada normal ou grande
  win: [
    'EU AVISEI QUE TAVA PAGANDO! 🤑',
    'FORROU! Chama o Igor de meu amor!',
    'Soltei a carta sem dó! 💰',
    'Respeita o bigode do IgorMaster!',
    'Recebaaa! Tudo em IgorCoins que não valem nada! 😂',
    'É o tigrinho? Não, é o IGORZINHO! 🐯✨',
  ],

  // Frases quando bate um Near Miss (quase lá!) ou giro sem ganho
  lose: [
    'Quase! Passou raspando no cabelo do Igor!',
    'Na próxima vem o Wild, confia...',
    'O algoritmo do Igor deu uma piscadinha 👀',
    'Calma que o Igor tá aquecendo a garganta!',
    'Perdeu nada, é tudo moeda de mentira mesmo! 🤣',
    'Mais perto que isso só dois passos!',
  ],

  // Frases quando aparece o WILD do Igor (Expansão + Respin)
  wild: [
    'OLHA O IGOR AÍ! COLUNA EXPANDIDA! 🔥',
    'MODO IGOR SELVAGEM ATIVADO! RESPIN GRÁTIS!',
    'SEGURA ESSA CARA LINDA NA COLUNA TODA! 🤩',
    'WILD DO IGOR! Agora o bicho vai pegar!',
  ],

  // Frase suprema quando fecha a tela inteira (x10 Bonus)
  igorMaster: [
    'IGOR MASTER SUPREMO! FECHOU A TELA TODA! X10! 🏆👑',
  ],
};

// Mensagens zoeiras conforme o contador de "giros sem ganhar" vai subindo
export function getMensagemSeca(girosSemGanhar: number): string | null {
  if (girosSemGanhar <= 1) return null;
  if (girosSemGanhar === 2) return '2 giros no seco... O Igor foi beber água 💧';
  if (girosSemGanhar === 3) return '3 giros sem ganhar: "Calma que tá acumulando!" 🤡';
  if (girosSemGanhar === 4) return '4 giros: O Igor tá fingindo que não te conhece 👀';
  if (girosSemGanhar === 5) return '5 giros na seca! Ainda bem que é IgorCoin grátis 😂';
  if (girosSemGanhar === 6) return '6 giros: Alguém acorda o Igor que ele dormiu no rolo! 😴';
  if (girosSemGanhar === 7) return '7 giros: "No 8º giro é certeza!" — Fonte: Vozes da cabeça 🧠';
  if (girosSemGanhar >= 8 && girosSemGanhar < 12) {
    return `${girosSemGanhar} giros sem ganhar! O Igor comprou um iate imaginário com suas moedas 🛥️`;
  }
  return `${girosSemGanhar} giros de seca histórica! Chama o VAR do Igor! 📺🚨`;
}

// Helper para sortear uma frase aleatória de uma categoria
export function sortearFrase(categoria: keyof typeof FRASES_IGOR): string {
  const lista = FRASES_IGOR[categoria];
  return lista[Math.floor(Math.random() * lista.length)];
}

