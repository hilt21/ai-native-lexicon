import assert from 'node:assert/strict';
import test from 'node:test';
import { skillMapOverview } from '../src/domain/content/skill-map-overview.mjs';

test('overview bounds examples, retains configured order and counts secondary cluster membership', () => {
 const data = { taxonomy: { layers: [{ id: 'empty' }, { id: 'work' }], types: [{ id: 'tool' }], clusters: [{ id: 'second' }], relation_types: [{ id: 'feeds' }, { id: 'uses' }, { id: 'empty' }] }, nodes: ['d','b','a','c','old','unlayered'].map((id) => ({ id, type: 'tool', status: id === 'old' ? 'retired' : 'active', layer: id === 'unlayered' ? undefined : 'work', secondary_clusters: ['second'] })), relations: [{ from:'d', to:'b',type:'uses' },{from:'old',to:'a',type:'feeds'},{from:'a',to:'b',type:'uses'},{from:'b',to:'a',type:'feeds'}] };
 const overview = skillMapOverview(data);
 assert.deepEqual(overview.groups.map((g) => [g.id,g.count,g.examples.map((n) => n.id)]), [['empty',0,[]],['work',4,['a','b','c']],['other',1,['unlayered']]]);
 assert.equal(overview.clusters[0].count, 5);
 assert.deepEqual(overview.relationships.map(({ edge }) => edge), [{from:'b',to:'a',type:'feeds'},{from:'a',to:'b',type:'uses'}]);
 data.relations.reverse(); assert.deepEqual(skillMapOverview(data).relationships, overview.relationships);
});
test('empty and layerless maps remain valid without invented content', () => {
 const data = { taxonomy: { layers: [], types: [{id:'custom'}],clusters:[],relation_types:[] }, nodes: [], relations:[] };
 assert.deepEqual(skillMapOverview(data).groups.map((g) => [g.id,g.count,g.examples]), [['custom',0,[]]]);
 assert.deepEqual(skillMapOverview(data).relationships, []);
});
