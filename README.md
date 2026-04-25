# RiviumChat Node.js SDK

Server-side SDK for RiviumChat. Manage chat rooms, messages, reactions, pins, webhooks, and push notification templates from your Node.js backend.

> **Server-side only.** This SDK requires a server secret and must never be used in client-side applications. The server secret can be extracted from client apps.

## Features

- Room management (create, find, list, add participants)
- Message operations (send, edit, delete, search, mentions)
- Read receipts and unread counts
- Emoji reactions
- Message pinning
- Webhook configuration
- Push notification templates (via Rivium Push)
- Centrifugo connection token generation
- Zero runtime dependencies — uses native Node.js `http`/`https`
- TypeScript declarations included

## Installation

```bash
npm install @rivium/chat
```

## Quick Start

```typescript
import { RiviumChat } from '@rivium/chat';

const riviumChat = new RiviumChat({
  apiKey: 'YOUR_API_KEY',
  serverSecret: 'YOUR_SERVER_SECRET',
});
```

### Create a Room

```typescript
const room = await riviumChat.rooms.findOrCreate({
  externalId: 'order-123',
  participants: [
    { externalUserId: 'user-1', displayName: 'Alice', role: 'member' },
    { externalUserId: 'user-2', displayName: 'Bob', role: 'member' },
  ],
});
```

### Send a Message

```typescript
const message = await riviumChat.messages.send(room.id, {
  senderUserId: 'user-1',
  content: 'Hello from the server!',
});
```

### Get Message History

```typescript
const { messages, hasMore } = await riviumChat.messages.getHistory(room.id, {
  userId: 'user-1',
  limit: 50,
});
```

### Mark as Read

```typescript
await riviumChat.messages.markAsRead(room.id, 'user-1');
```

### Unread Counts

```typescript
const summary = await riviumChat.rooms.getUnreadSummary('user-1');
// { totalUnread: 5, rooms: [{ roomId, externalId, unreadCount }] }
```

## API Reference

### Rooms

```typescript
riviumChat.rooms.create(options)                    // Create a room
riviumChat.rooms.findOrCreate(options)               // Find or create by externalId
riviumChat.rooms.get(roomId)                         // Get room by ID
riviumChat.rooms.getByExternalId(externalId)          // Get room by external ID
riviumChat.rooms.list(userId)                        // List rooms for a user
riviumChat.rooms.addParticipant(roomId, options)      // Add participant to room
riviumChat.rooms.getUnreadSummary(userId)             // Get unread counts
```

### Messages

```typescript
riviumChat.messages.send(roomId, options)             // Send a message
riviumChat.messages.getHistory(roomId, options)        // Get paginated history
riviumChat.messages.markAsRead(roomId, userId)         // Mark messages as read
riviumChat.messages.edit(messageId, userId, content)   // Edit a message
riviumChat.messages.delete(messageId, userId)          // Delete a message
riviumChat.messages.search(roomId, options)            // Search messages
riviumChat.messages.getMentions(roomId, options)        // Get @mentions
```

### Reactions

```typescript
riviumChat.reactions.add(messageId, userId, emoji)     // Add reaction
riviumChat.reactions.remove(messageId, userId, emoji)   // Remove reaction
riviumChat.reactions.list(messageId)                    // List reactions
```

### Pins

```typescript
riviumChat.pins.pin(messageId, userId)                 // Pin a message
riviumChat.pins.unpin(messageId, userId)                // Unpin a message
riviumChat.pins.list(roomId)                           // List pinned messages
```

### Webhooks

```typescript
riviumChat.webhooks.get()                              // Get webhook config
riviumChat.webhooks.setWebhook({ url, secret? })        // Set webhook URL
riviumChat.webhooks.removeWebhook()                     // Remove webhook
riviumChat.webhooks.setPushTemplate(templateId)          // Set push template
riviumChat.webhooks.removePushTemplate()                 // Remove push template
riviumChat.webhooks.setPushTemplates(templates)           // Per-event push templates
riviumChat.webhooks.removePushTemplates()                 // Remove per-event templates
```

### Tokens

```typescript
riviumChat.tokens.getConnectionToken({ userId, info? })  // Get Centrifugo token
```

## Push Notifications

Configure push notifications for offline users via [Rivium Push](https://rivium.co/cloud/rivium-push):

```typescript
// Use a Rivium Push template
await riviumChat.webhooks.setPushTemplate('your-template-id');

// Or use per-event inline templates
await riviumChat.webhooks.setPushTemplates({
  new_message: {
    title: '{{senderName}}',
    body: '{{messagePreview}}',
  },
  mention: {
    title: '{{senderName}} mentioned you',
    body: '{{messagePreview}}',
  },
});
```

## Links

- [Rivium Chat](https://rivium.co/cloud/rivium-chat) - Learn more about Rivium Chat
- [Documentation](https://rivium.co/cloud/rivium-chat/docs/quick-start) - Full documentation and guides
- [Rivium Console](https://console.rivium.co) - Manage your chat rooms

## License

MIT
