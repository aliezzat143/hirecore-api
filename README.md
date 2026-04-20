# 🚀 HireCore API
A scalable freelance marketplace backend with secure payments, real-time communication, and media handling.

📌 Overview

HireCore API is a production-ready backend system for a freelance marketplace platform. It handles user authentication, job management, secure payments, real-time messaging, and file uploads — all built with a scalable and modular architecture.

This project is designed to simulate a real-world SaaS backend and demonstrate full-stack backend engineering capabilities.

⚙️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Real-time: Socket.IO
Payments: Stripe (Webhooks)
Media Storage: Cloudinary
Authentication: JWT (Access + Refresh Tokens)
Other: REST APIs, MVC Architecture
✨ Features
🔐 Authentication & Security
JWT-based authentication (access & refresh tokens)
Role-based access control (Client / Freelancer / Admin)
Password hashing & secure credential handling
Rate limiting & input validation
💼 Job Management
Create, update, and delete job postings
Freelancer bidding / acceptance system
Job status tracking (open, in-progress, completed)
💬 Real-Time Messaging
One-to-one chat system using Socket.IO
Live message updates
Conversation tracking per job
💳 Payments Integration
Secure payments using Stripe
Webhook handling for payment confirmation
Transaction tracking per job
🖼️ Media Uploads
File/image uploads via Cloudinary
Secure storage and retrieval
📊 System Design
Modular MVC architecture
Centralized error handling
Logging system for debugging and monitoring
🧠 Architecture Overview
Client → REST API → Controllers → Services → Database (MongoDB)
                     ↘ External Services:
                        - Stripe (Payments)
                        - Cloudinary (Media)
                        - Socket.IO (Real-time)
🚀 Getting Started
Prerequisites
Node.js (v16+)
MongoDB
Stripe account
Cloudinary account
Installation
git clone https://github.com/yourusername/hirecore-api.git
cd hirecore-api
npm install
Environment Variables

Create a .env file in the root directory:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
Run the Server
npm run dev
📡 API Usage

You can test endpoints using:

Postman

A full API collection will be added soon.

## 📡 API Collection

A complete API collection is available for testing all endpoints and workflows.

### 🔗 Access the Collection

* Postman Collection: https://github.com/aliezzat143/hirecore-api/tree/main/hirecore-api/postman

---

### 🧪 What You Can Test

The collection includes fully structured requests for:

* 🔐 Authentication (Register / Login / Refresh Tokens)
* 👤 User Roles (Client / Freelancer / Admin)
* 💼 Job Management (Create / Apply / Update / Complete)
* 💬 Real-time Messaging (via Socket.IO)
* 💳 Payments (Stripe integration + webhook testing)
* 🖼️ File Uploads (Cloudinary integration)

---

### ▶️ How to Use

1. Import the collection into Postman
3. Set your local or deployed base URL
4. Run requests in sequence to simulate full workflows

---

### 🔄 Example Workflow

1. Register as Client
2. Create a Job
3. Register as Freelancer
4. Apply / Accept Job
5. Complete Payment
6. Start Real-time Chat

This demonstrates the full lifecycle of the platform.


🛡️ Production-Ready Considerations
Secure payment handling via Stripe webhooks
Scalable architecture (MVC pattern)
Error handling & logging
Environment-based configuration
Input validation & protection against common attacks
📈 Future Improvements
Notification system (email / push)
Admin dashboard
Escrow payment system
Microservices architecture
🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

📄 License

This project is licensed under the MIT License.

👤 Author

Developed by Ali Ezzat
