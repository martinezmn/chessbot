import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [PrismaService, GameService],
})
export class GameModule {}
