'use strict';
const G = window.GraftEngine;
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const hosted = window.parent !== window;
const fruit = ['🍒','🍇','🍐','🍉','🫐','🍋','🍊','🍎'];
const colors = ['#ff9da7','#c5a0f7','#d6e792','#82dfac','#92b6ee','#f4dd84','#f5b58c','#ec8dba'];
const I18N = window.GraftI18n;
const languageInfo = code => I18N.locales.find(item => item.code === code);
let chosenLocale = null;
try { chosenLocale = I18N.normalize(localStorage.getItem('graft.locale')); } catch {}
let locale = chosenLocale || (navigator.languages || [navigator.language]).map(I18N.normalize).find(Boolean) || 'en';
let hostLocaleApplied = false;
const t = (key, vars = {}) => I18N.t(locale, key, vars);
const counts = Array(8).fill(0);
let mode = 'harvest', layout = 'trellis', focusLane = 0;
// Standalone demo credits mirror the simulator's one-million test allowance.
// Jam specifies no fixed demo amount; hosted balances always come from Host.
const INITIAL_DEMO_BALANCE = 1_000_000n * 100n;
let demoBalance = INITIAL_DEMO_BALANCE, prize = 0n, stage = 'idle', snapshot = null, bridge = null;
let activeRound = null, lastRound = null, lastResult = null, lastRow = null, revealedSeasons = 0;
let betControls, history = [], statusKey = 'idle', statusVars = {}, errorText = '', waitVersion = 0, recovering = false;
let lastHostError = null;
const handled = new Set();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause = ms => new Promise(resolve => setTimeout(resolve, reducedMotion ? 1 : ms));
function sound(name, arg) { try { window.FruitAudio?.[name]?.(arg); } catch {} }
function syncViewport() {
  const hostHeight = snapshot?.ui?.viewport?.availableHeight;
  const available = Number.isFinite(hostHeight) && hostHeight > 0 ? hostHeight : window.innerHeight;
  document.documentElement.dataset.density = available < 740 ? 'compact' : 'comfortable';
  document.documentElement.dataset.shortViewport = available <= 520 ? 'true' : 'false';
  document.documentElement.style.setProperty('--game-available-height', Math.round(available) + 'px');
}
// Keep the official widget in the footer instead of adding another page row.
function positionJamBadge() {
  const badge = $('#chain-jam-badge'), slot = $('#jamBadgeSlot');
  if (!badge || !slot) return false;
  if (badge.parentElement !== slot) slot.appendChild(badge);
  return true;
}
function hostErrorMessage(error) { return window.GraftHostErrors.message(error, locale); }
function reportHostError(error) {
  lastHostError = error;
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
  const rtpText = (G.RTP_BPS / 100).toFixed(2) + '%';
  $$('[data-rtp-value]').forEach(node => { node.textContent = rtpText; });
  $$('[data-rtp-info]').forEach(node => {
    node.title = t('rtpTitle') + ': ' + rtpText;
    node.setAttribute('aria-label', node.title);
  });
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
  $('#layoutValue').textContent = t(layout); $('#layoutCaption').textContent = t(layout);
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
      cell.setAttribute('aria-label', fruit[lane] + ' · ' + (t('path') + ' ') + (lane + 1) + ' · ' + (t('node') + ' ') + (node + 1));
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
  $$('.lane-hit').forEach(node => { node.textContent='—'; delete node.dataset.hits; }); $$('.pay-button').forEach(node => node.classList.remove('winner'));
}
function renderBets() {
  betControls?.destroy();
  $('#payButtons').innerHTML = fruit.map((icon,i) => '<button class="pay-button" data-lane="' + i + '"><span class="fruit">' + icon + '</span><span class="lane-name">' + t('laneName',{n:i+1}) + '</span><span class="lane-stake">00</span><span class="lane-hit">—</span></button>').join('');
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
  document.documentElement.lang = languageInfo(locale).htmlLang;
  document.documentElement.dataset.language = locale;
  document.title=t('title')+' · Chain Jam';
  $$('[data-i18n]').forEach(node => { node.textContent=t(node.dataset.i18n); });
  $('#languageButton').textContent=languageInfo(locale).short+'⌄';
  $('#languageButton').title=languageInfo(locale).label;
  $('#languageButton').setAttribute('aria-label',t('language')+': '+languageInfo(locale).label);
  $('#languageMenu').setAttribute('aria-label',t('language'));
  $$('[data-locale]').forEach(button => button.setAttribute('aria-selected',String(button.dataset.locale===locale)));
  $('#rulesButton').setAttribute('aria-label',t('rulesTitle'));
  $('#closeDialog').setAttribute('aria-label',t('close'));
  $('.mode-picker').setAttribute('aria-label',t('modeChoice'));
  $('#gardenBoard').setAttribute('aria-label',t('garden'));
  if (!betControls) renderBets();
  $$('.pay-button').forEach((button,index) => {
    button.querySelector('.lane-name').textContent=t('laneName',{n:index+1});
    button.setAttribute('aria-label',fruit[index]+' '+t('laneName',{n:index+1}));
    const hit=button.querySelector('.lane-hit');
    if (hit.dataset.hits!==undefined) hit.textContent=t('hits',{n:hit.dataset.hits});
  });
  renderNumbers(); renderPaths();
  const variables=statusKey==='failed' && lastHostError ? {error:hostErrorMessage(lastHostError)} : statusVars;
  status(statusKey,variables,Boolean(errorText));
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
    button.querySelector('.lane-hit').dataset.hits=String(result.hits[lane]);
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
  if (!hostLocaleApplied && snapshot?.ui?.locale) {
    const hostLocale=I18N.normalize(snapshot.ui.locale);
    hostLocaleApplied=true;
    if (!chosenLocale && hostLocale && hostLocale!==locale) { locale=hostLocale; applyLocale(); }
  }
  syncViewport();
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
function toggleLanguageMenu(open, focus = false) {
  $('#languageMenu').hidden=!open;
  $('#languageButton').setAttribute('aria-expanded',String(open));
  if (focus) {
    if (open) $('#languageMenu [data-locale="'+locale+'"]').focus();
    else $('#languageButton').focus();
  }
}
$('#languageMenu').innerHTML=I18N.locales.map(item=>'<button type="button" role="option" data-locale="'+item.code+'" lang="'+item.htmlLang+'" tabindex="-1">'+item.label+'</button>').join('');
$('#languageButton').addEventListener('click',()=>toggleLanguageMenu($('#languageMenu').hidden,true));
$('#languageButton').addEventListener('keydown',event=>{
  if (event.key==='ArrowDown' || event.key==='ArrowUp') { event.preventDefault(); toggleLanguageMenu(true,true); }
});
$('#languageMenu').addEventListener('click',event=>{
  const button=event.target.closest('[data-locale]');
  if (!button || busy()) return;
  const selected=I18N.normalize(button.dataset.locale);
  if (!selected) return;
  locale=selected; chosenLocale=selected;
  try{localStorage.setItem('graft.locale',locale);}catch{}
  toggleLanguageMenu(false,true); applyLocale();
});
$('#languageMenu').addEventListener('keydown',event=>{
  if (event.key==='Escape') { event.preventDefault(); event.stopPropagation(); toggleLanguageMenu(false,true); return; }
  if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const options=$$('#languageMenu [data-locale]');
  const current=options.indexOf(document.activeElement);
  const next=event.key==='Home' ? 0 : event.key==='End' ? options.length-1 : (current+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
  options[next].focus();
});
document.addEventListener('click',event=>{if(!event.target.closest('#languagePicker'))toggleLanguageMenu(false);});
document.addEventListener('focusin',event=>{if(!event.target.closest('#languagePicker'))toggleLanguageMenu(false);});
$('#closeDialog').addEventListener('click',()=>$('#infoDialog').close());
$('#infoDialog').addEventListener('click',event=>{if(event.target===$('#infoDialog'))$('#infoDialog').close();});
document.addEventListener('keydown',event=>{if(event.code==='Space' && !event.repeat && !$('#infoDialog').open && !event.target.closest('button,input,textarea,select')){event.preventDefault();void start();}});
renderBoard(); applyLocale();
syncViewport();
window.addEventListener('resize', syncViewport);
if (!positionJamBadge()) {
  const badgeObserver = new MutationObserver(() => { if (positionJamBadge()) badgeObserver.disconnect(); });
  badgeObserver.observe(document.body, {childList:true});
}
bridge=window.FruitCasinoBridge.create({onSnapshot:receiveSnapshot,onReady:()=>{recoverSnapshot();renderNumbers();},onError:error=>{reportHostError(error);renderNumbers();}});
