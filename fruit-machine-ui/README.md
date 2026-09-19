# 嫁接果园 · Graft Garden

[English project guide](../README.md) · [中文项目说明](../README.zh-CN.md)

[公开试玩](https://graft-garden.vercel.app) · [源码仓库](https://github.com/LuckyYouStudio/graft-garden)

Graft Garden 是为 Chain Jam 改造的三季果园游戏。玩家给八条果枝路径分配下注，选择收成模式和嫁接布局，随后揭晓三次风向并按路径命中数结算。参赛版本使用这一套玩法；此前经典水果机的停格、Lucky 送灯及猜大小不属于当前奖表。

## 玩法与 97% RTP

一局有三个季节，每季八个节点。每季风向独立且均匀地取 `0…7`，点亮从该风向开始的四个相邻节点。每条果枝路径在每季各经过一个节点，最终累计 `0…3` 次命中。

两种布局都保留八条路径。格架（Trellis）让一条路径在三季使用相同编号；嫁接（Graft）会重新连接第二、三季的节点。布局改变多条下注之间的相关性，不改变单条路径的命中概率或理论 RTP。

| 路径命中数 | 概率 | 稳态收成 / Harvest | 共振绽放 / Bloom |
| --- | ---: | ---: | ---: |
| 0 | 12.5% | 0 | 0 |
| 1 | 37.5% | 0 | 0 |
| 2 | 37.5% | 1.52 × 本路径下注 | 0 |
| 3 | 12.5% | 3.20 × 本路径下注 | 7.76 × 本路径下注 |

倍率为总返还，包含本金。逐路径期望分别为 `0.375 × 1.52 + 0.125 × 3.20 = 0.97` 和 `0.125 × 7.76 = 0.97`。因此，两种模式、两种布局及任意合法下注分配的理论 RTP 都为 **97%**。它是长期期望返还比例，不是单局中奖率；多路径总返还也不一定高于该局总下注。

为保持奖表精确，合约要求每条下注为 `25` 个 token 最小单位的整数倍。前端金额以整数单位处理，避免浮点计算改变实际返奖率。未使用的路径下注为零。

## 本地独立试玩

余额标题统一为「余额 / Balance」。独立试玩每次加载初始提供 1,000,000 虚拟积分，参照 SDK 模拟器的默认测试额度；这不是 Jam 规定的固定金额。SDK 模式严格读取 `HostSnapshotV1.balances.smartVaultBalance`，由主机决定可用余额。

前端是静态文件，无需构建。在仓库根目录运行：

```powershell
python scripts/serve-game.py
```

打开 [http://localhost:4199/](http://localhost:4199/)。直接打开 URL 时运行独立试玩，余额与开奖均为模拟数据。中文、英文均可使用。该开发服务器提供 CORS 响应头，使官方模拟器可以跨域读取清单；普通 `python -m http.server` 没有这一配置，不适合直接替代进行 SDK 联调。

静态托管应上传整个 `fruit-machine-ui` 目录，并保留同源根路径下的 `game.manifest.json`。项目已提供 Netlify / Cloudflare Pages 使用的 `_headers` 和 Vercel 使用的 `vercel.json`：清单响应应包含 `Access-Control-Allow-Origin: *`。其他平台应配置等效响应头。

`index.html` 包含 Jam 要求的脚本：

```html
<script async src="https://jam.chain.wtf/widget.js"></script>
```

不要添加阻止 iframe 嵌入的 `X-Frame-Options` 或不兼容的 CSP `frame-ancestors`；实际部署后仍需验证公开 URL、响应头、资源路径和 iframe 行为。

## Chain SDK 本地联调

另开一个终端，从仓库根目录进入本地 SDK 工作区：

```powershell
cd casino-sdk/casino-sdk
npm install
npm start
```

SDK 启动本地链、VRF 节点与 [http://localhost:3300/](http://localhost:3300/) 模拟器。保持前端的 `4199` 服务运行，在模拟器设置面板选择 `GraftGardenGame`，将游戏 URL 设为 `http://localhost:4199/`。本地部署地址记录在 `casino-sdk/casino-sdk/simulator/local-node/deployed.json`；重启内存链后应重新读取，不要硬编码旧地址。模拟器使用测试代币，不是生产资金。

生产结算只接受 Host 的会话结果。前端提交下注，等待链上最终结果，展示三季动画后调用 `revealOutcome`。独立试玩的随机结果不可用来替代 Host 结果。

| 文件 | 职责 |
| --- | --- |
| `game.manifest.json` | SDK 清单，`gameId` 为 `GraftGardenGame` |
| `sdk-bridge.js` | Guest / Host 通信、ABI 编解码和会话生命周期 |
| `graft-engine.js` | 独立试玩模型、路径与奖表 |
| `app.js`、`index.html`、`styles.css` | 界面、三季揭晓及本地/Host 状态 |
| `audio.js` | 原创 WebAudio 音效 |
| `../casino-sdk/casino-sdk/simulator/contracts/GraftGardenGame.sol` | 实现 `ICasinoGameV2` 的结算合约 |
| `../scripts/graft-math.cjs` | 独立穷举 512 个风向组合，检查分布和期望 |

合约 ABI：

```solidity
// version = 1; mode: 0 Harvest / 1 Bloom; layout: 0 Trellis / 1 Graft.
gameData = abi.encode(uint8 version, uint8 mode, uint8 layout, uint256[8] stakes);
gameState = abi.encode(uint8 version, uint8 mode, uint8 layout,
                      uint8[3] seasons, uint8[8] hits);
```

`sum(stakes)` 必须等于 `wager`。等待随机数时，合约中的 `seasons` 和 `hits` 为 `255` 哨兵值，不能展示成已结算结果。`quoteCaps` 穷举 512 种结果以申报最大返还与准备金；两种模式都只请求一次随机数，不提供局内追加行动。

## 验证

从仓库根目录运行：

```powershell
node scripts/graft-math.cjs
node scripts/graft-engine.test.cjs
node fruit-machine-ui/sdk-bridge.test.cjs
node fruit-machine-ui/audio.test.cjs
node --check fruit-machine-ui/app.js
node --check fruit-machine-ui/graft-engine.js
npm --prefix casino-sdk/casino-sdk/simulator run compile-contracts
```

`graft-math.cjs` 独立枚举全部 `8³ = 512` 种风向，并检查单路径分布 `[64, 192, 192, 64]`。单路径、稀疏及多路径下注示例用于防止奖表或布局映射漂移。`graft-engine.test.cjs` 使用 BigInt 检查 6,144 个前端模型结果及严格 97% 期望，两项已通过。

本地独立试玩的浏览器验证已通过：初始八路下注为零、长按持续加注及松开停止、清除全部下注、精确 `1.52` / `3.20` / `7.76` 返还、收奖，以及英文界面在 `390px` 宽度的展示。

完整 Host 浏览器测试也已通过：官方模拟器通过清单和真实 Penpal 连接完成两局（会话号见报告）；钱包断开时不会降级为可下注的试玩；返还使用合约结果；动画后才执行 `revealOutcome`；可显示原始结果；iframe 重载恢复未完成会话，未重复下注。记录见 `../reference-analysis/GRAFT_BROWSER_VERIFICATION.json`。

保持前端和 SDK 本地栈运行，从仓库根目录可重新执行：

```powershell
node scripts/graft-browser.test.cjs
```

测试使用 Playwright；如运行环境不同，可用 `PLAYWRIGHT_MODULE` 和 `CHROMIUM_PATH` 环境变量指定模块及浏览器路径。可选的 `getRandomnessVerification` 在索引数据尚未到达时可能失败，界面会如实显示验证失败；原始结果展示不等于密码学证明已验证。

保持 SDK 本地栈运行，在 `casino-sdk/casino-sdk/simulator` 目录执行合约及真实本地会话验证：

```powershell
node scripts/verify-graft.mjs
```

2026-09-19 的合约验证已通过：编译产物与部署代码匹配、24,576 次位掩码/参考模型比较、2,048 个合约结果（512 种风向 × 四种模式/布局组合）、48 个风险报价案例、9 类非法输入，以及四次经本地 Host 和 Verify Network VRF 完成的会话及代币账目核对。报告保存在 `../reference-analysis/GRAFT_CONTRACT_VERIFICATION.json`。这些结果验证合约与本地结算链路，不代表公开部署或评审通过。

## 提交范围

参赛依据为 [Chain Jam 官方页面](https://jam.chain.wtf/#submit)，SDK依据为工作区内官方 SDK 文档。项目中的旧 `FruitTigerGame.sol`、`engine.js` 及历史水果机设计资料保留作开发参考，**不是 Graft Garden 的参赛合约或奖表**。

本地可运行不等于已提交。源码已公开到 [GitHub](https://github.com/LuckyYouStudio/graft-garden)；试玩已部署至 Vercel；提供 Discord 联系方式及填写官方表单仍需完成；参见仓库根目录 `JAM_SUBMISSION.md`。游戏是否满足原创性和最终参赛资格由主办方判断。
