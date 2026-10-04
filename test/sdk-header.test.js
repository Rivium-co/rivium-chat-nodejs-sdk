// Run with `npm test` (builds first). Uses only node:test, no dependencies.
const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { version } = require('../package.json');
const { SDK_NAME, SDK_VERSION } = require('../dist');
const { HttpClient, SDK_HEADER_VALUE } = require('../dist/client');

test('SDK_VERSION matches package.json', () => {
  assert.strictEqual(SDK_NAME, 'node');
  assert.strictEqual(SDK_VERSION, version);
  assert.strictEqual(SDK_HEADER_VALUE, `node/${version}`);
});

test('every request sends X-Rivium-SDK next to the key and the server secret', async () => {
  const seen = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      seen.push({ method: req.method, url: req.url, headers: req.headers, body });
      res.setHeader('Content-Type', 'application/json');
      res.end('{"ok":true}');
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    const client = new HttpClient({ apiKey: 'k', serverSecret: 's' });
    // Test-only: point the private base URL at the local stub server.
    client.baseUrl = `http://127.0.0.1:${server.address().port}`;
    await client.get('/api/v1/rooms', { userId: 'u_1', skip: undefined });
    await client.post('/api/v1/users/token', { userId: 'u_1' });

    assert.strictEqual(seen.length, 2);
    for (const req of seen) {
      assert.strictEqual(req.headers['x-rivium-sdk'], `node/${version}`);
      assert.strictEqual(req.headers['x-api-key'], 'k');
      assert.strictEqual(req.headers['x-server-secret'], 's');
      assert.strictEqual(req.headers['content-type'], 'application/json');
    }
    // Nothing else about a request changed.
    assert.strictEqual(seen[0].url, '/api/v1/rooms?userId=u_1');
    assert.strictEqual(seen[0].body, '');
    assert.strictEqual(seen[1].url, '/api/v1/users/token');
    assert.strictEqual(seen[1].body, '{"userId":"u_1"}');
    assert.deepStrictEqual(
      Object.keys(seen[1].headers).sort(),
      ['connection', 'content-length', 'content-type', 'host', 'x-api-key', 'x-rivium-sdk', 'x-server-secret'],
    );
  } finally {
    server.close();
  }
});
