import { HttpClient } from '../client';
import { Reaction } from '../types';

export class Reactions {
  constructor(private client: HttpClient) {}

  /** Add a reaction to a message. */
  async add(messageId: string, userId: string, emoji: string): Promise<Reaction> {
    return this.client.post<Reaction>(`/api/v1/messages/${messageId}/reactions`, { userId, emoji });
  }

  /** Remove a reaction from a message. */
  async remove(messageId: string, userId: string, emoji: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/api/v1/messages/${messageId}/reactions`, { userId, emoji });
  }

  /** Get all reactions for a message. */
  async list(messageId: string): Promise<Reaction[]> {
    return this.client.get<Reaction[]>(`/api/v1/messages/${messageId}/reactions`);
  }
}
