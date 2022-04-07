CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    category VARCHAR(50)
);