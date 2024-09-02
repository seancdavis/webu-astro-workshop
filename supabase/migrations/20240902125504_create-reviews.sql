CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR NOT NULL,
  rating INTEGER CHECK (
    rating BETWEEN 1 AND 5
  ) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
