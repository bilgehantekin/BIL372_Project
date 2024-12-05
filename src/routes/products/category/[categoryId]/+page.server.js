import { error, redirect, fail } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ params, locals }) => {
	const category = await db
		.select()
		.from(schema.category)
		.where(eq(schema.category.id, params.categoryId))
		.limit(1);

	if (!category.length) {
		throw error(404, 'Category not found');
	}

	const products = await db
		.select({
			id: schema.product.id,
			name: schema.product.name,
			description: schema.product.description,
			unitPrice: schema.product.unitPrice,
			stock: schema.product.stock,
			productClass: {
				id: schema.productClass.id,
				name: schema.productClass.name
			},
			seller: {
				id: schema.seller.id,
				user: {
					firstName: schema.user.firstName,
					lastName: schema.user.lastName
				}
			}
		})
		.from(schema.product)
		.innerJoin(schema.productClass, eq(schema.product.productClassId, schema.productClass.id))
		.innerJoin(schema.seller, eq(schema.product.sellerId, schema.seller.id))
		.innerJoin(schema.user, eq(schema.seller.userId, schema.user.id))
		.where(eq(schema.product.categoryId, params.categoryId));

	return {
		category: category[0],
		products,
		user: locals.user
	};
};

export const actions = {
	addToCart: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();
		const productId = form.get('productId');
		const quantity = parseInt(form.get('quantity'));

		if (isNaN(quantity) || quantity < 1) {
			return fail(400, { error: 'Invalid quantity' });
		}

		const [product] = await db
			.select()
			.from(schema.product)
			.where(eq(schema.product.id, productId))
			.limit(1);

		if (!product) {
			return fail(404, { error: 'Product not found' });
		}

		if (quantity > product.stock) {
			return fail(400, { error: 'Not enough stock available' });
		}

		const customer = await db
			.select()
			.from(schema.customer)
			.where(eq(schema.customer.userId, locals.user.id))
			.limit(1);

		let cart = await db
			.select()
			.from(schema.cart)
			.where(eq(schema.cart.customerId, customer[0].id))
			.limit(1);

		if (!cart.length) {
			await db.insert(schema.cart).values({
				id: crypto.randomUUID(),
				customerId: customer[0].id,
				date: new Date()
			});

			cart = await db
				.select()
				.from(schema.cart)
				.where(eq(schema.cart.customerId, customer[0].id))
				.limit(1);
		}

		const existingCartProduct = await db
			.select()
			.from(schema.cartProduct)
			.where(
				and(
					eq(schema.cartProduct.cartId, cart[0].id),
					eq(schema.cartProduct.productId, productId)
				)
			)
			.limit(1);

		if (existingCartProduct.length > 0) {
			const newQuantity = existingCartProduct[0].quantity + quantity;

			if (newQuantity > product.stock) {
				return fail(400, { error: 'Total quantity exceeds available stock' });
			}

			await db
				.update(schema.cartProduct)
				.set({ quantity: newQuantity })
				.where(eq(schema.cartProduct.id, existingCartProduct[0].id));
		} else {
			await db.insert(schema.cartProduct).values({
				id: crypto.randomUUID(),
				cartId: cart[0].id,
				productId,
				quantity
			});
		}

		return {
			success: true,
			message: `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`
		};
	}
};