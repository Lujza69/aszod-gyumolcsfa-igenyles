
-- 1. Insert Admin User into auth.users if not exists
-- We use a fixed UUID for simplicity or generate one.
-- Password hash: $2b$10$JtDBRFbEXARRQKAejhVuh.t4eZJK2MYVUlpLORQ24Ixk8Q4RJ4/q.
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'raczpanni04@gmail.com';
  
  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', -- Default instance_id
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'raczpanni04@gmail.com',
      '$2b$10$JtDBRFbEXARRQKAejhVuh.t4eZJK2MYVUlpLORQ24Ixk8Q4RJ4/q.', -- Helper generated bcrypt hash
      now(), -- Auto-confirm email
      null,
      null,
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- 2. Create RLS Policy for Applications Table
-- Allow authenticated users (which is only our admin) to SELECT
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON applications;

CREATE POLICY "Enable read access for authenticated users"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
