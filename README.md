# Installation Guide

This README provides instructions on how to install and run both the frontend and backend of the application.

## Prerequisites

- [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm)
- [Docker](https://www.docker.com/)
- [Yarn](https://yarnpkg.com/)

## Installation Steps

### Step 1: Set up Node Version 18 using nvm

```
nvm use 18
```

### Step 2: Frontend Setup

a. Navigate to frontend directory

```
cd frontend
```

b. Install dependencies

```
npm install
```

c. Run development server

```
npm run dev
```

### Step 3: Backend Setup

a. Navigate to backend directory

```
cd backend
```

b. Start Docker Compose

```
docker-compose up -d
```

c. Install backend dependencies

```
yarn
```

d. Start backend server in development mode

```
yarn start:dev
```

Now, both the frontend and backend servers are up and running.

You can access the frontend server at http://localhost:3000 and the backend server at http://localhost:3001.
