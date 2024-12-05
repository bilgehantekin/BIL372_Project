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

	if (!customer.length) {
		throw redirect(302, '/auth/login');
	}

	const recentOrders = await db
		.select()
		.from(schema.order)
		.where(eq(schema.order.customerId, customer[0].id))
		.orderBy(desc(schema.order.date))
		.limit(5);

	const addresses = await db
		.select({
			id: schema.address.id,
			description: schema.address.description,
			district: {
				name: schema.district.name,
				city: {
					name: schema.city.name,
					country: {
						name: schema.country.name
					}
				}
			}
		})
		.from(schema.address)
		.innerJoin(schema.district, eq(schema.address.districtId, schema.district.id))
		.innerJoin(schema.city, eq(schema.district.cityId, schema.city.id))
		.innerJoin(schema.country, eq(schema.city.countryId, schema.country.id))
		.where(eq(schema.address.userId, locals.user.id));

	return {
		recentOrders,
		addresses
	};
};