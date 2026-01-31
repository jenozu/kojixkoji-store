-- Run this in Supabase SQL Editor if checkout still shows $9.99 for Canada
-- after you set Canada (CA) to $0 in Admin → Settings → Shipping.
-- This allows the public API to read shipping_rates (required for checkout).

ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read shipping_rates" ON shipping_rates;
CREATE POLICY "Allow public read shipping_rates" ON shipping_rates
  FOR SELECT USING (true);
