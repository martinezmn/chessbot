import { Injectable } from '@nestjs/common';

export interface ChessPiece {
  piece: string;
  owner: 'white' | 'black';
}

@Injectable()
export class BoardHelper {
  decode(boardString: string): {
    board: Record<string, { piece: string; owner: 'white' | 'black' }>;
    captured: ChessPiece[];
  } {
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

    const board: Record<string, { piece: string; owner: 'white' | 'black' }> =
      {};
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

  encode(input: {
    board: Record<string, { piece: string; owner: 'white' | 'black' }>;
    captured: ChessPiece[];
  }): string {
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
}
