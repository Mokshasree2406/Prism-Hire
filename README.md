# 🎯 Prism Hire - Full-Stack Interview Preparation Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)

A comprehensive, AI-powered interview preparation platform with **cross-platform support** - Web, iOS, and Android. Built with modern technologies to help candidates ace their interviews with personalized practice sessions, AI-generated questions, mock interviews, and resume analysis.

---

## 📁 Project Structure

```
Prism-Hire/
├── 📱 client/              # Web Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── 📲 mobile/              # Mobile App (React Native + Expo)
│   ├── src/
│   ├── assets/
│   └── package.json
│
├── 🖥️  server/             # Backend API (Node.js + Express + MongoDB)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── package.json
│
├── detect_ip.js           # Network IP detection utility
└── start-all.bat          # Quick launch script (Windows)
```

---

## ✨ Features

### 🎯 Core Functionality
- **Session Management** - Create and manage multiple career goals/sessions
- **AI-Powered Testing** - Practice with dynamically generated AI questions
- **Mock Interviews** - Interactive chat-based interview practice
- **Resume Analysis** - Get AI-powered feedback on your resume
- **AI Hub** - Compare responses from multiple AI models (ChatGPT, Claude, Gemini)
- **Progress Tracking** - Analytics dashboard to monitor your improvement

### 🌐 Cross-Platform
- **Web Application** - Full-featured React web app with responsive design
- **iOS & Android** - Native mobile experience via React Native & Expo
- **Synchronized Experience** - Seamless transition between devices

### 🎨 User Experience
- **Dark Mode** - Eye-friendly interface optimized for long study sessions
- **Responsive Design** - Works perfectly on all screen sizes
- **Intuitive Navigation** - Modern UI with smooth transitions
- **Real-time Feedback** - Instant AI responses and analytics

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **Expo Go** (optional, for mobile testing) - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **Git** - [Download](https://git-scm.com/downloads)

### 📥 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/prism-hire.git
cd prism-hire
```

2. **Set up environment variables**
```bash
cd server
cp .env.example .env
# Edit .env with your actual credentials (see Configuration section)
```

3. **Install dependencies for all modules**
```bash
# Install server dependencies
cd server
npm install

# Install web client dependencies
cd ../client
npm install

# Install mobile app dependencies (optional)
cd ../mobile
npm install
```

---

## 🔧 Configuration

### Server Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/prism_hire_db
# Or use MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/prism_hire

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Google Gemini API Keys
# Get your API key from: https://makersuite.google.com/app/apikey

# API KEY 1: Used for AI Hub and Test Generation
MY_GEMINI_KEY=your_gemini_api_key_here

# API KEY 2: Used for Interview Module
GEMINI_API_KEY=your_gemini_api_key_here

# Note: You can use the same API key for both if needed
```

### Mobile API Configuration

Update the API endpoint in `mobile/src/lib/api.js`:

```javascript
// For local development, use your computer's local IP
const API_URL = 'http://192.168.x.x:5000/api';

// To find your IP address (Windows):
// Run: ipconfig
// Look for IPv4 Address under your active network adapter

// To find your IP address (Mac/Linux):
// Run: ifconfig
// Or use the included detect_ip.js: node detect_ip.js
```

---

## 🏃 Running the Application

### Option 1: Quick Start (All Services) - Windows

**Easiest way to launch everything at once:**

```bash
# Simply double-click start-all.bat
# Or run from command line:
start-all.bat
```

This automatically launches:
- ✅ Backend Server on `http://localhost:5000`
- ✅ Web Client on `http://localhost:5173`
- ✅ Mobile App (Expo DevTools)

### Option 2: Manual Start (Individual Services)

#### 1️⃣ Start Backend Server

```bash
cd server
npm run dev
```
- Server runs on: **http://localhost:5000**
- API endpoints available at: **http://localhost:5000/api**

#### 2️⃣ Start Web Client

```bash
cd client
npm run dev
```
- Web app opens at: **http://localhost:5173**
- Auto-opens in your default browser

#### 3️⃣ Start Mobile App

```bash
cd mobile
npm start
```
- **Scan QR code** with Expo Go app on your phone
- Or press `w` to open in **web browser**
- Or press `a` for **Android emulator** / `i` for **iOS simulator**

---

## 🌐 Access Across Devices

### 📱 Mobile Devices (Same Wi-Fi Network)

1. Ensure your phone and computer are on the **same Wi-Fi network**
2. Run `npm start` in the mobile folder
3. Open **Expo Go** app on your phone
4. Scan the **QR code** displayed in the terminal
5. The app automatically connects to your local server

### 🌍 Web Browser (Mobile UI)

1. Navigate to the mobile folder: `cd mobile`
2. Run: `npm run web` or press `w` after `npm start`
3. Open `http://localhost:8081` in any browser
4. Experience the same mobile UI in your browser!

---

## 🛠️ Tech Stack

### Frontend - Web (`client/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool & Dev Server |
| TailwindCSS | 3.4.17 | Styling |
| React Router | 7.13.0 | Navigation |
| Axios | 1.13.3 | HTTP Client |
| Lucide React | 0.563.0 | Icons |
| Recharts | 3.7.0 | Analytics Charts |
| React Markdown | 10.1.0 | Markdown Rendering |

### Frontend - Mobile (`mobile/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Mobile Framework |
| Expo | ~54.0.33 | Development Platform |
| React Navigation | 7.1.28 | Navigation |
| Axios | 1.13.5 | HTTP Client |
| Expo Secure Store | ~15.0.8 | Secure Token Storage |
| Lucide React Native | 0.564.0 | Icons |
| React Native Gesture Handler | ~2.28.0 | Gestures |

### Backend (`server/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v14+ | Runtime |
| Express | 5.2.1 | Web Framework |
| MongoDB | Latest | Database |
| Mongoose | 9.1.5 | ODM |
| JWT | 9.0.3 | Authentication |
| bcryptjs | 3.0.3 | Password Hashing |
| Google Generative AI | 0.24.1 | Gemini AI Integration |
| Anthropic SDK | 0.72.1 | Claude AI Integration |
| OpenAI | 6.17.0 | ChatGPT Integration |
| Multer | 2.0.2 | File Upload |
| Mammoth | 1.11.0 | DOCX Parsing |
| PDF Parse | 1.1.1 | PDF Parsing |

---

## 📖 Usage Guide

### 1. **Create an Account**
   - Register with email and password
   - Secure JWT-based authentication

### 2. **Set Up Your Profile**
   - Create your first career session/goal
   - Define your target role and interview focus

### 3. **Practice & Prepare**
   - **Test Module**: Practice with AI-generated technical questions
   - **Interview Chat**: Simulate real interview conversations
   - **Resume Analyzer**: Upload and get AI feedback on your resume
   - **AI Hub**: Compare responses from multiple AI models

### 4. **Track Progress**
   - View analytics dashboard
   - Review saved questions and answers
   - Monitor improvement over time

### 5. **Multi-Device Access**
   - Start on web, continue on mobile
   - Seamless synchronization across platforms

---

## 🔒 Security

- ✅ **JWT-based Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Secure Storage** - expo-secure-store on mobile
- ✅ **Environment Variables** - Sensitive data in .env files
- ✅ **Input Validation** - Server-side validation for all inputs
- ✅ **CORS Protection** - Configured CORS policies

> **⚠️ Important**: Never commit your `.env` file to version control. Always use `.env.example` as a template.

---

## 🐛 Troubleshooting

### Web Client Issues

**Problem**: White screen or build errors
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Problem**: React DOM not found
```bash
npm install react-dom
```

### Mobile App Issues

**Problem**: Can't connect to server
```bash
# 1. Find your computer's IP address
node detect_ip.js

# 2. Update mobile/src/lib/api.js with your IP
const API_URL = 'http://YOUR_IP_HERE:5000/api';

# 3. Ensure firewall allows port 5000
# Windows: Windows Defender Firewall > Allow an app
```

**Problem**: Metro bundler issues
```bash
# Clear cache and restart
cd mobile
npx expo start -c
```

**Problem**: Expo Go not connecting
- Ensure phone and computer are on the **same Wi-Fi network**
- Disable VPN if active
- Try using the web version: `npm run web`

### Server Issues

**Problem**: MongoDB connection failed
```bash
# Verify MongoDB is running
# Windows: Check Services for "MongoDB"
# Mac/Linux: sudo systemctl status mongodb

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env with Atlas connection string
```

**Problem**: Session creation failing
- Check `.env` file exists with correct values
- Verify `JWT_SECRET` is set
- Check server logs for detailed errors: `npm run dev`

**Problem**: AI features not working
- Verify API keys in `.env` are valid
- Check API quota/billing on respective platforms
- Ensure internet connection is active

---

## 📱 Platform Support

| Platform | Status | Access Method |
|----------|--------|---------------|
| **Windows** | ✅ Full Support | Web + Expo |
| **macOS** | ✅ Full Support | Web + Expo + iOS Simulator |
| **Linux** | ✅ Full Support | Web + Expo |
| **iOS** | ✅ Full Support | Expo Go App |
| **Android** | ✅ Full Support | Expo Go App |
| **Web Browser** | ✅ Full Support | Any modern browser |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent question generation
- Expo team for excellent mobile development platform
- MongoDB for robust database solution
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/yourusername/prism-hire/issues)
3. Create a [new issue](https://github.com/yourusername/prism-hire/issues/new) with detailed information

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️ by the Prism Hire Team

</div>
