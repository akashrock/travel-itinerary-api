# Travel Itinerary API

A simple Node.js + Express API with MongoDB and Redis for managing travel itineraries and authentication.

---

## 🚀 Features
- User registration & login (with JWT auth)
- Create, read, update, delete itineraries
- MongoDB for data persistence
- Redis for caching
- Ready for local development & deployment

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/travel-itinerary-api.git
cd travel-itinerary-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the project root:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelDB
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
```

### 4. Start MongoDB & Redis locally
```bash
mongod
redis-server
```

### 5. Run the project
```bash
npm start
```

Server should start at:
👉 http://localhost:5000

---

## 📌 API Documentation

### 🔐 Auth Routes

#### 1. Register User
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```
✅ **Response**
```json
{
  "token": "jwt_token_here"
}
```

#### 2. Login User
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
✅ **Response**
```json
{
  "token": "jwt_token_here"
}
```

---

### 🧳 Itinerary Routes

#### 1. Get all itineraries
**GET** `/api/itineraries`
✅ **Response**
```json
[
  {
    "_id": "64d1f7a6b8e21c7b9c123456",
    "title": "Trip to Goa",
    "description": "Beach holiday",
    "date": "2025-09-10",
    "user": "64d1f7a6b8e21c7b9c789012"
  }
]
```

#### 2. Create itinerary
**POST** `/api/itineraries` (🔒 Requires JWT in header: `Authorization: Bearer <token>`)
```json
{
  "title": "Trip to Goa",
  "description": "Beach holiday",
  "date": "2025-09-10"
}
```
✅ **Response**
```json
{
  "message": "Itinerary created successfully",
  "itinerary": {
    "_id": "64d1f7a6b8e21c7b9c123456",
    "title": "Trip to Goa",
    "description": "Beach holiday",
    "date": "2025-09-10",
    "user": "64d1f7a6b8e21c7b9c789012"
  }
}
```

#### 3. Update itinerary
**PUT** `/api/itineraries/:id`
```json
{
  "title": "Trip to Manali",
  "description": "Mountain holiday"
}
```
✅ **Response**
```json
{
  "message": "Itinerary updated successfully"
}
```

#### 4. Delete itinerary
**DELETE** `/api/itineraries/:id`
✅ **Response**
```json
{
  "message": "Itinerary deleted successfully"
}
```

---

## 🌍 Deployment Notes
- Can be deployed on **Render / Railway / Heroku**
- Make sure to update **MongoDB URI** (e.g., MongoDB Atlas) & Redis connection
