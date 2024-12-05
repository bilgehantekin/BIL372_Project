import { redirect } from '@sveltejs/kit';
import { eq, and, lte, desc, sql } from 'drizzle-orm';
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

	const recentOrders = await db
		.select({
			id: schema.orderDetailProduct.id,
			order: {
				id: schema.order.id,
				date: schema.order.date,
				status: schema.order.status
			},
			product: {
				id: schema.product.id,
				name: schema.product.name
			},
			quantity: schema.orderDetailProduct.quantity,
			amount: schema.orderDetail.amount
		})
		.from(schema.product)
		.innerJoin(schema.orderDetailProduct, eq(schema.orderDetailProduct.productId, schema.product.id))
		.innerJoin(schema.orderDetail, eq(schema.orderDetailProduct.orderDetailsId, schema.orderDetail.id))
		.innerJoin(schema.order, eq(schema.orderDetail.orderId, schema.order.id))
		.where(eq(schema.product.sellerId, seller[0].id))
		.orderBy(desc(schema.order.date))
		.limit(5);

	const productCount = await db
		.select({ count: sql`count(*)` })
		.from(schema.product)
		.where(eq(schema.product.sellerId, seller[0].id));

	const lowStockCount = await db
		.select({ count: sql`count(*)` })
		.from(schema.product)
		.where(and(
			eq(schema.product.sellerId, seller[0].id),
			lte(schema.product.stock, 5)
		));

	return {
		recentOrders,
		productCount: productCount[0].count,
		lowStockCount: lowStockCount[0].count
	};
};