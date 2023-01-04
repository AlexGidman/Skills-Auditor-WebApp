# Skills-Auditor-WebApp

A web application using React and Node for auditing skills.

## Getting Started

1. Install all node modules (checkout root project directory)

```bash
npm install
```

2. Create a .env file in the backend directory and a TOKEN_SECRET variable. For example:


```
TOKEN_SECRET="secret"
```

3. Run application (production)

```bash
npm start
```

Open web browser and access http://localhost:8900/

### Running app for development

For hot reloading React app for changes, run the backend and frontend separately. Open two shells
and run the backend:

```bash
npm start
```

Then run the frontend:

```bash
npm run start-ui
```

Open web browser and access http://localhost:3000/

**Note** The application will also be hosted on port 8900; this is the production build, so won't be
updated dynamically. For development, ignore this route.

## API Tests

Tests are kept in the \_\_test\_\_ folder. All test files must follow the file naming convention:
**\*.spec.js**

To run the tests:

```bash
npm run test:api
```

The **testing.js** file is ran before all test files (\*.spec.js); it includes the mock of the
Sequelize database connection found in models/index.js. We recommend when writing tests that the
model itself is mocked to return mock values as well as checking functions are run with the correct
values.

## UI Tests

Tests are kept in each component / view folder. All test files must follow the file naming
convention: **\*.spec.js**

To run the tests:

```bash
npm run test:ui
```

The **testing.js** file is ran before all test files (\*.spec.js); it includes the mocks for the
backend service.
