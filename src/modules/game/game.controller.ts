import { Get, Controller, Render } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('g')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':game')
  @Render('game')
  public game() {
    return { message: 'Hello world!' };
  }
}
