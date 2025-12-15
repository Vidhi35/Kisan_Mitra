-- Seed Development User Profile
-- This creates a mock user for development/testing when auth is bypassed

-- Insert dev user profile (upsert to avoid conflicts)
INSERT INTO profiles (
  id,
  full_name,
  phone,
  location,
  farm_size,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Dev Farmer',
  '+91 98765 43210',
  'Maharashtra, India',
  5.5,
  'farmer',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Add some sample plant diagnoses for the dev user
INSERT INTO plant_diagnoses (
  id,
  user_id,
  disease_name,
  crop_type,
  confidence,
  severity,
  symptoms,
  treatment_recommendation,
  image_url,
  diagnosed_at,
  created_at
) VALUES 
(
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Late Blight',
  'Tomato',
  0.92,
  'moderate',
  'Dark brown spots on leaves, white fuzzy growth on undersides',
  'Apply copper-based fungicide, remove affected leaves, improve air circulation',
  '/placeholder.svg?height=400&width=400',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'a0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Healthy',
  'Rice',
  0.98,
  'none',
  'No visible symptoms, healthy green leaves',
  'Continue regular care and monitoring',
  '/placeholder.svg?height=400&width=400',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- Add sample farm records
INSERT INTO farm_records (
  id,
  user_id,
  crop_name,
  record_type,
  description,
  quantity,
  unit,
  cost,
  date,
  notes,
  created_at,
  updated_at
) VALUES 
(
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Wheat',
  'planting',
  'Planted winter wheat',
  50,
  'kg',
  2500,
  CURRENT_DATE - INTERVAL '30 days',
  'Good soil conditions',
  NOW(),
  NOW()
),
(
  'b0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Tomato',
  'harvest',
  'First tomato harvest',
  200,
  'kg',
  0,
  CURRENT_DATE - INTERVAL '7 days',
  'Excellent yield this season',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Add sample community posts
INSERT INTO community_posts (
  id,
  author_id,
  title,
  content,
  category,
  tags,
  likes_count,
  comments_count,
  views_count,
  is_pinned,
  created_at,
  updated_at
) VALUES 
(
  'c0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Tips for organic tomato farming',
  'I have been growing organic tomatoes for 5 years now. Here are my top tips: 1) Use compost tea weekly, 2) Rotate crops every season, 3) Plant marigolds nearby for pest control.',
  'tip',
  ARRAY['organic', 'tomato', 'tips'],
  12,
  3,
  45,
  false,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  'c0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Help identifying pest on my rice crop',
  'I found some small insects on my rice plants. They seem to be eating the leaves. Can anyone help identify them?',
  'question',
  ARRAY['rice', 'pest', 'help'],
  5,
  8,
  120,
  false,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- Add weather alerts for the dev user's location
INSERT INTO weather_alerts (
  id,
  location,
  state,
  alert_type,
  severity,
  title,
  description,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  'd0000000-0000-0000-0000-000000000001',
  'Maharashtra',
  'Maharashtra',
  'rain',
  'moderate',
  'Heavy Rainfall Expected',
  'Heavy rainfall expected in the next 48 hours. Secure crops and ensure proper drainage.',
  NOW(),
  NOW() + INTERVAL '2 days',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
