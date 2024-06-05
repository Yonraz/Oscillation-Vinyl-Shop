# Ticketing

## Description

A fullstack web application for buying and selling tickets. Users can view tickets for sale, sign in to place orders and make payments, or sell their own tickets. This project is built on an event-based architecture and utilizes server-side rendering. It aims to provide a comprehensive learning experience in microservices, Docker, Kubernetes, Kafka, and Next.js.

## Technologies Used

* **Frontend:** Built with **React** and **Next.js 14**.
* **Backend Services:** Each service is developed using **Node.js** and **Express**.
* **Languages:** Both frontend and backend are written in **TypeScript**.
* **Databases:** **MongoDB** and **Redis** are used for each service.
* **Containerization:** The entire app runs on **Docker** containers within a **Kubernetes** cluster.
* **Event Handling and Microservice Communication:** Managed by **Apache Kafka**.
* **Styling:** **TailwindCSS** is used as the frontend styling framework.
* **Testing:** Comprehensive testing suites are implemented using **Jest**.

## Current Working Features

* **Authentication and Authorization**
    - Utilizes JWT for user authentication.
    - Sign-in, sign-up, and sign-out pages on the client communicate with the auth service.

* **Tickets**
    - Users can view available tickets.
    - Authenticated users can add and update their own tickets.
    - Authenticated users can view and place their own orders.

## Event Architecture Overview

Communication between microservices is implemented using asynchronous events with a Kafka cluster.

### Basic Event-Based Architecture Workflow

Each service has its own database and area of responsibility. It emits an event whenever an action occurs that other services need to be aware of, and it listens for relevant events that may occur in other services.

For example, when a ticket is created by the Tickets service, a 'ticket created' event is emitted through Kafka along with the ticket data. Subscribers to this topic, such as the Orders service, receive this event and save the ticket data to their own databases. This introduces some data duplication among services but also eliminates direct dependencies between microservices, promoting a more decoupled and scalable architecture.

