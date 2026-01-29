-- Stripe Payment Integration - Database Migration
-- Run this SQL in Supabase SQL Editor to add payment fields to orders table

-- Add payment fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add index for payment_intent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);

-- Add index for payment_status
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Update existing orders to have default payment_status if null
UPDATE orders 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;
