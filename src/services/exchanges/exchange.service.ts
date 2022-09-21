import { IExchangePrice } from './response';
import { Page } from 'puppeteer-core';

export interface ExchangeService {
	getData(page: Page): Promise<IExchangePrice>;
}
