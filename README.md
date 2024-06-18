# Oscillation Vinyls

## Description

Oscillation Vinyls is a comprehensive full-stack web application designed for the buying and selling of vinyl records. Users can browse available records, register to place orders, make payments, and sell their own vinyls. This project leverages an event-driven architecture and server-side rendering to provide a robust and scalable platform. Through this project, I aim to deepen my understanding of microservices, software design and architecture principles, Docker, Kubernetes, and Kafka.

## Technologies Used

* **Frontend:** React, Next.js 14
* **Backend Services:** Node.js, Express
* **Languages:** TypeScript (for both frontend and backend)
* **Databases:** MongoDB, Redis
* **Containerization:** Docker, Kubernetes
* **Event Handling and Microservice Communication:** Apache Kafka
* **Styling:** TailwindCSS
* **Testing:** Jest

## Features

* **Authentication and Authorization**
    - JSON Web Tokens (JWT) for authentication
    - Sign-in, sign-up, and sign-out pages interact with the authentication service

* **Vinyl Records Management**
    - View available records
    - Authenticated users can add and update their own records
    - Image uploads stored in an AWS S3 bucket

* **Orders Management**
    - 15-minute reservation window for order placement
    - View order statuses

* **Payments**
    - Integrated with Stripe Embedded Checkout for payment processing
    - Payment functionality is for demonstration purposes only

## Frontend

### Main Routes

#### Root ('/')
- **Landing Page:** Browse genres and view records.
- **Authentication:** Sign in or sign up for full functionality.
- **Authenticated Users:** Add records, view orders, and make payments.

#### Authentication ('/auth')
- **Sign In/Sign Up/Sign Out:** Handles user authentication via the auth service and JWT.

#### Vinyls ('/vinyls')
- **Browse Records:** View all available vinyls.
- **Vinyl Details ([vinylId]):** Detailed view and order placement.
- **Add Vinyl ('/vinyls/new'):** Authenticated users can upload new vinyls.

#### Orders ('/orders')
- **View Orders:** Authenticated users can view their orders and statuses.
- **Order Details ([orderId]):** Reserve vinyls and complete orders within 15 minutes.
- **Order Completion ('/orders/complete'):** Post-payment process.

## Backend

### Event Architecture Overview

The microservices communicate asynchronously via a Kafka cluster, ensuring a decoupled and scalable architecture. Each service operates independently, emitting events for relevant actions and listening to events from other services.

### Event-Based Architecture Workflow

Each service maintains its own database and responsibility scope. Events such as 'vinyl created' are emitted by the Items service and consumed by other services like Orders, which then update their databases accordingly. This design ensures data consistency and independence among services.

Manual commit offsets are employed by each consumer to handle event processing errors effectively, allowing for reliable event handling.

### Services

A shared NPM library ensures consistency and standardization across services.

#### Authentication Service (Auth)
Handles user authentication and authorization.

* **Endpoints:**
    - **Sign In (POST /api/users/signin)**
        - Request Body: `{ email: string, password: string }`
        - Response: `{ email: string, id: string }`
    - **Sign Up (POST /api/users/signup)**
        - Request Body: `{ email: string, password: string }`
        - Response: `{ email: string, id: string }`
    - **Current User (GET /api/users/currentUser)**
        - Requires a valid JWT in `request.session`.
        - Response: `{ currentUser: { email: string } }` or `null`
    - **Sign Out (POST /api/users/signout)**
        - Request Body: Empty
        - Response: Empty

* **Authentication Middleware:**
    - **currentUser:** Verifies and sets the current user from JWT.
    - **requireAuth:** Ensures user is authenticated for protected routes.


#### Vinyls Service
Handles the management of vinyl records.

* **Endpoints:**
    - **Create Vinyl (POST /api/vinyls)**
        - Request Body: `{ title: string, price: number, description: string, imageUrl: string }`
        - Response: `{ id: string, title: string, price: number, description: string, imageUrl: string, userId: string }`
    - **Get All Vinyls (GET /api/vinyls)**
        - Response: `[{ id: string, title: string, price: number, description: string, imageUrl: string, userId: string }]`
    - **Get Vinyl by ID (GET /api/vinyls/:id)**
        - Response: `{ id: string, title: string, price: number, description: string, imageUrl: string, userId: string }`
    - **Update Vinyl (PUT /api/vinyls/:id)**
        - Request Body: `{ title?: string, price?: number, description?: string, imageUrl?: string }`
        - Response: `{ id: string, title: string, price: number, description: string, imageUrl: string, userId: string }`
    - **Delete Vinyl (DELETE /api/vinyls/:id)**
        - Response: `{ id: string }`

#### Orders Service
Handles the creation and management of orders.

* **Endpoints:**
    - **Create Order (POST /api/orders)**
        - Request Body: `{ vinylId: string }`
        - Response: `{ id: string, vinylId: string, userId: string, status: string, expiresAt: string, vinyl: {
  id: string;
  title: string;
  price: number;
} }`
    - **Get All Orders (GET /api/orders)**
        - Response: `[{ id: string, vinylId: string, userId: string, status: string, expiresAt: string }]`
    - **Get Order by ID (GET /api/orders/:id)**
        - Response: `{ id: string, vinylId: string, userId: string, status: string, expiresAt: string, vinyl: {
  id: string;
  title: string;
  price: number;
} }`
    - **Cancel Order (DELETE /api/orders/:id)**
        - Response: `{ id: string }`

#### Payments Service
Handles payment processing through Stripe.

* **Endpoints:**
    - **Create Payment (POST /api/payments)**
        - Request Body: `{ orderId: string, stripeId: string }`
        - Response: `{ success: boolean }`

#### Expiration Service
Handles the expiration of orders that are not completed within the reservation window.

* **Functionality:**
    - Listens for `order:created` events from the Orders Service.
    - Waits for a predefined duration (e.g., 15 minutes) using a Bull queue hosted on Redis.
    - Emits an `order:expired` event if the order is not completed within the reservation window.

* **Endpoints:**
    - This service primarily operates in the background and does not expose direct endpoints.


#### Common NPM Library
A shared library used by all services to ensure consistency.

* **Modules:**
    - **Events:** Event definitions and publisher/subscriber logic.
    - **Middleware:** Common middlewares such as `currentUser` and `requireAuth`.
    - **Errors:** Common error handling classes.
    
### Event Configuration Summary

#### Authentication Service (Auth)

* **Producers:**
    - **None.** 

* **Consumers:**
    - **None.** 

#### Vinyls Service

* **Producers:**
    - Emits `vinyl_created` event when a new vinyl record is created.
    - Emits `vinyl_updated` event when a vinyl record is updated.

* **Consumers:**
    - Consumes `order_created` event to mark vinyls as reserved.
    - Consumes `order_cancelled` event to mark vinyls as available again.

#### Orders Service

* **Producers:**
    - Emits `order_created` event when a new order is created.
    - Emits `order_updated` event when an order is cancelled.

* **Consumers:**
    - Consumes `vinyl_created` event to ensure vinyl data is up-to-date.
    - Consumes `vinyl_updated` event to update vinyl data in orders.
    - Consumes `expiration_complete` event to handle order expiration.
    - Consumes `payment_created` event when a payment is successfully processed.

#### Payments Service

* **Producers:**
    - Emits `payment_created` event when a payment is successfully processed.

* **Consumers:**
    - Consumes `order_created` event to process payments for new orders.
    - Consumes `order_cancelled` event to handle payment cancellations.

#### Expiration Service

* **Producers:**
    - Emits `expiration_complete` event when an order expires after the predefined reservation window (e.g., 15 minutes).

* **Consumers:**
    - Consumes `order_created` event to start the expiration timer for new orders.

### Responsibilities of Consumers

* **Auth Service:** No consumer responsibilities.
* **Vinyls Service:** 
    - Updates the status of vinyl records based on order events to track reservations and availability.
* **Orders Service:** 
    - Manages vinyl data within orders based on events from the Vinyls Service.
    - Handles order status updates and expirations.
* **Payments Service:** 
    - Processes payments and updates order statuses based on payment events.
    - Listens for cancellations.
* **Expiration Service:** 
    - Monitors new orders and triggers expiration events when necessary.


