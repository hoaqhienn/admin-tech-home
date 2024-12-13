import { io, Socket } from 'socket.io-client';
import { Messages } from 'interface/chat/ChatInterface';
import { getSocketConfig } from 'config/apiConfig';

class SocketService {
  private socket: Socket | null = null;
  private userId: number | null = null;

  connect(userId: number) {
    this.userId = userId;
    const socketConfig = getSocketConfig();
    this.socket = io(socketConfig.url, socketConfig.options);

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.socket?.emit('userOnline', userId);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket && this.userId) {
      this.socket.emit('userOffline', this.userId);
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  joinChat(chatId: number) {
    this.socket?.emit('joinChat', chatId);
  }

  leaveChat(chatId: number) {
    this.socket?.emit('outChat', chatId);
  }

  sendMessage(message: Messages, chatId: number) {
    this.socket?.emit('sendMessage', message, chatId);
  }

  deleteMessage(chatId: number, messageId: number) {
    this.socket?.emit('deleteMessage', chatId, messageId);
  }
}

export const socketService = new SocketService();
