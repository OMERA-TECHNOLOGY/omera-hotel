-- Drop all existing tables
DROP TABLE IF EXISTS 
    payment_reconciliation, payment_status, activity_logs, expenses, 
    booking_payments, payments, invoice_line_items, invoices, 
    order_items, restaurant_orders, menu_items, employees, 
    bookings, guests, room_features, rooms, room_types, 
    hotel_settings, users CASCADE;

-- Room Types with UUID
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('Single', 'Deluxe', 'Suite', 'Presidential')),
    description_amharic TEXT,
    description_english TEXT,
    base_price_birr DECIMAL(10,2) NOT NULL,
    base_price_usd DECIMAL(10,2),
    max_occupancy INTEGER NOT NULL,
    size VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms with UUID
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id),
    floor INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'cleaning', 'maintenance')),
    base_price_birr DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Features with UUID
CREATE TABLE room_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    feature VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ethiopian Guests with UUID
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    id_type VARCHAR(20) CHECK (id_type IN ('passport', 'kebele_id', 'driving_license', 'other')),
    id_number VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Ethiopian',
    region VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings with UUID
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES guests(id),
    room_id UUID REFERENCES rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    number_of_guests INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'active', 'checking_out', 'completed', 'cancelled')),
    source VARCHAR(20) DEFAULT 'walk_in' CHECK (source IN ('website', 'phone', 'walk_in', 'travel_agent', 'booking_com', 'other')),
    total_price_birr DECIMAL(10,2) NOT NULL,
    advance_payment_birr DECIMAL(10,2) DEFAULT 0,
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ethiopian Employees with UUID
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- References auth.users if using Supabase Auth
    first_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'receptionist', 'housekeeper', 'chef', 'waiter', 'cashier', 'security')),
    department VARCHAR(50) CHECK (department IN ('administration', 'front_desk', 'housekeeping', 'restaurant', 'finance', 'maintenance', 'security')),
    shift VARCHAR(50) CHECK (shift IN ('morning', 'day', 'afternoon', 'night')),
    salary_birr DECIMAL(10,2),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ethiopian Menu Items with UUID
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_english VARCHAR(100) NOT NULL,
    name_amharic VARCHAR(100),
    name_afan_oromo VARCHAR(100),
    category VARCHAR(20) CHECK (category IN ('breakfast', 'lunch', 'dinner', 'beverage', 'snack', 'traditional')),
    price_birr DECIMAL(10,2) NOT NULL,
    description_english TEXT,
    description_amharic TEXT,
    is_available BOOLEAN DEFAULT true,
    spice_level INTEGER CHECK (spice_level BETWEEN 1 AND 5),
    is_vegetarian BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurant Orders with UUID
CREATE TABLE restaurant_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) NOT NULL UNIQUE,
    booking_id UUID REFERENCES bookings(id),
    room_number VARCHAR(10),
    guest_name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'delivered')),
    total_amount_birr DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items with UUID
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES restaurant_orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices with UUID
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    booking_id UUID REFERENCES bookings(id),
    guest_name VARCHAR(200),
    room_number VARCHAR(10),
    subtotal_birr DECIMAL(10,2) NOT NULL,
    vat_amount_birr DECIMAL(10,2) NOT NULL,
    total_amount_birr DECIMAL(10,2) NOT NULL,
    amount_paid_birr DECIMAL(10,2) DEFAULT 0,
    balance_due_birr DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN (
        'unpaid', 'partially_paid', 'paid', 'overpaid', 'cancelled', 'refund_pending'
    )),
    due_date DATE,
    invoice_date DATE NOT NULL,
    vat_registration_number VARCHAR(50),
    tin_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Line Items with UUID
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount_birr DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments with UUID
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id),
    booking_id UUID REFERENCES bookings(id),
    amount_birr DECIMAL(10,2) NOT NULL,
    amount_usd DECIMAL(10,2),
    exchange_rate DECIMAL(10,2) DEFAULT 56.50,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN (
        'cash_birr', 'telebirr', 'cbe_birr', 'dashen_bank', 'awash_bank', 
        'chapa', 'amole', 'hello_cash', 'visa', 'mastercard', 'bank_transfer'
    )),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'processing', 'completed', 'failed', 'cancelled', 
        'refunded', 'partially_refunded', 'on_hold'
    )),
    transaction_reference VARCHAR(100),
    bank_reference VARCHAR(100),
    telebirr_transaction_id VARCHAR(100),
    cbe_birr_transaction_id VARCHAR(100),
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    recorded_by UUID REFERENCES employees(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking Payments with UUID
CREATE TABLE booking_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    amount_birr DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) CHECK (payment_type IN (
        'advance', 'balance', 'extension', 'damage_deposit', 'incidental'
    )),
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'pending',
    transaction_reference VARCHAR(100),
    due_date DATE,
    paid_date TIMESTAMPTZ,
    recorded_by UUID REFERENCES employees(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses with UUID
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) CHECK (category IN (
        'utilities', 'cleaning_supplies', 'maintenance', 'food_supplies', 
        'salaries', 'taxes', 'internet', 'marketing', 'transportation', 'other'
    )),
    description TEXT NOT NULL,
    amount_birr DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    supplier_name VARCHAR(200),
    recorded_by UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs with UUID
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    action_english TEXT NOT NULL,
    action_amharic TEXT,
    room VARCHAR(10),
    guest VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Status with UUID
CREATE TABLE payment_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_code VARCHAR(20) UNIQUE NOT NULL,
    status_description_english VARCHAR(100),
    status_description_amharic VARCHAR(100),
    is_active BOOLEAN DEFAULT true
);

-- Payment Reconciliation with UUID
CREATE TABLE payment_reconciliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id),
    bank_name VARCHAR(50),
    transaction_date DATE,
    amount_birr DECIMAL(10,2),
    reference_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'unmatched' CHECK (status IN ('unmatched', 'matched', 'disputed')),
    reconciled_by UUID REFERENCES employees(id),
    reconciled_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotel Settings with UUID
CREATE TABLE hotel_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_name_english VARCHAR(255) DEFAULT 'Omera Hotel',
    hotel_name_amharic VARCHAR(255) DEFAULT 'ኦመራ ሆቴል',
    contact_email VARCHAR(255),
    phone_numbers JSONB DEFAULT '["+251 11 123 4567", "+251 11 123 4568"]',
    address_english TEXT DEFAULT 'Bole Road, Addis Ababa, Ethiopia',
    address_amharic TEXT DEFAULT 'ቦሌ ፡ አዲስ አበባ፡ ኢትዮጵያ',
    total_rooms INTEGER DEFAULT 60,
    star_rating INTEGER DEFAULT 4,
    vat_rate DECIMAL(5,2) DEFAULT 15.00,
    vat_registration_number VARCHAR(50),
    tin_number VARCHAR(50),
    primary_currency VARCHAR(3) DEFAULT 'ETB',
    usd_to_etb_rate DECIMAL(10,2) DEFAULT 56.50,
    invoice_prefix VARCHAR(10) DEFAULT 'INV-',
    default_language VARCHAR(5) DEFAULT 'en',
    supported_languages JSONB DEFAULT '["en", "am", "om"]',
    calendar_system VARCHAR(20) DEFAULT 'both',
    timezone VARCHAR(50) DEFAULT 'Africa/Addis_Ababa',
    business_hours JSONB DEFAULT '{"check_in": "14:00", "check_out": "12:00", "restaurant_open": "06:00", "restaurant_close": "23:00"}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users with UUID
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'receptionist')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DASHBOARD & ANALYTICS TABLES
-- =============================================

-- Guest satisfaction ratings
CREATE TABLE guest_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    overall_rating DECIMAL(2,1) NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    cleanliness_rating DECIMAL(2,1) CHECK (cleanliness_rating BETWEEN 1 AND 5),
    service_rating DECIMAL(2,1) CHECK (service_rating BETWEEN 1 AND 5),
    amenities_rating DECIMAL(2,1) CHECK (amenities_rating BETWEEN 1 AND 5),
    food_rating DECIMAL(2,1) CHECK (food_rating BETWEEN 1 AND 5),
    comments TEXT,
    would_recommend BOOLEAN,
    guest_name VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily revenue tracking for dashboard stats
CREATE TABLE daily_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revenue_date DATE NOT NULL UNIQUE,
    room_revenue_birr DECIMAL(10,2) DEFAULT 0,
    restaurant_revenue_birr DECIMAL(10,2) DEFAULT 0,
    bar_revenue_birr DECIMAL(10,2) DEFAULT 0,
    other_revenue_birr DECIMAL(10,2) DEFAULT 0,
    total_revenue_birr DECIMAL(10,2) DEFAULT 0,
    total_revenue_usd DECIMAL(10,2) DEFAULT 0,
    occupancy_rate DECIMAL(5,2) DEFAULT 0,
    average_daily_rate_birr DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VIP and special requests tracking
CREATE TABLE special_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN (
        'anniversary', 'birthday', 'business', 'honeymoon', 'vip', 
        'airport_pickup', 'flower_arrangement', 'cake', 'wine', 'dietary', 'other'
    )),
    details TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES employees(id),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room maintenance and cleaning scheduling
CREATE TABLE room_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('cleaning', 'maintenance', 'repair', 'inspection', 'deep_clean')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    completed_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'delayed')),
    assigned_to UUID REFERENCES employees(id),
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    cost_birr DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SCHEMA IMPROVEMENTS & MISSING RELATIONSHIPS
-- =============================================

-- Add missing columns to existing tables
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS actual_check_in TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS actual_check_out TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS total_nights INTEGER GENERATED ALWAYS AS (check_out - check_in) STORED;

ALTER TABLE restaurant_orders 
ADD COLUMN IF NOT EXISTS served_by UUID REFERENCES employees(id),
ADD COLUMN IF NOT EXISTS prepared_by UUID REFERENCES employees(id);

ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;

ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS view_type VARCHAR(50) CHECK (view_type IN ('city', 'garden', 'pool', 'mountain', 'street')),
ADD COLUMN IF NOT EXISTS is_smoke_free BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_maintenance_date DATE;

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_created_at ON restaurant_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_status ON restaurant_orders(status);
CREATE INDEX IF NOT EXISTS idx_guests_created_at ON guests(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_revenue_date ON daily_revenue(revenue_date);
CREATE INDEX IF NOT EXISTS idx_guest_ratings_created_at ON guest_ratings(created_at);
CREATE INDEX IF NOT EXISTS idx_special_requests_status ON special_requests(status);
CREATE INDEX IF NOT EXISTS idx_room_maintenance_status ON room_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_room_maintenance_scheduled_date ON room_maintenance(scheduled_date);

-- =============================================
-- DASHBOARD VIEWS
-- =============================================

-- Main dashboard metrics view
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
    -- Room Occupancy
    (SELECT COUNT(*) FROM rooms WHERE status = 'occupied') as occupied_rooms,
    (SELECT COUNT(*) FROM rooms) as total_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'vacant') as available_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'cleaning') as cleaning_rooms,
    (SELECT COUNT(*) FROM rooms WHERE status = 'maintenance') as maintenance_rooms,
    
    -- Today's Bookings
    (SELECT COUNT(*) FROM bookings WHERE check_in = CURRENT_DATE) as today_checkins,
    (SELECT COUNT(*) FROM bookings WHERE check_out = CURRENT_DATE) as today_checkouts,
    (SELECT COUNT(*) FROM bookings WHERE check_in = CURRENT_DATE AND status = 'confirmed') as pending_arrivals,
    
    -- Revenue (Today)
    (SELECT COALESCE(SUM(total_amount_birr), 0) FROM invoices WHERE invoice_date = CURRENT_DATE AND payment_status IN ('paid', 'partially_paid')) as today_revenue,
    
    -- Restaurant Orders
    (SELECT COUNT(*) FROM restaurant_orders WHERE DATE(created_at) = CURRENT_DATE) as today_orders,
    (SELECT COUNT(*) FROM restaurant_orders WHERE status = 'preparing' AND DATE(created_at) = CURRENT_DATE) as preparing_orders,
    
    -- Guest Ratings (Last 30 days)
    (SELECT ROUND(AVG(overall_rating), 1) FROM guest_ratings WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as avg_rating_30d,
    (SELECT COUNT(*) FROM guest_ratings WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as total_ratings_30d;

-- VIP Arrivals View for Dashboard
CREATE OR REPLACE VIEW vip_arrivals_today AS
SELECT 
    g.first_name || ' ' || g.last_name as guest_name,
    r.room_number,
    rt.name as room_type,
    b.check_in,
    b.check_out,
    b.special_requests,
    g.is_vip
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
JOIN room_types rt ON r.room_type_id = rt.id
WHERE b.check_in = CURRENT_DATE 
AND b.status IN ('confirmed', 'active')
AND (g.is_vip = true OR rt.name IN ('Suite', 'Presidential'))
ORDER BY b.check_in;

-- Room Status Overview View
CREATE OR REPLACE VIEW room_status_overview AS
SELECT 
    r.room_number,
    rt.name as room_type,
    r.floor,
    r.status,
    r.base_price_birr,
    g.first_name || ' ' || g.last_name as current_guest,
    b.check_out
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
LEFT JOIN bookings b ON r.id = b.room_id AND b.status = 'active'
LEFT JOIN guests g ON b.guest_id = g.id
ORDER BY r.floor, r.room_number;

-- Revenue Analytics View
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
    dr.revenue_date,
    dr.total_revenue_birr,
    dr.room_revenue_birr,
    dr.restaurant_revenue_birr,
    dr.occupancy_rate,
    dr.average_daily_rate_birr,
    LAG(dr.total_revenue_birr) OVER (ORDER BY dr.revenue_date) as previous_day_revenue,
    (dr.total_revenue_birr - LAG(dr.total_revenue_birr) OVER (ORDER BY dr.revenue_date)) as revenue_change
FROM daily_revenue dr
ORDER BY dr.revenue_date DESC;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample guest ratings
INSERT INTO guest_ratings (booking_id, overall_rating, cleanliness_rating, service_rating, amenities_rating, food_rating, comments, would_recommend, guest_name)
SELECT 
    b.id,
    4.8 + (RANDOM() * 0.4)::numeric(2,1),
    4.7 + (RANDOM() * 0.6)::numeric(2,1),
    4.6 + (RANDOM() * 0.8)::numeric(2,1),
    4.5 + (RANDOM() * 1.0)::numeric(2,1),
    4.4 + (RANDOM() * 1.2)::numeric(2,1),
    CASE WHEN RANDOM() > 0.7 THEN 'Excellent service and very clean rooms' ELSE NULL END,
    RANDOM() > 0.2,
    g.first_name || ' ' || g.last_name
FROM bookings b
JOIN guests g ON b.guest_id = g.id
WHERE b.check_out < CURRENT_DATE
LIMIT 50;

-- Insert sample daily revenue data (last 30 days)
INSERT INTO daily_revenue (revenue_date, room_revenue_birr, restaurant_revenue_birr, total_revenue_birr, occupancy_rate, average_daily_rate_birr)
SELECT 
    CURRENT_DATE - (n || ' days')::INTERVAL as revenue_date,
    (30000 + RANDOM() * 20000)::numeric(10,2) as room_revenue,
    (8000 + RANDOM() * 12000)::numeric(10,2) as restaurant_revenue,
    (38000 + RANDOM() * 32000)::numeric(10,2) as total_revenue,
    (60 + RANDOM() * 35)::numeric(5,2) as occupancy_rate,
    (1200 + RANDOM() * 800)::numeric(10,2) as adr
FROM generate_series(0, 29) n
ON CONFLICT (revenue_date) DO NOTHING;

-- =============================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- =============================================

-- Enable RLS on new tables
ALTER TABLE guest_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_maintenance ENABLE ROW LEVEL SECURITY;

-- Policies for guest_ratings (read-only for most, full access for managers)
CREATE POLICY "Employees can view guest ratings" ON guest_ratings
    FOR SELECT USING (true);

CREATE POLICY "Managers can manage guest ratings" ON guest_ratings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE employees.id = auth.uid()::uuid 
            AND employees.role IN ('admin', 'manager')
        )
    );

-- Policies for daily_revenue (managers and finance only)
CREATE POLICY "Finance roles can manage daily revenue" ON daily_revenue
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE employees.id = auth.uid()::uuid 
            AND employees.department IN ('administration', 'finance')
            AND employees.role IN ('admin', 'manager', 'cashier')
        )
    );

-- Policies for special_requests
CREATE POLICY "Employees can view special requests" ON special_requests
    FOR SELECT USING (true);

CREATE POLICY "Managers can manage special requests" ON special_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE employees.id = auth.uid()::uuid 
            AND employees.role IN ('admin', 'manager', 'receptionist')
        )
    );

-- Policies for room_maintenance
CREATE POLICY "Employees can view maintenance" ON room_maintenance
    FOR SELECT USING (true);

CREATE POLICY "Maintenance staff can update assigned tasks" ON room_maintenance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM employees 
            WHERE employees.id = auth.uid()::uuid 
            AND (employees.role IN ('admin', 'manager') OR employees.id = assigned_to)
        )
    );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update daily revenue automatically
CREATE OR REPLACE FUNCTION update_daily_revenue()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert daily revenue record
    INSERT INTO daily_revenue (revenue_date, room_revenue_birr, restaurant_revenue_birr, total_revenue_birr)
    SELECT 
        CURRENT_DATE,
        COALESCE(SUM(CASE WHEN i.invoice_date = CURRENT_DATE THEN i.total_amount_birr ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN ro.created_at::date = CURRENT_DATE THEN ro.total_amount_birr ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN i.invoice_date = CURRENT_DATE THEN i.total_amount_birr ELSE 0 END), 0) +
        COALESCE(SUM(CASE WHEN ro.created_at::date = CURRENT_DATE THEN ro.total_amount_birr ELSE 0 END), 0)
    FROM invoices i
    FULL JOIN restaurant_orders ro ON true
    ON CONFLICT (revenue_date) 
    DO UPDATE SET
        room_revenue_birr = EXCLUDED.room_revenue_birr,
        restaurant_revenue_birr = EXCLUDED.restaurant_revenue_birr,
        total_revenue_birr = EXCLUDED.total_revenue_birr,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update daily revenue when payments or orders are made
CREATE OR REPLACE TRIGGER trigger_update_daily_revenue
    AFTER INSERT OR UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_revenue();

CREATE OR REPLACE TRIGGER trigger_update_daily_revenue_orders
    AFTER INSERT OR UPDATE ON restaurant_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_revenue();