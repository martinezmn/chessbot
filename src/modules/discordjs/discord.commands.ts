import { Injectable, Logger } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class DiscordCommands {
  private readonly logger = new Logger(DiscordCommands.name);

  constructor(private readonly prisma: PrismaService) {}

  @SlashCommand({
    name: 'game',
    description: 'Create a new game session',
  })
  public async onNewGame(@Context() [interaction]: SlashCommandContext) {
    const game = await this.prisma.game.create({
      data: { ownerId: interaction.user.id },
    });

    this.logger.log(`Game created with ID: ${game.id}`);

    const button = new ButtonBuilder()
      .setCustomId(`join/${game.id}`)
      .setLabel('Join')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    return interaction.reply({ content: 'Pong!', components: [row] });
  }
}
