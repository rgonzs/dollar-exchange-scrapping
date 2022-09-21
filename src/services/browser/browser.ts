import puppeteer from 'puppeteer-core';

async function getBrowser() {
	const browser = await puppeteer.launch({
		headless: false,
		executablePath:
			'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	});
	return browser;
}

export { getBrowser };
