import test from 'node:test';
import assert from 'node:assert/strict';
import { forgetCommunity, readRecentCommunities, rememberCommunity } from '../src/utils/recentCommunities.js';

test('keeps the five latest unique communities', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const key = 'recent';

  for (let index = 1; index <= 6; index += 1) rememberCommunity(storage, key, { id: `${index}`, name: `Cộng đồng ${index}` });
  rememberCommunity(storage, key, { id: '3', name: 'Cộng đồng 3' });

  assert.deepEqual(readRecentCommunities(storage, key).map((item) => item.id), ['3', '6', '5', '4', '2']);
  assert.deepEqual(forgetCommunity(storage, key, '5').map((item) => item.id), ['3', '6', '4', '2']);
});
