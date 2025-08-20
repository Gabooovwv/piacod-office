# Admin Panel

Egy gyönyörű és modern admin panel, amelyet Next.js, Tailwind CSS és Shadcn/ui segítségével építettünk termékkezeléshez JWT hitelesítéssel.

## Funkciók

- 🔐 **JWT Hitelesítés** - Biztonságos bejelentkezés email/jelszó párossal
- 📦 **Termékkezelés** - Teljes CRUD műveletek termékekhez
- 🎨 **Modern UI** - Gyönyörű felület Tailwind CSS és Shadcn/ui segítségével
- 📱 **Reszponzív Design** - Tökéletesen működik minden eszközön
- ⚡ **Gyors Teljesítmény** - Next.js 15 és App Router segítségével építve
- 🔄 **Valós idejű frissítések** - Azonnali UI frissítések műveletek után

## Technológiák

- **Frontend**: Next.js 15, React 18, TypeScript
- **Stílusok**: Tailwind CSS, Shadcn/ui
- **Hitelesítés**: JWT HTTP-only sütikkel
- **Ikonok**: Lucide React
- **Adatok**: Mock adatok (könnyen lecserélhető valós adatbázisra)

## Kezdő lépések

### Előfeltételek

- Node.js 18+
- npm vagy yarn
- MySQL/MariaDB adatbázis (piacod.hu adatbázisa)

### Telepítés

1. Klónozd a repository-t:

```bash
git clone <repository-url>
cd piacod-office
```

2. Telepítsd a függőségeket:

```bash
npm install
```

3. Telepítsd a backend függőségeket:

```bash
cd backend
npm install
cd ..
```

### Adatbázis beállítás

A projekt a piacod.hu adatbázisát használja. Győződj meg róla, hogy:

1. A piacod.hu adatbázisa fut a helyi gépeden
2. Az adatbázis kapcsolat be van állítva a `backend/src/config/database.js` fájlban
3. A szükséges táblák léteznek az adatbázisban

### Indítás

1. **Backend indítása:**

```bash
cd backend
npm start
```

A backend a `http://localhost:5000` címen fog futni.

2. **Frontend indítása (új terminál ablakban):**

```bash
npm run dev
```

3. Nyisd meg a [http://localhost:3000](http://localhost:3000) címet a böngészőben.

### Demo bejelentkezési adatok

- **Email**: admin@example.com
- **Jelszó**: admin123

## Projekt struktúra

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API útvonalak
│   │   ├── auth/          # Hitelesítési végpontok
│   │   └── products/      # Termékkezelési végpontok
│   ├── dashboard/         # Fő dashboard oldal
│   ├── login/             # Bejelentkezési oldal
│   └── layout.tsx         # Gyökér layout
├── components/            # Újrafelhasználható komponensek
│   ├── ui/               # Shadcn/ui komponensek
│   └── ProductDialog.tsx  # Termék szerkesztő dialógus
├── contexts/             # React kontextusok
│   └── AuthContext.tsx   # Hitelesítési kontextus
└── lib/                  # Segédeszközök és adatok
    ├── auth.ts           # Hitelesítési segédeszközök
    └── mock-data.ts      # Mock adatok

backend/
├── src/
│   ├── config/           # Konfigurációs fájlok
│   ├── middleware/       # Middleware-ek
│   ├── routes/           # API útvonalak
│   └── server.js         # Szerver indítás
└── package.json
```

## Funkciók részletesen

### Hitelesítés

- JWT-alapú hitelesítés HTTP-only sütikkel
- Automatikus token ellenőrzés
- Védett útvonalak
- Munkamenet kezelés

### Termékkezelés

- **Termékek megtekintése**: Gyönyörű táblázat termékképekkel és részletekkel
- **Termékek hozzáadása**: Modális dialógus űrlap validációval
- **Termékek szerkesztése**: Helyben szerkesztés minden mező módosíthatóságával
- **Termékek törlése**: Megerősítő dialógus törlés előtt
- **Készlet kezelés**: Vizuális jelzők alacsony készletű termékekhez

### Dashboard

- **Statisztika kártyák**: Összes termék, érték, alacsony készlet száma, kategóriák
- **Termék táblázat**: Rendezhető és kereshető terméklista
- **Reszponzív design**: Működik asztali, tablet és mobil eszközökön

## API végpontok

### Hitelesítés

- `POST /api/auth/login` - Felhasználó bejelentkezés
- `POST /api/auth/logout` - Felhasználó kijelentkezés
- `GET /api/auth/me` - Jelenlegi felhasználó lekérése

### Termékek

- `GET /api/products` - Összes termék lekérése
- `POST /api/products` - Új termék létrehozása
- `PUT /api/products/[id]` - Termék frissítése
- `DELETE /api/products/[id]` - Termék törlése

## Testreszabás

### Valós adatbázis hozzáadása

A mock adatokat a `src/lib/mock-data.ts` fájlban cseréld le az adatbázis kapcsolatodra:

1. Telepítsd a preferált adatbázis drivert (pl. `prisma`, `mongoose`, `@prisma/client`)
2. Frissítsd az API útvonalakat az adatbázis használatához
3. Cseréld le a mock adat függvényeket adatbázis lekérdezésekre

### Stílusok

A projekt Tailwind CSS-t használ Shadcn/ui komponensekkel. Testreszabhatod:

- Színeket a `tailwind.config.js` fájlban
- Komponens stílusokat a `src/components/ui/` mappában
- Globális stílusokat a `src/app/globals.css` fájlban

### Hitelesítés

A biztonság növeléséhez:

1. Használj környezeti változókat a JWT titkos kulcshoz
2. Implementálj jelszó hashelést bcrypt-tel
3. Adj hozzá rate limiting-et
4. Engedélyezd a HTTPS-t produkcióban

## Telepítés

### Vercel (Ajánlott)

1. Push-old a kódot GitHub-ra
2. Kapcsold össze a repository-t a Vercel-lel
3. Automatikus telepítés

### Egyéb platformok

Az alkalmazás telepíthető bármely Next.js-t támogató platformra:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Környezeti változók

Hozz létre egy `.env.local` fájlt produkcióhoz:

```env
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

## Közreműködés

1. Fork-old a repository-t
2. Hozz létre egy feature branch-et
3. Végezd el a változtatásokat
4. Adj hozzá teszteket, ha szükséges
5. Küldj be egy pull request-et

## Licenc

Ez a projekt nyílt forráskódú és elérhető az [MIT Licenc](LICENSE) alatt.

## Támogatás

Ha bármilyen kérdésed van vagy segítségre van szükséged, kérlek nyiss egy issue-t a GitHub-on.
