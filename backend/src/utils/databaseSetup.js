import supabase from "../config/supabase";
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
  } catch (error: any) {
    console.error("\n❌ Data insertion failed:");
    console.error("Error:", error.message);
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

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: "System Administrator",
          email: "admin@omerahotel.com",
          password_hash: hashedPassword,
          role: "admin",
          status: "active",
        },
      ])
      .select();

    if (error) {
      console.log("   ⚠️  Error creating admin user:", error.message);
    } else {
      console.log("   ✅ Admin user created successfully");
    }
  } catch (error: any) {
    console.log("   ⚠️  Failed to create admin user:", error.message);
  }
}

async function createSampleRooms() {
  console.log("📋 Checking/Creating sample rooms...");

  const sampleRooms = [
    {
      room_number: "101",
      type: "single",
      floor: 1,
      price_per_night: 99.99,
      description: "Comfortable single room with basic amenities",
      status: "available",
    },
    {
      room_number: "102",
      type: "single",
      floor: 1,
      price_per_night: 99.99,
      description: "Comfortable single room with basic amenities",
      status: "available",
    },
    {
      room_number: "201",
      type: "double",
      floor: 2,
      price_per_night: 149.99,
      description: "Spacious double room with premium amenities",
      status: "available",
    },
    {
      room_number: "202",
      type: "double",
      floor: 2,
      price_per_night: 149.99,
      description: "Spacious double room with premium amenities",
      status: "available",
    },
    {
      room_number: "301",
      type: "suite",
      floor: 3,
      price_per_night: 249.99,
      description: "Luxurious suite with separate living area",
      status: "available",
    },
    {
      room_number: "302",
      type: "suite",
      floor: 3,
      price_per_night: 279.99,
      description: "Executive suite with ocean view",
      status: "available",
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

      // Insert room if it doesn't exist
      const { error } = await supabase.from("rooms").insert(room);

      if (error) {
        console.log(
          `   ⚠️  Error creating room ${room.room_number}:`,
          error.message
        );
      } else {
        console.log(`   ✅ Room ${room.room_number} created`);
        createdCount++;
      }
    } catch (error: any) {
      console.log(
        `   ⚠️  Failed to check/create room ${room.room_number}:`,
        error.message
      );
    }
  }

  console.log(
    `   📊 Rooms: ${createdCount} created, ${existingCount} already exist`
  );
}

async function createSampleEmployees() {
  console.log("📋 Checking/Creating sample employees...");

  const sampleEmployees = [
    {
      user_id: 1,
      department: "management",
      position: "General Manager",
      salary: 75000,
      hire_date: "2023-01-15",
      contact_number: "+1234567890",
      address: "123 Main St, City",
      status: "active",
    },
    {
      user_id: 1,
      department: "front desk",
      position: "Receptionist",
      salary: 35000,
      hire_date: "2023-03-20",
      contact_number: "+1234567891",
      address: "456 Oak Ave, City",
      status: "active",
    },
    {
      user_id: 1,
      department: "housekeeping",
      position: "Housekeeper",
      salary: 28000,
      hire_date: "2023-02-10",
      contact_number: "+1234567892",
      address: "789 Pine Rd, City",
      status: "active",
    },
    {
      user_id: 1,
      department: "restaurant",
      position: "Head Chef",
      salary: 52000,
      hire_date: "2023-04-05",
      contact_number: "+1234567893",
      address: "321 Elm St, City",
      status: "active",
    },
  ];

  let createdCount = 0;
  let existingCount = 0;

  for (const employee of sampleEmployees) {
    try {
      // Check if employee already exists (by department and position)
      const { data: existingEmployee, error: checkError } = await supabase
        .from("employees")
        .select("id")
        .eq("department", employee.department)
        .eq("position", employee.position)
        .single();

      if (existingEmployee) {
        existingCount++;
        continue;
      }

      // Insert employee if it doesn't exist
      const { error } = await supabase.from("employees").insert(employee);

      if (error) {
        console.log(
          `   ⚠️  Error creating ${employee.position}:`,
          error.message
        );
      } else {
        console.log(`   ✅ ${employee.position} created`);
        createdCount++;
      }
    } catch (error: any) {
      console.log(
        `   ⚠️  Failed to check/create ${employee.position}:`,
        error.message
      );
    }
  }

  console.log(
    `   📊 Employees: ${createdCount} created, ${existingCount} already exist`
  );
}

async function createDefaultSettings() {
  console.log("📋 Checking/Creating default settings...");

  const defaultSettings = [
    { key: "hotel_name", value: "Omera Hotel", user_id: 1 },
    { key: "check_in_time", value: "14:00", user_id: 1 },
    { key: "check_out_time", value: "11:00", user_id: 1 },
    { key: "tax_rate", value: "0.10", user_id: 1 },
    { key: "currency", value: "USD", user_id: 1 },
    { key: "contact_email", value: "info@omerahotel.com", user_id: 1 },
    { key: "contact_phone", value: "+1-555-0123", user_id: 1 },
    {
      key: "address",
      value: "123 Luxury Avenue, City, State 12345",
      user_id: 1,
    },
  ];

  let createdCount = 0;
  let existingCount = 0;

  for (const setting of defaultSettings) {
    try {
      // Check if setting already exists
      const { data: existingSetting, error: checkError } = await supabase
        .from("settings")
        .select("key")
        .eq("key", setting.key)
        .single();

      if (existingSetting) {
        existingCount++;
        continue;
      }

      // Insert setting if it doesn't exist
      const { error } = await supabase.from("settings").insert(setting);

      if (error) {
        console.log(
          `   ⚠️  Error creating setting ${setting.key}:`,
          error.message
        );
      } else {
        console.log(`   ✅ Setting ${setting.key} created`);
        createdCount++;
      }
    } catch (error: any) {
      console.log(
        `   ⚠️  Failed to check/create setting ${setting.key}:`,
        error.message
      );
    }
  }

  console.log(
    `   📊 Settings: ${createdCount} created, ${existingCount} already exist`
  );
}

async function createSampleBookings() {
  console.log("📋 Checking/Creating sample bookings...");

  // Get the first room ID to use for bookings
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("id, room_number")
    .limit(1);

  if (roomsError || !rooms || rooms.length === 0) {
    console.log("   ⚠️  No rooms available for bookings");
    return;
  }

  const roomId = rooms[0].id;

  const sampleBookings = [
    {
      customer_name: "John Smith",
      customer_email: "john.smith@email.com",
      customer_phone: "+1234567890",
      room_id: roomId,
      check_in_date: "2024-02-15",
      check_out_date: "2024-02-18",
      num_guests: 2,
      total_amount: 299.97,
      booking_status: "confirmed",
      payment_status: "paid",
      created_by: 1,
    },
    {
      customer_name: "Sarah Johnson",
      customer_email: "sarah.j@email.com",
      customer_phone: "+1234567891",
      room_id: roomId,
      check_in_date: "2024-02-20",
      check_out_date: "2024-02-22",
      num_guests: 2,
      total_amount: 299.98,
      booking_status: "confirmed",
      payment_status: "paid",
      created_by: 1,
    },
  ];

  let createdCount = 0;
  let existingCount = 0;

  for (const booking of sampleBookings) {
    try {
      // Check if booking already exists (by email and check-in date)
      const { data: existingBooking, error: checkError } = await supabase
        .from("bookings")
        .select("id")
        .eq("customer_email", booking.customer_email)
        .eq("check_in_date", booking.check_in_date)
        .single();

      if (existingBooking) {
        existingCount++;
        continue;
      }

      // Insert booking if it doesn't exist
      const { error } = await supabase.from("bookings").insert(booking);

      if (error) {
        console.log(
          `   ⚠️  Error creating booking for ${booking.customer_name}:`,
          error.message
        );
      } else {
        console.log(`   ✅ Booking for ${booking.customer_name} created`);
        createdCount++;
      }
    } catch (error: any) {
      console.log(
        `   ⚠️  Failed to check/create booking for ${booking.customer_name}:`,
        error.message
      );
    }
  }

  console.log(
    `   📊 Bookings: ${createdCount} created, ${existingCount} already exist`
  );
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
          assigned_to: 1,
          task_description: "Full room cleaning and sanitization",
          status: "completed",
          date_assigned: "2024-01-28",
        },
        {
          room_id: rooms[1].id,
          assigned_to: 1,
          task_description: "Routine maintenance check",
          status: "pending",
          date_assigned: "2024-01-29",
        },
      ];

      for (const task of sampleTasks) {
        const { error } = await supabase
          .from("housekeeping_tasks")
          .insert(task);
        if (!error) {
          console.log(
            `   ✅ Housekeeping task created for room ${task.room_id}`
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
      const { error } = await supabase.from("finance_records").insert(record);
      if (!error) {
        console.log(`   ✅ Finance record created: ${record.source}`);
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
