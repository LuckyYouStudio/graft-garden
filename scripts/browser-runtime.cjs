// Install Playwright normally, or point PLAYWRIGHT_MODULE at an existing install.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const launchOptions = { headless: true };
if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
module.exports = { chromium, launchOptions };
