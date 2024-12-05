import { db } from '../index.js';
import * as schema from '../schema.js';

export async function seedLocationData() {
	const existingCountries = await db.select().from(schema.country);

	if (existingCountries.length === 0) {
		const countryIds = {
			usa: crypto.randomUUID(),
			canada: crypto.randomUUID(),
			uk: crypto.randomUUID()
		};

		await db.insert(schema.country).values([
			{ id: countryIds.usa, name: 'United States' },
			{ id: countryIds.canada, name: 'Canada' },
			{ id: countryIds.uk, name: 'United Kingdom' }
		]);

		// Create cities for each country
		const cityIds = {
			newYork: crypto.randomUUID(),
			losAngeles: crypto.randomUUID(),
			toronto: crypto.randomUUID(),
			vancouver: crypto.randomUUID(),
			london: crypto.randomUUID(),
			manchester: crypto.randomUUID()
		};

		await db.insert(schema.city).values([
			{ id: cityIds.newYork, name: 'New York', countryId: countryIds.usa },
			{ id: cityIds.losAngeles, name: 'Los Angeles', countryId: countryIds.usa },
			{ id: cityIds.toronto, name: 'Toronto', countryId: countryIds.canada },
			{ id: cityIds.vancouver, name: 'Vancouver', countryId: countryIds.canada },
			{ id: cityIds.london, name: 'London', countryId: countryIds.uk },
			{ id: cityIds.manchester, name: 'Manchester', countryId: countryIds.uk }
		]);

		// Create districts for each city
		await db.insert(schema.district).values([
			{ id: crypto.randomUUID(), name: 'Manhattan', cityId: cityIds.newYork },
			{ id: crypto.randomUUID(), name: 'Brooklyn', cityId: cityIds.newYork },
			{ id: crypto.randomUUID(), name: 'Downtown LA', cityId: cityIds.losAngeles },
			{ id: crypto.randomUUID(), name: 'Hollywood', cityId: cityIds.losAngeles },
			{ id: crypto.randomUUID(), name: 'Downtown Toronto', cityId: cityIds.toronto },
			{ id: crypto.randomUUID(), name: 'North York', cityId: cityIds.toronto },
			{ id: crypto.randomUUID(), name: 'Downtown Vancouver', cityId: cityIds.vancouver },
			{ id: crypto.randomUUID(), name: 'Kitsilano', cityId: cityIds.vancouver },
			{ id: crypto.randomUUID(), name: 'Westminster', cityId: cityIds.london },
			{ id: crypto.randomUUID(), name: 'Camden', cityId: cityIds.london },
			{ id: crypto.randomUUID(), name: 'City Centre', cityId: cityIds.manchester },
			{ id: crypto.randomUUID(), name: 'Northern Quarter', cityId: cityIds.manchester }
		]);
	}
}