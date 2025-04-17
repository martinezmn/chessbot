export interface ChessPiece {
  piece: string;
  owner: 'white' | 'black';
}

export interface ChessBoard {
  board: Record<string, ChessPiece>;
  captured: ChessPiece[];
}

export function encode(input: ChessBoard): string {
  const whiteParts: string[] = [];
  const blackParts: string[] = [];

  for (const [position, { piece, owner }] of Object.entries(input.board)) {
    const part = `${piece}${position}`;
    if (owner === 'white') {
      whiteParts.push(part);
    } else {
      blackParts.push(part);
    }
  }

  for (const { piece, owner } of input.captured) {
    const part = `${piece}z0`;
    if (owner === 'white') {
      whiteParts.push(part);
    } else {
      blackParts.push(part);
    }
  }

  return [...whiteParts, ...blackParts].join('');
}

export function decode(boardString: string): ChessBoard {
  const pieceRegex = /([PRNBQK])([a-hz][0-8])/g;
  const pieces: (ChessPiece & { position: string })[] = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pieceRegex.exec(boardString)) !== null) {
    const [, piece, position] = match;
    const owner: 'white' | 'black' =
      index < boardString.length / 2 ? 'white' : 'black';
    pieces.push({ piece, position, owner });
    index += match[0].length;
  }

  const board: Record<string, { piece: string; owner: 'white' | 'black' }> = {};
  const captured: ChessPiece[] = [];

  for (const { piece, position, owner } of pieces) {
    if (position === 'z0') {
      captured.push({ piece, owner });
    } else {
      board[position] = { piece, owner };
    }
  }

  return { board, captured };
}

export function getPossibleMoves(
  position: string,
  board: Record<string, ChessPiece>,
): Record<string, boolean> {
  const file = position[0];
  const rank = parseInt(position[1], 10);
  const pieceObj = board[position];
  if (!pieceObj) return {};

  const { piece, owner } = pieceObj;
  const moves: Record<string, boolean> = {};

  const directions = {
    N: [
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1],
    ],
    B: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    R: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    Q: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    K: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
  };

  const inBounds = (f: string, r: number) =>
    f >= 'a' && f <= 'h' && r >= 1 && r <= 8;

  const addMove = (f: string, r: number) => {
    const pos = f + r;
    if (!inBounds(f, r)) return;
    if (!board[pos] || board[pos].owner !== owner) {
      moves[pos] = true;
    }
  };

  switch (piece) {
    case 'P': {
      const dir = owner === 'white' ? 1 : -1;
      const startRank = owner === 'white' ? 2 : 7;
      const f = file;
      const oneStep = rank + dir;
      const twoStep = rank + 2 * dir;

      if (!board[f + oneStep]) addMove(f, oneStep);
      if (rank === startRank && !board[f + oneStep] && !board[f + twoStep]) {
        addMove(f, twoStep);
      }

      for (const df of [-1, 1]) {
        const targetFile = String.fromCharCode(file.charCodeAt(0) + df);
        const targetPos = targetFile + oneStep;
        if (
          inBounds(targetFile, oneStep) &&
          board[targetPos] &&
          board[targetPos].owner !== owner
        ) {
          moves[targetPos] = true;
        }
      }
      break;
    }
    case 'N':
      for (const [dx, dy] of directions.N) {
        const f = String.fromCharCode(file.charCodeAt(0) + dx);
        const r = rank + dy;
        addMove(f, r);
      }
      break;
    case 'B':
    case 'R':
    case 'Q':
      for (const [dx, dy] of directions[piece]) {
        let step = 1;
        while (true) {
          const f = String.fromCharCode(file.charCodeAt(0) + dx * step);
          const r = rank + dy * step;
          const pos = f + r;
          if (!inBounds(f, r)) break;
          if (!board[pos]) {
            moves[pos] = true;
          } else {
            if (board[pos].owner !== owner) moves[pos] = true;
            break;
          }
          step++;
        }
      }
      break;
    case 'K':
      for (const [dx, dy] of directions.K) {
        const f = String.fromCharCode(file.charCodeAt(0) + dx);
        const r = rank + dy;
        addMove(f, r);
      }
      break;
  }

  return moves;
}
