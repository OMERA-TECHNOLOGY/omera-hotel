export type Language = "en" | "am" | "om";

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    frontDesk: "Front Desk",
    rooms: "Rooms",
    bookings: "Bookings",
    finance: "Finance",
    housekeeping: "Housekeeping",
    restaurant: "Restaurant",
    employees: "Employees",
    settings: "Settings",

    // Common
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    actions: "Actions",
    status: "Status",
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Date",
    time: "Time",
    total: "Total",
    price: "Price",

    // Dashboard
    totalGuests: "Total Guests",
    occupiedRooms: "Occupied Rooms",
    todayRevenue: "Today's Revenue",
    checkInsToday: "Check-ins Today",
    recentActivity: "Recent Activity",

    // Front Desk
    newCheckIn: "New Check-in",
    checkOut: "Check Out",
    guestCheckIn: "Guest Check-in",
    issueKey: "Issue Key",
    extendStay: "Extend Stay",

    // Rooms
    roomManagement: "Room Management",
    addRoom: "Add Room",
    vacant: "Vacant",
    occupied: "Occupied",
    cleaning: "Cleaning",
    maintenance: "Maintenance",

    // Bookings
    newBooking: "New Booking",
    bookingCalendar: "Booking Calendar",
    checkInDate: "Check-in Date",
    checkOutDate: "Check-out Date",

    // Finance
    invoices: "Invoices",
    payments: "Payments",
    expenses: "Expenses",
    revenue: "Revenue",
    generateInvoice: "Generate Invoice",

    // Restaurant
    menu: "Menu",
    orders: "Orders",
    roomService: "Room Service",
    placeOrder: "Place Order",
    // Profile & Account
    profileSettings: "Profile Settings",
    notifications: "Notifications",
    billing: "Billing",
    connectedAccounts: "Connected Accounts",
    logout: "Logout",
    account: "Account",
    avatar: "Avatar",
    firstName: "First name",
    lastName: "Last name",
    security: "Security",
    changePassword: "Change Password",
    twoFactorAuth: "Two-factor authentication",
    manage2FA: "Manage 2FA",
    saving: "Saving...",
    saved: "Saved",
    errorSaving: "Error saving",
    loading: "Loading...",
    enable2FADesc:
      "Enable 2FA to add an extra layer of security to your account.",

    // Auth / Login
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    signIn: "Sign in",
    forgotPassword: "Forgot password?",

    // Rooms / Forms
    roomNumber: "Room number",
    roomType: "Room type",
    floor: "Floor",
    capacity: "Capacity",
    viewType: "View type",
    description: "Description",
    none: "None",

    // Preferences
    preferences: "Preferences",
    themeLabel: "Theme",
    notificationPreferencesLabel: "Notification Preferences",
    privacyAndAccessibility: "Privacy & Accessibility",
    optOutAnalytics: "Opt-out of analytics",
    reduceMotion: "Reduce motion",
  },
  am: {
    // Navigation (Amharic)
    dashboard: "ዳሽቦርድ",
    frontDesk: "የፊት ጠረጴዛ",
    rooms: "ክፍሎች",
    bookings: "ቦታ ማስያዝ",
    finance: "ፋይናንስ",
    housekeeping: "የቤት አጽዳት",
    restaurant: "ምግብ ቤት",
    employees: "ሰራተኞች",
    settings: "ቅንብሮች",

    // Common
    search: "ፈልግ",
    add: "አክል",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    actions: "ድርጊቶች",
    status: "ሁኔታ",
    name: "ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    date: "ቀን",
    time: "ሰዓት",
    total: "ጠቅላላ",
    price: "ዋጋ",

    // Dashboard
    totalGuests: "ጠቅላላ እንግዶች",
    occupiedRooms: "የተያዙ ክፍሎች",
    todayRevenue: "የዛሬ ገቢ",
    checkInsToday: "ዛሬ የገቡ",
    recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",

    // Front Desk
    newCheckIn: "አዲስ ቼክ-ኢን",
    checkOut: "ቼክ-አውት",
    guestCheckIn: "የእንግዳ ቼክ-ኢን",
    issueKey: "ቁልፍ ስጥ",
    extendStay: "መቆያን ማራዘም",

    // Rooms
    roomManagement: "የክፍል አስተዳደር",
    addRoom: "ክፍል አክል",
    vacant: "ባዶ",
    occupied: "የተያዘ",
    cleaning: "በጽዳት ላይ",
    maintenance: "በጥገና ላይ",

    // Bookings
    newBooking: "አዲስ ቦታ ማስያዝ",
    bookingCalendar: "የቦታ ማስያዝ ቀን መቁጠሪያ",
    checkInDate: "የመግባት ቀን",
    checkOutDate: "የመውጣት ቀን",

    // Finance
    invoices: "ደረሰኞች",
    payments: "ክፍያዎች",
    expenses: "ወጪዎች",
    revenue: "ገቢ",
    generateInvoice: "ደረሰኝ አዘጋጅ",

    // Restaurant
    menu: "ምናሌ",
    orders: "ትዕዛዞች",
    roomService: "የክፍል አገልግሎት",
    placeOrder: "ትዕዛዝ ስጥ",
    // Profile & Account
    profileSettings: "የመገለጫ ማቀናበሪያ",
    notifications: "ማሳወቂያዎች",
    billing: "ቢሊንግ",
    connectedAccounts: "የተገናኙ መለያዎች",
    logout: "ውጣ",
    account: "አካውንት",
    avatar: "ፎቶ",
    firstName: "ስም (ፊርስት)",
    lastName: "የዘር ስም",
    security: "ደህንነት",
    changePassword: "የይለፍ ቃል ቀይር",
    twoFactorAuth: "ሁለት-አካል ማረጋገጫ",
    manage2FA: "2FA አስተካክል",
    saving: "በመቀጠል...",
    saved: "ተቀምጧል",
    errorSaving: "የማስቀመጥ ስህተት",
    loading: "በመጫን...",
    enable2FADesc: "2FA ያብሩ እና የአካውንትዎን ደህንነት ይጨምሩ።",

    // Auth / Login
    emailPlaceholder: "ኢሜይልዎን ያስገቡ",
    passwordPlaceholder: "የይለፍ ቃልዎን ያስገቡ",
    rememberMe: "አስታውስ",
    signIn: "ግባ",
    forgotPassword: "የይለፍ ቃል ረስተዋል?",

    // Rooms / Forms
    roomNumber: "የክፍል ቁጥር",
    roomType: "ዓይነት ክፍል",
    floor: "ሬሎ",
    capacity: "ከፍተኛ ችሎታ",
    viewType: "የእይታ ዓይነት",
    description: "መግለጫ",
    none: "የለም",

    // Preferences
    preferences: "ቅንብሮች",
    themeLabel: "ርዕስ ሁኔታ",
    notificationPreferencesLabel: "የማሳወቂያ ቅንብሮች",
    privacyAndAccessibility: "ግላዊነት እና ቀላል የመጠቀም ነገሮች",
    optOutAnalytics: "ከስር ተግባራዊ ውጪ ሂደት",
    reduceMotion: "እንቅስቃሴን አሳነስ",
  },
  om: {
    // Navigation (Oromo)
    dashboard: "Gabatee",
    frontDesk: "Fuuldura",
    rooms: "Kutaalee",
    bookings: "Ramaddii",
    finance: "Faayinaansii",
    housekeeping: "Qulqullina Manaa",
    restaurant: "Mana Nyaataa",
    employees: "Hojjettoota",
    settings: "Qindaa'ina",

    // Common
    search: "Barbaadi",
    add: "Ida'i",
    edit: "Foyyessi",
    delete: "Haqi",
    save: "Olkaa'i",
    cancel: "Dhiisi",
    actions: "Gocha",
    status: "Haala",
    name: "Maqaa",
    email: "Iimeelii",
    phone: "Bilbilaa",
    date: "Guyyaa",
    time: "Yeroo",
    total: "Walitti",
    price: "Gatii",

    // Dashboard
    totalGuests: "Keessummaa Keessummoota",
    occupiedRooms: "Kutaalee Guutaman",
    todayRevenue: "Galii Har'aa",
    checkInsToday: "Har'a Galan",
    recentActivity: "Sochiilee Dhiyoo",

    // Front Desk
    newCheckIn: "Galma Haaraa",
    checkOut: "Bahuu",
    guestCheckIn: "Galma Keessummaa",
    issueKey: "Furtuu Kenni",
    extendStay: "Turuu Dheeressu",

    // Rooms
    roomManagement: "Bulchiinsa Kutaa",
    addRoom: "Kutaa Ida'i",
    vacant: "Duwwaa",
    occupied: "Guutame",
    cleaning: "Qulqulleessuu Irratti",
    maintenance: "Suphaa Irratti",

    // Bookings
    newBooking: "Ramaddii Haaraa",
    bookingCalendar: "Kaaleendara Ramaddii",
    checkInDate: "Guyyaa Galuu",
    checkOutDate: "Guyyaa Bahuu",

    // Finance
    invoices: "Waraqaalee Kaffaltii",
    payments: "Kaffaltiiwwan",
    expenses: "Baasii",
    revenue: "Galii",
    generateInvoice: "Waraqa Kaffaltii Tolchi",

    // Restaurant
    menu: "Tarree Nyaataa",
    orders: "Ajaja",
    roomService: "Tajaajila Kutaa",
    placeOrder: "Ajaja Kenni",
    // Profile & Account
    profileSettings: "Qindaa'ina Profaayilii",
    notifications: "Beeksisa",
    billing: "Herrega",
    connectedAccounts: "Akaawuntota Waliigalan",
    logout: "Ba'i",
    account: "Akaawuntii",
    avatar: "Fayyadama Suuraa",
    firstName: "Maqaa Jalqabaa",
    lastName: "Maqaa Dhumaa",
    security: "Nageenya",
    changePassword: "Jecha Icimsaa Jijjiiri",
    twoFactorAuth: "Mirkaneessa Lama-Qoodduu",
    manage2FA: "2FA too'achi",
    saving: "Oolchaa...",
    saved: "Olkaa'ame",
    errorSaving: "Dogoggora olkaa'uu",
    loading: "Olfamaa...",
    enable2FADesc: "2FA dabaluu dhaan tajaajila nageenya dabalataa kenna.",
    // Profile & Account
    profileSettings: "Qindaa'ina Profaayilii",
    notifications: "Beeksisa",
    billing: "Herrega",
    connectedAccounts: "Akaawuntota Waliigalan",
    logout: "Ba'i",
    account: "Akaawuntii",
    avatar: "Fayyadama Suuraa",
    firstName: "Maqaa Jalqabaa",
    lastName: "Maqaa Dhumaa",
    security: "Nageenya",
    changePassword: "Jecha Icimsaa Jijjiiri",
    twoFactorAuth: "Mirkaneessa Lama-Qoodduu",
    manage2FA: "2FA too'achi",
    saving: "Oolchaa...",
    saved: "Olkaa'ame",
    errorSaving: "Dogoggora olkaa'uu",

    // Auth / Login
    emailPlaceholder: "Iimeelii kee galchi",
    passwordPlaceholder: "Jecha icimsaa galchi",
    rememberMe: "Yaadadhu na",
    signIn: "Seeni",
    forgotPassword: "Jecha icimsaa irraanfatte?",

    // Rooms / Forms
    roomNumber: "Lakkoofsa Kutaa",
    roomType: "Gosa Kutaa",
    floor: "Laayira",
    capacity: "Dandeettii",
    viewType: "Gosa Ilaalchaa",
    description: "Ibsa",
    none: "Homaa",

    // Preferences
    preferences: "Filannoo",
    themeLabel: "Gosa Iddoo (Theme)",
    notificationPreferencesLabel: "Filannoo Beeksisa",
    privacyAndAccessibility: "Waliigalaafi Fayyadama Salphaa",
    optOutAnalytics: "Xiinxala irraa of-qusachuu",
    reduceMotion: "Sochii hir'isi",
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}
