import { redirect, fail } from '@sveltejs/kit';
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

	const [product, categories, productClasses] = await Promise.all([
		db
			.select()
			.from(schema.product)
			.where(and(
				eq(schema.product.id, params.productId),
				eq(schema.product.sellerId, seller[0].id)
			))
			.limit(1),
		db.select().from(schema.category),
		db.select().from(schema.productClass)
	]);

	if (!product.length) {
		throw error(404, 'Product not found');
	}

	return {
		product: product[0],
		categories,
		productClasses
	};
};

export const actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();

		try {
			await db
				.update(schema.product)
				.set({
					name: form.get('name'),
					description: form.get('description'),
					unitPrice: parseFloat(form.get('unitPrice')),
					stock: parseInt(form.get('stock')),
					categoryId: form.get('categoryId'),
					productClassId: form.get('productClassId')
				})
				.where(eq(schema.product.id, params.productId));

			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to update product' });
		}
	}
};