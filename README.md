# MovieFlix - Movie Recommendation App

A full-featured movie recommendation platform built with React frontend and Express.js backend, featuring user authentication, movie discovery, and personalized recommendations.

## 🚀 Live Demo

**Deployed Application**: https://5000-i2vv58assmmrvlovoch95-e5cbd45f.manusvm.computer

## ✨ Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Movie Discovery**: Search movies by title, genre, or year
- **Movie Details**: View comprehensive movie information
- **Favorites**: Save and manage favorite movies
- **Watchlist**: Create and manage personal watchlists
- **User Profile**: Manage account information and preferences
- **Responsive Design**: Optimized for desktop and mobile devices

### Technical Features
- **Modern UI**: Built with React and Tailwind CSS
- **RESTful API**: Express.js backend with MongoDB database
- **Authentication**: JWT-based secure authentication
- **Real-time Updates**: Dynamic content loading
- **Production Ready**: Optimized build and deployment

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Lucide Icons**: Beautiful icon library
- **React Router**: Client-side routing

### Backend
- **Express.js 4**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### External APIs
- **TMDB API**: The Movie Database for movie data

## 📁 Project Structure

```
movie-recommendation-app/
├── backend/                 # Express.js backend
│   ├── models/             # MongoDB models
│   │   └── User.js         # User model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── movies.js       # Movie routes
│   │   └── users.js        # User routes
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # Authentication middleware
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Home.jsx    # Homepage component
│   │   │   ├── Login.jsx   # Login form
│   │   │   ├── Register.jsx # Registration form
│   │   │   ├── Search.jsx  # Movie search
│   │   │   ├── MovieDetails.jsx # Movie details
│   │   │   ├── Favorites.jsx # Favorites page
│   │   │   ├── Watchlist.jsx # Watchlist page
│   │   │   ├── Profile.jsx # User profile
│   │   │   ├── Navbar.jsx  # Navigation bar
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/        # React context
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── dist/               # Production build
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- TMDB API Key (free from https://www.themoviedb.org/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-recommendation-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-recommendation-app
   JWT_SECRET=your-super-secret-jwt-key-here
   TMDB_API_KEY=your-tmdb-api-key-here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   PORT=5000
   ```

5. **Start MongoDB**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

### Development

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend
   npm start
   ```

3. **Access the application**
   - Full application: http://localhost:5000

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movies
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/top-rated` - Get top-rated movies
- `GET /api/movies/now-playing` - Get now playing movies
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id` - Get movie details

### User Features
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites` - Add to favorites
- `DELETE /api/users/favorites/:movieId` - Remove from favorites
- `GET /api/users/watchlist` - Get user watchlist
- `POST /api/users/watchlist` - Add to watchlist
- `DELETE /api/users/watchlist/:movieId` - Remove from watchlist
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 UI Components

The application uses a modern, responsive design with:
- **Dark/Light Theme**: Automatic theme detection
- **Mobile-First**: Responsive design for all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored securely

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout and navigation
- **Mobile**: Touch-friendly interface and navigation

## 🔧 Configuration

### TMDB API Setup
1. Visit https://www.themoviedb.org/
2. Create a free account
3. Go to Settings > API
4. Request an API key
5. Add the API key to your `.env` file

### MongoDB Setup
- **Local**: Install MongoDB locally and start the service
- **Cloud**: Use MongoDB Atlas for cloud hosting
- **Docker**: Run MongoDB in a Docker container

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **TMDB**: For providing the movie database API
- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **shadcn/ui**: For the beautiful UI components
- **Express.js**: For the robust backend framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ using React, Express.js, and MongoDB**
