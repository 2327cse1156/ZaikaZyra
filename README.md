🍴 ZaikaZyra

ZaikaZyra is a food ordering platform that connects users with restaurants, allowing them to browse menus, place orders, and track deliveries in real time. It is built with a MERN stack (MongoDB, Express, React, Node.js) and provides a smooth user experience with modern UI and secure backend.

🚀 Features

🔐 Authentication & Authorization (JWT-based login/signup)

🍕 Browse Menus – explore dishes from different restaurants

🛒 Cart & Checkout – add/remove items, place orders seamlessly

📦 Order Tracking – live updates on order status

👨‍🍳 Admin Panel – manage restaurants, menus, and orders

📱 Responsive UI – optimized for both desktop and mobile

🛠 Tech Stack
Frontend (Client)

⚛️ React (with Hooks & Context API/Redux for state management)

🎨 Tailwind CSS / Material UI (for styling)

🔄 Axios (API requests)

Backend (Server)

🌐 Node.js + Express.js

🗄 MongoDB (Mongoose ORM)

🔐 JWT Authentication

⚡ RESTful APIs

📂 Project Structure
ZaikaZyra/
│── client/        # React frontend
│── server/        # Node.js backend
│── package.json   # root dependencies (if any)
│── .gitignore
│── README.md

⚡ Installation & Setup
Prerequisites

Node.js (v16+)

MongoDB (local or Atlas)

npm / yarn

Clone Repository
git clone https://github.com/2327cse1156/ZaikaZyra.git
cd ZaikaZyra

Setup Client
cd client
npm install
npm run dev   # Starts frontend on http://localhost:5173 (Vite default)

Setup Server
cd server
npm install
npm run dev   # Starts backend on http://localhost:5000

🔑 Environment Variables

Create .env files in both client and server directories.

Server .env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

Client .env
VITE_API_URL=http://localhost:5000

🤝 Contributing

Fork the repo

Create a new branch (feature/your-feature)

Commit changes (git commit -m 'Add new feature')

Push to branch (git push origin feature/your-feature)

Create a Pull Request

📜 License

This project is licensed under the MIT License – free to use and modify.
