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
  async handleJoinRoom(client: Socket, payload: { gameId: string }) {
    await client.join(payload.gameId);
    this.logger.log(`Client ${client.id} joined room ${payload.gameId}`);
    const game = await this.gameService.getGameBoard(payload.gameId);
    client.emit('board', game?.board);
    this.logger.log(
      `Client ${client.id} is in rooms: ${JSON.stringify([...client.rooms])}`,
    );
  }

  @SubscribeMessage('move')
  async handleMessageToRoom(
    client: Socket,
    payload: { gameId: string; move: string },
  ) {
    this.logger.log(
      `Client ${client.id} is in rooms: ${JSON.stringify([...client.rooms])}`,
    );
    const socketsInRoom = this.server.sockets.adapter.rooms.get(payload.gameId);
    this.logger.log(
      `Sockets in room ${payload.gameId}: ${socketsInRoom ? Array.from(socketsInRoom).join(', ') : 'None'}`,
    );
    const [from, to] = payload.move.split(':');
    this.logger.log(`GameId ${payload.gameId} from ${from} to ${to}`);
    const board = await this.gameService.move(payload.gameId, from, to);
    // this.server.to(payload.gameId).emit('board', board);
    this.server.in(payload.gameId).emit('board', board);
  }
}
