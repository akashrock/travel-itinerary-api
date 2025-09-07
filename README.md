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

### 3. Setup environment variables for Render
Create a `.env` file in the project root:
```env
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/mydb?retryWrites=true&w=majority
UPSTASH_REDIS_URL=rediss://default:your-upstash-password@your-upstash-url:6379
JWT_SECRET=your_render_jwt_secret
```
### . Setup environment variables for locally
```env
PORT=5000
MONGO_URI=mongodb+srv://root:<db_password>@cluster0.kv8meeo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
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
- Make sure to update **MongoDB URI** (e.g., MongoDB Atlas) & Redis connection

---

## 🧪 Postman Collection

👉 [Travel API Postman Collection](https://ashish-singh-s-team.postman.co/workspace/Team-Workspace~74a8efc8-8012-4863-89c5-9fddc1f374a8/collection/47844124-258d7a0c-9106-4a98-b551-4d32c7c62f4e?action=share&creator=47844124)

### Environments Setup

#### 🔹 Local Environment
- `baseUrl` → `http://localhost:5000`

#### 🔹 Render Deployment
- `baseUrl` → `https://travel-itinerary-api-pin4.onrender.com`

### Steps
1. Import the Postman collection.
2. Create two environments (`Local` & `Render`) with `baseUrl` variable.
3. All requests in the collection use `{{baseUrl}}`.
4. Switch environments from the dropdown when testing.
