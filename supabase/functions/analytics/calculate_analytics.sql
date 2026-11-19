/*
  FUNCTION: calculate_analytics()
  
  Purpose: 
  Aggregates key business metrics for the Admin Dashboard, including 
  total revenue from paid orders, total order count, and product variety.
  
  Returns:
  - total_sales (NUMERIC): The sum of total_price for all 'paid' orders.
  - total_orders (BIGINT): The count of all orders in the system.
  - active_products (BIGINT): The count of all products in the catalog.
  
  Security:
  - Restricted to users with the 'admin' role.
  - SECUIRTY DEFINER ensures the function can query all tables regardless of RLS.
*/

CREATE OR REPLACE FUNCTION calculate_analytics()
RETURNS TABLE (
  total_sales NUMERIC,
  total_orders BIGINT,
  active_products BIGINT
) AS $$
BEGIN
  -- Authorization Check: Ensure the caller is an administrator.
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can view analytics';
  END IF;

  RETURN QUERY
  SELECT
    COALESCE(SUM(o.total_price), 0) AS total_sales,
    (SELECT COUNT(*) FROM orders) AS total_orders,
    (SELECT COUNT(*) FROM products) AS active_products
  FROM orders o 
  WHERE o.payment_status = 'paid';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
