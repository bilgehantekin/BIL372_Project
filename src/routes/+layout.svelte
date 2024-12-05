<script>
	import "../app.css";
	import { page } from '$app/stores';

	$: user = $page.data.user;
	$: userType = $page.data.userType;
</script>

<header>
	<nav>
		<a href="/">Home</a>
		<a href="/products">Products</a>

		{#if user}
			{#if userType === 'customer'}
				<a href="/customer/dashboard">Dashboard</a>
				<a href="/customer/orders">Orders</a>
				<a href="/customer/cart">Cart</a>
				<a href="/customer/profile">Profile</a>
			{:else if userType === 'seller'}
				<a href="/seller/dashboard">Dashboard</a>
				<a href="/seller/products">Products</a>
				<a href="/seller/orders">Orders</a>
				<a href="/seller/profile">Profile</a>
			{/if}
			<form method="POST" action="/auth/logout">
				<button type="submit">Logout</button>
			</form>
		{:else}
			<a href="/auth/login">Login</a>
			<a href="/auth/register">Register</a>
		{/if}
	</nav>
</header>

<main>
	<slot></slot>
</main>