# SurakshaPay 🛡️

**"Earn Without Fear. We’ve Got You Covered."**

SurakshaPay is an AI-powered parametric insurance platform tailored to gig economy workers and delivery partners (e.g., Zepto) in India. It offers dynamic, hyper-local protection against environmental and operational disruptions like heavy rain, extreme heat, and poor air quality.

## The Problem
Delivery partners depend entirely on daily task completions for income. Currently, extreme weather events forces them to choose between their safety and their earnings. Traditional insurance policies are slow, manual, and rarely cover specific localized daily income disruptions.

## The Solution
SurakshaPay provides **AI-powered parametric insurance**. Partners pay a small weekly micro-premium based on their risk profile. If conditions in their delivery zone exceed specific thresholds, a payout is automatically credited to their wallet—guaranteeing their income for that specific blocked period without any manual claims.

## Architecture

* **Frontend:** React + Tailwind CSS v4, built with Vite. Real-time data visualization via Recharts. 
* **Backend:** Java Spring Boot REST API.
* **Database:** MySQL to store user data, policies, and payout history.
* **Authentication:** JWT-based protection.

## AI Risk Engine & Parametric Logic
1. **Dynamic Profiling**: A worker's risk score (and premium) is calculated based on their selected work location (zone risk) and chosen schedule (peak hour risk).
2. **Parametric Triggers**:
    * **Rainfall:** > 50mm within a 3-hour window
    * **Temperature:** > 45°C during afternoon peaks
    * **AQI:** > 400 (Severe health risk)
3. **Smart Payouts**: Payout magnitude scales dynamically. (`Payout = Base Income Target × Time Factor × Severity Factor`)
4. **Fraud Detection**: The system cross-references the partner's device GPS against regional IMD (Indian Meteorological Department) weather datasets to prevent spoofed claims.

## Setup Steps

### 1. Backend (Spring Boot)
1. Navigate to the `surakshapay-backend` folder.
2. Ensure you have MySQL running on `localhost:3306`. Create a database named `surakshapay`.
3. Open `src/main/resources/application.properties` and update `spring.datasource.password` and `spring.datasource.username` to match your local setup.
4. Run `mvn clean install` followed by `mvn spring-boot:run`. The backend will start on port 8080.

### 2. Frontend (React)
1. Navigate to the `surakshapay-frontend` folder.
2. Install dependencies: `npm install`
3. Start the Vite server: `npm run dev`
4. Access the web app at **http://localhost:5173**

Enjoy building the future of micro-insurance with SurakshaPay!
