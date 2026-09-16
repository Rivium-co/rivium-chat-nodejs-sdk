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

### Users — verified identity (recommended)

Your API key ships inside every app, so it cannot prove who a user is. Mint a
short-lived token here and hand it to the client SDK's `tokenProvider`:

```typescript
// Express example — your own login protects the route
app.get('/chat-token', requireLogin, async (req, res) => {
  const { token } = await riviumChat.users.createToken({ userId: req.user.id });
  res.json({ token });
});
```

```typescript
riviumChat.users.createToken({ userId, info?, ttl? })  // 1 h default, 24 h max
riviumChat.users.revokeTokens(userId)                  // on logout, password change, ban
riviumChat.users.getNotificationSettings(userId)                // App-wide push settings
riviumChat.users.updateNotificationSettings(userId, options)    // Turn chat pushes off, mentions only, mute
```

`revokeTokens` invalidates every token issued to that user so far; it takes
effect within about 15 seconds across servers. Client SDKs then ask your
endpoint for a new token, so a signed-out user gets nothing.

### Rooms

```typescript
riviumChat.rooms.create(options)                    // Create a room
riviumChat.rooms.findOrCreate(options)               // Find or create by externalId
riviumChat.rooms.get(roomId)                         // Get room by ID
riviumChat.rooms.getByExternalId(externalId)          // Get room by external ID
riviumChat.rooms.list(userId)                        // List rooms for a user
riviumChat.rooms.addParticipant(roomId, options)      // Add participant to room
riviumChat.rooms.removeParticipant(roomId, userId)    // Remove participant (idempotent)
riviumChat.rooms.delete(roomId)                       // Permanently delete a room
riviumChat.rooms.getUnreadSummary(userId)             // Get unread counts
riviumChat.rooms.getNotificationSettings(roomId, userId)             // A user's push settings for a room
riviumChat.rooms.updateNotificationSettings(roomId, userId, options) // Mute a room or mentions only
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

### Notification settings

Let each user decide which chat pushes they get. Nothing changes until you set something.

```typescript
// Turn off chat pushes for a user across your app
await riviumChat.users.updateNotificationSettings('user-1', { pushLevel: 'none' });

// Only push when mentioned, and no reaction pushes
await riviumChat.users.updateNotificationSettings('user-1', {
  pushLevel: 'mentions',
  disabledEvents: ['reaction'],
});

// Mute one room for 8 hours, then unmute
await riviumChat.rooms.updateNotificationSettings(roomId, 'user-1', {
  mutedUntil: new Date(Date.now() + 8 * 3600_000),
});
await riviumChat.rooms.updateNotificationSettings(roomId, 'user-1', { mutedUntil: null });

await riviumChat.users.getNotificationSettings('user-1');
```

`pushLevel` is `all` (default), `mentions` or `none`. App-wide and room settings both apply: a push is sent only if neither blocks it.

## Links

- [Rivium Chat](https://rivium.co/cloud/rivium-chat) - Learn more about Rivium Chat
- [Documentation](https://rivium.co/cloud/rivium-chat/docs/quick-start) - Full documentation and guides
- [Rivium Console](https://console.rivium.co) - Manage your chat rooms

## License

MIT
