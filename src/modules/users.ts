import { HttpClient } from '../client';
import { CreateUserTokenOptions, UserToken, RevokeTokensResult } from '../types';

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
}
