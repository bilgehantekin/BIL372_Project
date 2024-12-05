import { mysqlTable, text, varchar, datetime, double, int } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	firstName: varchar('first_name', { length: 50 }),
	lastName: varchar('last_name', { length: 50 }),
	email: varchar('email', { length: 90 }).notNull().unique(),
	age: int('age'),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	phoneNumber: varchar('phone_number', { length: 20 })
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});

export const country = mysqlTable('country', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 50 }).notNull()
});

export const city = mysqlTable('city', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 50 }).notNull(),
	countryId: varchar('country_id', { length: 255 }).references(() => country.id)
});

export const district = mysqlTable('district', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 25 }).notNull(),
	cityId: varchar('city_id', { length: 255 }).references(() => city.id)
});

export const address = mysqlTable('address', {
	id: varchar('id', { length: 255 }).primaryKey(),
	districtId: varchar('district_id', { length: 255 }).references(() => district.id),
	description: text('description'),
	userId: varchar('user_id', { length: 255 }).references(() => user.id)
});

export const customer = mysqlTable('customer', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 }).references(() => user.id)
});

export const seller = mysqlTable('seller', {
	id: varchar('id', { length: 255 }).primaryKey(),
	taxNumber: varchar('tax_number', { length: 90 }),
	description: text('description'),
	userId: varchar('user_id', { length: 255 }).references(() => user.id)
});

export const category = mysqlTable('category', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 50 }).notNull(),
	description: text('description')
});

export const productClass = mysqlTable('product_class', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 100 }).notNull().unique()
});

export const product = mysqlTable('product', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 50 }),
	description: text('description'),
	unitPrice: double('unit_price'),
	stock: int('stock'),
	categoryId: varchar('category_id', { length: 255 }).references(() => category.id),
	sellerId: varchar('seller_id', { length: 255 }).references(() => seller.id),
	productClassId: varchar('product_class_id', { length: 255 }).references(() => productClass.id)
});

export const cart = mysqlTable('cart', {
	id: varchar('id', { length: 255 }).primaryKey(),
	customerId: varchar('customer_id', { length: 255 }).references(() => customer.id),
	date: datetime('date')
});

export const cartProduct = mysqlTable('cart_product', {
	id: varchar('id', { length: 255 }).primaryKey(),
	cartId: varchar('cart_id', { length: 255 }).references(() => cart.id),
	productId: varchar('product_id', { length: 255 }).references(() => product.id),
	quantity: int('quantity').notNull().default(1)
});

export const paymentMethod = mysqlTable('payment_method', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 30 }).notNull()
});

export const order = mysqlTable('order', {
	id: varchar('id', { length: 255 }).primaryKey(),
	customerId: varchar('customer_id', { length: 255 }).references(() => customer.id),
	addressId: varchar('address_id', { length: 255 }).references(() => address.id),
	date: datetime('date').notNull(),
	status: varchar('status', { length: 30 }).notNull(),
	totalAmount: double('total_amount').notNull()
});

export const payment = mysqlTable('payment', {
	id: varchar('id', { length: 255 }).primaryKey(),
	amount: double('amount').notNull(),
	date: datetime('date').notNull(),
	paymentMethodId: varchar('payment_method_id', { length: 255 }).references(() => paymentMethod.id),
	orderId: varchar('order_id', { length: 255 }).references(() => order.id)
});

export const orderDetail = mysqlTable('order_detail', {
	id: varchar('id', { length: 255 }).primaryKey(),
	orderId: varchar('order_id', { length: 255 }).references(() => order.id),
	amount: double('amount').notNull(),
	date: datetime('date').notNull(),
	paymentMethodId: varchar('payment_method_id', { length: 255 }).references(() => paymentMethod.id)
});

export const orderDetailProduct = mysqlTable('order_detail_product', {
	id: varchar('id', { length: 255 }).primaryKey(),
	orderDetailsId: varchar('order_details_id', { length: 255 }).references(() => orderDetail.id),
	productId: varchar('product_id', { length: 255 }).references(() => product.id),
	quantity: int('quantity').notNull()
});