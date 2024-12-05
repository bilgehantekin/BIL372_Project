import { eq, and, like, or } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ url, locals }) => {
	const searchTerm = url.searchParams.get('search');
	const categoryId = url.searchParams.get('category');
	const productClassId = url.searchParams.get('productClass');

	let query = db
		.select({
			id: schema.product.id,
			name: schema.product.name,
			description: schema.product.description,
			unitPrice: schema.product.unitPrice,
			stock: schema.product.stock,
			category: {
				id: schema.category.id,
				name: schema.category.name
			},
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
		.innerJoin(schema.category, eq(schema.product.categoryId, schema.category.id))
		.innerJoin(schema.productClass, eq(schema.product.productClassId, schema.productClass.id))
		.innerJoin(schema.seller, eq(schema.product.sellerId, schema.seller.id))
		.innerJoin(schema.user, eq(schema.seller.userId, schema.user.id))
		.where(
			and(
				categoryId ? eq(schema.product.categoryId, categoryId) : undefined,
				productClassId ? eq(schema.product.productClassId, productClassId) : undefined,
				searchTerm ? or(
					like(schema.product.name, `%${searchTerm}%`),
					like(schema.product.description, `%${searchTerm}%`)
				) : undefined
			)
		);

	const [products, categories, productClasses] = await Promise.all([
		query,
		db.select().from(schema.category),
		db.select().from(schema.productClass)
	]);

	return {
		products,
		categories,
		productClasses,
		searchTerm,
		selectedCategory: categoryId,
		selectedProductClass: productClassId,
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

		// Verify product exists and has enough stock
		const [product] = await db
			.select()
			.from(schema.product)
			.where(eq(schema.product.id, productId))
			.limit(1);

		if (!product || quantity > product.stock) {
			return fail(400, { error: 'Not enough stock available' });
		}

		const customer = await db
			.select()
			.from(schema.customer)
			.where(eq(schema.customer.userId, locals.user.id))
			.limit(1);

		// Find or create cart
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

		// Check if product already exists in cart
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
			// Update existing cart product quantity
			const newQuantity = existingCartProduct[0].quantity + quantity;

			if (newQuantity > product.stock) {
				return fail(400, { error: 'Not enough stock available' });
			}

			await db
				.update(schema.cartProduct)
				.set({ quantity: newQuantity })
				.where(eq(schema.cartProduct.id, existingCartProduct[0].id));
		} else {
			// Add new cart product
			await db.insert(schema.cartProduct).values({
				id: crypto.randomUUID(),
				cartId: cart[0].id,
				productId,
				quantity
			});
		}

		return { success: true };
	}
};