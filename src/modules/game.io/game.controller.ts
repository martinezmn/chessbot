import { Get, Controller, Render, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('g')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  @Render('game')
  public async game(@Param('id') id: string) {
    const board = await this.gameService.getGameBoard(id);
    if (!board) {
      return { error: 'Game not found' };
    }
    return { gameId: id, ...board };
  }
}
