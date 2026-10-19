BEGIN;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  image TEXT,
  in_stock BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total INTEGER NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  price INTEGER NOT NULL CHECK (price >= 0)
);

INSERT INTO products (title, price, image, in_stock) VALUES
  ('Simsiz quloqchin', 250000, 'https://placehold.co/600x400?text=Quloqchin', TRUE),
  ('Aqlli soat', 450000, 'https://placehold.co/600x400?text=Soat', TRUE),
  ('Klaviatura', 180000, 'https://placehold.co/600x400?text=Klaviatura', TRUE),
  ('Sichqoncha', 90000, 'https://placehold.co/600x400?text=Sichqoncha', FALSE),
  ('Monitor', 1500000, 'https://placehold.co/600x400?text=Monitor', TRUE),
  ('USB kabel', 35000, 'https://placehold.co/600x400?text=Kabel', TRUE);

COMMIT;
