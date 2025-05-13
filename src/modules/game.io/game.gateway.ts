import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {}

  afterInit() {
    this.logger.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoinRoom(client: Socket, payload: { invitationId: string }) {
    const game = await this.gameService.getGameByInvitation(
      payload.invitationId,
    );
    await client.join(game.id);
    this.logger.log(`Client ${client.id} joined room ${game.id}`);
    client.emit('board', game.board);
  }

  @SubscribeMessage('move')
  async handleMessageToRoom(
    client: Socket,
    payload: { invitationId: string; move: string },
  ) {
    const game = await this.gameService.getGameByInvitation(
      payload.invitationId,
    );
    const [from, to] = payload.move.split(':');
    this.logger.log(`GameId ${game.id} from ${from} to ${to}`);
    const board = await this.gameService.move(game.id, from, to);
    // this.server.to(payload.gameId).emit('board', board);
    this.server.in(game.id).emit('board', board);
  }
}
