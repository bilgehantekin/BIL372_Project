import { fail, redirect } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';
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
	default: async (event) => {
		const form = await event.request.formData();
		const email = form.get('email');
		const password = form.get('password');

		const user = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, email))
			.limit(1);

		if (!user.length || !(await verify(user[0].passwordHash, password))) {
			return fail(400, { message: 'Invalid credentials' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user[0].id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		throw redirect(302, '/');
	}
};