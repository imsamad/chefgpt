## Tech Stack

1. NextJS
2. Prisma and MongoDB
3. Dockerised MongoDB
4. Tailwind + CSS

## Setup

After cloning the repo, install the deps

```bash
pnpm install
```

Copy .env.eg to .env

```bash
cp .env.eg .env
```

Spin up Mongo Instance locally

```bash
docker compose up -d
```

Apply collection and indexes on mongo & Generate Client for prisma

```bash
pnpm prisma db push && pnpx prisma generate
```

Run seed

```bash
pnpx prisma db seed
```

Run the server, at port 3000

```
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
