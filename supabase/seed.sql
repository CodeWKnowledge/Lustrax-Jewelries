-- Insert Admin User (Auth)
-- NOTE: In Supabase, you must first create the user in GoTrue (auth.users).
-- This seed assumes you have created an admin in the Supabase UI with the email 'admin@lustrax.com'.
-- If you haven't, the handle_new_user trigger will catch their signup, but you STILL need to manually set their role to 'admin' using:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@lustrax.com';

-- Seed 5 Sample Products
INSERT INTO products (name, price, stock, description, category, image_url)
VALUES
  ('Aurelia Diamond Ring', 1250000, 5, '18k gold with ethically sourced 1ct diamond.', 'Rings', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2000'),
  ('Lustrax Silk Necklace', 450000, 12, 'Minimalist 24k gold chain necklace.', 'Necklaces', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000'),
  ('Celestial Studs', 180000, 25, 'Sterling silver star-shaped earrings.', 'Earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2000'),
  ('Infinity Bangle', 320000, 8, 'Hammered gold infinity-style bracelet.', 'Bracelets', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000')
ON CONFLICT DO NOTHING;

-- Note: Orders and Transactions are intrinsically tied to specific customer UUIDs.
-- Proceed with creating test users in Supabase Auth and placing orders via the frontend.
