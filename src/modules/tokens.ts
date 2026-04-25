import { HttpClient } from '../client';
import { GetTokenOptions } from '../types';

export class Tokens {
  constructor(private client: HttpClient) {}

  /** Get a Centrifugo connection token for a user. */
  async getConnectionToken(options: GetTokenOptions): Promise<{ token: string }> {
    return this.client.post<{ token: string }>('/api/v1/centrifugo/token', options);
  }
}
