-- MIGRATION: Create cta_banners table for marketing catalog banners
CREATE TABLE IF NOT EXISTS public.cta_banners (
    id TEXT PRIMARY KEY,
    headline TEXT NOT NULL,
    subheading TEXT,
    button_text TEXT,
    button_link TEXT,
    is_external BOOLEAN DEFAULT false,
    tag TEXT,
    theme TEXT DEFAULT 'gold',
    background_image TEXT,
    active BOOLEAN DEFAULT true,
    insert_after_index INTEGER DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cta_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Public can view active cta_banners" 
ON public.cta_banners FOR SELECT 
USING (true);

-- Allow authenticated admins to manage banners
CREATE POLICY "Admins can manage cta_banners" 
ON public.cta_banners FOR ALL 
USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
)
WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- Seed initial banners
INSERT INTO public.cta_banners (id, headline, subheading, button_text, button_link, is_external, tag, theme, background_image, active, insert_after_index)
VALUES 
(
    'banner-vip-whatsapp',
    'LOOKING FOR SOMETHING SPECIAL?',
    'Chat with our team directly on WhatsApp for custom sizing, recommendations, and fast order assistance.',
    'Chat on WhatsApp',
    'https://wa.me/2348126839505?text=Hello%20Lustrax,%20I%20need%20help%20choosing%20a%20piece',
    true,
    'Quick Support',
    'gold',
    '',
    true,
    8
),
(
    'banner-chains-drop',
    'EXPLORE OUR SOLID CHAINS',
    'Handcrafted links with premium weight and daily durability. Find your signature style.',
    'Shop Chains',
    '/?category=Necklaces',
    false,
    'Popular Collection',
    'dark',
    '',
    true,
    20
),
(
    'banner-free-delivery',
    'FREE DELIVERY ACROSS NIGERIA',
    'Every order is insured and safely packaged with certificate of authenticity included.',
    'Browse Best Sellers',
    '/?category=All',
    false,
    'Lustrax Promise',
    'minimal',
    '',
    true,
    36
)
ON CONFLICT (id) DO NOTHING;
