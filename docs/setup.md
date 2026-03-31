# Setup Notes

## Supabase project
- URL: `https://dzeuamikcqdutzcnmsno.supabase.co`
- Add keys to `.env` files from examples.

## Apply schema
Use Supabase SQL editor or CLI to run:
1. `supabase/migrations/20260309104500_mvp_schema.sql`
2. Create Auth users in Supabase Dashboard:
   - `admin@ateliergroup.com` / `Password123!`
   - `staff@ateliermidtown.com` / `Password123!`
3. `supabase/seed.sql`

## Demo users (seed)
- `admin@ateliergroup.com` / `Password123!`
- `staff@ateliermidtown.com` / `Password123!`

## Expected MVP proof points
- User can authenticate with Supabase Auth
- User has active location membership
- App shell loads tenant brand settings for group/location
- Admin and staff shell routes render correctly
