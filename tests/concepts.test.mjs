import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, validateConceptDirectory } from '../scripts/concept-validation.mjs';

const directory = fileURLToPath(new URL('../src/data/concepts/', import.meta.url));

test('the catalog contains valid concepts across all supported categories', async () => {
  const result = await validateConceptDirectory(directory);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(Object.keys(result.categoryCounts), CATEGORIES);
  assert.ok(Object.values(result.categoryCounts).every((count) => count > 0));
});

test('every relationship resolves to another concept', async () => {
  const result = await validateConceptDirectory(directory);
  const slugs = new Set(result.records.map(({ slug }) => slug));
  for (const { slug, data } of result.records) {
    assert.ok(data.related.length >= 2, `${slug} needs at least two relationships`);
    assert.ok(data.related.every((related) => slugs.has(related)), `${slug} has a broken relationship`);
  }
});


test('portable schema and validator accept the same categories', async () => {
  const schema = JSON.parse(await readFile(new URL('../schemas/concept.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(schema.properties.category.enum, CATEGORIES);
});


test('requested foundational vocabulary has the intended categories', async () => {
  const { records } = await validateConceptDirectory(directory);
  const terms = new Map(records.map(({ data }) => [data.term, data.category]));
  const requested = {
    Instruction: ['Prompt', 'Instructions', 'System Prompt'],
    Context: ['Context', 'Context Window', 'Context Selection', 'Context Compression', 'Context Pruning', 'Context Refresh', 'Context Isolation', 'Context Handoff'],
    Knowledge: ['Retrieval', 'RAG'],
    Memory: ['Working Memory', 'Long-Term Memory', 'Memory Consolidation', 'Forgetting'],
    State: ['State', 'Artifact', 'Checkpoint'],
    Goal: ['Goal', 'Task', 'Subtask'],
    Reasoning: ['Planning', 'Task Decomposition', 'Tool Selection', 'Routing', 'Reflection', 'Replanning'],
    Capability: ['Tool', 'Skill', 'MCP'],
    Execution: ['Workflow', 'Agent Loop', 'Tool Calling', 'Delegation', 'Parallelism'],
    Feedback: ['Observation', 'Feedback', 'Grounding'],
    Verification: ['Evidence', 'Evaluation', 'Verification', 'Trace'],
    'Failure Handling': ['Retry', 'Fallback', 'Rollback', 'Recovery'],
    Governance: ['Guardrail', 'Permission', 'Approval', 'Budget', 'Termination'],
    'Multi-Agent': ['Orchestration', 'Handoff', 'Shared State', 'Coordination'],
  };
  for (const [category, names] of Object.entries(requested)) {
    for (const term of names) assert.equal(terms.get(term), category, term);
  }
});
