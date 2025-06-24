# Fit App
## About

Fit App is a modern calorie tracker designed to help users monitor their daily caloric intake and maintain a healthy lifestyle. With an intuitive interface and handy features, it simplifies tracking meals, setting goals, and analyzing progress.
## Setup

### Backend
The backend is a Dockerized Django application. To set it up, ensure you have Docker installed, then run the following command:

```bash
docker-compose up -d --build
```

This will build and start the backend services.

### Frontend
The frontend is a React application. Before proceeding, ensure you have [Node.js](https://nodejs.org/) installed. To set up the frontend, run the following commands:

```bash
npm install
npm run dev
```

If additional dependencies for Material-UI (MUI) are required, they will be installed automatically during `npm install`. No further setup is needed to start the application.

---

## App Showcase

### Main Functionalities
- **User Authentication**: Secure login and registration system based utilizing JWT Tokens.
- **Dynamic Dashboard**: Displays user-specific data and analytics.
- **Interactive UI**: Built with React and styled using Material-UI for a modern look and feel.
- **API Integration**: Seamless communication between the frontend and backend.

### Screenshots
#### Login Page
![login.png](screenshots%2Flogin.png)

#### Products Section
![products.png](screenshots%2Fproducts.png)

#### Adding new product
![product_add.png](screenshots%2Fproduct_add.png)

#### Goals Section
![goals_section.png](screenshots%2Fgoals_section.png)