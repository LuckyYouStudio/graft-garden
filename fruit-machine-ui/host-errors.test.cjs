const assert = require('node:assert/strict');
const {message} = require('./host-errors.js');
const revert = new Error('Execution reverted with reason: VM Exception while processing transaction: reverted with an unrecognized custom error (return data: 0xbcefcde4). Request Arguments: chain: Local chain 31337 data: 0x' + '1234'.repeat(1500));
const zh = message(revert,'zh');
assert.match(zh,/GraftGardenGame/);
assert.match(zh,/Restart harness/);
assert.ok(zh.length < 150);
assert.doesNotMatch(zh,/0xbcefcde4|Request Arguments|12341234/);
assert.match(message(revert,'en'),/select GraftGardenGame/);
assert.match(message(new Error('Failed to fetch'),'zh'),/模拟器/);
assert.match(message({code:4001,message:'User rejected request'},'en'),/cancelled/);
assert.ok(message(new Error('x'.repeat(5000)),'en').length <= 180);
assert.equal(message(new Error('Wager must equal encoded stakes'),'en'),'Wager must equal encoded stakes');
assert.doesNotMatch(message(new Error('Contract 0x'+'ab'.repeat(300)), 'en'),/abababab/);
console.log('Host errors: wrong-contract guidance, network/cancel messages and bounded UI passed');

