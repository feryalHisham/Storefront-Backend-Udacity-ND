# Image Processing API

## Overview

A backend API for a store that has products and users. It provides API endpoints to:

- Retrieve all products
- Retrieve product with specific id
- Add product
- Retrieve all users
- Retrieve user with specific id
- Add user
- Create order
- Retrieve all orders
- Retrieve order with specific id
- Retrieve all orders associated with specific user
- Authenticate user

### Prerequisites

Before you can run this project you need to install the following:

- [Node.js](https://nodejs.org/en/download/)
- Check that Node.js is installed by typing `node --version` in the terminal (or cmd)
- [Postgres](https://www.postgresql.org/download/)

### Install the dependencies

Clone the project and in the root directory open the terminal and type `npm install` to install the needed dependencies to run the project

### Setup environment and Database

- Create a `.env` file in the root directory to add the required environment variables as below

  ```bash
  # Server listening at port 3000
  PORT=3000

  # default env
  ENV=DEV

  # Database information
  # Database host
  POSTGRES_HOST=127.0.0.1
  # Dev Database name
  POSTGRES_DB=dev_db_name
  # Test Database name
  POSTGRES_DB_TEST=test_db_name
  # Database username
  POSTGRES_USER=postgres
  # Database password
  POSTGRES_PASSWORD=your-password

  # Pepper and salt for bcrypt
  PEPPER=pepper-secret
  SALT_ROUNDS=10

  # secret for JWT
  JWT_SECRET= jwt-secret
  ```

- Open the psql sell terminal and create two database for dev and test which are dev_db_name and test_db_name using the SQL queries `CREATE DATABASE dev_db_name;` `CREATE DATABASE test_db_name;`

- Run migrations to create the database tables
  ```bash
  npx db-migrate up
  ```

### Start the server

To start the server run the command `npm run dev`. The server is now up and listening on port 3000

## How to call an API?

Refer to [REQUIREMENTS.md](REQUIREMENTS.md) to find the list of all API endpoints with detailed information about each endpoint url, HTTP method and expected request and response.

For example to call Index Products that gets all products, open your browser or postman and enter the url (http://localhost:3000/mystore/products).

## Testing

To run the specs use the command `npm run test`.

## Formatting and Linting

To apply prettier formatting run `npm run format`.
To apply linting run `npm run lint`.

## Implementation

This project is developed with `TypeScript` and using:

- [Node.js](https://nodejs.org/en/download/)
- [Express](https://expressjs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [pg](https://www.npmjs.com/package/pg)
- [db-migrate](https://www.npmjs.com/package/db-migrate)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

### Project structure and files

```bash
─src
    │   enviroment-variables.ts # exports .env variables to be used across the application
    │   index.ts
    │
    ├───database
    │       database.ts  # Creates an instance of database pool
    │
    ├───middlewares
    │       verify-jwt.middleware.ts
    │
    ├───models
    │   ├───order
    │   │       order-response.type.ts
    │   │       order.model.ts
    │   │       order.type.ts
    │   │
    │   ├───order-product
    │   │       product-in-order.type.ts
    │   │
    │   ├───product
    │   │       product.model.ts
    │   │       product.type.ts
    │   │
    │   └───user
    │           user.model.ts
    │           user.type.ts
    │
    ├───routes
    │   │   index.ts
    │   │
    │   └───handlers
    │           authenticate.ts
    │           orders.ts
    │           products.ts
    │           users-orders.ts
    │           users.ts
    │
    ├───services
    │   ├───authentication
    │   │       authentication.service.ts
    │   │
    │   └───users-orders # to handle the request of getting user's orders
    │           order-with-products.type.ts
    │           user-orders.type.ts
    │           users-orders.service.ts
    │
    ├───tests
    │   │   orders-endpoints.spec.ts
    │   │   orders-model.spec.ts
    │   │   products-endpoints.spec.ts
    │   │   products-model.spec.ts
    │   │   user-model.spec.ts
    │   │   users-endpoints.spec.ts
    │   │
    │   └───helpers
    │           reporter.ts
    │
    └───utils
            utilities.ts
```
