import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chrome-aws-lambda';

async function getBrowser() {
	const isAws = process.env.IS_AWS;
	let browser: puppeteer.Browser;
	if (isAws) {
		browser = await chromium.puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		});
	} else {
		browser = await puppeteer.launch({
			headless: false,
			executablePath:
				'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		});
	}
	return browser;
}

export { getBrowser };
