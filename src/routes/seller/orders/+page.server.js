import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const seller = await db
		.select()
		.from(schema.seller)
		.where(eq(schema.seller.userId, locals.user.id))
		.limit(1);

	if (!seller.length) {
		throw redirect(302, '/seller/setup');
	}

	const orders = await db
		.select({
			id: schema.order.id,
			date: schema.order.date,
			status: schema.order.status,
			totalAmount: schema.order.totalAmount,
			customer: {
				id: schema.customer.id,
				user: {
					id: schema.user.id,
					email: schema.user.email
				}
			}
		})
		.from(schema.order)
		.innerJoin(schema.orderDetail, eq(schema.orderDetail.orderId, schema.order.id))
		.innerJoin(schema.orderDetailProduct, eq(schema.orderDetailProduct.orderDetailsId, schema.orderDetail.id))
		.innerJoin(schema.product, eq(schema.orderDetailProduct.productId, schema.product.id))
		.innerJoin(schema.customer, eq(schema.order.customerId, schema.customer.id))
		.innerJoin(schema.user, eq(schema.customer.userId, schema.user.id))
		.where(eq(schema.product.sellerId, seller[0].id))
		.orderBy(desc(schema.order.date));

	return { orders };
};
