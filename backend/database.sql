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