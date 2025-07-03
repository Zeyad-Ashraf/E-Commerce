This is a full-featured E-Commerce platform inspired by Noon, built with modern technologies and enhanced with AI integration.

🔥 Key Features
🛍️ Product Catalog: Browse products by category, subcategory, brand, etc.

🔍 Advanced Search: Filter and sort products with multiple criteria.

🧠 AI Integration:

Smart Product Recommendations based on user behavior and interests.

AI Chat Assistant for customer support or product queries.

Sales Analytics with AI: Detect sales trends and suggest pricing or stock strategies.

👤 User Authentication & Roles:

Admin Dashboard

Vendor/Dashboard for product uploads

Customer Accounts with Order History

🛒 Shopping Cart & Checkout: Add-to-cart, order summary, and payment integration.

📦 Order Management System: Track order status, shipping, and delivery.

💬 Reviews & Ratings: Customers can share feedback on purchased products.

📈 Performance Optimized: Caching, rate limiting, and load-tested APIs.

⚙️ Tech Stack
Backend: NestJS,  Mongoose

Authentication: JWT, bcrypt, Role-based Access Control

Caching: Redis

AI Integration: Connected with AI models (OpenRouter API / OpenAI) to provide smart features

Security: Helmet, CORS, Rate Limiting

🚀 AI Use Cases (Expanded)
Use Case	Description
🧠 Smart Assistant	Helps users find products using natural language
📊 Sales Prediction	AI analyzes sales data to forecast demand

🧪 Performance
Load tested with Autocannon: Handles up to 950 concurrent users with acceptable response times.

Redis caching significantly improves product fetching speed.

🛡️ Security Measures
Input validation & sanitization

JWT-based authentication

Rate limiting to prevent brute force

Helmet for setting secure HTTP headers
