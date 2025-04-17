import { Module } from '@nestjs/common';
import { DiscordJSModule } from './modules/discord.js/discord.module';
import { GameIOModule } from './modules/game.io/game.module';

@Module({
  imports: [DiscordJSModule, GameIOModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
