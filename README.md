# Title Forge
## Overview
Title Forge is a full-stack application designed to generate titles for various purposes, including YouTube videos, blog posts, and other content. The project consists of a backend API built with Express.js and a frontend application built with React.

## Features
* **Title Generation**: The application uses AI models to generate titles based on user input.
* **User Authentication**: Users can create accounts and log in to access their generated titles.
* **Payment Gateway**: The application integrates with a payment gateway to allow users to purchase premium features.
* **Queue System**: The application uses a queue system to manage title generation requests.

## Tech Stack
* **Backend**: Express.js, TypeScript, MongoDB
* **Frontend**: React, Tailwind CSS, Vite
* **AI Models**: Google GenAI, Perplexity AI

## Architecture
The application consists of the following components:
* **Backend API**: Handles user requests, generates titles, and interacts with the database.
* **Frontend Application**: Provides a user interface for users to interact with the application.
* **Database**: Stores user data, generated titles, and other relevant information.

## Getting Started
### Prerequisites
* Node.js (version 16 or higher)
* MongoDB (version 5 or higher)
* A code editor or IDE

### Installation
1. Clone the repository: `git clone https://github.com/kaihere14/Title-Forge.git`
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Start the backend API: `npm run dev`
5. Navigate to the frontend directory: `cd frontend`
6. Install dependencies: `npm install`
7. Start the frontend application: `npm run dev`

### Configuration
The application uses environment variables to configure the database connection and other settings. Create a `.env` file in the backend directory with the following variables:
* `MONGO_URI`: the MongoDB connection string
* `PORT`: the port number for the backend API

## Usage
### Generating Titles
1. Create a new user account or log in to an existing one.
2. Navigate to the title generation page.
3. Enter the title prompt and select the desired AI model.
4. Click the "Generate Title" button to generate a title.

### Payment Gateway
1. Navigate to the payment page.
2. Select the desired payment plan.
3. Enter payment information and complete the transaction.

### Queue System
1. Navigate to the queue page.
2. View the status of your title generation requests.

## API Documentation
### Endpoints
* **GET /api/youtube**: Retrieves a list of generated titles for YouTube videos.
* **POST /api/user**: Creates a new user account.
* **GET /api/payment**: Retrieves a list of available payment plans.
* **POST /api/queue**: Submits a title generation request to the queue.

### Request/Response Examples
* **GET /api/youtube**:
	+ Request: `GET /api/youtube HTTP/1.1`
	+ Response: `200 OK [{"title": "Example Title", "id": 1}]`
* **POST /api/user**:
	+ Request: `POST /api/user HTTP/1.1 {"username": "example", "password": "password"}`
	+ Response: `201 Created {"id": 1, "username": "example"}`
* **GET /api/payment**:
	+ Request: `GET /api/payment HTTP/1.1`
	+ Response: `200 OK [{"plan": "Basic", "price": 9.99}]`
* **POST /api/queue**:
	+ Request: `POST /api/queue HTTP/1.1 {"title": "Example Title", "prompt": "Example Prompt"}`
	+ Response: `201 Created {"id": 1, "status": "pending"}`

## Development
### Setting up the Development Environment
1. Install Node.js and MongoDB.
2. Clone the repository.
3. Navigate to the backend directory and install dependencies.
4. Start the backend API.
5. Navigate to the frontend directory and install dependencies.
6. Start the frontend application.

### Running Tests
1. Navigate to the backend directory.
2. Run `npm run test` to execute the backend tests.
3. Navigate to the frontend directory.
4. Run `npm run test` to execute the frontend tests.

## Contributing
Contributions are welcome! Please submit a pull request with your changes and a brief description of what you've added or fixed.

## License
Title Forge is licensed under the MIT License.

## Roadmap
* **Version 1.0**: Initial release with basic title generation features.
* **Version 1.1**: Add user authentication and payment gateway integration.
* **Version 1.2**: Implement queue system and improve title generation algorithms.

## Credits
* **kaihere14**: Creator and maintainer of the project.
* **Google**: Provider of the GenAI model.
* **Perplexity AI**: Provider of the Perplexity AI model.