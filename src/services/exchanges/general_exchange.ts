import { Exchange } from 'models/exchange.model';
import { Page } from 'puppeteer-core';
import { IExchangePrice } from './response';

// export interface ExchangeProperties {
// 	url: string;
// 	name: string;
// 	waitQuery: string;
// 	buyQuery: string;
// 	sellQuery: string;
// }

export async function getExchangeData(
	page: Page,
	exchange: Exchange
): Promise<IExchangePrice> {
	await page.goto(exchange.url, {
		waitUntil: 'networkidle0',
	});
	await page.waitForSelector(exchange.waitQuery);
	await page.waitForTimeout(2000)
	// await new Promise(r => setTimeout(r, 4000));

	const prices = await page.evaluate((exchange) => {
		const buy =
			document.querySelector(exchange.buyQuery)?.textContent?.trim() ??
			'0.00';
		const sell =
			document.querySelector(exchange.sellQuery)?.textContent?.trim() ??
			'0.00';

		return { buy, sell };
	}, exchange);

	return { name: exchange.name, prices };
}
