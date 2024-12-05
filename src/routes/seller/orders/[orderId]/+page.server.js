import { redirect, error, fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ params, locals }) => {
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

	const order = await db
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
			},
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
		.innerJoin(schema.customer, eq(schema.order.customerId, schema.customer.id))
		.innerJoin(schema.user, eq(schema.customer.userId, schema.user.id))
		.innerJoin(schema.address, eq(schema.order.addressId, schema.address.id))
		.innerJoin(schema.district, eq(schema.address.districtId, schema.district.id))
		.innerJoin(schema.city, eq(schema.district.cityId, schema.city.id))
		.innerJoin(schema.country, eq(schema.city.countryId, schema.country.id))
		.where(eq(schema.order.id, params.orderId))
		.limit(1);

	if (!order.length) {
		throw error(404, 'Order not found');
	}

	const orderDetails = await db
		.select({
			id: schema.orderDetailProduct.id,
			product: {
				id: schema.product.id,
				name: schema.product.name,
				sellerId: schema.product.sellerId
			},
			quantity: schema.orderDetailProduct.quantity,
			amount: schema.orderDetail.amount
		})
		.from(schema.orderDetailProduct)
		.innerJoin(schema.orderDetail, eq(schema.orderDetailProduct.orderDetailsId, schema.orderDetail.id))
		.innerJoin(schema.product, eq(schema.orderDetailProduct.productId, schema.product.id))
		.where(eq(schema.orderDetail.orderId, order[0].id));

	const hasAccess = orderDetails.some(detail => detail.product.sellerId === seller[0].id);
	if (!hasAccess) {
		throw error(403, 'Access denied');
	}

	return {
		order: order[0],
		orderDetails
	};
};

export const actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();
		const newStatus = form.get('status');

		try {
			await db
				.update(schema.order)
				.set({ status: newStatus })
				.where(eq(schema.order.id, params.orderId));

			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to update order status' });
		}
	}
};