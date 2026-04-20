# 🏠 Roommate Compatibility Matcher

A smart web application that helps students find the most compatible roommates based on lifestyle, habits, and personal preferences.

---

## 🚀 Live Demo
👉 https://roommate-matcher-mu-roan.vercel.app/

---

## 🎯 Problem Statement

Students are often assigned roommates randomly, leading to conflicts due to mismatched habits, routines, and lifestyles.

This project solves that by:
- Collecting structured user preferences
- Analyzing compatibility using a scoring algorithm
- Matching users with the most compatible roommates

---

## 💡 Features

- 🔐 User Authentication (Signup/Login)
- 🧾 Dynamic Questionnaire for preferences
- 🧠 Compatibility Matching Algorithm
- 📊 Compatibility Score (in %)
- 🤝 “Why Match” explanations (insightful reasoning)
- 🏠 Dashboard for navigation
- 📱 Responsive UI (mobile + desktop)

---

## 🧠 How It Works

1. Users sign up and log in  
2. Fill out a questionnaire (sleep, cleanliness, noise, etc.)  
3. Data is stored in Firebase  
4. The system compares user profiles  
5. Generates compatibility scores using weighted differences  
6. Displays top matches with explanations  

---

## 🧮 Matching Algorithm

The compatibility score is calculated using:

Compatibility = 100 − Σ (weight × difference in traits)

- Each trait (sleep, cleanliness, etc.) is assigned a weight
- Smaller differences → higher compatibility
- Larger differences → lower compatibility

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Context API
- Tailwind CSS

### Backend
- Firebase Authentication
- Firestore Database

### Deployment
- Vercel

---

## 📁 Project Structure
src/
├── components/
├── pages/
├── context/
├── services/
├── hooks/

---

## 🔐 Environment Variables

Create a `.env` file locally:
VITE_API_KEY=…
VITE_AUTH_DOMAIN=…
VITE_PROJECT_ID=…
VITE_STORAGE_BUCKET=…
VITE_MESSAGING_SENDER_ID=…
VITE_APP_ID=…
VITE_MEASUREMENT_ID=…

---

## ⚙️ Setup Instructions


# Clone repo
git clone https://github.com/your-username/roommate-matcher.git

# Go into project
cd roommate-matcher

# Install dependencies
npm install

# Run locally
npm run dev

⸻

🧑‍💻 Author

Udayveer Singh

⸻

📌 Final Note

This project demonstrates:

* Real-world problem solving
* Strong React fundamentals
* Backend integration
* Scalable architecture

Built as a production-level portfolio project 🚀
