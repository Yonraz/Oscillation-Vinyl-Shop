# Oscillation Vinyls

## Description

A fullstack web application for buying and selling vinyl records. Users can view records for sale, sign in to place orders and make payments, or sell their own vinyls. This project is built on an event-based architecture and utilizes server-side rendering. My goal in this project is to get a solid understanding of microservices, software design and architecture principles, Docker, Kubernetes and Kafka.

## Technologies Used

* **Frontend:** Built with **React** and **Next.js 14**.
* **Backend Services:** Each service is developed using **Node.js** and **Express**.
* **Languages:** Both frontend and backend are written in **TypeScript**.
* **Databases:** **MongoDB** or **Redis** are used for each service.
* **Containerization:** The entire app runs on **Docker** containers within a **Kubernetes** cluster.
* **Event Handling and Microservice Communication:** Managed by **Apache Kafka**.
* **Styling:** **TailwindCSS** is used as the frontend styling framework.
* **Testing:** Comprehensive testing suites are implemented using **Jest**.

## Features

* **Authentication and Authorization**
    - Utilizes JWT for user authentication.
    - Sign-in, sign-up, and sign-out pages on the client communicate with the auth service.

* **Records**
    - Users can view available records.
    - Authenticated users can add and update their own records.
    - Authenticated users can view and place their own orders.
    - When uploading a record for sale, images are stored on an AWS S3 bucket.

* **Orders**
    - Orders can be made in a 15 minute time frame during which the selected vinyl is reserved and cannot be purchased by other users
    - Users can view their orders and order statuses.

* **Payments**
    - Used stripe for payment processing.
    - This is a showcase project, payment functionality is not available.


## Event Architecture Overview

Communication between microservices is implemented using asynchronous events with a Kafka cluster.

### Basic Event-Based Architecture Workflow

Each service has its own database and area of responsibility. It emits an event whenever an action occurs that other services need to be aware of, and it listens for relevant events that may occur in other services.

For example, when an item is created by the Items service, a 'vinyl created' event is emitted through Kafka along with the vinyl data. Subscribers to this topic, such as the Orders service, receive this event and save the ticket data to their own databases. This introduces some data duplication among services but also eliminates direct dependencies between microservices, promoting a more decoupled and scalable architecture.

To make sure events are read properly, to avoid versioning errors for example, a manual commit offset is being done by each consumer, so that if an error occurs kafka will not commit the offset of the current event and try later.
