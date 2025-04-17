import { Get, Controller, Render, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('g')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  @Render('game')
  public game(@Param('id') id: string) {
    const board = this.gameService.getGameBoard();
    return { board, gameId: id, side: 'black' };
  }
}
