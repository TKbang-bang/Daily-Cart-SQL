<body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #fafafa; color: #333; padding: 20px;">
  <h1 style="text-align: center; font-size: 32px; margin-bottom: 20px;">Daily Cart - Online Store</h1>

  <p style="margin-bottom: 20px;">
    <strong>Daily Cart</strong> is an online store application divided into three main parts: the <strong>Client</strong>, the <strong>Admin Dashboard</strong>, and the <strong>Server</strong>. The platform allows customers to browse products,
    add them to a shopping cart, and complete purchases, while authorized managers and admins can manage products, orders, and staff.
  </p>

  <h2 style="font-size: 24px; margin-top: 30px;">Client</h2>
  <p style="margin-bottom: 10px;">This is the frontend used by customers to shop on the platform.</p>
  <ul style="margin-left: 20px; margin-bottom: 20px;">
    <li>Users can browse products.</li>
    <li>Users can filter products by category or search by name.</li>
    <li>Products can be added to the shopping cart.</li>
    <li>Checkout and purchase flow is integrated.</li>
  </ul>

  <p><strong>Dependencies:</strong> axios, react-router-dom, sonner</p>
  <p><strong>.env:</strong> <code>VITE_SERVER_URL</code> → Server base URL</p>

  <h2 style="font-size: 24px; margin-top: 30px;">Admin Dashboard</h2>
  <p style="margin-bottom: 10px;">Used by store managers and admins to manage store operations.</p>
  <ul style="margin-left: 20px; margin-bottom: 20px;">
    <li>Create and update products.</li>
    <li>View and manage customer orders.</li>
    <li>View and manage store managers (restricted to admin only).</li>
  </ul>

  <p><strong>Dependencies:</strong> Same as Client</p>
  <p><strong>.env:</strong> Same as Client</p>

  <h2 style="font-size: 24px; margin-top: 30px;">Server</h2>
  <p style="margin-bottom: 10px;">The backend handles authentication, protected routes, product and order management, and payment processing.</p>

  <p>
    Authentication uses <strong>JWT tokens and cookies</strong>. The <strong>access-token</strong> is used to validate user requests. If it expires, a new one can be generated using the <strong>refreshToken</strong> cookie.
    If both are invalid, the user loses access and must log in again.
  </p>

  <h3 style="font-size: 20px; margin-top: 20px;">Main Routes</h3>
  <ul style="margin-left: 20px; margin-bottom: 20px;">
    <li><code>/auth</code> → Signup / Login</li>
    <li><code>/protected</code> → Requires session and authentication</li>
    <li><code>/protected/users</code> → User management</li>
    <li><code>/protected/products</code> → Product management</li>
    <li><code>/protected/cart</code> → Cart actions</li>
    <li><code>/protected/payment</code> → Payment session and Stripe handling</li>
    <li><code>/protected/orders/private</code> → Order management</li>
  </ul>

  <h3 style="font-size: 20px; margin-top: 20px;">Dependencies</h3>
  <p style="margin-bottom: 20px;">bcrypt, cookie-parser, cors, dotenv, express, jsonwebtoken, multer, pg, pg-hstore, sequelize, stripe</p>

  <h3 style="font-size: 20px; margin-top: 20px;">Environment Variables</h3>
  <ul style="margin-left: 20px; margin-bottom: 40px;">
    <li><code>DB_USER</code>, <code>DB_PASSWORD</code>, <code>DB_NAME</code>, <code>DB_HOST</code>, <code>DB_PORT</code></li>
    <li><code>CLIENT_URL</code>, <code>ADMIN_URL</code></li>
    <li><code>JWT_ACCESS_SECRET</code> → Secret for access token</li>
    <li><code>JWT_REFRESH_SECRET</code> → Secret for refresh token</li>
    <li><code>ADMIN_CODE</code> → Create or login as Admin</li>
    <li><code>MANAGER_CODE</code> → Create or login as Manager</li>
    <li><code>STRIPE_SECRET</code> → Stripe API secret key</li>
  </ul>

  <p style="text-align: center; font-style: italic;">Daily Cart © 2025</p>
</body>
