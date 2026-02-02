
# Aszód - Gyümölcsfa és Virághagyma Igénylés

Ez a webalkalmazás lehetővé teszi Aszód lakosai számára, hogy ingyenesen igényeljenek facsemetéket és virághagymákat az önkormányzat készleteiből. A rendszer valós időben kezeli a készleteket és megakadályozza a túligénylést.

## Funkciók

- **Valós idejű készletfigyelés**: Azonnal látja a felhasználó, miből mennyi van.
- **Tranzakcionális igénylés**: Adatbázis szintű védelem a párhuzamos túligénylések ellen.
- **Premium Design**: Modern, reszponzív felület Next.js és Tailwind CSS használatával.
- **Supabase Backend**: Megbízható PostgreSQL alapú tárolás.

## Technikai Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, RPC functions)
- **Validáció**: Zod, React Hook Form

## Telepítés és Deploy (Vercel)

A projekt úgy lett kialakítva, hogy közvetlenül és egyszerűen deployolható legyen Vercelre.

### 1. Előkészületek (Supabase)

1. Hozz létre egy új projektet a [Supabase Dashboardon](https://supabase.com/dashboard).
2. Lépj a **SQL Editor** menüpontba.
3. Másold be és futtasd le a `supabase_schema.sql` fájl tartalmát (gyökérkönyvtárban található). Ez létrehozza a táblákat és a szükséges függvényeket, valamint feltölti a kezdeti készletet.

### 2. Deploy Vercelre

1. Forkold vagy klónozd ezt a repót a saját GitHub fiókodba (ha még nincs ott).
2. Regisztrálj/lépj be a [Vercelre](https://vercel.com).
3. Hozz létre egy új projektet (Add New -> Project).
4. Válaszd ki a GitHub repót (`aszod-gyumolcsfa-igenyles`).
5. A **Environment Variables** szekcióban add hozzá az alábbiakat (adatok a Supabase Project Settings -> API menüből):

   - `NEXT_PUBLIC_SUPABASE_URL`: A projekt URL-je (pl. `https://xyz.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: A publikus API kulcs (anon key)

6. Kattints a **Deploy** gombra.

### 3. Használat

A deploy után az oldal azonnal működőképes. A Supabase Dashboard *Table Editor* nézetében követheted nyomon a beérkező igényléseket (`applications` tábla).

## Adataxport

Az összes igénylés exportálható CSV/Excel formátumban közvetlenül a Supabase Dashboardról:
1. Nyisd meg az `applications` táblát.
2. Kattints a jobb felső sarokban a "Export" gombra -> "Export to CSV".

## Fejlesztés Helyben

```bash
# Függőségek telepítése
npm install

# Környezeti változók beállítása (.env.local fájlba)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Fejlesztői szerver indítása
npm run dev
```
