-- Seed data: 5 sellers, 15 listings, 8 orders, 10 reviews
-- Uses deterministic UUIDs for reproducible local development.

-- Create demo users via Supabase auth (auto-creates profiles via trigger)
-- In local dev, auto-confirm is enabled so these users are immediately active.
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES
  ('a0000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000',
   'alice@demo.local', crypt('password123', gen_salt('bf')),
   NOW(), '{"full_name":"Alice Chen"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW()),
  ('a0000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000',
   'bob@demo.local', crypt('password123', gen_salt('bf')),
   NOW(), '{"full_name":"Bob Martinez"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW()),
  ('a0000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000',
   'carol@demo.local', crypt('password123', gen_salt('bf')),
   NOW(), '{"full_name":"Carol Davis"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW()),
  ('a0000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000',
   'dave@demo.local', crypt('password123', gen_salt('bf')),
   NOW(), '{"full_name":"Dave Kim"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW()),
  ('a0000000-0000-4000-8000-000000000005', '00000000-0000-0000-0000-000000000000',
   'eve@demo.local', crypt('password123', gen_salt('bf')),
   NOW(), '{"full_name":"Eve Robinson"}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ensure profiles exist (trigger should have created them, but just in case)
INSERT INTO profiles (id, email, full_name, bio) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'alice@demo.local', 'Alice Chen',
   'Vintage electronics collector and restorer. Based in San Francisco.'),
  ('a0000000-0000-4000-8000-000000000002', 'bob@demo.local', 'Bob Martinez',
   'Furniture maker and woodworking enthusiast. Custom pieces available.'),
  ('a0000000-0000-4000-8000-000000000003', 'carol@demo.local', 'Carol Davis',
   'Fashion designer specializing in sustainable clothing and accessories.'),
  ('a0000000-0000-4000-8000-000000000004', 'dave@demo.local', 'Dave Kim',
   'Sports equipment dealer. Quality gear at fair prices.'),
  ('a0000000-0000-4000-8000-000000000005', 'eve@demo.local', 'Eve Robinson',
   'Home and garden specialist. Curated collection of indoor plants and decor.')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio;

-- 15 Listings across categories (3 per seller)
INSERT INTO listings (id, seller_id, title, description, price, category, image_urls, status) VALUES
  -- Alice: Electronics
  ('b0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001',
   'Vintage Sony Walkman TPS-L2', 'Original 1979 Sony Walkman in working condition. The first portable cassette player ever made. Includes original headphones and leather case. Minor cosmetic wear consistent with age.',
   450.00, 'electronics',
   ARRAY['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000002',
   'a0000000-0000-4000-8000-000000000001',
   'Restored 1960s Tube Amplifier', 'Fully restored Fisher X-100-B stereo tube amplifier. All capacitors replaced, tubes tested strong. Rich warm sound perfect for vinyl listening. 30W per channel.',
   1200.00, 'electronics',
   ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000003',
   'a0000000-0000-4000-8000-000000000001',
   'Mechanical Keyboard — Cherry MX Blue', 'Custom-built 65% mechanical keyboard with Cherry MX Blue switches, PBT keycaps, and aluminum case. USB-C, hot-swappable. Excellent tactile feedback for typists.',
   189.00, 'electronics',
   ARRAY['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800'],
   'active'),
  -- Bob: Furniture
  ('b0000000-0000-4000-8000-000000000004',
   'a0000000-0000-4000-8000-000000000002',
   'Handmade Walnut Dining Table', 'Solid black walnut dining table, seats 6-8. Live-edge design with epoxy river detail in deep blue. Hand-rubbed oil finish. Dimensions: 72" x 36" x 30".',
   2800.00, 'furniture',
   ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000005',
   'a0000000-0000-4000-8000-000000000002',
   'Mid-Century Modern Bookshelf', 'Inspired by Danish mid-century design. Made from white oak with brass hardware. Five adjustable shelves. Dimensions: 36" W x 12" D x 72" H. Ships flat-packed.',
   650.00, 'furniture',
   ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000006',
   'a0000000-0000-4000-8000-000000000002',
   'Reclaimed Wood Coffee Table', 'Coffee table made from 100-year-old barn wood. Hairpin legs in matte black steel. Natural patina preserved. 48" x 24" x 18". Each piece is unique.',
   420.00, 'furniture',
   ARRAY['https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=800'],
   'active'),
  -- Carol: Clothing
  ('b0000000-0000-4000-8000-000000000007',
   'a0000000-0000-4000-8000-000000000003',
   'Organic Linen Summer Dress', 'Handmade A-line dress in natural undyed linen. Adjustable waist tie, two side pockets, relaxed fit. Available in S/M/L. Sustainably sourced fabric.',
   135.00, 'clothing',
   ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000008',
   'a0000000-0000-4000-8000-000000000003',
   'Hand-Knit Merino Wool Scarf', 'Chunky cable-knit scarf in 100% merino wool. Measures 72" x 12". Naturally temperature-regulating and incredibly soft. Color: heathered charcoal.',
   85.00, 'clothing',
   ARRAY['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000009',
   'a0000000-0000-4000-8000-000000000003',
   'Upcycled Denim Jacket — One of a Kind', 'Vintage Levi''s trucker jacket with hand-embroidered floral patches and custom distressing. Size M. A wearable art piece that tells a story.',
   220.00, 'clothing',
   ARRAY['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'],
   'active'),
  -- Dave: Sports
  ('b0000000-0000-4000-8000-000000000010',
   'a0000000-0000-4000-8000-000000000004',
   'Carbon Fiber Road Bike Frame', 'Lightweight carbon fiber frame, size 56cm. Internal cable routing, tapered head tube, press-fit BB86. Weighs just 950g. Uncut steerer tube included.',
   899.00, 'sports',
   ARRAY['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000011',
   'a0000000-0000-4000-8000-000000000004',
   'Professional Boxing Gloves 16oz', 'Genuine leather boxing gloves, 16oz. Multi-layer foam padding, reinforced wrist support. Used by amateur and pro fighters. Color: classic black/gold.',
   129.00, 'sports',
   ARRAY['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000012',
   'a0000000-0000-4000-8000-000000000004',
   'Camping Hammock with Rain Fly', 'Double-wide nylon hammock with mosquito net and waterproof rain fly. Supports up to 500 lbs. Includes tree straps and stuff sack. Perfect for backpacking.',
   79.00, 'sports',
   ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
   'active'),
  -- Eve: Home & Garden
  ('b0000000-0000-4000-8000-000000000013',
   'a0000000-0000-4000-8000-000000000005',
   'Monstera Deliciosa — Large Established Plant', 'Healthy 3-foot Monstera with multiple fenestrated leaves. Comes in a 10" ceramic pot. Easy care — indirect light, water weekly. Local pickup or careful shipping available.',
   95.00, 'home-garden',
   ARRAY['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000014',
   'a0000000-0000-4000-8000-000000000005',
   'Handmade Ceramic Planter Set (3 pcs)', 'Set of three wheel-thrown planters in speckled stoneware. Drainage holes with matching saucers. Sizes: 4", 6", 8". Finished in a matte white glaze.',
   110.00, 'home-garden',
   ARRAY['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'],
   'active'),
  ('b0000000-0000-4000-8000-000000000015',
   'a0000000-0000-4000-8000-000000000005',
   'Macrame Wall Hanging — Large', 'Hand-knotted macrame wall hanging in natural cotton rope. 36" wide x 48" long. Mounted on a driftwood branch. Adds texture and warmth to any room.',
   175.00, 'home-garden',
   ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
   'sold')
ON CONFLICT (id) DO NOTHING;

-- 8 Orders (various buyers purchasing from different sellers)
INSERT INTO orders (id, buyer_id, listing_id, status, total, created_at) VALUES
  -- Dave buys Alice's Walkman
  ('c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000004',
   'b0000000-0000-4000-8000-000000000001',
   'delivered', 450.00, NOW() - INTERVAL '30 days'),
  -- Eve buys Bob's coffee table
  ('c0000000-0000-4000-8000-000000000002',
   'a0000000-0000-4000-8000-000000000005',
   'b0000000-0000-4000-8000-000000000006',
   'delivered', 420.00, NOW() - INTERVAL '25 days'),
  -- Alice buys Carol's scarf
  ('c0000000-0000-4000-8000-000000000003',
   'a0000000-0000-4000-8000-000000000001',
   'b0000000-0000-4000-8000-000000000008',
   'delivered', 85.00, NOW() - INTERVAL '20 days'),
  -- Bob buys Dave's hammock
  ('c0000000-0000-4000-8000-000000000004',
   'a0000000-0000-4000-8000-000000000002',
   'b0000000-0000-4000-8000-000000000012',
   'delivered', 79.00, NOW() - INTERVAL '15 days'),
  -- Carol buys Eve's macrame (the sold listing)
  ('c0000000-0000-4000-8000-000000000005',
   'a0000000-0000-4000-8000-000000000003',
   'b0000000-0000-4000-8000-000000000015',
   'delivered', 175.00, NOW() - INTERVAL '10 days'),
  -- Eve buys Alice's keyboard
  ('c0000000-0000-4000-8000-000000000006',
   'a0000000-0000-4000-8000-000000000005',
   'b0000000-0000-4000-8000-000000000003',
   'shipped', 189.00, NOW() - INTERVAL '5 days'),
  -- Alice buys Bob's bookshelf
  ('c0000000-0000-4000-8000-000000000007',
   'a0000000-0000-4000-8000-000000000001',
   'b0000000-0000-4000-8000-000000000005',
   'confirmed', 650.00, NOW() - INTERVAL '2 days'),
  -- Dave buys Carol's denim jacket
  ('c0000000-0000-4000-8000-000000000008',
   'a0000000-0000-4000-8000-000000000004',
   'b0000000-0000-4000-8000-000000000009',
   'pending', 220.00, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 10 Reviews (only on delivered orders)
INSERT INTO reviews (id, order_id, reviewer_id, rating, comment) VALUES
  -- Dave reviews Alice's Walkman
  ('d0000000-0000-4000-8000-000000000001',
   'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000004',
   5, 'Incredible find! The Walkman works perfectly and the original headphones are in great shape. Alice packaged it beautifully. A true collector''s piece.'),
  -- Alice reviews the Walkman sale (seller perspective not typical, but Dave as buyer)
  -- Actually let's have Alice review Carol's scarf
  ('d0000000-0000-4000-8000-000000000002',
   'c0000000-0000-4000-8000-000000000003',
   'a0000000-0000-4000-8000-000000000001',
   5, 'The softest scarf I''ve ever owned. The merino wool is incredibly luxurious and the cable-knit pattern is beautiful. Carol is a talented artisan.'),
  -- Eve reviews Bob's coffee table
  ('d0000000-0000-4000-8000-000000000003',
   'c0000000-0000-4000-8000-000000000002',
   'a0000000-0000-4000-8000-000000000005',
   4, 'Beautiful table with amazing character from the reclaimed wood. Deducting one star only because delivery took a bit longer than expected, but Bob was great with communication.'),
  -- Bob reviews Dave's hammock
  ('d0000000-0000-4000-8000-000000000004',
   'c0000000-0000-4000-8000-000000000004',
   'a0000000-0000-4000-8000-000000000002',
   5, 'Took this camping last weekend and it was perfect. Super comfortable, the rain fly kept me dry during an unexpected shower. Great value for the price.'),
  -- Carol reviews Eve's macrame
  ('d0000000-0000-4000-8000-000000000005',
   'c0000000-0000-4000-8000-000000000005',
   'a0000000-0000-4000-8000-000000000003',
   5, 'Absolutely stunning piece. The craftsmanship is impeccable and the driftwood branch adds such a nice organic touch. It transformed my living room wall.'),
  -- Additional reviews for variety
  ('d0000000-0000-4000-8000-000000000006',
   'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000004',
   5, 'Fast shipping, item exactly as described. Would definitely buy from this seller again. The leather case was a nice bonus.'),
  ('d0000000-0000-4000-8000-000000000007',
   'c0000000-0000-4000-8000-000000000002',
   'a0000000-0000-4000-8000-000000000005',
   4, 'The wood grain is even more beautiful in person. Pairs perfectly with my mid-century furniture. Hairpin legs are sturdy and well-made.'),
  ('d0000000-0000-4000-8000-000000000008',
   'c0000000-0000-4000-8000-000000000003',
   'a0000000-0000-4000-8000-000000000001',
   4, 'Wonderful quality and the heathered charcoal color goes with everything. Runs slightly narrower than I expected but still love it.'),
  ('d0000000-0000-4000-8000-000000000009',
   'c0000000-0000-4000-8000-000000000004',
   'a0000000-0000-4000-8000-000000000002',
   4, 'Good hammock for the price. The mosquito net is a nice touch. Tree straps could be a bit longer for larger trees but overall very happy.'),
  ('d0000000-0000-4000-8000-000000000010',
   'c0000000-0000-4000-8000-000000000005',
   'a0000000-0000-4000-8000-000000000003',
   5, 'Eve is incredibly talented. This is a real work of art. The cotton rope quality is excellent and the knots are perfectly even. Highly recommend!')
ON CONFLICT (order_id, reviewer_id) DO NOTHING;
