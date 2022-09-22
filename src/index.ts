import { getBrowser } from './services/browser/browser';

import {
	ExchangeProperties,
	getExchangeData,
} from './services/exchanges/general_exchange';

import { AppDatasource } from './services/db/db';
import { Price } from './models/price.model';

const main = async (event: any, context: any, callback: any) => {
	const browser = await getBrowser();

	try {
		await AppDatasource.initialize();
		console.log('Base de datos conectada');
	} catch (error) {
		console.error('Error al conectar a bd');
		console.error(error);
		process.exit(1);
	}

	const priceRepository = AppDatasource.getRepository(Price);

	const exchanges: ExchangeProperties[] = [
		{
			url: 'https://kambista.com/',
			name: 'kambista',
			waitQuery: '.km_calc-encabezado',
			buyQuery: '#valcompra',
			sellQuery: '#valventa',
		},
		{
			url: 'https://www.rextie.com/',
			name: 'rextie',
			waitQuery: '.amount',
			buyQuery: '.price.buy.ng-tns-c15-0 > .amount',
			sellQuery: '.price.sell.ng-tns-c15-0 > .amount',
		},
		{
			url: 'https://app.dollarhouse.pe/calculadora',
			name: 'dollar_house',
			waitQuery: '#mainContent',
			buyQuery: 'span#buy-exchange-rate',
			sellQuery: 'span#sell-exchange-rate',
		},
		{
			url: 'https://tkambio.com/',
			name: 'tkambio',
			waitQuery: '.block-exchange-rates',
			buyQuery:
				'.exchange-rate.purcharse-content.c-grey-400.flex-grow-1.flex-column.align-items-center .price',
			sellQuery:
				'.exchange-rate.sale-content.active.c-grey-400.flex-grow-1.flex-column.align-items-center .price',
		},
	];

	for (const exchange of exchanges) {
		const page = await browser.newPage();
		const data = await getExchangeData(page, exchange);
		console.log('Cargando datos de ' + exchange.name);

		let { buy, sell } = data.prices;

		if (buy.toUpperCase().includes('S')) {
			buy = buy.split(' ')[1];
		}

		if (sell.toUpperCase().includes('S')) {
			sell = sell.split(' ')[1];
		}

		await priceRepository.upsert(
			{
				name: data.name,
				buyPrice: +buy,
				sellPrice: +sell,
			},
			{
				skipUpdateIfNoValuesChanged: true,
				conflictPaths: ['name'],
			}
		);
		await page.close();
	}
	browser.close();
	return callback(null, 'ok');
};

exports.handler = main;
