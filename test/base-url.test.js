// Run with `npm test` (builds first). Uses only node:test, no dependencies.
const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { HttpClient, resolveBaseUrl } = require('../dist/client');

test('baseUrl: the default, and what is accepted', () => {
  assert.strictEqual(resolveBaseUrl(), 'https://chat.rivium.co');
  assert.strictEqual(resolveBaseUrl(''), 'https://chat.rivium.co');
  assert.strictEqual(resolveBaseUrl('https://chat.example.com/'), 'https://chat.example.com');
  assert.strictEqual(resolveBaseUrl('https://example.com/chat//'), 'https://example.com/chat');
  assert.strictEqual(resolveBaseUrl('http://localhost:3000'), 'http://localhost:3000');
  assert.strictEqual(resolveBaseUrl('http://127.0.0.1:3000'), 'http://127.0.0.1:3000');
});

test('baseUrl: refused so the server secret never goes elsewhere in clear text', () => {
  for (const bad of ['chat.example.com', 'http://chat.example.com', 'ftp://chat.example.com', 'https://u:p@chat.example.com', 'https://chat.example.com?x=1', 'https://chat.example.com#x']) {
    assert.throws(() => new HttpClient({ apiKey: 'k', serverSecret: 's', baseUrl: bad }), /RiviumChat: baseUrl/, bad);
  }
});

test('requests go to baseUrl, keeping its path, with the query', async () => {
  const seen = [];
  const server = http.createServer((req, res) => {
    seen.push(req.url);
    res.setHeader('Content-Type', 'application/json');
    res.end('{}');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    const port = server.address().port;
    await new HttpClient({ apiKey: 'k', serverSecret: 's', baseUrl: `http://127.0.0.1:${port}` }).get('/api/v1/rooms', { userId: 'u 1' });
    await new HttpClient({ apiKey: 'k', serverSecret: 's', baseUrl: `http://127.0.0.1:${port}/chat/` }).get('/api/v1/rooms');
    assert.deepStrictEqual(seen, ['/api/v1/rooms?userId=u+1', '/chat/api/v1/rooms']);
  } finally {
    server.close();
  }
});
