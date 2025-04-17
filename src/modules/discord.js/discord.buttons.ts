import { Injectable, Logger } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from 'discord.js';
import { Context, Button, ButtonContext, ComponentParam } from 'necord';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class DiscordButtons {
  private readonly logger = new Logger(DiscordButtons.name);

  constructor(private readonly prisma: PrismaService) {}

  @Button('join/:gameId')
  public async onButton(
    @Context() [interaction]: ButtonContext,
    @ComponentParam('gameId') gameId: string,
  ) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return interaction.reply({
        content: 'Game not found',
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      process.env.APP_ENV !== 'dev' &&
      game.ownerDid === interaction.user.id
    ) {
      return interaction.reply({
        content: 'You cannot join your own game',
        flags: MessageFlags.Ephemeral,
      });
    }

    if (game.guestDid) {
      return interaction.reply({
        content: 'Game already has a guest',
        flags: MessageFlags.Ephemeral,
      });
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        gameId: game.id,
        guestDid: interaction.user.id,
      },
    });

    await this.prisma.game.update({
      where: { id: game.id },
      data: { guestDid: interaction.user.id },
    });

    const button = new ButtonBuilder()
      .setLabel('Enter')
      .setURL(`${process.env.APP_URL}/g/${invitation.id}`)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    this.logger.log(`Invitation created with ID: ${invitation.id}`);

    return interaction.reply({
      content: 'Pong!',
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}
