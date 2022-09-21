import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'prices',
})
export class Price {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	name: string;

	@Column('float', {
		name: 'buy_price',
	})
	buyPrice: number;

	@Column('float', {
		name: 'sell_price',
	})
	sellPrice: number;
}
