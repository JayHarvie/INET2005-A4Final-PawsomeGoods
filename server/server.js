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
  origin: 'http://localhost:5173',
  credentials: true,
}));


// Session middleware
app.use(session({
  secret: 'hjbby^we643gDrsdf#9Hjdh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 3600000,
  },
}));



// Routes
app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
