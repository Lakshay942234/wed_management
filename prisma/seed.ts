import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create Super Admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const superAdmin = await prisma.user.upsert({
        where: { phone: "9999999999" },
        update: {},
        create: {
            name: "Super Admin",
            phone: "9999999999",
            password: hashedPassword,
            role: "SUPERADMIN",
        },
    });
    console.log("✅ Super Admin created:", superAdmin.phone);

    // Create Hotels
    const hotel1 = await prisma.hotel.create({
        data: {
            name: "Grand Palace Hotel",
            address: "123 Wedding Lane, Mumbai, Maharashtra 400001",
            phone: "+91 22 1234 5678",
            notes: "5-star luxury hotel with spa and pool",
        },
    });

    const hotel2 = await prisma.hotel.create({
        data: {
            name: "Royal Heritage Resort",
            address: "456 Celebration Road, Mumbai, Maharashtra 400002",
            phone: "+91 22 8765 4321",
            notes: "Traditional architecture with modern amenities",
        },
    });
    console.log("✅ Hotels created");

    // Create Coordinators
    const coordinator1 = await prisma.coordinator.create({
        data: {
            name: "Rahul Sharma",
            phone: "+91 98765 43210",
            type: "AIRPORT",
            area: "Mumbai Airport Terminal 2",
        },
    });

    const coordinator2 = await prisma.coordinator.create({
        data: {
            name: "Priya Patel",
            phone: "+91 98765 43211",
            type: "HOTEL",
            area: "Grand Palace Hotel",
        },
    });

    const coordinator3 = await prisma.coordinator.create({
        data: {
            name: "Amit Singh",
            phone: "+91 98765 43212",
            type: "HOTEL",
            area: "Royal Heritage Resort",
        },
    });
    console.log("✅ Coordinators created");

    // Create Events
    const eventDate1 = new Date("2026-04-13");
    const eventDate2 = new Date("2026-04-14");
    const eventDate3 = new Date("2026-04-15");

    await prisma.event.createMany({
        data: [
            {
                name: "Mehndi Ceremony",
                date: eventDate1,
                startTime: "16:00",
                endTime: "20:00",
                venue: "Grand Palace Hotel - Garden Area",
                notes: "Traditional mehndi for bride and family",
                order: 1,
            },
            {
                name: "Sangeet Night",
                date: eventDate1,
                startTime: "20:00",
                endTime: "23:30",
                venue: "Grand Palace Hotel - Grand Ballroom",
                notes: "Dress code: Colorful Indian attire",
                order: 2,
            },
            {
                name: "Haldi Ceremony",
                date: eventDate2,
                startTime: "10:00",
                endTime: "12:00",
                venue: "Poolside Lawn",
                notes: "Wear clothes you don't mind getting yellow!",
                order: 1,
            },
            {
                name: "Wedding Ceremony",
                date: eventDate2,
                startTime: "18:00",
                endTime: "21:00",
                venue: "Royal Heritage Resort - Main Hall",
                notes: "The main event! Traditional attire requested",
                order: 2,
            },
            {
                name: "Reception",
                date: eventDate2,
                startTime: "21:00",
                endTime: "00:00",
                venue: "Royal Heritage Resort - Banquet Hall",
                notes: "Dinner and celebrations",
                order: 3,
            },
            {
                name: "Farewell Brunch",
                date: eventDate3,
                startTime: "11:00",
                endTime: "14:00",
                venue: "Grand Palace Hotel - Restaurant",
                notes: "Casual goodbye gathering",
                order: 1,
            },
        ],
    });
    console.log("✅ Events created");

    // Create sample families with guests
    const family1 = await prisma.family.create({
        data: {
            name: "The Sharma Family",
            relationship: "Cousin",
            hotelId: hotel1.id,
            coordinatorId: coordinator2.id,
            arrivalDate: new Date("2026-04-12"),
            arrivalMode: "FLIGHT",
            arrivalDetails: "AI 123, arriving 14:30",
            departureDate: new Date("2026-04-16"),
            departureMode: "FLIGHT",
            departureDetails: "AI 456, departing 18:00",
            foodBeforeSunset: false,
            roomRequirements: "2 connecting rooms preferred",
        },
    });

    await prisma.user.createMany({
        data: [
            { name: "Vikram Sharma", phone: "9876543210", role: "GUEST", familyId: family1.id },
            { name: "Meera Sharma", phone: "9876543211", role: "GUEST", familyId: family1.id },
            { name: "Aryan Sharma", phone: "9876543212", role: "GUEST", familyId: family1.id },
        ],
    });

    const family2 = await prisma.family.create({
        data: {
            name: "The Patel Family",
            relationship: "Friend",
            hotelId: hotel2.id,
            coordinatorId: coordinator3.id,
            arrivalDate: new Date("2026-04-13"),
            arrivalMode: "CAR",
            arrivalDetails: "Driving from Pune, arriving morning",
            departureDate: new Date("2026-04-15"),
            departureMode: "CAR",
            departureDetails: "Departing afternoon",
            foodBeforeSunset: true,
            foodRestrictions: "Jain food required",
            specialNotes: "Elderly grandmother needs wheelchair access",
        },
    });

    await prisma.user.createMany({
        data: [
            { name: "Nikhil Patel", phone: "9876543220", role: "GUEST", familyId: family2.id },
            { name: "Anita Patel", phone: "9876543221", role: "GUEST", familyId: family2.id },
        ],
    });

    console.log("✅ Sample families and guests created");
    console.log("\n🎉 Seeding complete!");
    console.log("\n📋 Login credentials:");
    console.log("   Super Admin: 9999999999 / admin123");
    console.log("   Guest (Vikram): 9876543210");
    console.log("   Guest (Nikhil): 9876543220");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
