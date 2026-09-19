# Chain Jam 提交交接 · Graft Garden

本文件准备可复核的提交材料。尚未向 Chain Jam 提交表单，也没有获得主办方审核通过。官方依据：[Chain Jam 参赛与提交页面](https://jam.chain.wtf/#submit)，核对日期：2026-09-19。

## 可用于提交的内容

| 表单字段 | 内容 / 状态 |
| --- | --- |
| Game title | **Graft Garden / 嫁接果园** |
| Game URL | 待部署到用户控制的公开地址；`http://localhost:4199/` 仅供本地测试 |
| Declared RTP | **97%** |
| Discord | 待填写用户的真实联系方式（官方必填） |
| X / Telegram | 可选，由用户提供 |
| Source access | [公开 GitHub 仓库](https://github.com/LuckyYouStudio/graft-garden) |
| Pitch / info | 下方英文提案可直接采用或编辑 |

**English pitch**

Graft Garden is a three-season orchard wager game. Place stakes on up to eight fruit paths, then choose a Trellis or Graft arrangement. Three independent wind reveals each light four of eight seasonal nodes. A path's return depends on how many of its three nodes bloom. Harvest pays 1.52× for two hits and 3.20× for three; Bloom pays 7.76× for three hits only. Both modes return exactly 97% in expectation for every permitted stake allocation. The arrangement changes how paths win together, creating a visible choice of exposure without changing their expected return. The static page includes a standalone demo; embedded play uses the Chain casino SDK and the GraftGardenGame contract for authoritative settlement.

中文玩法说明：玩家先分配八条果枝路径的下注，再选择格架或嫁接布局。三季风向依次点亮节点，路径贯穿三季后的命中数决定返还。相较最初的水果机原型，当前参赛机制已改为三季路径结算，不包含传统停格开奖、Lucky 送灯或猜大小。

## 可复核的 RTP

每季共有八个等概率风向，其中四个会点亮一条给定路径的节点，所以单季命中概率为 `1/2`。三季独立，单路径命中数的概率为：

| 命中数 | 概率 | Harvest 总返还倍率 | Bloom 总返还倍率 |
| --- | ---: | ---: | ---: |
| 0 | 1/8 | 0 | 0 |
| 1 | 3/8 | 0 | 0 |
| 2 | 3/8 | 38/25 = 1.52× | 0 |
| 3 | 1/8 | 80/25 = 3.20× | 194/25 = 7.76× |

- Harvest：`(3/8 × 38/25) + (1/8 × 80/25) = 97%`。
- Bloom：`1/8 × 194/25 = 97%`。
- 任意合法路径下注之和，由期望的线性性质保持 97%。布局改变路径之间的相关性，不改变这一结论。
- 每条下注须为 `25` token 最小单位的整数倍，使每个结果的返还均为整数，没有逐次向下取整造成的 RTP 偏移。界面使用整数金额单位。

RTP 是理论平均返还，不是单局中奖概率，也不承诺某次或有限次数试玩的实际回报。完整奖表在 `GraftGardenGame.sol`，独立枚举模型在 `scripts/graft-math.cjs`。

## 本地核验入口

独立试玩（仓库根目录）：

```powershell
python scripts/serve-game.py
```

另开终端启动官方 SDK 模拟器：

```powershell
cd casino-sdk/casino-sdk
npm install
npm start
```

打开 [本地模拟器](http://localhost:3300/)，在设置中选择 `GraftGardenGame`，游戏地址填 `http://localhost:4199/`。具体 ABI、验证命令与文件职责见 `fruit-machine-ui/README.md`。旧水果机合约与文档不代表参赛奖表。

开发服务器允许模拟器跨域读取清单。正式托管也必须给 `game.manifest.json` 提供 `Access-Control-Allow-Origin: *`；已附 Netlify / Cloudflare Pages 的 `_headers` 和 Vercel 的 `vercel.json`。不要添加阻止 iframe 嵌入的 `X-Frame-Options`。

合约与真实本地会话验证命令（保持 SDK 本地栈运行）：

```powershell
cd casino-sdk/casino-sdk/simulator
node scripts/verify-graft.mjs
```

2026-09-19 已通过合约全结果验证、风险报价与非法输入检查，以及四次经本地 Host + Verify Network VRF 完成的会话和代币账目核对。机器可读记录为 `reference-analysis/GRAFT_CONTRACT_VERIFICATION.json`。这是本地测试，不是正式链部署或主办方审核。

前端模型通过 `node scripts/graft-engine.test.cjs` 的 6,144 个结果校验，以 BigInt 验证严格 97% 期望。独立试玩浏览器已验证零初始下注、长按/松开/清除、精确 `1.52`、`3.20` 与 `7.76` 返还、收奖和 `390px` 英文布局。

完整官方模拟器浏览器联调亦已通过，两局真实会话（会话号见报告）覆盖清单与 Penpal 接线、合约权威返还、动画后揭晓余额、原始结果展示、钱包断开限制，以及 iframe 重载后恢复会话而不重复下注。报告：`reference-analysis/GRAFT_BROWSER_VERIFICATION.json`。重跑命令为仓库根目录下的 `node scripts/graft-browser.test.cjs`；Playwright 运行路径可通过 `PLAYWRIGHT_MODULE` / `CHROMIUM_PATH` 设置。

可选 VRF 证明查询依赖索引数据，在数据未到达时可能失败，界面会如实报告。显示原始结果不代表密码学证明已验证；合约测试中的四次实际 VRF 会话与浏览器的可选证明查询是两项独立检查。

## 对照官方要求

| 要求 | 项目材料 / 交付前检查 |
| --- | --- |
| SDK 合约、通信和清单 | `GraftGardenGame.sol`、`sdk-bridge.js`、`game.manifest.json`；合约与完整 Host 浏览器联调已通过本地验证，记录见两份验证报告 |
| 可快速加载的完整游戏 | 静态前端；公开部署后检查资源加载及移动端展示 |
| RTP 93–98%，实际奖表一致 | 声明 97%；上方解析证明及 512 结果独立枚举 |
| 有下注、随机结果和返还 | 路径下注 → 三季风向 → 命中数结算 |
| 公开 URL 可独立试玩 | 本地独立试玩入口已提供；公开托管待完成 |
| 新概念 | 三季风向与嫁接路径是本项目的参赛提案；原创性是否合格由评审认定 |
| Jam widget | `index.html` 包含官方 widget 脚本；部署后检查该标签存在且资源可访问 |
| 源码与正式表单 | 源码已在 [GitHub](https://github.com/LuckyYouStudio/graft-garden) 公开；真实联系方式与表单提交待完成 |

## 尚待完成的外部步骤

1. 将 `fruit-machine-ui` 静态目录部署到用户控制的公开 HTTPS 地址，保持根路径清单和所有本地资源可访问。
2. 在公开地址验证独立试玩、手机布局、英文/中文和 iframe 嵌入；确认 Jam widget 正常加载。
3. 源码已在 [GitHub](https://github.com/LuckyYouStudio/graft-garden) 公开，包含前端、合约、数学验证、SDK 与运行说明；报名时将此地址填入 Source access。
4. 填写真实 Discord 联系方式和源码地址，在官方表单提交。是否对接正式链、上架或获得奖项仍需主办方后续流程。

源码已公开；这不表示已公开托管游戏、已提交报名或已通过审核。
