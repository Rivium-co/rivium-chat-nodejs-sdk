import { HttpClient } from './client';
import { Rooms } from './modules/rooms';
import { Messages } from './modules/messages';
import { Reactions } from './modules/reactions';
import { Pins } from './modules/pins';
import { Webhooks } from './modules/webhooks';
import { Tokens } from './modules/tokens';
import { RiviumChatConfig } from './types';

export class RiviumChat {
  private client: HttpClient;

  /** Room management */
  public rooms: Rooms;

  /** Message operations */
  public messages: Messages;

  /** Message reactions */
  public reactions: Reactions;

  /** Pinned messages */
  public pins: Pins;

  /** Webhook & push configuration */
  public webhooks: Webhooks;

  /** Centrifugo connection tokens */
  public tokens: Tokens;

  constructor(config: RiviumChatConfig) {
    this.client = new HttpClient(config);
    this.rooms = new Rooms(this.client);
    this.messages = new Messages(this.client);
    this.reactions = new Reactions(this.client);
    this.pins = new Pins(this.client);
    this.webhooks = new Webhooks(this.client);
    this.tokens = new Tokens(this.client);
  }
}

export { RiviumChatError } from './client';
export * from './types';
