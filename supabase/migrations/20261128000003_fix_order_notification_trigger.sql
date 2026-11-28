-- MIGRATION: Fix handle_new_order_notification for guest checkouts (NULL user_id)
-- When user_id is NULL (guest checkout), COALESCE recipient_name or fallback to 'Valued Guest' instead of evaluating to NULL which violated NOT NULL constraint on message.

CREATE OR REPLACE FUNCTION public.handle_new_order_notification()
RETURNS TRIGGER AS $$
DECLARE
    v_customer_name TEXT;
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        SELECT full_name INTO v_customer_name FROM public.profiles WHERE id = NEW.user_id;
    END IF;

    v_customer_name := COALESCE(v_customer_name, NEW.recipient_name, 'a Valued Guest');

    INSERT INTO public.notifications (title, message, type, link)
    VALUES (
        'New Order Received',
        'A new order (Ref: ' || COALESCE(NEW.payment_reference, NEW.id::text) || ') has been placed by ' || v_customer_name || '.',
        'order',
        '/admin/orders'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
