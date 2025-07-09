# 📚 Book Review App (MERN Stack)

A full-stack Book Review application where users can browse and review books, and admins can manage book listings and reviews. Built using MongoDB, Express.js, React.js, and Node.js.

---

## 🚀 Features

- 🔐 User Authentication (JWT)
- 👥 Role-based access: `Admin` & `User`
- 📖 Users can:
  - View all books
  - Submit reviews with ratings
  - Download book files
- 🛠️ Admins can:
  - Add new books
  - Delete or edit reviews
- ⚡ Real-time updates using **Socket.IO**
- 🌐 Responsive and interactive UI

---

## 🧾 Folder Structure

book-review-app/
│
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── api/ # Axios instance
│ ├── components/
│ ├── context/ # Auth context
│ ├── pages/ # Login, Admin, User dashboards
│ ├── styles/
│ └── App.js
│
├── server/ # Express backend
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── index.js # Main entry point
│
├── .gitignore
├── .env
├── README.md
└── package.json
---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Axios
- Context API
- Socket.IO-client

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- Socket.IO

---

## 📦 Installation Guide

### 🔧 Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Git

---

### 📁 Clone Repository

```bash
git clone https://github.com/Sachint122/Book_Manage.git
cd book-review-app

cd server
npm install

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

node server.js
```
💻 Setup Client
Open new terminal:

```bash
cd client
npm install
npm start
```
Frontend will run on: http://localhost:3000
Backend runs on: http://localhost:5000

⚙️ Usage
✅ Register/Login as a user

📥 Browse and download books

✍️ Add reviews with star ratings

👨‍💼 Admin can:

Add new books

Delete or update reviews

📡 Deployment (Optional)
🔷 Deploy Frontend (Vercel, Netlify)

```bash
cd client
npm run build
```
Upload the /build folder to Netlify or Vercel.

🔷 Deploy Backend (Render, Railway)
>Push server code to GitHub

>Create a new Render service

>Add environment variables: MONGO_URI, JWT_SECRET

>Use npm start as start command


🛡️ Security Notes
>Don’t expose .env files or secrets in client

>Use HTTPS in production

>Enable CORS properly for deployed domain

🤝 Contributing
PRs are welcome! Please open an issue for bugs or ideas.

👨‍💻 Developed By
Sachin Tiwari
GitHub | Email: sachintiwari.751858@gmail.com