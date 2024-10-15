## Cara memulai :

```bash
npm init -y
```

ini digunakan untuk membuat package json

## List dependencies dan dev dependencies :

```bash
npm install express
npm install prisma
npm install @prisma/client
npm install zod
npm install cors
npm install jsonwebtoken
npm install uuid
npm install bcrypt
npm install dotenv #jika diperlukan
npm install express-session jsonwebtoken cookie-parser #jika diperlukan
npm install @types/express-session @types/jsonwebtoken @types/cookie-parser --save-dev #jika diperlukan
```

```bash
npm install -D typescript
npm install -D @types/node
npm install -D @types/express
npm install -D @types/cors
npm install -D @types/jsonwebtoken
npm install -D @types/uuid
npm install -D @types/bcrypt
npm install -D eslint
npm install -D @typescript-eslint/parser
npm install -D @typescript-eslint/eslint-plugin
npm install -D ts-node-dev
```

## tsconfig, eslint dan prisma

```bash
npx tsc --init
```

untuk membuat tsconfig.json

```bash
npx eslint --init
```

untuk membuat eslintrc.json atau mjs

```bash
npx prisma init
```

Untuk inisialisasi prisma

```bash
npx prisma migrate dev --name initial_migrate
```

untuk membuat migrasi prisma, pastikan sudah memiliki model database

```bash
# MySQL Connection
DATABASE_URL="mysql://username:password@localhost:3306/nama_database"

# PostgreSQL Connection
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Contoh koneksi prisma ke database
