# Task Manager - React Native (Expo)

## Objective
This project is a React Native app built with Expo, featuring a Node.js and MongoDB backend. Users can sign up, log in, and manage tasks (CRUD operations).

## Features

### Authentication:
- **Signup Screen:** Users can register with their name, email, and password.
- **Login Screen:** Users can log in using their email and password.
- **Token-based Authentication:** Uses AsyncStorage to store JWT tokens for authentication.

### Task Management:
- **Home Screen:** Fetches and displays tasks from the backend with a pull-to-refresh feature.
- **Add Task Screen:** Users can create a task (title + description).
- **Task Details Screen:** Displays task details and allows users to edit or delete tasks.
- **Logout:** Provides a logout button that clears the stored token and navigates to the Login screen.

## Tech Stack & Tools
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation (Stack Navigator)
- **Storage:** AsyncStorage (for JWT tokens)
- **UI Components:** React Native Paper

## Setup Instructions

### Prerequisites:
- Node.js installed (latest LTS recommended)
- Expo CLI installed (`npm install -g expo-cli`)

### Steps to Run the App:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code from the terminal using the Expo Go app (Android) or use an emulator/simulator.

### Backend Setup (if applicable):
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```

## Login Details (For Testing)
Use the following test credentials to log in as an existing user:
- **Email:** `saravanani@gmail.com`
- **Password:** `Admin@123`

## Reset Project
If you need a fresh start, run:
```bash
npm run reset-project
```
This will reset the project and move the starter code to the `app-example` directory.

## Learn More
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

