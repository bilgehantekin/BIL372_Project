import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth/auth';

export async function POST(event) {
	if (event.locals.session) {
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
	}

	throw redirect(302, '/auth/login');
}