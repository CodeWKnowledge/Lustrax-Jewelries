/*
  LUSTRAX SECURITY POLICIES (Row Level Security)
  
  This file implements the security layer for the Lustrax-Jewelries database.
  It ensures that users can only access their own data, while giving 
  admins full visibility over the system.
  
  Key Principles:
  - Default Deny: All tables have RLS enabled.
  - Public Visibility: Products and basic profiles are generally viewable.
  - Ownership: Orders and Transactions are restricted to the creator/owner.
  - Admin Supremacy: Users with the 'admin' role bypass most restrictions.
*/

-- ==========================================
-- 1. ENABLE RLS
-- ==========================================
-- By default, tables are locked down until policies are added.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. PROFILES POLICIES
-- ==========================================

-- Allows search and discovery (e.g., for social features or simplified lookups)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allows a new user to register their own profile data during signup
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Restricts profile editing to the account owner
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Grants admins full CRUD access to all profiles for management/moderation
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==========================================
-- 3. PRODUCTS POLICIES
-- ==========================================

-- Everyone (even guest users) should be able to browse the catalog
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Restricts catalog management (adding/editing/deleting) strictly to admins
CREATE POLICY "Only admins can modify products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==========================================
-- 4. ORDERS POLICIES
-- ==========================================

-- Privacy: A customer can only see their own order history
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Creation: A customer can place their own orders
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Management: Admins can view and update status for all customer orders
CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ==========================================
-- 5. TRANSACTIONS POLICIES
-- ==========================================

-- Privacy: Link transaction visibility to order ownership
CREATE POLICY "Users can view their own transactions via order link" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = transactions.order_id AND orders.customer_id = auth.uid())
  );

-- Auditing: Admins have full visibility for financial auditing and refunds
CREATE POLICY "Admins have full access to transactions" ON transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
