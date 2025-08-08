# Kindify – Empowering Transparent Donations

**Kindify** is a full-stack donation platform designed to connect donors with verified NGOs. Built with a modern MERN stack, Kindify simplifies charitable giving while ensuring transparency, trust, and traceability for every transaction.

---

## 🌟 Features

- **Secure Authentication** using Google OAuth 2.0 and JWT
- **Role-based Access** for Donors, NGOs, and Admins
- **Razorpay Integration** for real-time, secure donations
- **Admin Dashboard** for NGO verification and platform oversight
- **NGO Profiles** with project details, certifications, and histories
- **Donation History** with transparent tracking per user
- **Advanced Search** by cause, location, and NGO status
- **Real-time Alerts** and notifications for key actions

---

## 🛠️ Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS  
**Backend**: Node.js, Express.js  
**Database**: MongoDB  
**Authentication**: OAuth 2.0 (Google), JWT  
**Payments**: Razorpay  
**Others**: REST APIs, Role-Based Access Control, Git, Postman

---

## 📁 Project Structure

```
Kindify/
├── kindify-client/       # Frontend (React + Vite + Tailwind)
│   └── src/
│
├── Kindify-server/       # Backend (Node.js + Express + MongoDB)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── index.js
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/iamansoni07/Kindify.git
cd Kindify
```

### 2. Setup Backend

```bash
cd Kindify-server
npm install
```

Create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../kindify-client
npm install
npm run dev
```

The frontend will run at `http://localhost:5173` and the backend at `http://localhost:5000` by default.

---

## 🧪 Available Roles

- **Donor**: Explore NGOs, donate securely, track donations
- **NGO**: Apply for verification, manage profile and documents
- **Admin**: Verify NGOs, monitor activity, manage the platform

---

## 👤 Author

**Aman Soni**  
📧 [aman.soni0713@gmail.com](mailto:aman.soni0713@gmail.com)  
🌐 [Portfolio](https://amansonidev.netlify.app)  
💼 [LinkedIn](https://www.linkedin.com/in/amansoni0713/)  
🐙 [GitHub](https://github.com/iamansoni07)

---

## 📄 License

This project is licensed under the **MIT License**.

---
