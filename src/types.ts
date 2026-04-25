// ─── Configuration ───────────────────────────────────────────────

export interface RiviumChatConfig {
  /** Your Rivium API key */
  apiKey: string;
  /** Your Rivium server secret — required for server-side operations */
  serverSecret: string;
}

// ─── Enums / Literal Types ──────────────────────────────────────

export type RoomType = 'direct' | 'group';
export type ParticipantRole = 'admin' | 'member';
export type MessageType = 'text' | 'image' | 'file' | 'system';

// ─── Attachment ─────────────────────────────────────────────────

export interface Attachment {
  url: string;
  mimeType: string;
  name: string;
  size: number;
}

// ─── Participant ────────────────────────────────────────────────

export interface Participant {
  id: string;
  roomId: string;
  externalUserId: string;
  displayName?: string;
  locale?: string;
  role: ParticipantRole;
  lastReadAt?: string;
  joinedAt: string;
}

// ─── Room ───────────────────────────────────────────────────────

export interface Room {
  id: string;
  appId: string;
  type: RoomType;
  externalId?: string;
  name?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  participants?: Participant[];
}

// ─── Message ────────────────────────────────────────────────────

export interface Message {
  id: string;
  roomId: string;
  senderUserId: string;
  type: MessageType;
  content: string;
  attachments?: Attachment[];
  metadata?: Record<string, any>;
  replyToId?: string;
  replyTo?: Message;
  isDeleted: boolean;
  isEdited: boolean;
  editedAt?: string;
  editHistory?: { content: string; editedAt: string }[];
  isPinned: boolean;
  pinnedAt?: string;
  pinnedBy?: string;
  createdAt: string;
  reactions?: Reaction[];
}

// ─── Reaction ───────────────────────────────────────────────────

export interface Reaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

// ─── Mention ────────────────────────────────────────────────────

export interface Mention {
  id: string;
  messageId: string;
  mentionedUserId: string;
  roomId: string;
  createdAt: string;
  message: Message;
}

// ─── Paginated Messages ─────────────────────────────────────────

export interface PaginatedMessages {
  messages: Message[];
  hasMore: boolean;
}

// ─── Search Result ──────────────────────────────────────────────

export interface SearchResult {
  messages: Message[];
  total: number;
}

// ─── Unread Summary ─────────────────────────────────────────────

export interface RoomUnread {
  roomId: string;
  unreadCount: number;
}

export interface UnreadSummary {
  totalUnread: number;
  rooms: RoomUnread[];
}

// ─── Webhook / Push Config ──────────────────────────────────────

export interface EventPushConfig {
  templateId?: string;
  title?: string;
  body?: string;
  skip?: boolean;
}

export interface PushTemplates {
  new_message?: EventPushConfig;
  mention?: EventPushConfig;
  reaction?: EventPushConfig;
  room_created?: EventPushConfig;
  participant_joined?: EventPushConfig;
  file_shared?: EventPushConfig;
  message_pinned?: EventPushConfig;
}

export interface WebhookConfig {
  webhookUrl: string | null;
  hasSecret: boolean;
  pushTemplateId: string | null;
  pushTemplates: PushTemplates | null;
}

// ─── Request Option Interfaces ──────────────────────────────────

export interface ParticipantInput {
  externalUserId: string;
  displayName?: string;
  locale?: string;
  role?: ParticipantRole;
}

export interface CreateRoomOptions {
  type?: RoomType;
  externalId?: string;
  name?: string;
  participants: ParticipantInput[];
  metadata?: Record<string, any>;
}

export interface AddParticipantOptions {
  externalUserId: string;
  displayName?: string;
  locale?: string;
  role?: ParticipantRole;
}

export interface SendMessageOptions {
  senderUserId: string;
  content: string;
  type?: MessageType;
  attachments?: Attachment[];
  metadata?: Record<string, any>;
  replyToId?: string;
}

export interface GetHistoryOptions {
  userId: string;
  limit?: number;
  before?: string;
}

export interface SearchMessagesOptions {
  q: string;
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetMentionsOptions {
  userId: string;
  limit?: number;
}

export interface SetWebhookOptions {
  url: string;
  secret?: string;
}

export interface GetTokenOptions {
  userId: string;
  info?: Record<string, any>;
}
