import { getBrowser } from './services/browser/browser';

import { getExchangeData } from './services/exchanges/general_exchange';
// ExchangeProperties,

import { AppDatasource } from './services/db/db';

import { Price } from './models/price.model';
import { Exchange } from './models/exchange.model';

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

	const exchangeRepository = AppDatasource.getRepository(Exchange);
	const priceRepository = AppDatasource.getRepository(Price);

	const exchanges = await exchangeRepository.find({});
	// const exchanges: ExchangeProperties[] = [
	// 	{
	// 		url: 'https://kambista.com/',
	// 		name: 'kambista',
	// 		waitQuery: '.km_calc-encabezado',
	// 		buyQuery: '#valcompra',
	// 		sellQuery: '#valventa',
	// 	}
	// ];

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
		console.table({ buy, sell });

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
	await browser.close();
	return callback(null, 'ok');
};
// main(null,null,console.log)
exports.handler = main;
