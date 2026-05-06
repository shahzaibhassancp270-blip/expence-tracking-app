# SmartSpend - Personal Expense Tracker

SmartSpend is a modern, offline-first personal finance management application built with React Native and Expo. It helps users track their spending, manage budgets, and visualize their financial health through intuitive analytics.

![SmartSpend Banner](https://img.shields.io/badge/SmartSpend-Finance-00BFA5?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.0-black?style=for-the-badge&logo=expo)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=for-the-badge&logo=firebase)

## ✨ Features

- 🔐 **Secure Authentication**: User sign-up, login, and password recovery powered by Firebase Authentication.
- 📱 **Offline-First Storage**: All expense data and profile settings are stored locally using `AsyncStorage`, ensuring the app remains responsive even without an internet connection.
- 📊 **Dynamic Analytics**: Visual representation of spending habits using interactive charts and graphs.
- 💰 **Budget Management**: Set monthly budgets and track your spending against your goals in real-time.
- 🌙 **Modern UI/UX**: Clean, responsive design built with React Native Paper, featuring support for both light and dark modes.
- 👤 **Profile Customization**: Manage user details and application preferences easily.

## 🚀 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 54](https://expo.dev/)
- **UI Library**: [React Native Paper](https://reactnativepaper.com/)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Stack & Bottom Tabs)
- **Charts**: [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- **Backend/Auth**: [Firebase](https://firebase.google.com/)
- **Persistence**: [Async Storage](https://react-native-async-storage.github.io/async-storage/)
- **Icons**: [Material Community Icons](https://materialdesignicons.com/)

## 🛠️ Project Structure

```text
src/
├── assets/         # App icons and splash screens
├── components/     # Reusable UI components (CustomButton, ExpenseCard, etc.)
├── constants/      # App-wide constants and theme definitions
├── context/        # React Context providers (Auth, Expense, Theme)
├── navigation/     # AppStack, AuthStack, and MainNavigator
├── screens/        # Auth (Login/Register) and Main (Dashboard/Analytics) screens
├── services/       # Logic for Firebase Auth and AsyncStorage
└── utils/          # Helper functions and formatting utilities
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- [Expo Go](https://expo.dev/expo-go) app on your mobile device (for testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahzaibhassancp270-blip/expence-tracking-app.git
   cd expence-tracking-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Update `src/services/firebase.js` with your own Firebase configuration if needed.

4. **Start the development server**:
   ```bash
   npx expo start
   ```

5. **Run on your device**:
   Scan the QR code displayed in the terminal with your Expo Go app.

## 📝 License

This project is private and intended for personal use.

---
*Built with ❤️ by Shazaib*
