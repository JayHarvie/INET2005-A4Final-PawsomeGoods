import express from 'express';
import cors from 'cors';
import session from 'express-session';
import usersRouter from './routes/users.js';
import productRouter from './routes/products.js';

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',  // React frontend URL
  credentials: true, // Allow cookies to be sent
}));

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,  // Save sessions only when there is data
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production when using https
    sameSite: 'lax', // or 'strict', depending on your needs
    maxAge: 3600000,  // Session expiration time
  },
}));


// Routes
app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
