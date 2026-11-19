/*
  FUNCTION: create_order(p_customer_id, p_products, p_total_price)
  
  Purpose: 
  Handles the atomic creation of a new order while simultaneously 
  reducing product inventory levels.
  
  Parameters:
  - p_customer_id (UUID): The ID of the buyer.
  - p_products (JSONB): An array of objects: [{"product_id": "...", "quantity": "..."}].
  - p_total_price (NUMERIC): The final calculated cost of the order.
  
  Logic Flow:
  1. Validates that every requested product has sufficient stock.
  2. If stock is available, decrements the 'stock' column in 'products'.
  3. Inserts a new record into the 'orders' table with 'pending' status.
  
  Returns:
  - UUID: The generated ID of the new order.
  
  Security:
  - SECURITY DEFINER ensures it has the permissions to modify inventory/orders.
*/

CREATE OR REPLACE FUNCTION create_order(
  p_customer_id UUID,
  p_products JSONB,
  p_total_price NUMERIC
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_quantity INT;
  v_current_stock INT;
BEGIN
  -- 1. Inventory Validation & Allocation
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_products)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_quantity := (v_item->>'quantity')::INT;

    -- Fetch current inventory levels for the specific item
    SELECT stock INTO v_current_stock FROM products WHERE id = v_product_id;

    -- Guard: Prevent ordering more than is currently available
    IF v_current_stock < v_quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
    END IF;

    -- Update: Deduct the purchased quantity from global stock
    UPDATE products 
    SET stock = stock - v_quantity 
    WHERE id = v_product_id;
  END LOOP;

  -- 2. Order Record Creation
  INSERT INTO orders (customer_id, products, total_price, order_status, payment_status)
  VALUES (p_customer_id, p_products, p_total_price, 'pending', 'unpaid')
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
