import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

export const load = async ({ locals, url }) => {
	const publicRoutes = [
		'/',
		'/auth/login',
		'/auth/register',
		'/products',
		'/products/category'
	];
	const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));

	if (!locals.user && !isPublicRoute) {
		throw redirect(302, '/auth/login');
	}

	let userType = null;

	if (locals.user) {
		const [customer, seller] = await Promise.all([
			db
				.select()
				.from(schema.customer)
				.where(eq(schema.customer.userId, locals.user.id))
				.limit(1),
			db
				.select()
				.from(schema.seller)
				.where(eq(schema.seller.userId, locals.user.id))
				.limit(1)
		]);


		if (customer.length) {
			userType = 'customer';

			if (url.pathname.startsWith('/seller')) {
				throw redirect(302, '/customer/dashboard');
			}
		} else if (seller.length) {
			userType = 'seller';

			if (url.pathname.startsWith('/customer')) {
				throw redirect(302, '/seller/dashboard');
			}
		}
	}

	return {
		user: locals.user,
		userType
	};
};