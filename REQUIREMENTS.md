# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
  - method: `GET`
  - endpoint: `mystore/products`
  - response: Array of `Products`
- Show
  - method: `GET`
  - endpoint: `mystore/products/:id` where `id` is the id of the product you wish to retrieve
  - response: `Product`
- Create [token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users

- Index [token required]
  - method: `GET`
  - endpoint: `mystore/users`
  - response: Array of `Users`
- Show [token required]
  - method: `GET`
  - endpoint: `mystore/users/:id`
  - response: `User`
- Create [token required]
  - method: `POST`
  - endpoint: `mystore/users/adduser`
  - request body:
    ```yaml
    {
      'firstname': 'FIRST_NAME',
      'lastname': 'LAST_NAME',
      'email': 'useremail@email.com',
      'password': 'mypassword'
    }
    ```
  - response: Success message with created user id

#### Orders

- Create
  - method: `POST`
  - endpoint: `mystore/orders/addorder`
  - request body:
    ```yaml
    {
      'userId': 2,
      'status': 'active',
      'products': [{ 'productId': 1, 'quantity': 20 }, { 'productId': 2, 'quantity': 10 }]
    }
    ```
  - response: Success message with created order id
- Index
  - method: `GET`
  - endpoint: `mystore/orders`
  - response:
    ```yaml
    [
      {
        'id': 1,
        'userId': '1',
        'productId': '1',
        'orderId': '1',
        'orderStatus': 'active',
        'quantity': 2
      },
      {
        'id': 2,
        'userId': '1',
        'productId': '2',
        'orderId': '1',
        'orderStatus': 'active',
        'quantity': 4
      }
    ]
    ```
- Show
  - method: `GET`
  - endpoint: `mystore/orders/:id`
  - response:
    ```yaml
    {
      'id': 1,
      'userId': '1',
      'productId': '1',
      'orderId': '1',
      'orderStatus': 'active',
      'quantity': 2
    }
    ```
- Get current orders by user [token required]
  - method: `GET`
  - endpoint: `mystore//userorders/:userid`
  - response:
    ```yaml
    {
      'userId': '2',
      'firstname': 'FIRST',
      'lastname': 'LAST',
      'orders':
        [
          {
            'orderId': '2',
            'orderStatus': 'active',
            'products':
              [
                {
                  'id': '1',
                  'name': 'product1',
                  'price': '20.00',
                  'category': 'toys',
                  'quantity': 20
                },
                {
                  'id': '2',
                  'name': 'product2',
                  'price': '300.00',
                  'category': 'bags',
                  'quantity': 10
                }
              ]
          },
          {
            'orderId': '3',
            'orderStatus': 'complete',
            'products':
              [
                {
                  'id': '1',
                  'name': 'product1',
                  'price': '20.00',
                  'category': 'toys',
                  'quantity': 40
                }
              ]
          }
        ]
    }
    ```
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

#### Authentication

- Authenticate a user in order to get a JWT token
  - method: `POST`
  - endpoint: `mystore/authenticate`
  - request body:
    ```yaml
    { 'email': 'test1@email.com', 'password': 'mypassword' }
    ```
  - response: a JWT token

## Data Shapes

#### Product

- id: `SERIAL PRIMARY KEY`
- product_name: `VARCHAR(50)`
- price: `DECIMAL(6,2)`
- category: `VARCHAR(50)`

#### User

- id: `SERIAL PRIMARY KEY`
- firstName: `VARCHAR(50)`
- lastName: `VARCHAR(50)`
- email: `VARCHAR(50) UNIQUE`
- user_password: `VARCHAR(225)`

#### Orders

- id `SERIAL PRIMARY KEY`
- user_id `BIGINT REFERENCES users(id)`
- status of order (active or complete) `VARCHAR(20)`

#### Order_Products

- order_id `BIGINT REFERENCES orders(id)`
- product_id `BIGINT REFERENCES products(id)`
- quantity `INTEGER`

## DataBase Schema

#### Products Table

```
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    category VARCHAR(50)
);

```

#### Users Table

```
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 firstname VARCHAR(50) NOT NULL,
 lastname VARCHAR(50) NOT NULL,
 email VARCHAR(50) UNIQUE NOT NULL,
 user_password VARCHAR(225) NOT NULL
);
```

#### Orders Table

```
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    order_status  VARCHAR(20)
);
```

#### Order Product Table to represent the Many-to-Many relationship between orders and products

```
CREATE TABLE order_product (
    id SERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    quantity INTEGER NOT NULL
);
```
