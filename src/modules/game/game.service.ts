import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';

@Injectable()
export class GameService {
  public constructor(private readonly client: Client) {}
}
