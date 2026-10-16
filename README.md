This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Known issues

- **`npm run build` fails on `lib/oldmodels.ts`** (noted 2026-10-16, arrived with the
  `yasir16thOct` merge). TypeScript reports `TS2741: Property '"55ah"' is missing` at
  `lib/oldmodels.ts:87`: the X Double Light entry only has `"30ah"` pricing, but `BatteryId`
  is now `"30ah" | "55ah"`. Nothing imports the file — it looks like a backup of the old
  model data — so `npm run dev` is unaffected, but the type check blocks every production
  build. **Fix before deploying:** delete `lib/oldmodels.ts` if it's no longer needed
  (confirm with Yasir), or add the missing `"55ah"` pricing.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
