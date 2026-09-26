## [0.2.0] - 2026-09-26

- Changed: `rooms.findOrCreate()` returns `{ room, created }`, which is what the
  API has always answered. It was declared as returning a `Room`, so every field
  read as `undefined`. Use `const { room, created } = await ...`; `created`
  tells you whether this call is what created the room.

## [0.1.4] - 2026-09-26

- Added: `lastMessage` and `unreadCount` on `Room`. A chat list can show the
  latest message and an unread badge from `listRooms()` alone, with no extra
  calls.

## [0.1.3] - 2026-09-16

- Added: notification settings. `users.getNotificationSettings()` / `users.updateNotificationSettings()` for the whole app, and `rooms.getNotificationSettings()` / `rooms.updateNotificationSettings()` for one room.

## [0.1.2] - 2026-09-12

- Added: `users.createToken()` and `users.revokeTokens()` for verified user identity.

## [0.1.1] - 2026-08-20

- Added: `rooms.removeParticipant()` and `rooms.delete()`.

## [0.1.0] - 2026-04-26

- Initial release
