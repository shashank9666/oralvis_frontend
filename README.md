# 🦷 OralVis Healthcare -- Dental Scan Management System

A full-stack web application for managing dental scans, built for
**OralVis Healthcare**.\
It supports two roles:

-   **Technicians** → Upload patient dental scans.
-   **Dentists** → View scans and download reports.

This project demonstrates authentication, file handling, cloud storage,
database integration, and a modern frontend.

------------------------------------------------------------------------

## 🚀 Tech Stack

### Frontend

-   **React (Vite)**
-   **Tailwind CSS** (for modern, responsive styling)
-   **React Router DOM** (routing)
-   **Axios** (API requests)
-   **jsPDF** (PDF report generation)

### Backend

-   **Node.js** + **Express.js**
-   **SQLite** (lightweight database)
-   **Multer** (file uploads)
-   **Cloudinary SDK** (cloud image storage)
-   **bcryptjs** (password hashing)
-   **jsonwebtoken** (JWT-based authentication)
-   **CORS** (cross-origin requests)

------------------------------------------------------------------------

## 📌 Features

### 🔑 Authentication

-   Secure login with **Role-Based Access Control (RBAC)**.
-   JWT stored on the client to protect API requests.

### 👩‍🔬 Technician Dashboard

-   Upload scans with:
    -   Patient Name & ID
    -   Scan Type
    -   Region
    -   Scan Image
-   Images uploaded to **Cloudinary**, URL stored in SQLite.

### 🦷 Dentist Dashboard

-   View all scans in a clean, responsive layout.
-   View scan thumbnails and enlarge full images.
-   Download a **PDF report** for any scan.

### 📄 PDF Report

-   Includes patient details, scan info, and date.
-   Embeds scan image into the generated PDF.

------------------------------------------------------------------------

## 🏗️ Project Structure

    oralvis-healthcare/
    │── backend/         # Express + SQLite + Cloudinary
    │   ├── index.js
    │   ├── database.sqlite
    │   ├── routes/
    │   └── ...
    │
    │── frontend/        # React + Vite + Tailwind
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── App.js
    │   │   └── ...
    │   └── tailwind.config.js
    │
    └── README.md

------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

``` bash
git clone https://github.com/<your-username>/oralvis-healthcare.git
cd oralvis-healthcare
```

### 2️⃣ Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`) with:

``` env
PORT=5000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:

``` bash
npm start
```

### 3️⃣ Frontend Setup

``` bash
cd ../frontend
npm install
```

Create a `.env` file:

``` env
VITE_API_URL=http://localhost:5000
```

Run the client:

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🔑 Default Credentials (for testing)

-   **Technician**
    -   Email: `tech@oralvis.com`
    -   Password: `password123`
-   **Dentist**
    -   Email: `dentist@oralvis.com`
    -   Password: `password123`

------------------------------------------------------------------------

## 🌍 Deployment

-   **Backend** → Deploy on [Render](https://render.com/) or
    [Vercel](https://vercel.com/).\
-   **Frontend** → Deploy on [Netlify](https://www.netlify.com/) or
    Vercel.\
-   Ensure **CORS** is configured for frontend → backend communication.

------------------------------------------------------------------------

## 📸 Screenshots

### 🔐 Login Page

![Login](./screenshots/login.png)

### 👩‍🔬 Technician Upload

![Upload](./screenshots/technician.png)

### 🦷 Dentist Dashboard

![Dentist](./screenshots/dentist.png)

------------------------------------------------------------------------

## ✅ Submission Checklist

-   [x] Source code with **frontend** and **backend** folders.\
-   [x] Working authentication with role-based access.\
-   [x] Upload & view scans with cloud storage.\
-   [x] PDF report generation.\
-   [x] Hosted demo link.\
-   [x] Documentation with setup guide and credentials.

------------------------------------------------------------------------

💡 *Built with ❤️ using React, TailwindCSS, Node.js, Express, SQLite,
and Cloudinary.*
