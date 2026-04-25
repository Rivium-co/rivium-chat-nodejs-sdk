import { HttpClient } from '../client';
import { Message } from '../types';

export class Pins {
  constructor(private client: HttpClient) {}

  /** Pin a message. */
  async pin(messageId: string, userId: string): Promise<Message> {
    return this.client.post<Message>(`/api/v1/messages/${messageId}/pin`, { userId });
  }

  /** Unpin a message. */
  async unpin(messageId: string, userId: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/api/v1/messages/${messageId}/pin`, { userId });
  }

  /** Get all pinned messages in a room. */
  async list(roomId: string): Promise<Message[]> {
    return this.client.get<Message[]>(`/api/v1/rooms/${roomId}/pinned`);
  }
}
