import { HttpClient } from '../client';
import { GetTokenOptions } from '../types';

/** Chat API route that issues the realtime connection token. */
const REALTIME_TOKEN_PATH = '/api/v1/centrifugo/token';

export class Tokens {
  constructor(private client: HttpClient) {}

  /** Get a realtime connection token for a user. */
  async getConnectionToken(options: GetTokenOptions): Promise<{ token: string }> {
    return this.client.post<{ token: string }>(REALTIME_TOKEN_PATH, options);
  }
}
