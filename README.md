# Click2Buy Backend API

## Project Description

Click2Buy is a modular, modern **e-commerce backend** built with **TypeScript, Node.js, Express, MongoDB, Mongoose, Zod, and JWT authentication**.  
This backend provides APIs for managing **users, products, orders**, and **admin statistics**. The project is fully modular, type-safe, and designed for production-ready scalability.  

---

## Tech Stack

- **Node.js** & **Express 5** – server and routing  
- **TypeScript** – type-safe coding  
- **MongoDB & Mongoose** – database & ODM  
- **Zod** – data validation  
- **JWT** – authentication  
- **dotenv** – environment variables  
- **Cors** – cross-origin requests  
- **Nodemon & concurrently** – dev workflow with automatic server restart  

---

## Project Setup

### 1. Clone the repo
```bash
git clone https://github.com/SifatNiloy/click2buy-server-side.git
cd click2buy-server-side 
```
### 2. Install dependencies
```bash
npm install
```
### 3. Setup environment variables
Create a .env file in the root:

### 4. Development server
```bash
npm run dev
```
Automatically compiles TypeScript to dist/

Restarts server on any code change

### 5. Production build
```bash
npm run build
npm start
```
API Documentation
Base URL: http://localhost:5000

For all protected routes, include JWT in headers:
Authorization: Bearer <JWT_TOKEN>

### 1. Server Health
**Method:** `GET`  
**URL:** `/`  
**Body:** None  

**Response:**
```json
"click2buy server connected"

###  2. JWT Token Generation
Method: POST

URL: /jwt

Headers: Content-Type: application/

Body:



{
  "email": "user@example.com",
  "role": "User"
}
Response Example:
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
### Users API
a) Get All Users (Admin only)
Method: GET

URL: /users

Headers: Authorization: Bearer <JWT_TOKEN>

## Response Example:



[
  {
    "_id": "64fa1234abcd5678ef901234",
    "email": "user@example.com",
    "role": "User",
    "displayName": "John Doe"
  }
]
## b) Create User
Method: POST

URL: /users

Headers: Content-Type: application/

Body:



{
  "email": "newuser@example.com",
  "displayName": "New User",
  "password": "password123",
  "role": "User"
}
Response Example:



{
  "acknowledged": true,
  "insertedId": "64fa5678abcd1234ef901234"
}
## c) Update Profile (Authenticated)
Method: PUT

URL: /api/user/profile

Headers: Authorization: Bearer <JWT_TOKEN>

Body:



{
  "displayName": "Updated Name",
  "email": "updated@example.com",
  "password": "newpassword"
}
Response Example:



{
  "_id": "64fa1234abcd5678ef901234",
  "email": "updated@example.com",
  "displayName": "Updated Name",
  "role": "User"
}
## d) Delete User
Method: DELETE

URL: /users/<USER_ID>

Headers: Authorization

Response Example:



{
  "acknowledged": true,
  "deletedCount": 1
}
## e) Make User Admin
Method: PATCH

URL: /users/admin/<USER_ID>

Headers: Authorization (Admin JWT)

Response Example:



{
  "acknowledged": true,
  "modifiedCount": 1
}
## f) Check Admin by Email
Method: GET

URL: /users/admin/<EMAIL>

Headers: Authorization

Response Example:



{
  "admin": true
}
### Products API 
## a) Get All Products (Paginated)
Method: GET

URL: /products?page=0&size=10

Response Example:



{
  "count": 100,
  "products": [
    { "_id": "p1", "name": "Product 1", "price": 99.99 },
    { "_id": "p2", "name": "Product 2", "price": 49.99 }
  ]
}
## b) Get Limited Products
Method: GET

URL: /limitedProduct

Response Example:



[
  { "_id": "p11", "name": "Product 11", "price": 59.99 },
  { "_id": "p12", "name": "Product 12", "price": 79.99 }
]
## c) Search Product by Name
Method: GET

URL: /products/<NAME>

Response Example:



[
  { "_id": "p5", "name": "Laptop", "price": 899.99 }
]
## d) Add Product (Admin only)
Method: POST

URL: /products

Headers: Authorization: Bearer <JWT_TOKEN>

Body:



{
  "name": "New Product",
  "price": 120,
  "description": "A test product",
  "category": "Electronics",
  "image": "https://example.com/product.jpg"
}
Response Example:



{
  "acknowledged": true,
  "insertedId": "p101"
}
## e) Delete Product
Method: DELETE

URL: /products/<PRODUCT_ID>

Headers: Admin JWT

Response Example:



{
  "acknowledged": true,
  "deletedCount": 1
}
### Orders API 
## a) Get Orders for a User
Method: GET

URL: /orders?email=user@example.com

Headers: Authorization

Response Example:



[
  {
    "_id": "o1",
    "email": "user@example.com",
    "items": [
      { "productId": "p1", "quantity": 2 },
      { "productId": "p2", "quantity": 1 }
    ],
    "price": 299.99
  }
]
## b) Create Order
Method: POST

URL: /orders

Headers: Content-Type: application/

Body:



{
  "email": "user@example.com",
  "items": [
    { "productId": "p1", "quantity": 2 },
    { "productId": "p2", "quantity": 1 }
  ],
  "price": 299.99
}
Response Example:



{
  "acknowledged": true,
  "insertedId": "o101"
}
## c) Get Order by ID
Method: GET

URL: /orders/<ORDER_ID>

Response Example:



{
  "_id": "o101",
  "email": "user@example.com",
  "items": [
    { "productId": "p1", "quantity": 2 }
  ],
  "price": 199.99
}
** d) Delete Order **
Method: DELETE

URL: /orders/<ORDER_ID>

Response Example:



{
  "acknowledged": true,
  "deletedCount": 1
}
Admin Stats API
Method: GET

URL: /admin-stats

Headers: Admin JWT

Response Example:



{
  "users": 10,
  "products": 50,
  "orders": 20,
  "totalPrice": 4500
}
Postman Collection Setup
Create Environment Variables:

BASE_URL = http://localhost:5000

TOKEN = <JWT_TOKEN>

Use {{BASE_URL}}/users, {{BASE_URL}}/products, etc. for request URLs.

For protected routes, set header:

css

Authorization: Bearer {{TOKEN}}
Use raw  for POST/PUT bodies as shown in examples.
```

License
© SifatNiloy

