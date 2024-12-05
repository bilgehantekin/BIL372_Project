# Simple Headless E-commerce Platform Template

A simple headless e-commerce platform template built with SvelteKit and Drizzle ORM, featuring user authentication, product management, shopping cart functionality, and order processing.


## Installation

1. Clone the repository:
```bash
git clone git@github.com:ISmillex/simple-headless-e-commerce-platform-template.git
```

2. Install dependencies:
```bash
pnpm i
```

3. Set up environment variables in a `.env.development` file or `.env.production` file:
```env
ENV=development
DATABASE_URL=mysql://user:password@localhost:3306/dbname
```

4. Initialize the database:
```bash
pnpm run db:push:dev 
```

5. Run the development server:
```bash
pnpm dev
```
## Tech Stack

- SvelteKit
- Drizzle ORM
- MySQL


## License

MIT License

