import { HttpClient } from '../client';
import {
  CreateUserTokenOptions,
  UserToken,
  RevokeTokensResult,
  NotificationSettings,
  UpdateNotificationSettingsOptions,
} from '../types';

export function settingsBody(userId: string, settings: UpdateNotificationSettingsOptions) {
  const { mutedUntil, ...rest } = settings;
  return {
    userId,
    ...rest,
    ...(mutedUntil !== undefined && {
      mutedUntil: mutedUntil instanceof Date ? mutedUntil.toISOString() : mutedUntil,
    }),
  };
}

/**
 * User tokens — how your app proves **who** the user is.
 *
 * Your API key ships inside every app, so it cannot identify a user. Mint a
 * short-lived token here (server-side, with your server secret) and hand it to
 * the client SDK's `tokenProvider`. The client SDKs refresh it automatically.
 */
export class Users {
  constructor(private client: HttpClient) {}

  /**
   * Creates a token for one of your users. Expires in 1 hour by default
   * (`ttl` seconds, max 24 hours).
   *
   * ```ts
   * app.get('/chat-token', requireLogin, async (req, res) => {
   *   const { token } = await chat.users.createToken({ userId: req.user.id });
   *   res.json({ token });
   * });
   * ```
   */
  async createToken(options: CreateUserTokenOptions): Promise<UserToken> {
    return this.client.post<UserToken>('/api/v1/users/token', options);
  }

  /**
   * Invalidates every token issued to this user so far — call it on logout,
   * password change or ban. Tokens already in the user's hands stop working
   * within seconds, for REST and realtime alike.
   */
  async revokeTokens(userId: string): Promise<RevokeTokensResult> {
    return this.client.post<RevokeTokensResult>(
      `/api/v1/users/${encodeURIComponent(userId)}/revoke-tokens`,
    );
  }

  /** A user's chat push settings for your whole app. */
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    return this.client.get<NotificationSettings>('/api/v1/users/notification-settings', { userId });
  }

  /**
   * Changes a user's chat push settings for your whole app, e.g. to turn chat
   * pushes off from your own settings screen.
   *
   * ```ts
   * await chat.users.updateNotificationSettings('user-1', { pushLevel: 'none' });
   * ```
   */
  async updateNotificationSettings(
    userId: string,
    settings: UpdateNotificationSettingsOptions,
  ): Promise<NotificationSettings> {
    return this.client.put<NotificationSettings>(
      '/api/v1/users/notification-settings',
      settingsBody(userId, settings),
    );
  }
}
