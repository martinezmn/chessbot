import { Module } from '@nestjs/common';
import { DiscordModule } from './modules/discordjs/discord.module';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [DiscordModule, GameModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
