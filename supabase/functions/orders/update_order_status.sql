/*
  FUNCTION: update_order_status(p_order_id, p_new_status)
  
  Purpose: 
  Allows administrators to transition an order through the 
  fulfillment pipeline (e.g., from 'pending' to 'shipped').
  
  Parameters:
  - p_order_id (UUID): The unique identifier for the order.
  - p_new_status (order_status): The target status (shipped, delivered, etc.).
  
  Security:
  - Restricted to users with the 'admin' role.
  - SECURITY DEFINER ensures it has permissions to bypass standard RLS for updates.
*/

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_new_status order_status
)
RETURNS VOID AS $$
BEGIN
  -- Authorization Check: Ensure only management can trigger status changes.
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can update order statuses';
  END IF;

  UPDATE orders
  SET order_status = p_new_status
  WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
