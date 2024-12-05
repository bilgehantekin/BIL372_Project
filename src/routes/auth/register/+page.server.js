import { fail, redirect } from '@sveltejs/kit';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth/auth';

export const load = ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const accountType = form.get('accountType');
		const email = form.get('email');

		const existingUser = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			return fail(400, { message: 'Email already exists' });
		}

		const userId = crypto.randomUUID();
		const passwordHash = await hash(form.get('password'));

		await db.insert(table.user).values({
			id: userId,
			firstName: form.get('firstName'),
			lastName: form.get('lastName'),
			email: form.get('email'),
			passwordHash,
			phoneNumber: form.get('phoneNumber'),
			age: parseInt(form.get('age'))
		});

		if (accountType === 'customer') {
			await db.insert(table.customer).values({
				id: crypto.randomUUID(),
				userId
			});
		} else {
			await db.insert(table.seller).values({
				id: crypto.randomUUID(),
				userId,
				taxNumber: form.get('taxNumber'),
				description: form.get('description')
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);

		throw redirect(302, '/setup/address');
	}
};
