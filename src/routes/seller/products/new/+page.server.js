import { redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const [categories, productClasses] = await Promise.all([
		db.select().from(schema.category),
		db.select().from(schema.productClass)
	]);

	return {
		categories,
		productClasses
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const seller = await db
			.select()
			.from(schema.seller)
			.where(eq(schema.seller.userId, locals.user.id))
			.limit(1);

		const form = await request.formData();

		try {
			const productId = crypto.randomUUID();
			await db.insert(schema.product).values({
				id: productId,
				sellerId: seller[0].id,
				name: form.get('name'),
				description: form.get('description'),
				unitPrice: parseFloat(form.get('unitPrice')),
				stock: parseInt(form.get('stock')),
				categoryId: form.get('categoryId'),
				productClassId: form.get('productClassId')
			});

			throw redirect(302, '/seller/products');
		} catch (error) {
			return fail(500, { message: 'Failed to create product' });
		}
	}
};