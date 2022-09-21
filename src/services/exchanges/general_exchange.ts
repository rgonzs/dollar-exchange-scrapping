import { Page } from 'puppeteer-core';
import { IExchangePrice } from './response';

export interface ExchangeProperties {
	url: string;
	name: string;
	waitQuery: string;
	buyQuery: string;
	sellQuery: string;
}

export async function getExchangeData(
	page: Page,
	exchange: ExchangeProperties
): Promise<IExchangePrice> {
	await page.goto(exchange.url, {
		waitUntil: 'networkidle0',
	});
	await page.waitForSelector(exchange.waitQuery);

	const prices = await page.evaluate((exchange) => {
		const buy =
			document.querySelector(exchange.buyQuery)?.textContent?.trim() ??
			'no hay data';
		const sell =
			document.querySelector(exchange.sellQuery)?.textContent?.trim() ??
			'no hay data';

		return { buy, sell };
	}, exchange);

	return { name: exchange.name, prices };
}
