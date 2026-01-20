# FitPulse

FitPulse is a comprehensive fitness tracking application designed to help users achieve their health goals. It combines a robust Django backend with a modern React (Next.js) frontend (web) and specifications for a mobile experience.

## Project Structure

*   `accounts/`: Handles user authentication (registration, login, password reset).
*   `fitness_profile/`: Manages user profiles and fitness surveys (onboarding).
*   `dashboard/`: Provides analytics, logs daily activities (water, sleep, weight), and visualizes progress.
*   `frontend/`: A Next.js web application for user interaction.
*   `config/`: Main Django project configuration.

## Features

1.  **Authentication**:
    *   Secure user registration and login.
    *   Token-based authentication for API access.
    *   Password reset functionality.

2.  **Onboarding (Fitness Survey)**:
    *   Collects user details: Gender, Age, Height, Weight.
    *   Sets fitness goals: Cut, Bulk, Maintain.
    *   Determines activity levels and fitness experience.

3.  **Dashboard & Analytics**:
    *   **BMI Calculation**: Automatically computed based on profile data.
    *   **Calorie & Macro Targets**: Personalized recommendations based on TDEE (Total Daily Energy Expenditure) and goals.
    *   **Progress Tracking**: Visual graphs for weight, sleep, and hydration over time.

4.  **Daily Logging**:
    *   **Water**: Track daily intake in milliliters.
    *   **Sleep**: Log hours of sleep.
    *   **Weight**: Update body weight to track progress.
    *   **Nutrition**: Log calories and macros (Protein, Carbs, Fats).

## Prerequisites

*   **Python 3.10+**
*   **Node.js 18+** (for the frontend)

## Installation & Setup

### Backend (Django)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/karim26010/fitnessapp/
    cd platform
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Apply database migrations:**
    ```bash
    python manage.py migrate
    ```

5.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will be accessible at `http://localhost:8000`.

### Frontend (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The web app will be accessible at `http://localhost:3000`.

## API Endpoints

### Authentication
*   `POST /register/`: Register a new user.
*   `POST /login/`: Login and retrieve an auth token.
*   `POST /logout/`: Logout the current user.
*   `POST /forgot-password/`: Request a password reset.

### Profile & Survey
*   `POST /survey/`: Submit initial fitness profile data.
*   `GET /profile/`: Retrieve user profile and current analytics.
*   `PATCH /profile/update/`: Update profile details.

### Dashboard & Logging
*   `GET /dashboard/`: Get daily stats and graph data.
*   `POST /log/water/`: Log water intake.
*   `POST /log/sleep/`: Log sleep hours.
*   `POST /log/nutrition/`: Log meals (calories/macros).
*   `POST /log/weight/`: Log current weight.
