/*
  LUSTRAX CORE DATABASE SCHEMA
  
  This file defines the base structure of the Lustrax-Jewelries database, 
  including custom enums, tables, and auth-triggered profile creation.
  
  Order of execution: 
  1. schema.sql (This file)
  2. storage.sql
  3. policies.sql
  4. functions/*.sql
*/
*/
-- ==========================================
-- 1. CUSTOM ENUMS (Domain Types)
-- ==========================================

-- Standardized roles for access control
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Possible states for an order in the fulfillment pipeline
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');

-- Payment state for tracking financial completion
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'failed');

-- Precise tracking for successful/failed payment attempts
CREATE TYPE transaction_status AS ENUM ('success', 'failed');

-- ==========================================
-- 2. CORE TABLES
-- ==========================================

-- PROFILES: Extends Supabase auth.users with app-specific metadata.
-- Automatically populated via the handle_new_user() trigger.
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS: The catalog of jewelry items available for purchase.
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'Uncategorized',
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS: High-level records of customer purchases.
-- The 'products' column uses JSONB to store a snapshot of items (id, quantity).
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  products JSONB NOT NULL,
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  order_status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS: Financial validation records linked to Paystack references.
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL,
  status transaction_status,
  reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. AUTH AUTOMATION (Triggers)
-- ==========================================

-- FUNCTION: handle_new_user()
-- Purpose: Ensures every authenticated user has a corresponding row in the 'profiles' table.
-- SECURITY DEFINER: Ensures the function runs with elevated privileges to bypass RLS initially.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: on_auth_user_created
-- Fires immediately after a new user rows is inserted into auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 4. REAL-TIME CONFIGURATION
-- ==========================================

-- Enable Real-time broadcasts for the Admin and Customer dashboards 
-- to reflect live order/transaction updates without refreshing.
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
