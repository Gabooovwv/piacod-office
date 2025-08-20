# Backend Setup Guide

Ez a dokumentum bemutatja, hogyan állítsd be és használd az új Express backend-et a Next.js alkalmazásodban.

## 🚀 Gyors Beállítás

### 1. Backend Függőségek Telepítése

```bash
cd backend
npm install
```

### 2. Környezeti Változók Beállítása

Másold le a `backend/env.example` fájlt `.env` néven és állítsd be az adatbázis kapcsolatot:

```bash
cd backend
copy env.example .env
```

Szerkeszd a `.env` fájlt:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Backend Indítása

```bash
cd backend
npm run dev
```

A backend elérhető lesz: http://localhost:3002

### 4. Frontend Backend API-val Indítása

```bash
# Környezeti változók beállítása
set NEXT_PUBLIC_API_MODE=backend
set NEXT_PUBLIC_BACKEND_URL=http://localhost:3002

# Next.js indítása
npm run dev
```

## 📚 API Dokumentáció

A backend indítása után elérhető:

- **Swagger UI:** http://localhost:3002/api-docs
- **Health Check:** http://localhost:3002/health
- **API Base:** http://localhost:3002/api

## 🔄 API Változások

### Termékek API

| Metódus | Endpoint | Leírás |
|---------|----------|---------|
| GET | `/api/products` | Összes termék lekérése |
| GET | `/api/products/:id` | Termék ID alapján |
| PATCH | `/api/products/:id` | Termék státusz frissítése |
| DELETE | `/api/products/:id` | Termék törlése |

### Kategóriák API

| Metódus | Endpoint | Leírás |
|---------|----------|---------|
| GET | `/api/categories` | Fő kategóriák |
| GET | `/api/categories/:id` | Kategória ID alapján |
| GET | `/api/categories/:id/subcategories` | Alkategóriák |

### Autentikáció

| Metódus | Endpoint | Leírás |
|---------|----------|---------|
| POST | `/api/auth/login` | Bejelentkezés |
| GET | `/api/auth/me` | Jelenlegi felhasználó |
| POST | `/api/auth/logout` | Kijelentkezés |
| POST | `/api/auth/validate` | Token validálás |

## 🛠️ Frontend Módosítások

### 1. API Konfiguráció Használata

A frontend most már automatikusan használja az új API konfigurációt:

```javascript
import apiClient from '@/lib/api-client';

// Termékek lekérése
const products = await apiClient.getProducts();

// Termék státusz frissítése
await apiClient.updateProductStatus(id, true);

// Kategóriák lekérése
const categories = await apiClient.getCategories();
```

### 2. Környezeti Változók

A frontend automatikusan vált a Next.js API routes és a backend között:

```env
# Backend használatához
NEXT_PUBLIC_API_MODE=backend
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Next.js API routes használatához (alapértelmezett)
NEXT_PUBLIC_API_MODE=nextjs
```

## 🚀 Gyors Indítás Scriptek

### Windows

1. **Backend indítása:**
   ```bash
   start-backend.bat
   ```

2. **Frontend indítása (backend API-val):**
   ```bash
   start-frontend.bat
   ```

### Manuális Indítás

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   set NEXT_PUBLIC_API_MODE=backend
   set NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
   npm run dev
   ```

## 🔍 Hibaelhárítás

### Gyakori Problémák

1. **Adatbázis kapcsolat sikertelen**
   - Ellenőrizd a MySQL beállításokat a `.env` fájlban
   - Győződj meg róla, hogy a MySQL szerver fut
   - Ellenőrizd, hogy az adatbázis létezik

2. **CORS hibák**
   - Ellenőrizd a `CORS_ORIGIN` beállítást a backend `.env` fájlban
   - Győződj meg róla, hogy a frontend URL helyes

3. **Port már használatban**
   - Változtasd meg a `PORT` beállítást a backend `.env` fájlban
   - Állítsd le a portot használó folyamatot

4. **API hívások sikertelenek**
   - Ellenőrizd, hogy mindkét szerver fut
   - Nézd meg a böngésző konzolját hibákért
   - Ellenőrizd a backend logokat

## 📊 Teljesítmény Előnyök

### Backend Előnyök

- ✅ **Külön szerver:** Jobb skálázhatóság
- ✅ **Swagger UI:** Automatikus API dokumentáció
- ✅ **Rate Limiting:** API védelme
- ✅ **Security Headers:** Biztonsági fejlesztések
- ✅ **Connection Pooling:** Hatékony adatbázis kapcsolat
- ✅ **Logging:** Részletes naplózás

### Frontend Előnyök

- ✅ **Könnyű váltás:** API módok között
- ✅ **Hibakezelés:** Központosított API kliens
- ✅ **Type Safety:** TypeScript támogatás
- ✅ **Konfigurálhatóság:** Környezeti változókkal

## 🔄 Visszaállítás Next.js API Routes-ra

Ha vissza szeretnél váltani a Next.js API routes-ra:

```bash
# Környezeti változók törlése vagy módosítása
set NEXT_PUBLIC_API_MODE=nextjs

# Next.js indítása
npm run dev
```

## 📝 Következő Lépések

1. **Autentikáció:** JWT token kezelés hozzáadása
2. **Validáció:** Request/response validáció
3. **Tesztelés:** Unit és integrációs tesztek
4. **Monitoring:** Logging és monitoring fejlesztése
5. **Deployment:** Production környezet beállítása

## 🆘 Segítség

Ha problémába ütközöl:

1. Ellenőrizd a backend logokat
2. Nézd meg a Swagger dokumentációt
3. Teszteld az API végpontokat a Swagger UI-ban
4. Ellenőrizd a környezeti változókat 