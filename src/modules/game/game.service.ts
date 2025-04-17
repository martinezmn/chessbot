import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { BoardHelper } from './board.helper';
import boardStringConst from 'src/shared/constants/board-string.const';

const pieceIconMap = {
  white: {
    K: '♔',
    Q: '♕',
    R: '♖',
    B: '♗',
    N: '♘',
    P: '♙',
  },
  black: {
    K: '♚',
    Q: '♛',
    R: '♜',
    B: '♝',
    N: '♞',
    P: '♟',
  },
};

@Injectable()
export class GameService {
  public constructor(
    private readonly client: Client,
    private readonly boardHelper: BoardHelper,
  ) {}

  public getGameBoard(pieces?: string) {
    if (!pieces) {
      pieces = boardStringConst;
    }

    const board = this.boardHelper.decode(pieces);

    return board;
  }
}
