# 🚀 SurakshaPay – Income Protection for Delivery Partners

## 📌 About the Problem
Delivery partners working with platforms like Zomato and Swiggy depend on daily earnings. But many times, due to heavy rain, extreme heat, pollution, or sudden curfews, they are not able to work properly.

Because of this, they lose a part of their income. Right now, there is no proper system that helps them recover this loss.


## 💡 Our Idea
We are building **SurakshaPay**, a simple insurance platform that helps delivery partners protect their income.

Instead of complicated insurance claims, our system works automatically:
- It checks real-time conditions like weather
- If a disruption happens, it detects it
- Then it gives compensation for lost working hours


## 👤 Target Users
We are focusing on:
**Food delivery partners (Zomato / Swiggy)**

### Example:
A delivery partner usually earns around ₹800 per day.  
If heavy rain happens, they may lose 2–3 hours of work.  
Our system will detect this and provide compensation automatically.


## ⚙️ How the System Works

1. User registers with basic details  
2. System calculates risk based on location  
3. User selects a weekly plan  
4. Platform continuously checks weather data  
5. If conditions cross a limit (like heavy rain), a claim is triggered  
6. Payment is processed automatically (simulated)


## 💰 Weekly Plans

| Plan     | Cost        | Coverage            |
|----------|------------|--------------------|
| Basic    | ₹20/week   | Up to 2 hours/day  |
| Standard | ₹40/week   | Up to 4 hours/day  |
| Pro      | ₹60/week   | Up to 6 hours/day  |

The premium may slightly change based on the risk in that area.


## 🌦 When Does It Trigger?

We are using simple conditions like:

- Heavy Rain  
- Very High Temperature  
- Poor Air Quality  
- Curfew or sudden restrictions  

If any of these affect working hours, the system will trigger a payout.


## 🤖 Where AI is Used

We are using basic AI/logic in three places:

- To estimate how risky a location is  
- To adjust weekly premium  
- To check for fake or duplicate claims  


## 🔌 Tools & Technologies

- Frontend: React.js  
- Backend: Node.js (Express)  
- Database: MongoDB / Firebase  
- APIs: Weather API (or mock data)  
- Payments: Mock / test mode  


## 🖥 Why We Chose Web App

We selected a web application because:
- It is easier to build in less time  
- It works on both mobile and desktop  
- It is enough for demo purposes  


## 📊 Features We Plan to Show

- Simple registration  
- Plan selection  
- Live risk display  
- Automatic claim trigger  
- Simulated payout  
- Basic dashboard  


## 📅 Plan for Next Phases

- Add better AI logic for pricing  
- Improve fraud detection  
- Add proper dashboard  
- Simulate real-time payout system  


## 🎯 What Makes Our Idea Different

- No manual claim process  
- Simple weekly plans  
- Automatic detection of problems  
- Focus only on income loss (not health or vehicle)
## 🔐 Adversarial Defense & Anti-Spoofing Strategy

As identified in the threat scenario, simple GPS-based verification is not reliable. Our system is designed to handle such advanced fraud attempts using multiple layers of validation instead of relying on a single data point.

---

### 1. Differentiation: Genuine User vs Spoofed User

Our approach is based on **behavior + environment matching**, not just location.

For a genuine delivery partner:
- Their movement pattern will be continuous and realistic  
- Their activity will match working hours and delivery behavior  
- Their location will align with real-world environmental conditions  

For a spoofed user:
- Location may suddenly jump to a high-risk zone  
- No actual movement or inconsistent movement patterns  
- Activity does not match expected delivery behavior  

We use this combination of signals to identify suspicious patterns instead of trusting GPS alone.

---

### 2. Data Points Used for Detection

To detect fraud, our system analyzes multiple data points:

- 📍 GPS consistency (movement vs sudden jumps)  
- 📶 Network signal strength and stability  
- 📱 Device activity (screen usage, app interaction)  
- ⏱ Time-based activity patterns (working hours vs inactive periods)  
- 🌦 Weather data correlation (actual vs claimed condition)  
- 📊 Historical behavior of the user  
- 👥 Pattern detection (multiple users claiming from same zone at same time)  

This helps identify coordinated fraud attempts such as group-based spoofing.

---

### 3. UX Balance: Handling Flagged Claims

We ensure that genuine users are not unfairly penalized.

If a claim is flagged:
- It is marked as **"Under Review" instead of rejected immediately**  
- Partial payout may be provided as a safety measure  
- User may be asked for simple verification (like app activity check)  

For genuine cases:
- Claims are approved quickly  
- No extra steps are required  

For suspicious patterns:
- Additional verification is triggered  
- Repeated suspicious behavior may reduce trust score  

This approach maintains a balance between **fraud prevention and user trust**.

---

### ✅ Summary

Our system uses a **multi-layer verification approach** combining:
- Behavioral analysis  
- Environmental validation  
- Pattern detection  

This ensures that even advanced spoofing attacks can be identified, while still providing a smooth experience for honest delivery partners.

## 👨‍💻 Team Members

- Naveen  
- Bala  
- Tarak  
- Harsha  
- Sreyesha 

---

## 🏁 Final Note

Our goal is to create a simple and practical solution that can actually help delivery partners manage income loss during difficult conditions.

---

*Built for Guidewire DEVTrails 2026*
>>>>>>> 74059e9c87dc88749d5a7b30d9b16a82dcb10b88
=======
# 🚀 SurakshaPay – Income Protection for Delivery Partners (Full Stack Implementation)

## 📌 About the Problem
Delivery partners working with platforms like Zomato and Swiggy depend on daily earnings. But due to heavy rain, extreme heat, pollution, or sudden curfews, they lose income. SurakshaPay provides **parametric insurance** with automatic payouts - no claims needed!

## 💡 Key Features
- **Automatic Triggers**: Real-time weather/disruption detection
- **AI Risk Engine**: Dynamic pricing based on location risk
- **Instant Payouts**: Simulated UPI settlements
- **Fraud Protection**: Multi-layer anti-spoofing validation
- **Full Dashboard**: Live alerts, wallet balance, policy management

## 🏗️ Tech Stack
**Backend**: Java Spring Boot + JPA + MySQL  
**Frontend**: React + Vite + Tailwind  
**APIs**: Weather simulation, parametric triggers, payment processing

## 🎯 Demo Flow
1. Register/Login → Select Plan → View Dashboard
2. Admin triggers weather event → AI validates → Auto-payout processed
3. Live updates in UI with real-time polling

## 💰 Plans
| Plan | Weekly Cost | Coverage |
|------|-------------|----------|
| Basic | ₹20 | 2 hrs/day |
| Standard | ₹40 | 4 hrs/day |
| Pro | ₹60 | 6 hrs/day |

## 🔧 Quick Start
```bash
# Backend
cd surakshapay-backend && mvn spring-boot:run

# Frontend  
cd surakshapay-frontend && npm run dev
```

## ☁️ Vercel Deployment (Fixed 404 Issue)

### Frontend (surakshapay-frontend)
1. `cd surakshapay-frontend`
2. `npm install`
3. Connect to Vercel: `npm i -g vercel` then `vercel --prod`
4. **Set env var in Vercel dashboard**: `VITE_API_URL=https://your-backend-url.vercel.app`

**vercel.json added**: Fixes SPA routing 404 errors!

### Backend (surakshapay-backend) 
Java/Spring Boot → Deploy to Railway/Heroku or Render
```
mvn clean package -DskipTests
java -jar target/*.jar
```

### Test Prod
```
Root: ✅ Landing Page
/dashboard: ✅ SPA routing works!
API calls: Need VITE_API_URL set
```

## 🎉 Built for Guidewire DEVTrails 2026
**Team**: Naveen, Bala, Tarak, Harsha, Sreyesha

*Automatic income protection - Zero manual claims!*
=======
# 🚀 SurakshaPay – Income Protection for Delivery Partners

## 📌 About the Problem
Delivery partners working with platforms like Zomato and Swiggy depend on daily earnings. But many times, due to heavy rain, extreme heat, pollution, or sudden curfews, they are not able to work properly.

Because of this, they lose a part of their income. Right now, there is no proper system that helps them recover this loss.


## 💡 Our Idea
We are building **SurakshaPay**, a simple insurance platform that helps delivery partners protect their income.

Instead of complicated insurance claims, our system works automatically:
- It checks real-time conditions like weather
- If a disruption happens, it detects it
- Then it gives compensation for lost working hours


## 👤 Target Users
We are focusing on:
**Food delivery partners (Zomato / Swiggy)**

### Example:
A delivery partner usually earns around ₹800 per day.  
If heavy rain happens, they may lose 2–3 hours of work.  
Our system will detect this and provide compensation automatically.


## ⚙️ How the System Works

1. User registers with basic details  
2. System calculates risk based on location  
3. User selects a weekly plan  
4. Platform continuously checks weather data  
5. If conditions cross a limit (like heavy rain), a claim is triggered  
6. Payment is processed automatically (simulated)


## 💰 Weekly Plans

| Plan     | Cost        | Coverage            |
|----------|------------|--------------------|
| Basic    | ₹20/week   | Up to 2 hours/day  |
| Standard | ₹40/week   | Up to 4 hours/day  |
| Pro      | ₹60/week   | Up to 6 hours/day  |

The premium may slightly change based on the risk in that area.


## 🌦 When Does It Trigger?

We are using simple conditions like:

- Heavy Rain  
- Very High Temperature  
- Poor Air Quality  
- Curfew or sudden restrictions  

If any of these affect working hours, the system will trigger a payout.


## 🤖 Where AI is Used

We are using basic AI/logic in three places:

- To estimate how risky a location is  
- To adjust weekly premium  
- To check for fake or duplicate claims  


## 🔌 Tools & Technologies

- Frontend: React.js  
- Backend: Node.js (Express)  
- Database: MongoDB / Firebase  
- APIs: Weather API (or mock data)  
- Payments: Mock / test mode  


## 🖥 Why We Chose Web App

We selected a web application because:
- It is easier to build in less time  
- It works on both mobile and desktop  
- It is enough for demo purposes  


## 📊 Features We Plan to Show

- Simple registration  
- Plan selection  
- Live risk display  
- Automatic claim trigger  
- Simulated payout  
- Basic dashboard  


## 📅 Plan for Next Phases

- Add better AI logic for pricing  
- Improve fraud detection  
- Add proper dashboard  
- Simulate real-time payout system  


## 🎯 What Makes Our Idea Different

- No manual claim process  
- Simple weekly plans  
- Automatic detection of problems  
- Focus only on income loss (not health or vehicle)
## 🔐 Adversarial Defense & Anti-Spoofing Strategy

As identified in the threat scenario, simple GPS-based verification is not reliable. Our system is designed to handle such advanced fraud attempts using multiple layers of validation instead of relying on a single data point.

---

### 1. Differentiation: Genuine User vs Spoofed User

Our approach is based on **behavior + environment matching**, not just location.

For a genuine delivery partner:
- Their movement pattern will be continuous and realistic  
- Their activity will match working hours and delivery behavior  
- Their location will align with real-world environmental conditions  

For a spoofed user:
- Location may suddenly jump to a high-risk zone  
- No actual movement or inconsistent movement patterns  
- Activity does not match expected delivery behavior  

We use this combination of signals to identify suspicious patterns instead of trusting GPS alone.

---

### 2. Data Points Used for Detection

To detect fraud, our system analyzes multiple data points:

- 📍 GPS consistency (movement vs sudden jumps)  
- 📶 Network signal strength and stability  
- 📱 Device activity (screen usage, app interaction)  
- ⏱ Time-based activity patterns (working hours vs inactive periods)  
- 🌦 Weather data correlation (actual vs claimed condition)  
- 📊 Historical behavior of the user  
- 👥 Pattern detection (multiple users claiming from same zone at same time)  

This helps identify coordinated fraud attempts such as group-based spoofing.

---

### 3. UX Balance: Handling Flagged Claims

We ensure that genuine users are not unfairly penalized.

If a claim is flagged:
- It is marked as **“Under Review” instead of rejected immediately**  
- Partial payout may be provided as a safety measure  
- User may be asked for simple verification (like app activity check)  

For genuine cases:
- Claims are approved quickly  
- No extra steps are required  

For suspicious patterns:
- Additional verification is triggered  
- Repeated suspicious behavior may reduce trust score  

This approach maintains a balance between **fraud prevention and user trust**.

---

### ✅ Summary

Our system uses a **multi-layer verification approach** combining:
- Behavioral analysis  
- Environmental validation  
- Pattern detection  

This ensures that even advanced spoofing attacks can be identified, while still providing a smooth experience for honest delivery partners.

## 👨‍💻 Team Members

- Naveen  
- Bala  
- Tarak  
- Harsha  
- Sreyesha 

---

## 🏁 Final Note

Our goal is to create a simple and practical solution that can actually help delivery partners manage income loss during difficult conditions.

---

*Built for Guidewire DEVTrails 2026*
>>>>>>> 74059e9c87dc88749d5a7b30d9b16a82dcb10b88
