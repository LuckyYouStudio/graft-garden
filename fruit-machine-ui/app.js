'use strict';
const G = window.GraftEngine;
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const hosted = window.parent !== window;
const fruit = ['🍒','🍇','🍐','🍉','🫐','🍋','🍊','🍎'];
const colors = ['#ff9da7','#c5a0f7','#d6e792','#82dfac','#92b6ee','#f4dd84','#f5b58c','#ec8dba'];
const words = {
  zh: {
    title:'嫁接果园', tagline:'种下路径，等待三季风来。', balance:'试玩财富', hostBalance:'钱包余额',
    prize:'本局收成', garden:'三季果园 · 8 条路径', spring:'01 · 生根', summer:'02 · 开花', autumn:'03 · 结果',
    harvest:'稳态收成', bloom:'共振绽放', harvestHint:'2 中 ×1.52 · 3 中 ×3.20', bloomHint:'仅 3 中 ×7.76',
    layout:'路径布局', trellis:'格架', graft:'嫁接', clear:'清除全部', total:'本局总注', preview:'风向演示',
    verify:'结果验证', history:'最近收成', rtpNote:'97% 为长期理论返奖率，不代表单局中奖概率。赔付包含本金。',
    idle:'选择果树路径；三季各点亮 4 个节点，按路径命中次数支付收成。',
    choose:'请选择果树路径', ready:'准备好迎接三季风向', start:'开始收成', collect:'收取收成', next:'继续',
    busy:'等待风向', retry:'重新读取结果', cancel:'申请取消超时局', hold:'点击 +{unit} · 按住持续加注',
    unit:'每次加注 {unit} {symbol}', standalone:'独立试玩 · 虚拟积分', connected:'Casino SDK · {symbol}',
    connecting:'正在连接 Casino 主机', disconnected:'请在主机连接钱包', setup:'请先完成主机钱包设置',
    mismatch:'请在主机恢复会话密钥', noBalance:'等待主机余额', wrongGame:'主机未加载 GraftGardenGame',
    noLimits:'等待主机风险额度', insufficient:'余额不足，请减少下注', limit:'下注超出主机当前额度',
    opening:'正在提交本局下注…', pending:'下注已提交，等待链上随机数；请勿重复下注。',
    wind:'第 {season} 季风向已锁定：从节点 {node} 开始', reveal:'三季风向到齐，正在揭示路径…',
    won:'收成 {amount} · {count} 条下注路径命中', lost:'本局下注路径未达到收成条件',
    collected:'收成已转入试玩财富', settled:'收成已由合约结算，钱包余额以主机为准',
    cleared:'全部下注已清除', previewing:'风向演示中 · 不下注、不计入余额',
    previewDone:'演示结束 · 三季风窗与路径已显示', waitingLong:'结果尚未同步。可重新读取；超时取消由主机校验。',
    roundCancelled:'本局已取消；余额处理以合约和主机为准', roundForfeited:'本局已结束；按合约规则处理余额',
    failed:'操作失败：{error}', restored:'正在恢复未完成的链上局', errorResult:'结果数据不完整或不匹配，请重新同步。',
    noResult:'完成一局后，可在这里查看风向、命中、赔付及会话信息。',
    rulesTitle:'三季风向，八条果树路径', trace:'{fruit} 路径：{nodes} · {hits}', traceHint:'加注可查看该路径的连接',
    hits:'{n}/3 命中', credits:'积分', mute:'关闭音效', unmute:'开启音效',
    verifyUnavailable:'主机没有提供 VRF 验证接口；会话原始数据如下。', noVrf:'本地模拟器未使用 Verify Network VRF。',
    verified:'主机报告 VRF 验证通过', unverified:'VRF 尚未验证或验证未通过',
    rules:'先选择模式与布局，再点击或长按底部果树按钮加注。初始下注均为 0。每条路径穿过生根、开花、结果三个季节的各一个节点。每季独立随机选一个起点，在 8 个节点中点亮连续 4 个。路径经过的亮点数就是命中次数。',
    rules2:'格架：路径三季沿同一编号。嫁接：第二、第三季重新连接节点，改变多条路径之间的相关性。单路径的命中概率保持不变。先展示每季风窗，再揭示已下注路径；主界面节点仅供展示。',
    rules3:'每条路径命中 0 / 1 / 2 / 3 次的概率是 12.5% / 37.5% / 37.5% / 12.5%。稳态收成有赔付的概率为 50%，共振绽放为 12.5%；有赔付不等于净盈利。多路下注的综合命中率由布局和下注组合决定。',
    rules4:'稳态收成：3/8 × 1.52 + 1/8 × 3.20 = 0.97。共振绽放：1/8 × 7.76 = 0.97。任意合法下注组合均有 97% 理论 RTP。金额用整数最小单位计算，避免小额赔付被截断。独立试玩采用浏览器随机数；主机模式只展示合约结果。',
    ruleHit:'命中次数', ruleChance:'概率', noPay:'无赔付'
  },
  en: {
    title:'Graft Garden', tagline:'Plant a path. Let three seasons unfold.', balance:'Demo balance', hostBalance:'Wallet balance',
    prize:'Round harvest', garden:'THREE SEASONS · EIGHT PATHS', spring:'01 · ROOT', summer:'02 · BLOOM', autumn:'03 · FRUIT',
    harvest:'Harvest', bloom:'Bloom', harvestHint:'2 hits ×1.52 · 3 hits ×3.20', bloomHint:'3 hits only ×7.76',
    layout:'Path layout', trellis:'Trellis', graft:'Graft', clear:'Clear all', total:'Total wager', preview:'Wind preview',
    verify:'Verify result', history:'Recent harvests', rtpNote:'97% is a long-run theoretical return, not the chance of winning a round. Payouts include the stake.',
    idle:'Choose orchard paths. Each season lights 4 nodes; path hits determine the harvest.',
    choose:'Choose an orchard path', ready:'Ready for three seasonal winds', start:'Grow & reveal', collect:'Collect harvest', next:'Continue',
    busy:'Waiting for winds', retry:'Sync result', cancel:'Request timeout cancellation', hold:'Click +{unit} · Hold to add',
    unit:'Each press adds {unit} {symbol}', standalone:'Standalone demo · virtual credits', connected:'Casino SDK · {symbol}',
    connecting:'Connecting to Casino host', disconnected:'Connect your wallet in the host', setup:'Complete your wallet setup in the host',
    mismatch:'Restore your session key in the host', noBalance:'Waiting for host balance', wrongGame:'Host must load GraftGardenGame',
    noLimits:'Waiting for host risk limits', insufficient:'Insufficient balance; reduce your wager', limit:'Wager exceeds current host limits',
    opening:'Submitting this wager…', pending:'Wager submitted; waiting for on-chain randomness. Do not resubmit.',
    wind:'Season {season} locked: wind starts at node {node}', reveal:'All three winds are in. Revealing your paths…',
    won:'Harvest {amount} · {count} wagered paths paid', lost:'No wagered path reached the harvest threshold',
    collected:'Harvest added to your demo balance', settled:'Settled by the contract. Wallet balance follows the host.',
    cleared:'All bets cleared', previewing:'Wind preview · no wager or balance change',
    previewDone:'Preview complete · seasonal windows and paths are visible', waitingLong:'Result not synced yet. Retry sync; the host checks timeout cancellation.',
    roundCancelled:'Round cancelled; balance handling follows the contract and host', roundForfeited:'Round ended under the contract rules',
    failed:'Operation failed: {error}', restored:'Restoring the unfinished on-chain round', errorResult:'Incomplete or mismatched result. Please sync again.',
    noResult:'Complete a round to inspect winds, hits, payout and session details.',
    rulesTitle:'Three seasons. Eight orchard paths.', trace:'{fruit} path: {nodes} · {hits}', traceHint:'Add a wager to trace its path',
    hits:'{n}/3 hits', credits:'credits', mute:'Mute sound', unmute:'Enable sound',
    verifyUnavailable:'The host does not expose VRF verification. Raw session data is shown below.', noVrf:'The local simulator does not use Verify Network VRF.',
    verified:'Host reports that VRF verification passed', unverified:'VRF unverified or verification failed',
    rules:'Choose a mode and layout, then click or hold a fruit button to wager. All wagers start at zero. Each path passes through one node in each of three seasons. Every season independently selects a random starting node and lights four consecutive nodes out of eight. The number of lit nodes along a path is its hit count.',
    rules2:'Trellis follows the same node number in all seasons. Graft reconnects the second and third seasons, changing correlations between paths while keeping each path’s hit probabilities unchanged. The board shows each seasonal window, then the wagered paths. Board nodes are display-only.',
    rules3:'A path has 0 / 1 / 2 / 3 hits with probabilities 12.5% / 37.5% / 37.5% / 12.5%. A payout occurs 50% of the time in Harvest and 12.5% in Bloom. A payout is not necessarily a net profit. Combined hit rates depend on your layout and allocation.',
    rules4:'Harvest: 3/8 × 1.52 + 1/8 × 3.20 = 0.97. Bloom: 1/8 × 7.76 = 0.97. Every valid allocation has 97% theoretical RTP. Integer base units keep small payouts exact. Standalone uses browser randomness; host mode displays contract outcomes only.',
    ruleHit:'Hits', ruleChance:'Probability', noPay:'No payout'
  }
};
let locale = 'zh';
try { locale = localStorage.getItem('graft.locale') === 'en' ? 'en' : 'zh'; } catch {}
const t = (key, vars = {}) => Object.entries(vars).reduce((s, [k,v]) => s.replaceAll('{' + k + '}', String(v)), words[locale][key] || key);
const counts = Array(8).fill(0);
let mode = 'harvest', layout = 'trellis', focusLane = 0;
let demoBalance = 66100n, prize = 0n, stage = 'idle', snapshot = null, bridge = null;
let activeRound = null, lastRound = null, lastResult = null, lastRow = null, revealedSeasons = 0;
let betControls, history = [], statusKey = 'idle', statusVars = {}, errorText = '', waitVersion = 0, recovering = false;
const handled = new Set();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause = ms => new Promise(resolve => setTimeout(resolve, reducedMotion ? 1 : ms));
function sound(name, arg) { try { window.FruitAudio?.[name]?.(arg); } catch {} }
function hostErrorMessage(error) { return window.GraftHostErrors.message(error, locale); }
function reportHostError(error) {
  console.warn('Graft Garden host request:', error);
  status('failed', {error:hostErrorMessage(error)}, true);
}
function busy() { return stage !== 'idle'; }
function context() {
  const d = hosted ? snapshot?.token?.decimals : 2;
  if (!Number.isInteger(d) || d < 0 || d > 36) return null;
  const scale = 10n ** BigInt(d);
  return { decimals:d, scale, unit:d === 0 ? 25n : d === 1 ? 50n : scale, symbol:hosted ? (snapshot?.token?.symbol || 'TOKEN') : t('credits') };
}
function format(value, ctx = context()) {
  if (!ctx) return '—';
  const n = BigInt(value), negative = n < 0n, abs = negative ? -n : n;
  const fraction = (abs % ctx.scale).toString().padStart(ctx.decimals, '0').replace(/0+$/, '');
  return (negative ? '−' : '') + (abs / ctx.scale).toString() + (ctx.decimals ? '.' + fraction.padEnd(Math.min(2, ctx.decimals), '0') : '');
}
function currentStakes() { const unit = context()?.unit || 0n; return counts.map(n => BigInt(n) * unit); }
function total(stakes = currentStakes()) { return stakes.reduce((a,b) => a + b, 0n); }
function balance() { const raw = snapshot?.balances?.smartVaultBalance; return hosted ? (/^\d+$/.test(raw || '') ? BigInt(raw) : null) : demoBalance; }
function readyReason() {
  if (!hosted) return null;
  if (bridge?.getStatus() !== 'ready' || !snapshot || !context()) return 'connecting';
  if (snapshot.integration?.manifest?.gameId !== 'GraftGardenGame') return 'wrongGame';
  const state = snapshot.wallet?.status;
  if (state !== 'ready') return state === 'setup-required' ? 'setup' : state === 'session-key-mismatch' ? 'mismatch' : 'disconnected';
  if (balance() === null) return 'noBalance';
  return null;
}
let quoteCache = { key:null, value:0n };
function maxPayout(stakes) {
  const key = [mode,layout,...stakes].join(':');
  if (quoteCache.key === key) return quoteCache.value;
  let max = 0n;
  for (let packed = 0; packed < 512; packed++) {
    const result = G.resolve([packed & 7, (packed >> 3) & 7, (packed >> 6) & 7], stakes, mode, layout);
    if (result.payout > max) max = result.payout;
  }
  quoteCache = { key, value:max };
  return max;
}
function betReason() {
  const reason = readyReason(); if (reason) return reason;
  const stakes = currentStakes(), wager = total(stakes);
  if (!wager) return 'choose';
  if (balance() === null || wager > balance()) return 'insufficient';
  if (hosted) {
    const caps = snapshot.casino || {};
    if (caps.maxBetAmount && BigInt(caps.maxBetAmount) > 0n && wager > BigInt(caps.maxBetAmount)) return 'limit';
    const risk = caps.maxAllowedReservedProfit !== undefined ? BigInt(caps.maxAllowedReservedProfit) :
      caps.availableLiquidity !== undefined && Number.isInteger(caps.maxBetRiskBps) ? BigInt(caps.availableLiquidity) * BigInt(caps.maxBetRiskBps) / 10000n : null;
    if (risk === null) return 'noLimits';
    if (maxPayout(stakes) > wager + risk) return 'limit';
  }
  return null;
}
function status(key, vars = {}, isError = false) {
  statusKey = key; statusVars = vars; errorText = isError ? t(key, vars) : '';
  $('#roundStatus').textContent = t(key, vars);
  $('#roundStatus').classList.toggle('error', isError);
}
function toast(key, vars) {
  $('#toast').textContent = t(key,vars); $('#toast').classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => $('#toast').classList.remove('show'), 2500);
}
function renderNumbers() {
  const ctx = context(), amount = total(), available = balance(), reason = betReason();
  $('#rtpValue').textContent = (G.RTP_BPS / 100).toFixed(2) + '%';
  const exactBalance = available === null ? '—' : format(available);
  const parts = exactBalance.split('.');
  $('#wealthValue').textContent = parts[1]?.length > 4 ? '≈' + parts[0] + '.' + parts[1].slice(0,4) : exactBalance;
  $('#wealthValue').title = exactBalance;
  $('#wealthTitle').textContent = t(hosted ? 'hostBalance' : 'balance');
  $('#currencyLabel').textContent = ctx?.symbol || '';
  $('#prizeValue').textContent = format(prize);
  $('#totalStake').textContent = format(amount);
  $('#unitInfo').textContent = ctx ? t('unit',{unit:format(ctx.unit),symbol:ctx.symbol}) : '';
  $('#betHint').textContent = ctx ? t('hold',{unit:format(ctx.unit)}) : t('connecting');
  $('#connectionLabel').textContent = hosted ? (readyReason() ? t(readyReason()) : t('connected',{symbol:ctx?.symbol})) : t('standalone');
  $('#startLabel').textContent = busy() ? t('busy') : prize > 0n ? t(hosted ? 'next' : 'collect') : t('start');
  $('#startHint').textContent = busy() ? '…' : prize > 0n ? format(prize) : reason ? t(reason) : t('ready');
  $('#startButton').disabled = busy() || (prize === 0n && Boolean(reason));
  $('#clearBetsButton').disabled = busy() || !counts.some(Boolean);
  $('#harvestButton').disabled = busy(); $('#bloomButton').disabled = busy(); $('#layoutButton').disabled = busy();
  $('#previewButton').disabled = busy(); $('#languageButton').disabled = busy();
  $('#harvestButton').setAttribute('aria-pressed', String(mode === 'harvest'));
  $('#bloomButton').setAttribute('aria-pressed', String(mode === 'bloom'));
  $('#layoutValue').textContent = t(layout) + ' ⇄'; $('#layoutCaption').textContent = t(layout);
  $$('.pay-button').forEach((button,i) => {
    button.disabled = busy();
    button.querySelector('.lane-stake').textContent = String(counts[i]).padStart(2,'0');
    button.classList.toggle('selected',counts[i] > 0);
  });
  $('#recoveryActions').hidden = stage !== 'waiting-retry';
  $('#cancelButton').disabled = !activeRound?.sessionId;
  $('#soundButton').textContent = window.FruitAudio?.getState().muted ? '♩' : '♪';
  $('#soundButton').setAttribute('aria-label',t(window.FruitAudio?.getState().muted ? 'unmute' : 'mute'));
  if (busy()) betControls?.cancel();
}
function renderBoard() {
  $('#gardenNodes').innerHTML = Array.from({length:24},(_,i) => {
    const season = Math.floor(i / 8), node = i % 8;
    return '<span class="garden-node" data-season="' + season + '" data-node="' + node + '" style="left:' + (6.25+node*12.5) + '%;top:' + ((45+season*90)/270*100) + '%"><span class="node-fruit" aria-hidden="true"></span><span class="node-number">' + (node+1) + '</span></span>';
  }).join('');
  renderPaths();
}
function renderPaths(round = null) {
  const stakes = round?.stakes || currentStakes(), selectedLayout = round?.layout || layout;
  // Fruit identifies the betting path; node numbers still identify wind positions.
  // Graft permutes the paths between seasons, so icons must follow that mapping.
  for (let season = 0; season < 3; season++) {
    for (let lane = 0; lane < fruit.length; lane++) {
      const node = G.pathNode(selectedLayout, lane, season);
      const cell = $('.garden-node[data-season="' + season + '"][data-node="' + node + '"]');
      cell.querySelector('.node-fruit').textContent = fruit[lane];
      cell.dataset.lane = lane;
      cell.setAttribute('aria-label', fruit[lane] + ' · ' + (locale === 'zh' ? '果树 ' : 'Path ') + (lane + 1) + ' · ' + (locale === 'zh' ? '节点 ' : 'Node ') + (node + 1));
    }
  }
  $('#pathLines').innerHTML = Array.from({length:8},(_,lane) => {
    const points = [0,1,2].map(s => [50+G.pathNode(selectedLayout,lane,s)*100,45+s*90]);
    const d = 'M' + points[0].join(',') + ' L' + points[1].join(',') + ' L' + points[2].join(',');
    return '<path class="path-line ' + (lane === focusLane && stakes[lane] > 0n ? 'selected' : '') + '" d="' + d + '" stroke="' + colors[lane] + '" style="color:' + colors[lane] + ';opacity:' + (stakes[lane] > 0n ? (lane === focusLane ? .9 : .36) : .07) + '"/>';
  }).join('');
  const nodes = [0,1,2].map(s => G.pathNode(selectedLayout,focusLane,s)+1);
  const hits = lastResult && lastRound && lastRound.layout === selectedLayout ? t('hits',{n:lastResult.hits[focusLane]}) : t('traceHint');
  $('#pathDetail').textContent = t('trace',{fruit:fruit[focusLane],nodes:nodes.join(' → '),hits});
}
function paintSeason(season, wind, final) {
  $$('.garden-node[data-season="' + season + '"]').forEach(node => {
    node.classList.toggle('lit',G.isLit(Number(node.dataset.node),wind));
    node.classList.toggle('pulse',!final && Number(node.dataset.node) === wind);
  });
  const item = $('#windSummary').children[season];
  item.textContent = ['Ⅰ','Ⅱ','Ⅲ'][season] + ' · ' + (wind+1) + ' → ' + (((wind+3)&7)+1);
  item.classList.toggle('revealed',final);
}
function clearBoard() {
  $$('.garden-node').forEach(node => node.classList.remove('lit','pulse','trace'));
  Array.from($('#windSummary').children).forEach((node,i) => { node.textContent=['Ⅰ','Ⅱ','Ⅲ'][i]+' · —'; node.classList.remove('revealed'); });
  $$('.lane-hit').forEach(node => { node.textContent='—'; }); $$('.pay-button').forEach(node => node.classList.remove('winner'));
}
function renderBets() {
  betControls?.destroy();
  $('#payButtons').innerHTML = fruit.map((icon,i) => '<button class="pay-button" data-lane="' + i + '" aria-label="' + icon + ' '+ (i+1) + '"><span class="fruit">' + icon + '</span><span class="lane-name">' + (locale === 'zh' ? '果树 ' : 'PATH ') + (i+1) + '</span><span class="lane-stake">00</span><span class="lane-hit">—</span></button>').join('');
  betControls = window.bindBetControls({
    buttons:$$('.pay-button'), canBet:() => !busy() && !$('#infoDialog').open,
    increment: i => {
      if (counts[i] >= 9999) return false;
      const ctx = context(); if (!ctx) return false;
      if (balance() !== null && total()+ctx.unit > balance()) return false;
      counts[i]++; focusLane=i; sound('bet'); renderNumbers(); renderPaths(); return true;
    }
  });
}
function applyLocale() {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'; document.title=t('title')+' · Chain Jam';
  $$('[data-i18n]').forEach(node => { node.textContent=t(node.dataset.i18n); });
  $('#languageButton').textContent=locale==='zh'?'中文⌄':'English⌄'; $('#rulesButton').setAttribute('aria-label',t('rulesTitle'));
  $('#gardenBoard').setAttribute('aria-label',t('garden'));
  renderBets(); renderNumbers(); renderPaths(); status(statusKey,statusVars,Boolean(errorText));
}
async function animate(result, round, preview = false) {
  stage='animating'; renderNumbers(); clearBoard(); renderPaths(round);
  for (let season=0;season<3;season++) {
    if (!preview) status('pending');
    for (let tick=0;tick<(reducedMotion?0:10);tick++) {
      paintSeason(season,(tick+season*2)&7,false); sound('tick',{index:tick,progress:tick/10}); await pause(45+tick*4);
    }
    paintSeason(season,result.winds[season],true); sound('stop'); status('wind',{season:season+1,node:result.winds[season]+1}); await pause(250);
  }
  status('reveal');
  for (let lane=0;lane<8;lane++) {
    const button=$$('.pay-button')[lane];
    button.querySelector('.lane-hit').textContent=t('hits',{n:result.hits[lane]});
    button.classList.toggle('winner',round.stakes[lane]>0n && G.payoutFor(round.mode,result.hits[lane],round.stakes[lane])>0n);
    if (round.stakes[lane] === 0n) continue;
    result.paths[lane].forEach(point => {
      if (point.lit) $('.garden-node[data-season="'+point.season+'"][data-node="'+point.node+'"]').classList.add('trace');
    });
    sound('reveal'); await pause(130);
  }
  await pause(400);
}
function appendHistory(result, ctx) {
  history.unshift({payout:result.payout,ctx}); history=history.slice(0,8);
  $('#historyStrip').innerHTML=history.map(r=>'<i class="'+(r.payout>0n?'win':'')+'">'+format(r.payout,r.ctx)+'</i>').join('');
}
function showOutcome(result, round) {
  lastResult=result; lastRound=round; prize=result.payout; renderPaths(round);
  const paying=result.hits.filter((n,i)=>round.stakes[i]>0n && G.payoutFor(round.mode,n,round.stakes[i])>0n).length;
  $('#winSummary').textContent=total(round.stakes)>0n?'×'+(Number(result.payout*100n/total(round.stakes))/100).toFixed(2):'—';
  status(result.payout>0n?'won':'lost',{amount:format(result.payout,round.ctx),count:paying});
  sound(result.payout>0n?'win':'lose',{multiplier:Number(result.payout)/Number(total(round.stakes))});
  appendHistory(result,round.ctx);
}
function randomWind() { const buffer=new Uint8Array(1); crypto.getRandomValues(buffer); return buffer[0]&7; }
async function runDemo() {
  const round={stakes:currentStakes(),mode,layout,ctx:context()};
  demoBalance-=total(round.stakes); prize=0n;
  const result=G.resolve(G.randomWinds(randomWind),round.stakes,round.mode,round.layout);
  await animate(result,round); showOutcome(result,round); stage='idle'; renderNumbers();
}
function storageKey() { return 'graft.pending:'+snapshot?.integration?.chainId+':'+snapshot?.integration?.gameAddress+':'+snapshot?.wallet?.address; }
function savePending(round) { try { if(round) sessionStorage.setItem(storageKey(),JSON.stringify({...round,stakes:round.stakes.map(String),ctx:undefined})); else sessionStorage.removeItem(storageKey()); } catch {} }
function rowRound(row) {
  const data=bridge.decodeGameData(row.raw?.gameData);
  if(!data) throw new Error(t('errorResult'));
  return {key:row.sessionKey,sessionId:row.sessionId,mode:data.mode===1?'bloom':'harvest',layout:data.layoutId===1?'graft':'trellis',stakes:data.stakes.map(BigInt),ctx:context()};
}
async function consumeSettlement(settled, round) {
  const row=settled.row, phase=row.phase ?? settled.phase;
  if(phase===4 || phase===5) {
    handled.add(round.key); savePending(null); activeRound=null; stage='idle'; prize=0n;
    status(phase===5?'roundCancelled':'roundForfeited'); renderNumbers(); return;
  }
  if (round.restoreFromHost) {
    // Recovery starts by session key, before historical rows necessarily
    // contain gameData. Only the settled host row supplies the restored bet.
    Object.assign(round, rowRound(row), {restoreFromHost:false});
    savePending(round);
  }
  const outcome=settled.outcome;
  if(phase!==3 || !outcome || outcome.pending || !/^\d+$/.test(row.payout || '') ||
    outcome.mode!==(round.mode==='bloom'?1:0) || outcome.layoutId!==(round.layout==='graft'?1:0)) throw new Error(t('errorResult'));
  const result=G.resolve(outcome.seasons,round.stakes,round.mode,round.layout);
  if(outcome.hits.some((h,i)=>h!==result.hits[i]) || result.payout!==BigInt(row.payout)) throw new Error(t('errorResult'));
  lastRow=row;
  if (!round.presented) {
    await animate(result,round); showOutcome(result,round); round.presented=true;
  }
  // Host keeps payout hidden until this call; it must follow the entire reveal.
  // A failed display release remains retryable; do not silently strand the
  // host's withheld payout or clear the recovery key before acknowledgement.
  await bridge.revealOutcome(row.sessionId);
  handled.add(round.key); savePending(null); activeRound=null; stage='idle'; renderNumbers();
}
async function waitForRound(round) {
  const version=++waitVersion;
  try {
    const settled=await bridge.waitForSettlement(round.key,120000);
    if(version!==waitVersion) return;
    round.sessionId=settled.row.sessionId; await consumeSettlement(settled,round);
  } catch(error) {
    if(version!==waitVersion) return;
    stage='waiting-retry'; status('waitingLong',{},true); renderNumbers();
    console.warn('Graft settlement sync:',error.message);
  }
}
async function runHost() {
  const round={stakes:currentStakes(),mode,layout,ctx:context()};
  stage='opening'; status('opening'); renderNumbers();
  try {
    const opened=await bridge.openSession({wager:total(round.stakes).toString(),stakes:round.stakes,mode:round.mode==='bloom'?1:0,layoutId:round.layout==='graft'?1:0});
    round.key=opened.sessionKey; activeRound=round; savePending(round); stage='waiting'; status('pending'); renderNumbers();
    await waitForRound(round);
  } catch(error) {
    // No local debit or refund in host mode. The host is always authoritative.
    stage='idle'; reportHostError(error); renderNumbers();
    recoverSnapshot();
  }
}
function recoverSnapshot() {
  if(!hosted || !snapshot || !bridge || busy() || activeRound || recovering || readyReason()) return;
  recovering=true;
  try {
    let saved=null; try { saved=JSON.parse(sessionStorage.getItem(storageKey()) || 'null'); } catch {}
    const rows=(snapshot.sessions?.items || []).filter(r=>r.gameAddress?.toLowerCase()===snapshot.integration.gameAddress.toLowerCase() && !handled.has(r.sessionKey));
    if (typeof saved?.key === 'string' && saved.key && !handled.has(saved.key)) {
      // Lock immediately while the host replays its history. Never replace
      // this exact pending key with a different, partially replayed old round.
      const round = {key:saved.key, sessionId:saved.sessionId, restoreFromHost:true, ctx:context()};
      activeRound=round; stage='waiting'; status('restored'); renderNumbers();
      void waitForRound(round);
      return;
    }
    const row=rows.find(r=>(r.phase===1 || r.phase===2) && bridge.decodeGameData(r.raw?.gameData));
    if(!row) return;
    const round=rowRound(row); activeRound=round; savePending(round); stage='waiting'; status('restored'); renderNumbers(); void waitForRound(round);
  } catch(error) { reportHostError(error); }
  finally { recovering=false; }
}
function receiveSnapshot(value) {
  snapshot=value;
  if(lastRow) lastRow=value?.sessions?.items?.find(r=>r.sessionKey===lastRow.sessionKey) || lastRow;
  if(activeRound) {
    const row=value?.sessions?.items?.find(r=>r.sessionKey===activeRound.key);
    if(row) activeRound.sessionId=row.sessionId;
  }
  recoverSnapshot(); renderNumbers();
}
async function start() {
  if(busy()) return;
  sound('unlock');
  if(prize>0n) {
    if(!hosted) demoBalance+=prize;
    prize=0n; sound('transfer','toWealth'); status(hosted?'settled':'collected'); renderNumbers(); return;
  }
  const reason=betReason(); if(reason) return toast(reason);
  sound('start');
  if(hosted) await runHost(); else await runDemo();
}
async function preview() {
  if(busy()) return;
  const round={stakes:currentStakes(),mode,layout,ctx:context()};
  const result=G.resolve(G.randomWinds(randomWind),round.stakes,mode,layout);
  status('previewing'); sound('unlock'); await animate(result,round,true);
  stage='idle'; status('previewDone'); renderNumbers();
}
function showDialog(title) { betControls?.cancel(); $('#dialogTitle').textContent=title; $('#dialogBody').replaceChildren(); $('#infoDialog').showModal(); }
function paragraph(text) { const p=document.createElement('p'); p.textContent=text; $('#dialogBody').append(p); }
function showRules() {
  showDialog(t('rulesTitle')); paragraph(t('rules')); paragraph(t('rules2'));
  const table=document.createElement('table');
  table.innerHTML='<thead><tr><th>'+t('ruleHit')+'</th><th>'+t('ruleChance')+'</th><th>'+t('harvest')+'</th><th>'+t('bloom')+'</th></tr></thead><tbody>'+[
    ['0','12.5%','—','—'],['1','37.5%','—','—'],['2','37.5%','×1.52','—'],['3','12.5%','×3.20','×7.76']
  ].map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody>';
  $('#dialogBody').append(table); paragraph(t('rules3')); paragraph(t('rules4'));
}
async function showVerification() {
  showDialog(t('verify'));
  if(!lastResult) return paragraph(t('noResult'));
  const details={mode:lastRound.mode,layout:lastRound.layout,winds:lastResult.winds.map(n=>n+1),hits:lastResult.hits,stakes:lastRound.stakes.map(String),payout:lastResult.payout.toString(),decimals:lastRound.ctx?.decimals,theoreticalRtp:'97%',source:lastRow?'contract':'standalone demo'};
  if(lastRow) Object.assign(details,{sessionId:lastRow.sessionId,sessionKey:lastRow.sessionKey,openTransactionHash:lastRow.raw?.openTransactionHash,settleTransactionHash:lastRow.raw?.settleTransactionHash,randomness:lastRow.raw?.randomness,randomnessRequests:lastRow.raw?.randomnessRequests});
  if(lastRow && bridge?.getHostApi()?.getRandomnessVerification) {
    try {
      const verification=await bridge.getHostApi().getRandomnessVerification({sessionId:lastRow.sessionId});
      paragraph(t(!verification.supported?'noVrf':verification.requests?.length && verification.requests.every(r=>r.valid)?'verified':'unverified'));
      details.verification=verification;
    } catch(error) { paragraph(t('failed',{error:hostErrorMessage(error)})); }
  } else paragraph(t(lastRow?'verifyUnavailable':'standalone'));
  const pre=document.createElement('pre'); pre.textContent=JSON.stringify(details,null,2); $('#dialogBody').append(pre);
}
$('#startButton').addEventListener('click',()=>{ void start().catch(error=>{ stage='idle';reportHostError(error);renderNumbers(); }); });
$('#previewButton').addEventListener('click',()=>{void preview();});
$('#clearBetsButton').addEventListener('click',()=>{ if(busy())return; betControls.cancel();counts.fill(0);renderNumbers();renderPaths();sound('click');toast('cleared'); });
$('#harvestButton').addEventListener('click',()=>{if(!busy()){mode='harvest';renderNumbers();renderPaths();}});
$('#bloomButton').addEventListener('click',()=>{if(!busy()){mode='bloom';renderNumbers();renderPaths();}});
$('#layoutButton').addEventListener('click',()=>{if(!busy()){layout=layout==='trellis'?'graft':'trellis';clearBoard();renderNumbers();renderPaths();}});
$('#rulesButton').addEventListener('click',showRules); $('#verifyButton').addEventListener('click',()=>{void showVerification();});
$('#soundButton').addEventListener('click',()=>{ const audio=window.FruitAudio;if(audio){audio.setMuted(!audio.getState().muted);sound('click');renderNumbers();}});
$('#retryButton').addEventListener('click',()=>{if(activeRound && stage==='waiting-retry'){stage='waiting';status('pending');renderNumbers();void waitForRound(activeRound);}});
$('#cancelButton').addEventListener('click',async()=>{
  if(!activeRound?.sessionId || stage!=='waiting-retry')return;
  $('#cancelButton').disabled=true;
  try {await bridge.cancelStuckRandomness(activeRound.sessionId);stage='waiting';status('pending');void waitForRound(activeRound);}
  catch(error){reportHostError(error);} renderNumbers();
});
$('#languageButton').addEventListener('click',()=>{const menu=$('#languageMenu');menu.hidden=!menu.hidden;$('#languageButton').setAttribute('aria-expanded',String(!menu.hidden));});
$$('[data-locale]').forEach(button=>button.addEventListener('click',()=>{
  locale=button.dataset.locale;try{localStorage.setItem('graft.locale',locale);}catch{}
  $('#languageMenu').hidden=true;$('#languageButton').setAttribute('aria-expanded','false');applyLocale();
}));
document.addEventListener('click',event=>{if(!event.target.closest('#languagePicker')){$('#languageMenu').hidden=true;$('#languageButton').setAttribute('aria-expanded','false');}});
$('#closeDialog').addEventListener('click',()=>$('#infoDialog').close());
$('#infoDialog').addEventListener('click',event=>{if(event.target===$('#infoDialog'))$('#infoDialog').close();});
document.addEventListener('keydown',event=>{if(event.code==='Space' && !event.repeat && !$('#infoDialog').open && !event.target.closest('button,input,textarea,select')){event.preventDefault();void start();}});
renderBoard(); applyLocale();
bridge=window.FruitCasinoBridge.create({onSnapshot:receiveSnapshot,onReady:()=>{recoverSnapshot();renderNumbers();},onError:error=>{reportHostError(error);renderNumbers();}});
