import { Injectable, Logger } from '@nestjs/common';
import { Context, On, Once, ContextOf } from 'necord';
import { Client } from 'discord.js';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  public constructor(private readonly client: Client) {}

  @Once('ready')
  public onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }
}
