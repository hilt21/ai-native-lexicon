import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { stringify } from 'yaml';
import { fixture, mapInput } from './skill-map-fixture.mjs';
import { skillMapLoader } from '../src/lib/skill-map-loader.mjs';

test('a later filesystem snapshot cannot be overwritten by an earlier delayed Astro parse', async (t) => {
  const directory = await fixture(t);
  const watcher = new EventEmitter(); watcher.add = () => {};
  const records = new Map();
  let releaseOld, enteredOld, parsedNew, wroteNew;
  const oldGate = new Promise((r) => { releaseOld = r; });
  const oldStarted = new Promise((r) => { enteredOld = r; });
  const newParsed = new Promise((r) => { parsedNew = r; });
  const newWritten = new Promise((r) => { wroteNew = r; });
  const store = { clear: () => records.clear(), set: (record) => { records.set(record.id, record); if (record.data.title === 'New snapshot') wroteNew(); } };
  await skillMapLoader(directory).load({
    store, watcher, generateDigest: JSON.stringify,
    logger: { error: (message) => assert.fail(message) },
    async parseData({ data }) {
      if (data.title === 'Old snapshot') { enteredOld(); await oldGate; }
      if (data.title === 'New snapshot') parsedNew();
      return data;
    },
  });
  const file = join(directory, 'example', 'map.yaml');
  await writeFile(file, stringify({ ...mapInput, title: 'Old snapshot' }));
  watcher.emit('change', file); await oldStarted;
  await writeFile(file, stringify({ ...mapInput, title: 'New snapshot' }));
  watcher.emit('change', file);
  // With serialization the new parse waits for the old one; the legacy loader
  // reaches it first, then overwrites it when the delayed parse is released.
  await Promise.race([newParsed, new Promise((r) => setTimeout(r, 100))]);
  releaseOld(); await newWritten;
  await new Promise((r) => setImmediate(r));
  assert.equal(records.get('example').data.title, 'New snapshot');
});

test('restoring an empty journey directory refreshes content after a directory validation error', async (t) => {
  const directory = await fixture(t);
  const watcher = new EventEmitter(); watcher.add = () => {};
  const records = new Map();
  let reportError, reportRecovery;
  const errored = new Promise((r) => { reportError = r; });
  const recovered = new Promise((r) => { reportRecovery = r; });
  const store = { clear: () => records.clear(), set: (r) => { records.set(r.id, r); if (r.data.title === 'Recovered map') reportRecovery(); } };
  await skillMapLoader(directory).load({ store, watcher, generateDigest: JSON.stringify, parseData: async ({ data }) => data, logger: { error: reportError } });
  const journeys = join(directory, 'example', 'journeys');
  await rm(journeys, { recursive: true }); watcher.emit('unlinkDir', journeys);
  assert.match(await errored, /journeys/);
  assert.equal(records.get('example').data.title, 'Test skills');
  await writeFile(join(directory, 'example', 'map.yaml'), stringify({ ...mapInput, title: 'Recovered map' }));
  await mkdir(journeys); watcher.emit('addDir', journeys);
  await recovered;
  assert.equal(records.get('example').data.title, 'Recovered map');
});
