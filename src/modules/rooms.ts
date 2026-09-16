import { HttpClient } from '../client';
import {
  Room,
  CreateRoomOptions,
  AddParticipantOptions,
  Participant,
  UnreadSummary,
  NotificationSettings,
  UpdateNotificationSettingsOptions,
} from '../types';
import { settingsBody } from './users';

export class Rooms {
  constructor(private client: HttpClient) {}

  /** Create a new chat room. */
  async create(options: CreateRoomOptions): Promise<Room> {
    return this.client.post<Room>('/api/v1/rooms', options);
  }

  /** Find existing room by externalId or create a new one. */
  async findOrCreate(options: CreateRoomOptions): Promise<Room> {
    return this.client.post<Room>('/api/v1/rooms/find-or-create', options);
  }

  /** Get room by external ID. */
  async getByExternalId(externalId: string): Promise<Room> {
    return this.client.get<Room>(`/api/v1/rooms/by-external-id/${encodeURIComponent(externalId)}`);
  }

  /** List rooms for a user. */
  async list(userId: string): Promise<Room[]> {
    return this.client.get<Room[]>('/api/v1/rooms', { userId });
  }

  /** Get room by ID. */
  async get(id: string): Promise<Room> {
    return this.client.get<Room>(`/api/v1/rooms/${id}`);
  }

  /** Get unread counts across all rooms for a user. */
  async getUnreadSummary(userId: string): Promise<UnreadSummary> {
    return this.client.get<UnreadSummary>('/api/v1/rooms/unread-summary', { userId });
  }

  /** Add a participant to a room. */
  async addParticipant(roomId: string, options: AddParticipantOptions): Promise<Participant> {
    return this.client.post<Participant>(`/api/v1/rooms/${roomId}/participants`, options);
  }

  /** Remove a participant from a room. Idempotent — succeeds whether the participant existed or not. */
  async removeParticipant(roomId: string, externalUserId: string): Promise<void> {
    await this.client.delete<void>(
      `/api/v1/rooms/${roomId}/participants/${encodeURIComponent(externalUserId)}`,
    );
  }

  /** Permanently delete a room and all its data. */
  async delete(roomId: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/api/v1/rooms/${roomId}`);
  }

  /** A participant's push settings for one room. */
  async getNotificationSettings(roomId: string, userId: string): Promise<NotificationSettings> {
    return this.client.get<NotificationSettings>(
      `/api/v1/rooms/${roomId}/notification-settings`,
      { userId },
    );
  }

  /**
   * Changes a participant's push settings for one room: mute it, or only
   * notify on mentions. The user must be in the room.
   *
   * ```ts
   * await chat.rooms.updateNotificationSettings(roomId, 'user-1', { pushLevel: 'mentions' });
   * ```
   */
  async updateNotificationSettings(
    roomId: string,
    userId: string,
    settings: UpdateNotificationSettingsOptions,
  ): Promise<NotificationSettings> {
    return this.client.put<NotificationSettings>(
      `/api/v1/rooms/${roomId}/notification-settings`,
      settingsBody(userId, settings),
    );
  }
}
