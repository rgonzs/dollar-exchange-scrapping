import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'exchanges',
})
export class Exchange {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	name: string;

	@Column('text')
	url: string;

	@Column('text', {
		name: 'waitQuery',
	})
	waitQuery: string;

	@Column('text', {
		name: 'buyQuery',
	})
	buyQuery: string;

	@Column('text', {
		name: 'sellQuery',
	})
	sellQuery: string;
}
