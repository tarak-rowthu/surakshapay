# SurakshaPay: Automated Parametric Insurance System 🌤️💸

SurakshaPay is a Guidewire-style parametric insurance platform that completely automates payout processing based on external weather triggers. Designed for a Hackathon environment, this project demonstrates end-to-end parametric lifecycle handling: from dynamic environmental sensing to instant simulated UPI settlements with zero manual intervention.

## 🚀 Problem Statement
Traditional claim processing forces users into prolonged documentation cycles, manual checks, and high overhead costs. **SurakshaPay drops the traditional claim model entirely.** By leveraging parametric thresholds (e.g. `Rainfall > 50mm` or `Temperature > 45°C`), our AI automation engine instantly spots eligible policies, routes payouts automatically, rejects fraudulent overlapping claims securely, and settles limits directly into a user's wallet via UPI.

## 🏗️ Architecture Flow
1. **Trigger Engine (`ParametricTriggerService`):** Connects to mock IMD APIs/scheduled jobs evaluating real-time local conditions. 
2. **Fraud Gateway:** Scans the database preventing overlapping (within 5 minutes) duplicate payout queries mitigating system leakage.
3. **Core Registry & State (`PayoutRepository`):** Maps Payout models logging an initial `PENDING` state directly to explicit `User` records.
4. **Settlement Processor (`PaymentService`):** Hits a simulated UPI settlement layer verifying transactions executing 1-time fallback Retry execution hooks on drops.
5. **Event Alerting (`AlertService`):** Pushes asynchronous messages indexing exact `SUCCESS`, `FAILED`, and trigger statistics globally visible instantly to affected endpoints.

## 💻 Tech Stack
- **Backend:** Java Sprint Boot (JPA, Hibernate, Maven)
- **Database:** MySQL (Native Schema Mappings, strict relational mappings dropped in favor of raw data optimization)
- **Frontend:** React + Vite (Tailwind, Lucide Icons, Recharts)
- **Execution:** Polling `setInterval` hooks rendering Real-time React UI cards.

## 🛠️ Setup Steps
### Prerequisites
- JDK 17+
- Node.js 18+
- MySQL Server (Root User/Password configured in `application.properties`)

### Execution
1. **Start Backend (Port 8080)**:
   ```bash
   cd surakshapay-backend
   mvn compile spring-boot:run -Dmaven.test.skip=true
   ```
2. **Start Frontend (Port 5173)**:
   ```bash
   cd surakshapay-frontend
   npm install
   npm run dev
   ```

## 📡 Core API Endpoints
- **Transactions & Triggers:**
  - `POST /api/admin/simulate-trigger` - Initiates the Hackathon demo event explicitly generating Heat/Rain executions locally!
  - `GET /api/payouts?userId={id}` - Fetches payout transactions including real-time `status` flags tracking Settlements.
- **Aggregators:**
  - `GET /api/dashboard/{userId}` - Fetches explicitly localized stats array, Payout lists, total limits, and top Alerts seamlessly.
  - `GET /api/dashboard/alerts?userId={id}` - Dedicated Live Event streams pulling Guidewire logic executions!

## 🎯 Demo Steps (Hackathon Flow)
1. **Login** to local Dashboard. 
2. Observe the Active Policy coverage limits and the green `AI Risk Score`.
3. Hit the **`🚀 Trigger Alert`** button natively firing the `Heat` trigger.
4. The Backend will generate the explicitly hooked Payload resolving the new Payout.
5. The `PaymentService` will artificially process the settlement hook issuing either `✅ SUCCESS` or `❌ FAILED`.
6. Watch the UI automatically poll (every 15s) and render the updated live Alerts directly below the graphs, instantly formatting the new balance arrays natively!
