import { redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const [user, seller] = await Promise.all([
		db
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, locals.user.id))
			.limit(1),
		db
			.select()
			.from(schema.seller)
			.where(eq(schema.seller.userId, locals.user.id))
			.limit(1)
	]);

	if (!user.length || !seller.length) {
		throw redirect(302, '/auth/login');
	}

	return {
		user: user[0],
		seller: seller[0]
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth/login');
		}

		const form = await request.formData();

		try {
			await db.transaction(async (tx) => {
				await tx
					.update(schema.user)
					.set({
						firstName: form.get('firstName'),
						lastName: form.get('lastName'),
						email: form.get('email'),
						phoneNumber: form.get('phoneNumber')
					})
					.where(eq(schema.user.id, locals.user.id));

				await tx
					.update(schema.seller)
					.set({
						taxNumber: form.get('taxNumber'),
						description: form.get('description')
					})
					.where(eq(schema.seller.userId, locals.user.id));
			});

			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to update profile' });
		}
	}
};