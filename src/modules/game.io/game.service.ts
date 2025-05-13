import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ChessBoard, decode, encode, getPossibleMoves } from 'src/public/chess';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  public constructor(private readonly prisma: PrismaService) {}

  public async getGameByInvitation(invitationId: string) {
    const invitation = await this.prisma.invitation.findUniqueOrThrow({
      where: { id: invitationId },
      include: { game: true },
    });

    return invitation.game;
  }

  public async getGameBoard(invitationId: string) {
    const invitation = await this.prisma.invitation.findUniqueOrThrow({
      where: { id: invitationId },
      include: { game: true },
    });

    let side = 'black';

    if (invitation.guestDid === invitation.game.ownerDid) {
      side = 'white';
    }

    return { board: invitation.game.board, side };
  }

  public async move(gameId: string, from: string, to: string) {
    const game = await this.prisma.game.findUniqueOrThrow({
      where: { id: gameId },
    });

    const { board, captured } = decode(game.board);
    const possibleMoves = getPossibleMoves(from, board);

    if (!possibleMoves[to]) {
      throw new Error('Invalid move');
    }

    const newBoard: ChessBoard = {
      board: { ...board, [to]: board[from] },
      captured,
    };

    delete newBoard.board[from];

    if (board[to]) {
      newBoard.captured.push(board[to]);
    }

    const newBoardString = encode(newBoard);

    await this.prisma.game.update({
      where: { id: gameId },
      data: { board: newBoardString },
    });

    return newBoardString;
  }
}
