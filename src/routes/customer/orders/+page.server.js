import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const customer = await db
		.select()
		.from(schema.customer)
		.where(eq(schema.customer.userId, locals.user.id))
		.limit(1);

	const orders = await db
		.select()
		.from(schema.order)
		.where(eq(schema.order.customerId, customer[0].id))
		.orderBy(desc(schema.order.date));

	return { orders };
};