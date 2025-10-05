# 🧩 Node.js + TypeScript + MySQL (Dockerized REST API)

A modular, production-ready REST API built with **Node.js 20**, **TypeScript**, **Express**, and **Sequelize ORM**, using **MySQL** (compatible with AWS RDS).  
This project includes a clean architecture for services, models, and database logic — fully dockerized and seed-ready.

---

## 🚀 Features

- ⚙️ **Node.js 20 + TypeScript** for type-safe backend development
- 🧱 **Sequelize ORM** for MySQL (supports AWS RDS & local DBs)
- 🧩 **Modular folder structure** (models, services, controllers)
- 🧫 **Seed system** for initializing test or demo data
- 🐳 **Docker & Docker Compose** ready for local or remote deployment
- 🔐 **Environment variables via `.env` file (with `.env.example`)**
- ♻️ Supports **automatic seed execution** before app start (configurable)

---

## 📁 Project Structure

```
src/
 ├── app/                   # Express apps (Customers API / Orders API)
 │   ├── customers/
 │   │   ├── controller.ts
 │   │   ├── service.ts
 │   │   └── routes.ts
 │   └── orders/
 │       ├── controller.ts
 │       ├── service.ts
 │       └── routes.ts
 │
 ├── db/
 │   ├── models/            # Sequelize model definitions
 │   │   ├── Customer.ts
 │   │   ├── Product.ts
 │   │   ├── Order.ts
 │   │   └── OrderItem.ts
 │   ├── seeds/             # Data seeding scripts
 │   │   ├── index.ts
 │   │   ├── CustomerSeed.ts
 │   │   └── ProductSeed.ts
 │   └── db.ts              # Database connection + model registration
 │
 ├── app.ts                 # Express bootstrap file
 └── ...
```

---

## ⚙️ Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-user>/<repo-name>.git
cd <repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Copy and configure the environment file

```bash
cp .env.example .env
```

### 4. Fill your `.env` file with credentials:

Example:

```bash
# Database
DB_DIALECT=mysql
DB_HOST=your-db-hostname
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database
DB_SSL=true
DB_SSL_CA_PATH=certs/rds-ca.pem

# Server
PORT=3000
NODE_ENV=development
```

---

## 🐳 Docker Setup

### 1. Build the image

```bash
docker compose build
```

### 2. Run the container

```bash
docker compose up
```

By default, the API will be available at:

```
Customers: http://localhost:3001
Orders: http://localhost:3002
```

---

## 🧪 Running Seeds Manually

You can seed the database both **locally** and **inside Docker**.

### Locally

```bash
npm run db:seed
```

### Inside Docker

```bash
docker compose run --rm api npm run db:seed:js
```

### Seed Workflow

1. Syncs database schema (`sequelize.sync({ force: true })`)
2. Seeds **Customers** and **Products**
3. Prints success logs

---

## 🧱 Development Scripts

| Command              | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `npm run dev`        | Run in development with `ts-node`                     |
| `npm run build`      | Compile TypeScript to JavaScript (outputs `/dist`)    |
| `npm start`          | Run compiled code (`node dist/app.js`)                |
| `npm run db:seed`    | Run seeds in local TypeScript mode                    |
| `npm run db:seed:js` | Run seeds from compiled `/dist` code (used by Docker) |

---

## 🧩 API Overview

### **Customers API** (`:3001`)

| Method   | Endpoint                            | Description               |
| -------- | ----------------------------------- | ------------------------- |
| `POST`   | `/customers`                        | Create a new customer     |
| `GET`    | `/customers/:id`                    | Retrieve a customer by ID |
| `GET`    | `/customers?search=&cursor=&limit=` | Paginated list/search     |
| `PUT`    | `/customers/:id`                    | Update a customer         |
| `DELETE` | `/customers/:id`                    | Soft delete (optional)    |

---

### **Products API** (`:3002`)

| Method  | Endpoint                           | Description           |
| ------- | ---------------------------------- | --------------------- |
| `POST`  | `/products`                        | Create product        |
| `PATCH` | `/products/:id`                    | Update price or stock |
| `GET`   | `/products/:id`                    | Get product detail    |
| `GET`   | `/products?search=&cursor=&limit=` | Search products       |

---

### **Orders API** (`:3002`)

| Method | Endpoint                                   | Description                                                      |
| ------ | ------------------------------------------ | ---------------------------------------------------------------- |
| `POST` | `/orders`                                  | Create order with `{ customer_id, items:[{ product_id, qty }] }` |
| `GET`  | `/orders/:id`                              | Get order details including items                                |
| `GET`  | `/orders?status=&from=&to=&cursor=&limit=` | Filter & paginate orders                                         |
| `POST` | `/orders/:id/cancel`                       | Cancel order (conditional logic by status)                       |

---

## 🧩 Folder Notes

- **`/src/db/models/`** — all Sequelize model definitions.
- **`/src/db/seeds/`** — contains initialization data and relationships.
- **`/src/app/`** — domain logic (controllers, services, routes).
- **`db.ts`** — centralizes connection, model registration, and relationships.

---

## 🔐 Security

- Environment variables are required; `.env` file is excluded via `.gitignore`.
- AWS RDS connection supports SSL (via `DB_SSL_CA_PATH`).
- Default CORS policy and basic input validation should be configured at controller level.

---

## 🧰 Tech Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Runtime          | Node.js 20                 |
| Language         | TypeScript                 |
| Framework        | Express                    |
| ORM              | Sequelize                  |
| Database         | MySQL (AWS RDS compatible) |
| Containerization | Docker + Docker Compose    |

---

## 🧑‍💻 Local Development (without Docker)

```bash
npm install
npm run dev
```

The API will run at:

```
Customers: http://localhost:3001
Orders: http://localhost:3002

```

---

## 🧾 License

This project is licensed under the **MIT License** — you can freely modify and distribute it with attribution.
