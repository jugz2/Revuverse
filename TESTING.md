# Revuverse Testing Guide

This document provides instructions on how to run tests for the Revuverse application.

## Prerequisites

Before running the tests, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Frontend Tests

The frontend tests are written using Jest and React Testing Library. They test the React components, context providers, and utility functions.

### Setting Up Frontend Tests

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Running the Tests:

   ```
   npm test
   ```

   This will run all the tests in watch mode. To run tests with coverage:

   ```
   npm test -- --coverage
   ```

### Frontend Test Structure

- `src/components/__tests__/`: Contains tests for React components
- `src/__mocks__/`: Contains mock files for CSS and static assets
- `src/setupTests.js`: Contains setup code for Jest

## Backend Tests

The backend tests are written using Jest and Supertest. They test the API endpoints, controllers, and models.

### Setting Up Backend Tests

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Running the Tests:

   ```
   npm test
   ```

   This will run all the tests with coverage.

### Backend Test Structure

- `tests/`: Contains test files for API endpoints
- `jest.config.js`: Contains Jest configuration

## Test Coverage

Both frontend and backend tests generate coverage reports. After running the tests with coverage, you can view the reports in the `coverage` directory:

- Frontend: `frontend/coverage/lcov-report/index.html`
- Backend: `backend/coverage/lcov-report/index.html`

## Continuous Integration

The tests are automatically run in the CI/CD pipeline when changes are pushed to the repository. The pipeline will fail if any tests fail.

## Writing New Tests

### Frontend

When writing new frontend tests:

1. Create a new test file in the `src/components/__tests__/` directory
2. Import the component and necessary testing utilities
3. Write test cases using the `describe` and `test` functions
4. Use React Testing Library to render components and interact with them
5. Use Jest assertions to verify the expected behavior

Example:

```javascript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "../MyComponent";

describe("MyComponent", () => {
  test("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

### Backend

When writing new backend tests:

1. Create a new test file in the `tests/` directory
2. Import the necessary modules and setup test data
3. Write test cases using the `describe` and `test` functions
4. Use Supertest to make HTTP requests to the API
5. Use Jest assertions to verify the expected responses

Example:

```javascript
const request = require("supertest");
const app = require("../app");

describe("API Endpoint", () => {
  test("GET /api/resource returns 200", async () => {
    const response = await request(app).get("/api/resource");
    expect(response.statusCode).toBe(200);
  });
});
```

## Troubleshooting

If you encounter issues running the tests:

1. Make sure all dependencies are installed
2. Check that the test files are in the correct directories
3. Verify that the component or API being tested exists and is exported correctly
4. Check for any environment variables that might be required

For more help, please contact the development team.
