import { redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { seedPaymentMethods } from '$lib/server/db/seeds/paymentMethodSeed.js';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	await seedPaymentMethods();

	const customer = await db
		.select()
		.from(schema.customer)
		.where(eq(schema.customer.userId, locals.user.id))
		.limit(1);

	if (!customer.length) {
		throw redirect(302, '/auth/login');
	}

	const cart = await db
		.select()
		.from(schema.cart)
		.where(eq(schema.cart.customerId, customer[0].id))
		.limit(1);

	let cartItems = [];
	if (cart.length) {
		cartItems = await db
			.select({
				id: schema.cartProduct.id,
				quantity: schema.cartProduct.quantity,
				product: {
					id: schema.product.id,
					name: schema.product.name,
					unitPrice: schema.product.unitPrice,
					stock: schema.product.stock
				}
			})
			.from(schema.cartProduct)
			.innerJoin(schema.product, eq(schema.cartProduct.productId, schema.product.id))
			.where(eq(schema.cartProduct.cartId, cart[0].id));
	}

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

	const paymentMethods = await db
		.select()
		.from(schema.paymentMethod);

	const total = cartItems.reduce((sum, item) => sum + (item.product.unitPrice * item.quantity), 0);

	return {
		cartItems,
		addresses,
		paymentMethods,
		total
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();
		const paymentMethodId = form.get('paymentMethodId');
		const addressId = form.get('addressId');

		const customer = await db
			.select()
			.from(schema.customer)
			.where(eq(schema.customer.userId, locals.user.id))
			.limit(1);

		if (!customer.length) {
			return fail(400, { error: 'Customer not found' });
		}

		const cart = await db
			.select()
			.from(schema.cart)
			.where(eq(schema.cart.customerId, customer[0].id))
			.limit(1);

		if (!cart.length) {
			return fail(400, { error: 'Cart is empty' });
		}

		const cartItems = await db
			.select({
				id: schema.cartProduct.id,
				quantity: schema.cartProduct.quantity,
				product: {
					id: schema.product.id,
					unitPrice: schema.product.unitPrice,
					stock: schema.product.stock
				}
			})
			.from(schema.cartProduct)
			.innerJoin(schema.product, eq(schema.cartProduct.productId, schema.product.id))
			.where(eq(schema.cartProduct.cartId, cart[0].id));

		if (!cartItems.length) {
			return fail(400, { error: 'Cart is empty' });
		}

		for (const item of cartItems) {
			if (item.quantity > item.product.stock) {
				return fail(400, { error: `Not enough stock available for some items` });
			}
		}

		const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.unitPrice * item.quantity), 0);

		let completedOrderId;

		try {
			await db.transaction(async (tx) => {
				// Create order
				const orderId = crypto.randomUUID();
				completedOrderId = orderId; // Store the order ID

				await tx.insert(schema.order).values({
					id: orderId,
					customerId: customer[0].id,
					addressId: addressId,
					date: new Date(),
					status: 'pending',
					totalAmount
				});

				const orderDetailId = crypto.randomUUID();
				await tx.insert(schema.orderDetail).values({
					id: orderDetailId,
					orderId,
					amount: totalAmount,
					date: new Date(),
					paymentMethodId
				});

				for (const item of cartItems) {
					await tx.insert(schema.orderDetailProduct).values({
						id: crypto.randomUUID(),
						orderDetailsId: orderDetailId,
						productId: item.product.id,
						quantity: item.quantity
					});

					await tx
						.update(schema.product)
						.set({ stock: item.product.stock - item.quantity })
						.where(eq(schema.product.id, item.product.id));
				}

				await tx.insert(schema.payment).values({
					id: crypto.randomUUID(),
					orderId,
					amount: totalAmount,
					date: new Date(),
					paymentMethodId
				});

				await tx.delete(schema.cartProduct)
					.where(eq(schema.cartProduct.cartId, cart[0].id));
				await tx.delete(schema.cart)
					.where(eq(schema.cart.id, cart[0].id));
			});

			if (completedOrderId) {
				throw redirect(302, `/customer/orders/${completedOrderId}`);
			} else {
				return fail(500, { error: 'Failed to process order: Order ID not generated' });
			}

		} catch (error) {
			if (error instanceof Response) { // This catches the redirect
				throw error;
			}
			console.error('Checkout error:', error);
			return fail(500, { error: 'Failed to process order' });
		}
	}
};