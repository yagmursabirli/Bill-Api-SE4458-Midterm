**📱 Mobile Bill Payment API**
**SE4458 Large-Scale Systems Design – Midterm Project**
This project is ab Invoice Management and Payment System API developed for Mobile App, Banking App and Website, managed with Azure API Management and supported by JWT Authentication.

**🚀 Architecture Overview**
This system consists of 5 main components:

1️⃣ Backend API (Node.js / Express / PostgreSQL)
--Subscriber Management
--Bill Query (normal/detailed)
--Banking unpaid bills
--Payment processing (partial/ full)
--Admin operations
--CSV batch bill upload

2️⃣ Authentication
--JWT-based (Subscriber + Admin)
--Admin-only protected routes
--Password/PIN hashing

3️⃣ API Gateway (Azure API Management)
--Rate Limiting (3 requests/day – Mobile App Query Bill)
--Routing rules
--CORS management
--Subscription Key Enforcement
--Request/Response Transformation
--Request Logging → Application Insights

4️⃣ Logging (Azure Application Insights)
--Incoming request logs
--Timestamp
--IP
--Headers
--Response status
--Latency
--Throttling events
--Error breakdown

5️⃣ Database (PostgreSQL)
--Subscribers
--Bills
--Bill Details
--Payments
--Admins
--Rate Limit Table

🗂 **API Endpoints**
🔐 Auth API
POST	/api/v1/auth/login	Subscriber login
POST	/api/v1/auth/register	Subscriber register
POST	/api/v1/auth/admin/register	Admin register
POST	/api/v1/auth/admin/login	Admin login

📱 Mobile App - Bill APIs
GET	/api/v1/bills/query	Yes	Query monthly bill (rate limited)
GET	/api/v1/bills/detailed	Yes	Query detailed bill (paging supported)

🏦 Banking App - Bill API
GET	/api/v1/bills/banking/unpaid	Yes	List all unpaid bills

💳 Web Site - Payment API
POST	/api/v1/payment/pay	No	Pay bill (partial/full)

🛠 Admin API
POST	/api/v1/admin/add-bill	Admin	Create bill
POST	/api/v1/admin/add-bill-detail	Admin	Add detail to a bill
POST	/api/v1/admin/add-bill-batch	Admin	Upload CSV and import


**🔑 Rate Limiting**
Mobile App → Query Bill
📌 Limit: 3 requests per day per subscriber

Application:
APIM inbound policy
Database fallback (rate_limits table)
429 error returned after limit


**📊 Logging Architecture**
All logs are sent to Azure Application Insights.

Request logs:
--Timestamp
--Method
--Path
--Source IP
--Header dump
--Request size
--Auth result

Response logs:
--Status code
--Latency
--Response size
--Errors

Moreover:
--Rate limit violations
--CSV batch import logs
--Admin actions

**🧱 Database ER Diagram**
✔ ER visual has been added to the project as /docs/er diagram midterm.png


**🗄 SQL Schema (Auto Migration)**
CREATE TABLE subscribers (
    id SERIAL PRIMARY KEY,
    subscriber_no VARCHAR(50) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    subscriber_id INTEGER REFERENCES subscribers(id) ON DELETE CASCADE,
    month VARCHAR(10) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    remaining_amount NUMERIC(10,2) NOT NULL,
    paid_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX unique_bill_subscriber_month 
ON bills (subscriber_id, month);

CREATE TABLE bill_details (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
    type VARCHAR(50),
    amount NUMERIC(10,2)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bills(id) ON DELETE CASCADE,
    paid_amount NUMERIC(10,2),
    paid_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rate_limits (
    id SERIAL PRIMARY KEY,
    subscriber_no VARCHAR(50),
    date DATE,
    count INTEGER DEFAULT 0
);


**📘 Swagger Documentation**
On Swagger:
--All Auth structures
--Admin routes
--Bill queries
--Payment API
--CSV upload are all well documented.

**🌐 Deployment**
Backend API → Azure App Service
API Gateway → Azure API Management
Logging → Application Insights
Database → Azure PostgreSQL Flexible / PostgreSQL
