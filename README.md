# 🐯 IgorMaster — O Tigrinho do Igor

Paródia meme do jogo **Fortune Tiger** feita em **React + Vite + TypeScript + Tailwind CSS + Framer Motion + Zustand**, criada exclusivamente para brincadeira entre amigos!

> **Aviso:** Jogo 100% de brincadeira. Usa apenas moedas virtuais fictícias (**IgorCoins**), sem dinheiro real, sem pagamentos, sem backend e sem login.

---

## 🚀 Como rodar o projeto

```bash
npm install
npm run dev
```

Depois, acesse o link exibido no terminal (normalmente `http://localhost:5173`).

---

## 🖼️ Como trocar as fotos do Igor

As imagens do mascote e do símbolo WILD ficam na pasta `src/assets/igor/`:

- `src/assets/igor/igor-idle.png` — Rosto do Igor esperando o giro (estado normal)
- `src/assets/igor/igor-win.png` — Rosto do Igor comemorando quando sai vitória
- `src/assets/igor/igor-lose.png` — Rosto do Igor chorando/triste quando não ganha
- `src/assets/igor/igor-wild.png` — Rosto do Igor no símbolo **WILD (100x)** e na coluna expandida

Basta substituir esses 4 arquivos `.png` (ou `.jpg` mantendo o nome) pelas fotos que você quiser!

---

## 💬 Como editar as frases meme do Igor

Abra o arquivo [`src/lib/frases.ts`](src/lib/frases.ts):

- `FRASES_IGOR.idle`: Frases faladas durante os giros normais
- `FRASES_IGOR.win`: Frases quando o jogador ganha
- `FRASES_IGOR.lose`: Frases quando perde ou bate na trave
- `FRASES_IGOR.wild`: Frases quando o Wild do Igor expande na coluna e dá Respin
- `getMensagemSeca()`: Mensagens zoeiras do contador de "giros sem ganhar"

---

## 🎲 Como ajustar probabilidades e multiplicadores

Abra o arquivo [`src/lib/config.ts`](src/lib/config.ts):

- `SYMBOLS`: Altere nomes, emojis e multiplicadores (`multiplier`) de cada símbolo.
- `REEL_WEIGHTS`: Ajuste o peso de sorteio de cada símbolo nas Colunas 1, 2 e 3. Quanto maior o número, mais frequente o símbolo aparece.
- `LUCKY_BOOST_CHANCE`: Chance extra (padrão `0.08` = 8%) de forçar combinações generosas ou tela cheia para deixar a brincadeira mais divertida.

---

## 🔊 Como personalizar os sons

O jogo já possui um sintetizador **Web Audio API** integrado em [`src/lib/audio.ts`](src/lib/audio.ts) que gera todos os efeitos sonoros automaticamente (giro, parada dos rolos, suspense near-miss, expansão do wild, vitória e moedas) sem depender de arquivos externos.
Os arquivos placeholder também estão disponíveis em `src/assets/sounds/` (`spin.mp3`, `stop.mp3`, `win.mp3`, `coins.mp3`, `wild.mp3`).

