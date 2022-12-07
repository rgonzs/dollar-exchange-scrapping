import { DataSource } from 'typeorm';
import { Price } from '../../models/price.model';
import { Exchange } from '../../models/exchange.model';

export const AppDatasource = new DataSource({
	type: 'postgres',
	host: process.env.PGHOST,
	port: Number(process.env.PGPORT) ?? 5432,
	username: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	database: process.env.PGDATABASE,
	entities: [Price, Exchange],
});
