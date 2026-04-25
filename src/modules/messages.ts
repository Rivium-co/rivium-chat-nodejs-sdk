import { HttpClient } from '../client';
import {
  Message,
  PaginatedMessages,
  SendMessageOptions,
  GetHistoryOptions,
  SearchResult,
  SearchMessagesOptions,
  GetMentionsOptions,
  Mention,
} from '../types';

export class Messages {
  constructor(private client: HttpClient) {}

  /** Send a message to a room. */
  async send(roomId: string, options: SendMessageOptions): Promise<Message> {
    return this.client.post<Message>(`/api/v1/rooms/${roomId}/messages`, options);
  }

  /** Get message history for a room (paginated). */
  async getHistory(roomId: string, options: GetHistoryOptions): Promise<PaginatedMessages> {
    return this.client.get<PaginatedMessages>(`/api/v1/rooms/${roomId}/messages`, {
      userId: options.userId,
      limit: options.limit,
      before: options.before,
    });
  }

  /** Mark messages as read in a room for a user. */
  async markAsRead(roomId: string, userId: string): Promise<{ success: boolean }> {
    return this.client.post<{ success: boolean }>(`/api/v1/rooms/${roomId}/read`, { userId });
  }

  /** Edit a message. */
  async edit(messageId: string, userId: string, content: string): Promise<Message> {
    return this.client.put<Message>(`/api/v1/messages/${messageId}`, { userId, content });
  }

  /** Delete a message. */
  async delete(messageId: string, userId: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/api/v1/messages/${messageId}`, undefined, { userId });
  }

  /** Search messages in a room. */
  async search(roomId: string, options: SearchMessagesOptions): Promise<SearchResult> {
    return this.client.get<SearchResult>(`/api/v1/rooms/${roomId}/messages/search`, {
      q: options.q,
      userId: options.userId,
      limit: options.limit,
      offset: options.offset,
    });
  }

  /** Get mentions for a user in a room. */
  async getMentions(roomId: string, options: GetMentionsOptions): Promise<Mention[]> {
    return this.client.get<Mention[]>(`/api/v1/rooms/${roomId}/mentions`, {
      userId: options.userId,
      limit: options.limit,
    });
  }
}
