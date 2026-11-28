-- MIGRATION: Support Guest Checkout (Allow NULL user_id for guest orders and transactions)

-- 1. Alter orders table to allow NULL user_id
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- 2. Alter transactions table to allow NULL user_id
ALTER TABLE public.transactions ALTER COLUMN user_id DROP NOT NULL;

-- 3. Update create_order_secure to support guest checkout (NULL p_user_id)
CREATE OR REPLACE FUNCTION public.create_order_secure(
    p_user_id UUID,
    p_total_amount DECIMAL,
    p_payment_ref TEXT,
    p_shipping_details JSONB,
    p_order_items JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_item RECORD;
BEGIN
    -- 1. SECURITY PRE-FLIGHT: Ensure user ID matches auth context OR caller is admin OR it is a guest checkout (p_user_id IS NULL)
    IF auth.uid() IS NOT NULL AND p_user_id IS NOT NULL AND p_user_id != auth.uid() AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized Order Context: Profile ID mismatch';
    END IF;

    -- 2. Preventive Check: Avoid duplicates
    IF EXISTS (SELECT 1 FROM public.orders WHERE payment_reference = p_payment_ref) THEN
        RETURN jsonb_build_object('success', true, 'order_id', (SELECT id FROM public.orders WHERE payment_reference = p_payment_ref));
    END IF;

    -- 3. Create Master Order
    INSERT INTO public.orders (
        user_id, total_amount, status, payment_reference,
        shipping_address, shipping_city, shipping_phone, recipient_name,
        state, city, lga, area, street_address, landmark, latitude, longitude, full_address
    ) VALUES (
        p_user_id, p_total_amount, 'paid', p_payment_ref,
        p_shipping_details->>'address', p_shipping_details->>'city', 
        p_shipping_details->>'phone', p_shipping_details->>'name',
        p_shipping_details->>'state', p_shipping_details->>'city',
        p_shipping_details->>'lga', p_shipping_details->>'area',
        p_shipping_details->>'street_address', p_shipping_details->>'landmark',
        (p_shipping_details->'coordinates'->>'lat')::DECIMAL,
        (p_shipping_details->'coordinates'->>'lng')::DECIMAL,
        p_shipping_details->>'full_address'
    ) RETURNING id INTO v_order_id;

    -- 4. Ingest Order Items (Denormalized) and Deduct Stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_order_items) AS x(
        id UUID, 
        variant_id UUID,
        name TEXT, 
        price DECIMAL, 
        quantity INTEGER,
        attributes JSONB
    )
    LOOP
        -- Insert the item with full variant context
        INSERT INTO public.order_items (
            order_id, product_id, variant_id, product_name, price, quantity, attributes
        ) VALUES (
            v_order_id, v_item.id, v_item.variant_id, v_item.name, v_item.price, v_item.quantity, v_item.attributes
        );

        -- 5. ATOMIC INVENTORY DEPLETION
        IF v_item.variant_id IS NOT NULL THEN
            UPDATE public.product_variants 
            SET stock_quantity = stock_quantity - v_item.quantity
            WHERE id = v_item.variant_id AND stock_quantity >= v_item.quantity;
            
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Insufficient stock for variation of %', v_item.name;
            END IF;
        ELSE
            -- Fallback to base product stock
            UPDATE public.products 
            SET stock_quantity = stock_quantity - v_item.quantity
            WHERE id = v_item.id AND stock_quantity >= v_item.quantity;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Insufficient stock for product %', v_item.name;
            END IF;
        END IF;
    END LOOP;

    -- 6. Log Financial Transaction
    INSERT INTO public.transactions (
        user_id, order_id, amount, status, payment_reference
    ) VALUES (
        p_user_id, v_order_id, p_total_amount, 'success', p_payment_ref
    );

    RETURN jsonb_build_object('success', true, 'order_id', v_order_id);
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Protocol Failure: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
