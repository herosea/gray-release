# Project Memory

## Project Overview
**Gray Release** is a full-stack application composed of a Spring Boot backend and a React/Vite frontend. It implements a basic customer management and query system.

## Tech Stack

### Frontend (`/gray-release-frontend`)
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router v7
- **Styling:** Vanilla CSS
- **Icons:** Lucide React

### Backend (`/gray-release-backend`)
- **Framework:** Spring Boot 2.7.18
- **Language:** Java 8
- **Persistence:** MyBatis-Plus (v3.5.3.1)
- **Database:** H2 In-Memory Database (`jdbc:h2:mem:gray_release`)
- **Other Utilities:** Lombok

## Project Structure
- **/gray-release-frontend**: Contains the React SPA. Key pages include the Customer Query dashboard which connects to the backend API to fetch and display customer data.
- **/gray-release-backend**: Contains the Spring Boot application. 
  - **Models**: `Customer` entity integrated with MyBatis-Plus (`@TableName`, `@TableId`).
  - **Mappers**: `CustomerMapper` extending `BaseMapper<Customer>`.
  - **Services**: `CustomerService` utilizing the mapper to fetch data.
  - **Controllers**: Exposes REST API endpoints (e.g., `/api/customers`).
  - **Resources**: `schema.sql` (table creation) and `data.sql` (initial mockup data).

## Current Status
- Both frontend and backend are successfully integrated.
- The backend has been migrated from mock in-memory Java lists to **MyBatis-Plus** with an **H2 Database**.
- The `data.sql` script initializes 5 mock customer records on backend startup.
- The frontend successfully lists these records in the Customer Query page.

## How to Run Locally
1. **Frontend:** 
   ```bash
   cd gray-release-frontend
   npm install
   npm run dev
   ```
2. **Backend:**
   ```bash
   cd gray-release-backend
   mvn spring-boot:run
   ```
   *H2 Console is available at `http://localhost:8080/h2-console`.*

## AI Assistant Rules
- **Language**: Always formulate responses in **Chinese**.
