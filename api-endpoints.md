# Endpoints

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
