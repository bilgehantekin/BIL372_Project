import { db } from '../index.js';
import * as schema from '../schema.js';

export async function seedPaymentMethods() {
	const existingMethods = await db.select().from(schema.paymentMethod);

	if (existingMethods.length === 0) {
		await db.insert(schema.paymentMethod).values([
			{
				id: crypto.randomUUID(),
				name: 'Credit Card'
			},
			{
				id: crypto.randomUUID(),
				name: 'Debit Card'
			},
			{
				id: crypto.randomUUID(),
				name: 'PayPal'
			},
			{
				id: crypto.randomUUID(),
				name: 'Bank Transfer'
			},
			{
				id: crypto.randomUUID(),
				name: 'Cash on Delivery'
			},
			{
				id: crypto.randomUUID(),
				name: 'Digital Wallet'
			}
		]);
	}

	return db.select().from(schema.paymentMethod);
}