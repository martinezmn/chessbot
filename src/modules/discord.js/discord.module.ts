import { Module } from '@nestjs/common';
import { IntentsBitField } from 'discord.js';
import { NecordModule } from 'necord';
import { DiscordService } from './discord.service';
import { DiscordCommands } from './discord.commands';
import { DiscordButtons } from './discord.buttons';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  imports: [
    NecordModule.forRoot({
      token: process.env.DISCORD_BOT_TOKEN || '',
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
      ],
      development: process.env.DISCORD_DEVELOPMENT_GUILD_ID
        ? [process.env.DISCORD_DEVELOPMENT_GUILD_ID]
        : false,
    }),
  ],
  providers: [PrismaService, DiscordService, DiscordCommands, DiscordButtons],
})
export class DiscordJSModule {}
