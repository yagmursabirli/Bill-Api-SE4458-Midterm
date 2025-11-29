**📱 Mobile Bill Payment API**
**SE4458 Large-Scale Systems Design – Midterm Project**
This project is an Invoice Management and Payment System API developed for Mobile App, Banking App and Website, managed with Azure API Management and supported by JWT Authentication.

---
**🚀 Live Links**
### 🗂 GitHub Repository: https://github.com/yagmursabirli/Bill-Api-SE4458-Midterm
### 🌐 Backend (Azure App Service): https://yagmur-mobile-bill-api.azurewebsites.net/
### 📘 Swagger Documentation: https://yagmur-mobile-bill-api.azurewebsites.net/api-docs/
### 🚀 API Gateway (Azure API Management): https://yagmur-apim.azure-api.net/mobile-bill-api
### 🎥 Video Presentation: https://drive.google.com/file/d/1vqv0E1Oz23HzUizvctk7gLx6-4TuRMza/view?usp=sharing
### 🧩 ER Diagram: https://drive.google.com/file/d/15tfXzmJec-ppAHte0K61WQEA5_NfWvM7/view?usp=sharing

---
**🚀 Architecture Overview**
This system consists of 5 main components:

1️⃣ Backend API (Node.js / Express / PostgreSQL)
* --Subscriber Management
* --Bill Query (normal/detailed)
* --Banking unpaid bills
* --Payment processing (partial/ full)
* --Admin operations
* --CSV batch bill upload

2️⃣ Authentication
* --JWT-based (Subscriber + Admin)
* --Admin-only protected routes
* --Password/PIN hashing

3️⃣ API Gateway (Azure API Management)
* --Rate Limiting (3 requests/day – Mobile App Query Bill)
* --Routing rules
* --CORS management
* --Subscription Key Enforcement
* --Request/Response Transformation
* --Request Logging → Application Insights

4️⃣ Logging (Azure Application Insights)
* --Incoming request logs
* --Timestamp
* --IP
* --Headers
* --Response status
* --Latency
* --Throttling events
* --Error breakdown

5️⃣ Database (PostgreSQL)
* --Subscribers
* --Bills
* --Bill Details
* --Payments
* --Admins
* --Rate Limit Table

---
🗂 **API Endpoints**
🔐 Auth API
* POST	/api/v1/auth/login	Subscriber login
* POST	/api/v1/auth/register	Subscriber register
* POST	/api/v1/auth/admin/register	Admin register
* POST	/api/v1/auth/admin/login	Admin login

📱 Mobile App - Bill APIs
* GET	/api/v1/bills/query	Yes	Query monthly bill (rate limited)
* GET	/api/v1/bills/detailed	Yes	Query detailed bill (paging supported)

🏦 Banking App - Bill API
* GET	/api/v1/bills/banking/unpaid	Yes	List all unpaid bills

💳 Web Site - Payment API
* POST	/api/v1/payment/pay	No	Pay bill (partial/full)

🛠 Admin API
* POST	/api/v1/admin/add-bill	Admin	Create bill
* POST	/api/v1/admin/add-bill-detail	Admin	Add detail to a bill
* POST	/api/v1/admin/add-bill-batch	Admin	Upload CSV and import

---
**🔑 Rate Limiting**

Applied to:

GET /api/v1/bills/query

Limit: 3 requests per day

Key: subscription key + subscriberNo

Triggered via: APIM inbound policy

Response on limit:
429 Too Many Requests

---
**📊 Logging Architecture**
Logged Automatically by Application Insights:

Timestamp

HTTP method

URL

IP

JWT authentication result

Exceptions

Slow responses

Rate limit violations

Admin actions

CSV batch import results

---

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

---
**📘 Swagger Documentation**
On Swagger:
* --All Auth structures
* --Admin routes
* --Bill queries
* --Payment API
* --CSV upload are all well documented.

---
**🌐 Deployment**


Backend API → Azure App Service


API Gateway → Azure API Management


Logging → Application Insights


Database → Azure PostgreSQL Flexible / PostgreSQL
