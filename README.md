# 🔁 SkillSwap: Community-Powered Learning Platform

Empowering individuals to **share skills**, **gain knowledge**, and **grow together** through structured swaps. SkillSwap connects learners and mentors through a seamless, secure, and smart web platform.

---

## 🖥 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-orange?style=for-the-badge\&logo=next.js\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)

---

## 🚀 Overview

SkillSwap is a full-stack application designed to foster community-driven learning by enabling users to exchange skills. Whether you're a designer wanting to code or a coder curious about marketing, SkillSwap finds you the right partner.

---

## ✨ Key Features

### 👤 User Management

* 🔒 **JWT Authentication** with hashed passwords
* 🎨 **Profile Customization** with bio, skills, and availability
* 📸 **Profile Picture Uploads** via Cloudinary
* 👁️‍🗨️ **Privacy Controls** to manage profile visibility

### 🛠 Skills Ecosystem

* ➕ **Add Offered/Learning Skills** with categorization
* 🔍 **Advanced Skill Search** & filtering
* 📚 **Skill Taxonomy** for organized browsing

### 🔁 Skill Swapping

* 📬 **Swap Request System**
* 📊 **Status Tracking & Real-Time Updates**
* 🧠 **Smart Matching Algorithm** to suggest optimal partners
* 📥 **Request Inbox** to accept, reject or modify requests

### ⭐ Community Tools

* 🌟 **Swap Feedback & Rating System**
* ✅ **User Verification** via community trust
* 📅 **Availability Calendar**
* 🕒 **Swap History Timeline**

---

## 🧱 Architecture & Stack Details

### Frontend

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **State Management**: React Context API
* **Components**: Modular and custom-built

### Backend

* **Runtime**: Node.js with Express
* **ORM**: Sequelize
* **Database**: PostgreSQL
* **Auth**: JWT + Bcrypt
* **Image Hosting**: Cloudinary
* **Middleware**: Custom validation and auth layers

---

## 🗃 Database Schema

```sql
Users:
- id (PK), email, password, name, bio
- skills_offered, skills_wanted (arrays)
- availability (array), profile_image, is_public

SwapRequests:
- id (PK), requester_id (FK), requested_id (FK)
- skill_offered, skill_requested
- status (pending/accepted/rejected), created_at
```

---

## ⚙️ Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL
* Cloudinary account

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd skill-swap-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env # configure credentials
npm run migrate # if using migrations
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env.local # configure frontend env vars
```

### 4. Start Development

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### Environment Variables

**Backend (.env)**

```env
DATABASE_URL=postgresql://username:password@localhost:5432/skillswap_db
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Folder Structure

```
skill-swap-platform/
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   └── services/
```

---

## 🌐 API Reference

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/profile`

### Users

* `GET /api/users`
* `PUT /api/users/profile`
* `POST /api/users/upload`

### Swaps

* `POST /api/swaps/request`
* `GET /api/swaps/sent`
* `GET /api/swaps/received`
* `PUT /api/swaps/:id/status`

---

## 🎯 Hackathon Details

**Event**: \Odoo Hackathon]
**Team**: \[Runtime error]


### 🏆 Achievements

* ✅ Modern full-stack implementation
* ✅ Scalable architecture & modular codebase
* ✅ Smart matchmaking algorithm
* ✅ Real-time request tracking
* ✅ Secure auth & media handling

---

## 📸 Demo Screenshots

> *Add UI previews and flow diagrams here*

---

## 👨‍💻 Contributing

1. Fork this repository
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Create a Pull Request 🧠

---

## 📜 License

This project is licensed under the **ISC License**. See the [LICENSE](./LICENSE) file for details.

---
---

## 🙌 Acknowledgments

* Next.js, Node.js, and PostgreSQL Communities
* Cloudinary for media hosting
* Hackathon organizers & mentors
* All OSS contributors 💛

---

<div align="center">
  <strong>Built with ❤️ for community-powered growth.</strong><br/>
  <a href="#top">🔝 Back to Top</a>
</div>
