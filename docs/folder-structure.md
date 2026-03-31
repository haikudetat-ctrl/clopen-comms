# Initial Folder Structure

## Next.js web app (`apps/web`)
```text
apps/web
├── app
│   ├── (auth)
│   │   └── login
│   │       └── page.tsx
│   ├── (app)
│   │   ├── admin
│   │   │   ├── branding/page.tsx
│   │   │   ├── communications/page.tsx
│   │   │   ├── locations/page.tsx
│   │   │   ├── training/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── staff
│   │       ├── lineup/page.tsx
│   │       ├── menu/page.tsx
│   │       ├── training/page.tsx
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── app-shell.tsx
│   ├── login-form.tsx
│   └── shell-nav.tsx
├── lib
│   ├── tenant.ts
│   └── supabase
│       ├── client.ts
│       ├── config.ts
│       └── server.ts
├── package.json
└── tsconfig.json
```

## Expo mobile app (`apps/mobile`)
```text
apps/mobile
├── app
│   ├── (auth)
│   │   └── sign-in.tsx
│   ├── (staff)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── lineup.tsx
│   │   ├── menu.tsx
│   │   └── training.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── components
│   └── screen-card.tsx
├── lib
│   └── theme.ts
├── app.json
├── babel.config.js
├── package.json
└── tsconfig.json
```
