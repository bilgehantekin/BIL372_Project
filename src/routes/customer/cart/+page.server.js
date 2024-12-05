import { redirect, fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
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

	const cart = await db
		.select()
		.from(schema.cart)
		.where(eq(schema.cart.customerId, customer[0].id))
		.limit(1);

	if (!cart.length) {
		return { cartItems: [] };
	}

	const cartItems = await db
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

	const total = cartItems.reduce((sum, item) => sum + (item.product.unitPrice * item.quantity), 0);

	return {
		cartItems,
		cartId: cart[0].id,
		total
	};
};

export const actions = {
	updateCart: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();
		const updates = [];

		// Process all quantity updates
		for (const [key, value] of form.entries()) {
			if (key.startsWith('quantity_')) {
				const productId = key.replace('quantity_', '');
				const quantity = parseInt(value);

				if (isNaN(quantity) || quantity < 1) {
					return fail(400, { error: 'Invalid quantity' });
				}

				const [product] = await db
					.select()
					.from(schema.product)
					.where(eq(schema.product.id, productId))
					.limit(1);

				if (!product || quantity > product.stock) {
					return fail(400, { error: 'Not enough stock available' });
				}

				updates.push({ productId, quantity });
			}
		}

		try {
			const customer = await db
				.select()
				.from(schema.customer)
				.where(eq(schema.customer.userId, locals.user.id))
				.limit(1);

			const [cart] = await db
				.select()
				.from(schema.cart)
				.where(eq(schema.cart.customerId, customer[0].id))
				.limit(1);

			// Update each item
			for (const update of updates) {
				await db
					.update(schema.cartProduct)
					.set({ quantity: update.quantity })
					.where(
						and(
							eq(schema.cartProduct.cartId, cart.id),
							eq(schema.cartProduct.productId, update.productId)
						)
					);
			}

			return { success: true };
		} catch (error) {
			console.error('Cart update error:', error);
			return fail(500, { error: 'Failed to update cart' });
		}
	},

	removeItem: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();
		const productId = form.get('productId');

		if (!productId) {
			return fail(400, { error: 'Product ID is required' });
		}

		try {
			const customer = await db
				.select()
				.from(schema.customer)
				.where(eq(schema.customer.userId, locals.user.id))
				.limit(1);

			const [cart] = await db
				.select()
				.from(schema.cart)
				.where(eq(schema.cart.customerId, customer[0].id))
				.limit(1);

			// Remove the item
			await db
				.delete(schema.cartProduct)
				.where(
					and(
						eq(schema.cartProduct.cartId, cart.id),
						eq(schema.cartProduct.productId, productId)
					)
				);

			const remainingItems = await db
				.select()
				.from(schema.cartProduct)
				.where(eq(schema.cartProduct.cartId, cart.id));

			if (remainingItems.length === 0) {
				await db
					.delete(schema.cart)
					.where(eq(schema.cart.id, cart.id));
			}

			return { success: true };
		} catch (error) {
			console.error('Remove item error:', error);
			return fail(500, { error: 'Failed to remove item from cart' });
		}
	}
};