-- Shipping rates by region
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country_code)
);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_country ON shipping_rates(country_code);

-- Seed default rate (use country_code '*' for fallback)
INSERT INTO shipping_rates (name, country_code, price)
VALUES ('Default', '*', 9.99)
ON CONFLICT (country_code) DO NOTHING;

-- Allow public read so checkout and cart can fetch rates (anon key)
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read shipping_rates" ON shipping_rates;
CREATE POLICY "Allow public read shipping_rates" ON shipping_rates
  FOR SELECT USING (true);
