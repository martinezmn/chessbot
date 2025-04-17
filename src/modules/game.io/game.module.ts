import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from '../../shared/services/prisma.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [PrismaService, GameGateway, GameService],
})
export class GameIOModule {}
