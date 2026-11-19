/*
  FUNCTION: check_admin_role()
  
  Purpose: 
  A secure, server-side RPC to verify if the currently authenticated 
  user has the 'admin' role. This is more reliable than client-side 
  checks because it runs directly against the database record.
  
  Usage:
  Called from the frontend AuthContext and AdminLogin pages.
  
  Returns:
  - BOOLEAN: True if admin, false otherwise.
*/

CREATE OR REPLACE FUNCTION check_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
