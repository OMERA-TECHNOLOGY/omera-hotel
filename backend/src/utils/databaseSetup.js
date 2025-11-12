import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

async function initializeDatabase() {
  try {
    console.log("🏗️  Starting Omera Hotel Data Insertion...");
    console.log("📊 Testing Supabase connection...");

    // Test connection
    const { error } = await supabase.from("users").select("*").limit(1);

    if (error) {
      console.log("❌ Connection failed:", error.message);
      return;
    }

    console.log("✅ Supabase connection established\n");

    // Insert initial data without conflicts
    await insertInitialData();
  } catch (error) {
    console.error("\n❌ Data insertion failed:");
    console.error(
      "Error:",
      error && error.message ? error.message : String(error)
    );
  }
}

async function insertInitialData() {
  console.log("👤 Inserting initial data (skip if exists)...\n");

  // Insert data in sequence to maintain relationships
  await createAdminUser();
  await createSampleRooms();
  await createSampleEmployees();
  await createDefaultSettings();
  await createSampleBookings();
  await createSampleOtherData();

  console.log("\n✅ All data insertion completed!");
  console.log("\n🔑 Default Admin Login:");
  console.log("   Email: admin@omerahotel.com");
  console.log("   Password: admin123");
  console.log("\n🚀 You can now start the server with: npm run dev");
}

async function createAdminUser() {
  console.log("📋 Checking/Creating admin user...");

  try {
    // First check if admin user already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", "admin@omerahotel.com")
      .single();

    if (existingAdmin) {
      console.log("   ✅ Admin user already exists");
      return;
    }

    // Create admin user if it doesn't exist
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Insert minimal required columns according to database.sql
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: "admin@omerahotel.com",
          password_hash: hashedPassword,
          role: "admin",
          is_active: true,
        },
      ])
      .select();

    if (error) {
      console.log("   ⚠️  Error creating admin user:", error.message);
    } else {
      console.log("   ✅ Admin user created successfully");
    }
  } catch (error) {
    console.log(
      "   ⚠️  Failed to create admin user:",
      error && error.message ? error.message : String(error)
    );
  }
}

async function createSampleRooms() {
  console.log("📋 Checking/Creating sample rooms...");

  // Ensure some room types exist
  await createSampleRoomTypes();

  const sampleRooms = [
    {
      room_number: "101",
      room_type: "Single",
      floor: 1,
      base_price_birr: 99.99,
      status: "vacant",
    },
    {
      room_number: "102",
      room_type: "Single",
      floor: 1,
      base_price_birr: 99.99,
      status: "vacant",
    },
    {
      room_number: "201",
      room_type: "Deluxe",
      floor: 2,
      base_price_birr: 149.99,
      status: "vacant",
    },
    {
      room_number: "202",
      room_type: "Deluxe",
      floor: 2,
      base_price_birr: 149.99,
      status: "vacant",
    },
    {
      room_number: "301",
      room_type: "Suite",
      floor: 3,
      base_price_birr: 249.99,
      status: "vacant",
    },
    {
      room_number: "302",
      room_type: "Presidential",
      floor: 3,
      base_price_birr: 279.99,
      status: "vacant",
    },
  ];

  let createdCount = 0;
  let existingCount = 0;

  for (const room of sampleRooms) {
    try {
      // Check if room already exists
      const { data: existingRoom, error: checkError } = await supabase
        .from("rooms")
        .select("room_number")
        .eq("room_number", room.room_number)
        .single();

      if (existingRoom) {
        existingCount++;
        continue;
      }

      // Lookup room_type id by name
      const { data: types } = await supabase
        .from("room_types")
        .select("id, name")
        .eq("name", room.room_type)
        .limit(1);

      const room_type_id = types && types[0] ? types[0].id : null;

      const payload = {
        room_number: room.room_number,
        room_type_id,
        floor: room.floor,
        base_price_birr: room.base_price_birr,
        status: room.status,
      };

      // Insert room if it doesn't exist
      const { error } = await supabase.from("rooms").insert(payload);

      if (error) {
        console.log(
          `   ⚠️  Error creating room ${room.room_number}:`,
          error.message
        );
      } else {
        console.log(`   ✅ Room ${room.room_number} created`);
        createdCount++;
      }
    } catch (error) {
      console.log(
        `   ⚠️  Failed to check/create room ${room.room_number}:`,
        error && error.message ? error.message : String(error)
      );
    }
  }

  console.log(
    `   📊 Rooms: ${createdCount} created, ${existingCount} already exist`
  );
}

async function createSampleRoomTypes() {
  console.log("📋 Checking/Creating room types...");

  const types = [
    {
      name: "Single",
      description_english: "Single room",
      base_price_birr: 99.99,
      max_occupancy: 1,
    },
    {
      name: "Deluxe",
      description_english: "Deluxe room",
      base_price_birr: 149.99,
      max_occupancy: 2,
    },
    {
      name: "Suite",
      description_english: "Suite",
      base_price_birr: 249.99,
      max_occupancy: 4,
    },
    {
      name: "Presidential",
      description_english: "Presidential suite",
      base_price_birr: 399.99,
      max_occupancy: 6,
    },
  ];

  let created = 0;
  for (const t of types) {
    try {
      const { data: existing } = await supabase
        .from("room_types")
        .select("id")
        .eq("name", t.name)
        .limit(1);

      if (existing && existing.length > 0) continue;

      const { error } = await supabase.from("room_types").insert(t);
      if (!error) created++;
    } catch (e) {
      // ignore
    }
  }

  console.log(`   📊 Room types created: ${created}`);
}

async function createSampleEmployees() {
  console.log("📋 Checking/Creating sample employees...");
  const sampleEmployees = [
    {
      first_name: "Amanuel",
      father_name: "Bekele",
      last_name: "Tadesse",
      email: "amanuel.manager@omera.test",
      phone: "+251911000001",
      role: "manager",
      department: "administration",
      shift: "day",
      salary_birr: 75000,
      hire_date: "2023-01-15",
      status: "active",
    },
    {
      first_name: "Sara",
      father_name: "Kassa",
      last_name: "Abebe",
      email: "sara.reception@omera.test",
      phone: "+251911000002",
      role: "receptionist",
      department: "front_desk",
      shift: "morning",
      salary_birr: 35000,
      hire_date: "2023-03-20",
      status: "active",
    },
    {
      first_name: "Dagmawi",
      father_name: "Solomon",
      last_name: "Yosef",
      email: "dag.house@omera.test",
      phone: "+251911000003",
      role: "housekeeper",
      department: "housekeeping",
      shift: "day",
      salary_birr: 28000,
      hire_date: "2023-02-10",
      status: "active",
    },
    {
      first_name: "Marta",
      father_name: "Gebre",
      last_name: "Haile",
      email: "marta.chef@omera.test",
      phone: "+251911000004",
      role: "chef",
      department: "restaurant",
      shift: "day",
      salary_birr: 52000,
      hire_date: "2023-04-05",
      status: "active",
    },
  ];

  let createdCount = 0;
  for (const emp of sampleEmployees) {
    try {
      const { data: existing } = await supabase
        .from("employees")
        .select("id")
        .eq("email", emp.email)
        .limit(1);

      if (existing && existing.length > 0) continue;

      const { error } = await supabase.from("employees").insert(emp);
      if (error) {
        console.log(
          `   ⚠️  Error creating employee ${emp.email}:`,
          error.message
        );
      } else {
        console.log(`   ✅ Employee ${emp.email} created`);
        createdCount++;
      }
    } catch (e) {
      console.log(
        `   ⚠️  Failed to create employee ${emp.email}:`,
        e && e.message ? e.message : String(e)
      );
    }
  }

  console.log(`   📊 Employees: ${createdCount} created`);
}

async function createDefaultSettings() {
  console.log("📋 Checking/Creating default settings...");
  try {
    // Check if a hotel_settings row exists
    const { data: existing } = await supabase
      .from("hotel_settings")
      .select("id")
      .limit(1);
    if (existing && existing.length > 0) {
      console.log("   ✅ Hotel settings already exist");
      return;
    }

    const payload = {
      hotel_name_english: "Omera Hotel",
      contact_email: "info@omerahotel.com",
      phone_numbers: JSON.stringify(["+251 11 123 4567"]),
      address_english: "Bole Road, Addis Ababa, Ethiopia",
      total_rooms: 60,
      star_rating: 4,
      vat_rate: 15.0,
      primary_currency: "ETB",
      usd_to_etb_rate: 56.5,
      invoice_prefix: "INV-",
      default_language: "en",
      supported_languages: JSON.stringify(["en", "am", "om"]),
      calendar_system: "both",
      timezone: "Africa/Addis_Ababa",
      business_hours: JSON.stringify({ check_in: "14:00", check_out: "12:00" }),
    };

    const { error } = await supabase.from("hotel_settings").insert(payload);
    if (error)
      console.log("   ⚠️  Error creating hotel settings:", error.message);
    else console.log("   ✅ Hotel settings created");
  } catch (e) {
    console.log(
      "   ⚠️  Failed to create hotel settings:",
      e && e.message ? e.message : String(e)
    );
  }
}

async function createSampleBookings() {
  console.log("📋 Checking/Creating sample bookings...");
  // Ensure we have at least one guest and one room
  try {
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id")
      .limit(1);
    if (roomsError || !rooms || rooms.length === 0) {
      console.log("   ⚠️  No rooms available for bookings");
      return;
    }

    // Create sample guests
    const guestPayload = {
      first_name: "John",
      father_name: "M",
      last_name: "Smith",
      email: "john.smith@example.com",
      phone: "+251911000010",
      nationality: "Ethiopian",
    };

    const { data: existingGuest } = await supabase
      .from("guests")
      .select("id")
      .eq("email", guestPayload.email)
      .limit(1);

    let guestId;
    if (existingGuest && existingGuest.length > 0) {
      guestId = existingGuest[0].id;
    } else {
      const { data: createdGuest, error: guestErr } = await supabase
        .from("guests")
        .insert(guestPayload)
        .select();
      if (guestErr) {
        console.log("   ⚠️ Error creating sample guest:", guestErr.message);
        return;
      }
      guestId = createdGuest && createdGuest[0] ? createdGuest[0].id : null;
    }

    const roomId = rooms[0].id;

    const sampleBookings = [
      {
        guest_id: guestId,
        room_id: roomId,
        check_in: "2024-02-15",
        check_out: "2024-02-18",
        number_of_guests: 2,
        status: "confirmed",
        source: "walk_in",
        total_price_birr: 300.0,
        advance_payment_birr: 0,
      },
    ];

    for (const booking of sampleBookings) {
      try {
        const { data: existingBooking } = await supabase
          .from("bookings")
          .select("id")
          .eq("guest_id", booking.guest_id)
          .eq("check_in", booking.check_in)
          .limit(1);

        if (existingBooking && existingBooking.length > 0) continue;

        const { error } = await supabase.from("bookings").insert(booking);
        if (error) console.log("   ⚠️ Error creating booking:", error.message);
        else console.log("   ✅ Booking created");
      } catch (e) {
        console.log(
          "   ⚠️ Failed to create booking:",
          e && e.message ? e.message : String(e)
        );
      }
    }
  } catch (e) {
    console.log(
      "   ⚠️ Failed booking setup:",
      e && e.message ? e.message : String(e)
    );
  }
}

async function createSampleOtherData() {
  console.log("📋 Checking/Creating other sample data...");

  // Sample housekeeping tasks
  try {
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id")
      .limit(2);

    if (!roomsError && rooms && rooms.length > 0) {
      const sampleTasks = [
        {
          room_id: rooms[0].id,
          type: "cleaning",
          title: "Full room cleaning",
          description: "Full room cleaning and sanitization",
          scheduled_date: "2024-01-28",
          assigned_to: null,
          status: "completed",
        },
        {
          room_id: rooms[1].id,
          type: "maintenance",
          title: "Routine maintenance",
          description: "Routine maintenance check",
          scheduled_date: "2024-01-29",
          assigned_to: null,
          status: "pending",
        },
      ];

      for (const task of sampleTasks) {
        const { error } = await supabase.from("room_maintenance").insert(task);
        if (!error) {
          console.log(
            `   ✅ Room maintenance task created for room ${task.room_id}`
          );
        }
      }
    }
  } catch (error) {
    // Ignore errors for sample data
  }

  // Sample finance records
  try {
    const financeRecords = [
      {
        category: "income",
        source: "Room Booking",
        amount: 299.97,
        description: "Booking payment from John Smith",
        record_date: "2024-01-28",
        created_by: 1,
      },
      {
        category: "expense",
        source: "Supplies",
        amount: 150.0,
        description: "Cleaning supplies purchase",
        record_date: "2024-01-27",
        created_by: 1,
      },
    ];

    for (const record of financeRecords) {
      const payload = {
        category: record.category === "income" ? "utilities" : "other",
        description: record.description,
        amount_birr: record.amount,
        expense_date: record.record_date,
        supplier_name: record.source,
        recorded_by: null,
      };
      const { error } = await supabase.from("expenses").insert(payload);
      if (!error) {
        console.log(`   ✅ Expense record created: ${record.source}`);
      }
    }
  } catch (error) {
    // Ignore errors for sample data
  }
}

// Auto-run when called directly (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  // run without blocking
  initializeDatabase();
}

export { initializeDatabase };
