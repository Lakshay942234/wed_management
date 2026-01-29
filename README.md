# 💒 Wedding Guest Management System

A modern, mobile-first wedding guest management application built with Next.js 15, Prisma, and TypeScript. Manage guests, hotels, coordinators, and event schedules with role-based access control.

## ✨ Features

### 👤 Guest Portal
- Phone-based login (no password required)
- View assigned hotel and coordinator
- See event schedule with dates and venues
- Travel information and special requirements

### 🔧 Admin Panel
- Dashboard with guest statistics
- Manage guests and family groups
- Hotel and coordinator management
- Event schedule CRUD operations
- Search and filter guests

### 👑 Super Admin
- Create/delete admin accounts
- Export data to CSV (guests, hotels, events, coordinators)
- System-wide data summaries
- Data integrity monitoring

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lakshaybishnoi/wed_management.git
   cd wed_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the values:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-key-change-in-production"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npm run db:push      # Create database schema
   npm run db:seed      # Seed with sample data
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - App: http://localhost:3000

## 🔐 Demo Credentials

After seeding, use these credentials:

| Role | URL | Phone | Password |
|------|-----|-------|----------|
| **Super Admin** | `/admin/login` | `9999999999` | `admin123` |
| **Guest (Sharma)** | `/login` | `9876543210` | - |
| **Guest (Patel)** | `/login` | `9876543220` | - |

## 📁 Project Structure

```
wedding/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   ├── auth/     # Authentication
│   │   │   ├── families/ # Family CRUD
│   │   │   ├── hotels/   # Hotel CRUD
│   │   │   ├── coordinators/
│   │   │   ├── events/   # Event CRUD
│   │   │   ├── admins/   # Admin management
│   │   │   └── export/   # CSV export
│   │   ├── admin/        # Admin panel pages
│   │   ├── guest/        # Guest portal pages
│   │   ├── superadmin/   # Super admin pages
│   │   └── login/        # Login pages
│   ├── lib/
│   │   ├── auth.ts       # JWT & session utilities
│   │   └── db.ts         # Prisma client
│   └── middleware.ts     # Route protection
├── .env.example
└── package.json
```

## 🗃️ Database Schema

| Table | Description |
|-------|-------------|
| `User` | Guests and admins with roles |
| `Family` | Guest family groups with travel info |
| `Hotel` | Hotel information |
| `Coordinator` | Airport/hotel coordinator contacts |
| `Event` | Wedding event schedule |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio GUI |

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **ORM:** Prisma
- **Styling:** Tailwind CSS v4
- **Auth:** JWT with HTTP-only cookies

## 🌐 Production Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Strong random secret
   - `NEXT_PUBLIC_APP_URL` - Your domain

### Database Options
- **Supabase** - Free PostgreSQL
- **Neon** - Serverless PostgreSQL
- **PlanetScale** - MySQL-compatible

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Admin passwords are hashed with bcrypt
- Guest login is phone-only (private event assumption)

## 📄 License

MIT License - feel free to use for your wedding!

---

Built with ❤️ for wedding management
