# 🚀 CampusBuddy 🎓

A full-stack **MERN (MongoDB, Express, React, Node.js)** application that helps students discover campus events and find teammates — built with **DevSecOps practices, CI/CD pipelines, and containerization**.

---

## 🌟 Overview

CampusBuddy is designed to simplify campus collaboration by:

* 📅 Showcasing upcoming events
* 🤝 Helping students find teammates
* 🔐 Ensuring secure access with role-based authentication
* ⚙️ Demonstrating real-world DevSecOps workflows

---

## ✨ Features

### 👤 Student

* View all upcoming events
* Mark interest in events
* Find teammates for specific events
* Update team status (Has team / Looking for team)

### 👨‍🏫 Admin

* Create and manage events
* Restricted access to event creation
* Role-based authorization

---

## 🏗️ Tech Stack

### 💻 Frontend

* React.js
* Axios
* Tailwind CSS (or your styling framework)

### 🖥️ Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### 🔐 Security

* JWT Authentication
* Password hashing with bcrypt
* Role-Based Access Control (RBAC)

---



## 🔁 CI/CD Pipeline

### ⚙️ Continuous Integration

Implemented using GitHub Actions

On every push / pull request:

* Install dependencies (frontend + backend)
* Build frontend application
* Validate backend execution
* Build Docker images
* Run security scans using Trivy

### 🔐 Security Checks

* Scans Docker images for:

  * CRITICAL vulnerabilities
  * HIGH severity issues

---

## 🚀 Continuous Deployment

### 🌐 Frontend Deployment

* Hosted on Vercel
* Automatic deployment on every GitHub push

### 🖥️ Backend Deployment

* Hosted on Render (or similar)
* Environment variables configured securely

---

## 🔄 CI/CD Workflow

1. Developer pushes code to GitHub
2. GitHub Actions runs CI pipeline
3. Docker images are built and scanned
4. Frontend auto-deploys on Vercel
5. Backend auto-deploys on Render

---



## 🔐 DevSecOps Practices

* Environment variables using `.env`
* Secure JWT authentication
* Password hashing (bcrypt)
* Rate limiting (optional)
* Helmet for HTTP security headers
* Vulnerability scanning using Trivy
* Containerized deployment with Docker

---

## ⭐ Conclusion

CampusBuddy demonstrates:

* Full-stack MERN development
* Secure authentication & authorization
* CI/CD pipeline integration
* Docker-based containerization
* Real-world DevSecOps practices

---


