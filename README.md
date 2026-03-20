# EventAxis

A full-stack event ticketing platform built from scratch. Users can browse events, purchase tickets, and get QR codes for entry. Organizers can create and manage events with multiple ticket types. Staff can validate tickets at the venue using a QR scanner or by entering the ticket ID manually.

---

## Why I Built This

I wanted to build something that actually resembles a real-world system — not just a CRUD app with a few endpoints. The goal was to design a platform where three different types of users (organizers, attendees, and staff) interact with the same backend but have completely different capabilities and restrictions. That meant thinking about security, role-based access, and a clean separation between what each user can and cannot do.

---

## Tech Stack

**Backend**
- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication (JJWT 0.11.5)
- PostgreSQL
- Docker
- MapStruct
- Lombok

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router

---

## Features

**Attendees**
- Browse and search published events
- Purchase tickets with a mock payment flow
- View purchased tickets with QR codes
- QR code generated per ticket for venue entry

**Organizers**
- Create events with multiple ticket types (General, VIP, Elite, etc.)
- Set event dates, venue, sales windows, and ticket availability
- Publish or keep events in draft
- Manage and update existing events

**Staff**
- Validate tickets at the venue via QR scan or manual ticket ID entry
- Instant valid/invalid feedback
- Cannot purchase tickets (blocked at both frontend and backend)

---

## Authentication

The app uses a custom JWT-based auth system built on top of Spring Security. When a user signs up or logs in, the server generates a signed JWT containing their email and role. Every subsequent request is validated by a custom filter (`JwtAuthenticationFilter`) that reads the token from the `Authorization` header, verifies it, and populates the security context.

No third-party auth service. No Keycloak. Just Spring Security and JJWT.

---

## Role-Based Access Control

Three roles: `ORGANIZER`, `ATTENDEE`, `STAFF`

| Endpoint | Required Role |
|---|---|
| `POST /api/v1/events` | ORGANIZER |
| `GET /api/v1/events` | ORGANIZER |
| `POST /api/v1/events/*/ticket-types/*/tickets` | Any authenticated user |
| `GET /api/v1/tickets` | Any authenticated user |
| `POST /api/v1/ticket-validations` | STAFF |
| `GET /api/v1/published-events` | Public |

---

## Project Structure

```
tickets/
├── src/main/java/com/eventproject/tickets/
│   ├── config/
│   │   ├── JpaConfiguration.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtUtil.java
│   │   ├── QrCodeConfig.java
│   │   └── SecurityConfig.java
│   ├── controllers/
│   │   ├── AuthController.java
│   │   ├── EventController.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── PublishedEventController.java
│   │   ├── TicketController.java
│   │   ├── TicketTypeController.java
│   │   └── TicketValidationController.java
│   ├── domain/
│   │   ├── entities/
│   │   └── dtos/
│   └── exceptions/
│   ├── mappers/
│   ├── repositories/
│   ├── services/
│
ticket_frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-roles.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   └── api.ts
│   └── pages/
```

---

## Getting Started

### Prerequisites
- Java 17
- Node.js 18+
- Docker

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Run the backend

```bash
cd tickets
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### 3. Run the frontend

```bash
cd ticket_frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment

The backend reads from `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/postgres
jwt.secret=your_secret_here
jwt.expiration-ms=86400000
```

---

## API Overview

### Auth
```
POST /api/v1/auth/signup   - Register a new user
POST /api/v1/auth/login    - Login and receive JWT
```

### Events
```
GET    /api/v1/published-events         - List all published events (public)
GET    /api/v1/published-events/:id     - Get event details (public)
POST   /api/v1/events                   - Create event (ORGANIZER)
GET    /api/v1/events                   - List organizer's events (ORGANIZER)
PUT    /api/v1/events/:id               - Update event (ORGANIZER)
```

### Tickets
```
POST   /api/v1/events/:eventId/ticket-types/:ticketTypeId/tickets   - Purchase ticket
GET    /api/v1/tickets                                               - List my tickets
GET    /api/v1/tickets/:id                                           - Get ticket details
GET    /api/v1/tickets/:id/qr-codes                                  - Get QR code
```

### Validation
```
POST   /api/v1/ticket-validations   - Validate a ticket (STAFF)
```

---

## Notes

- Ticket validation is idempotent in the sense that scanning an already-validated ticket returns `INVALID` — preventing duplicate entry
- The QR code contains the ticket UUID which is what gets validated
- Payment flow is a mock — no real payment gateway is integrated

---

Built by Vikrant
