import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import {seedLocationData} from '$lib/server/db/seeds/locationSeed.js';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	await seedLocationData();

	const countries = await db.select().from(table.country);
	const cities = await db.select().from(table.city);
	const districts = await db.select().from(table.district);

	return {
		countries,
		cities,
		districts
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		await db.insert(table.address).values({
			id: crypto.randomUUID(),
			userId: locals.user.id,
			districtId: form.get('districtId'),
			description: form.get('description')
		});

		throw redirect(302, '/');
	}
};