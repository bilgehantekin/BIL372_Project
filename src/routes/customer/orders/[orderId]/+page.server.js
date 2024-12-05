import { error, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const customer = await db
		.select()
		.from(schema.customer)
		.where(eq(schema.customer.userId, locals.user.id))
		.limit(1);

	const order = await db
		.select({
			id: schema.order.id,
			date: schema.order.date,
			status: schema.order.status,
			totalAmount: schema.order.totalAmount,
			address: {
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
			}
		})
		.from(schema.order)
		.innerJoin(schema.address, eq(schema.order.addressId, schema.address.id))
		.innerJoin(schema.district, eq(schema.address.districtId, schema.district.id))
		.innerJoin(schema.city, eq(schema.district.cityId, schema.city.id))
		.innerJoin(schema.country, eq(schema.city.countryId, schema.country.id))
		.where(and(
			eq(schema.order.id, params.orderId),
			eq(schema.order.customerId, customer[0].id)
		))
		.limit(1);

	if (!order.length) {
		throw error(404, 'Order not found');
	}

	const orderDetails = await db
		.select({
			id: schema.orderDetail.id,
			amount: schema.orderDetail.amount,
			date: schema.orderDetail.date,
			product: {
				id: schema.product.id,
				name: schema.product.name
			},
			quantity: schema.orderDetailProduct.quantity
		})
		.from(schema.orderDetail)
		.innerJoin(schema.orderDetailProduct, eq(schema.orderDetail.id, schema.orderDetailProduct.orderDetailsId))
		.innerJoin(schema.product, eq(schema.orderDetailProduct.productId, schema.product.id))
		.where(eq(schema.orderDetail.orderId, order[0].id));

	const payments = await db
		.select({
			amount: schema.payment.amount,
			date: schema.payment.date,
			paymentMethod: {
				name: schema.paymentMethod.name
			}
		})
		.from(schema.payment)
		.innerJoin(schema.paymentMethod, eq(schema.payment.paymentMethodId, schema.paymentMethod.id))
		.where(eq(schema.payment.orderId, order[0].id));

	return {
		order: order[0],
		orderDetails,
		payments
	};
};