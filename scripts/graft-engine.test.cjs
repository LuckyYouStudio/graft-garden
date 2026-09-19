const assert=require('node:assert/strict');
const G=require('../fruit-machine-ui/graft-engine.js');
assert.equal(G.RTP_BPS,9700);
for(const mode of ['harvest','bloom']) for(const layout of ['trellis','graft']) {
  for(const stakes of [Array(8).fill(100n),[100n,0n,0n,0n,0n,0n,0n,0n],[25n,50n,75n,100n,125n,150n,175n,200n]]) {
    let payouts=0n;
    const distributions=Array.from({length:8},()=>[0,0,0,0]);
    for(let n=0;n<512;n++){
      const r=G.resolve([n&7,(n>>3)&7,(n>>6)&7],stakes,mode,layout);
      payouts+=r.payout;r.hits.forEach((h,i)=>distributions[i][h]++);
    }
    assert.equal(payouts*100n,stakes.reduce((a,b)=>a+b,0n)*97n*512n);
    distributions.forEach(d=>assert.deepEqual(d,[64,192,192,64]));
  }
}
assert.equal(G.payoutFor('harvest',2,100n),152n);
assert.equal(G.payoutFor('harvest',3,100n),320n);
assert.equal(G.payoutFor('bloom',3,100n),776n);
assert.throws(()=>G.resolve([0,0,8],Array(8).fill(100n),'harvest','graft'));
assert.throws(()=>G.payoutFor('harvest',2,1n));
console.log('Graft frontend exact-money math: 6144 outcomes passed, all allocations RTP 97%.');

