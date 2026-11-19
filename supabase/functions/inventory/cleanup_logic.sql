/*
  LUSTRAX INVENTORY CLEANUP & STOCK REVERSION
  
  This file implements the logic to automatically return products to 
  the inventory if an order sits 'unpaid' for too long.
*/

-- FUNCTION: revert_order_stock(p_order_id)
-- Purpose: Returns items from a specific order back to the 'products' stock.
CREATE OR REPLACE FUNCTION revert_order_stock(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
  v_item JSONB;
BEGIN
  -- Loop through the JSONB products array in the order
  FOR v_item IN SELECT * FROM jsonb_array_elements((SELECT products FROM orders WHERE id = p_order_id))
  LOOP
    UPDATE products 
    SET stock = stock + (v_item->>'quantity')::INT 
    WHERE id = (v_item->>'product_id')::UUID;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: cleanup_expired_orders()
-- Purpose: Identifies 'unpaid' orders older than 1 hour, reverts stock, and cancels them.
CREATE OR REPLACE FUNCTION cleanup_expired_orders()
RETURNS VOID AS $$
DECLARE
  v_order_id UUID;
BEGIN
  FOR v_order_id IN 
    SELECT id FROM orders 
    WHERE payment_status = 'unpaid' 
    AND created_at < NOW() - INTERVAL '1 hour'
    AND order_status != 'cancelled'
  LOOP
    -- 1. Revert the stock
    PERFORM revert_order_stock(v_order_id);
    
    -- 2. Mark the order as cancelled
    UPDATE orders 
    SET order_status = 'cancelled' 
    WHERE id = v_order_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
