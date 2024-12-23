import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { hashPassword, comparePassword, schema } from '../lib/utility.js'


const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', async (req,res) => {
  // get user inputs
  const { email, password, first_name, last_name } = req.body;
 
  // validate the inputs (to-do: validate email, enforce password policy)
  if(!email || !password || !first_name || !last_name) {
    return res.status(400).send('Missing required fields');
  }

  // Validate the password against the schema
  const isValidPassword = schema.validate(password);
  if (!isValidPassword) {
    return res.status(400).send('Password does not meet the required policy');
  }

  // check for existing user
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // hash (encrypt) the password
  const hashedPassword = await hashPassword(password);

  // add user to database
  const user = await prisma.customer.create({
    data: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword
    },
  });

  // send a response
  res.json({ 'user': email });
});

router.post('/login', async (req, res) => {
  console.log('Session before login:', req.session); // Check session data before login

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('missing required fields');
  }

  const existingUser = await prisma.customer.findUnique({
    where: { email: email },
  });
  if (!existingUser) {
    return res.status(401).send('User not found');
  }

  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }

  // Set session data
  req.session.user_id = existingUser.customer_id;
  req.session.email = existingUser.email;
  req.session.firstName = existingUser.first_name;
  req.session.lastName = existingUser.last_name;

  console.log('Session after login:', req.session); // Log session after login to verify

  // Ensure the session is saved
  req.session.save((err) => {
    if (err) {
      console.error('Error saving session:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.send('Login successful for ' + email);
  });
});




router.post('/logout', (req, res) => {
  req.session.destroy();
  res.send('successful logout');
});

router.get('/getSession', (req, res) => {
  console.log('Full session object:', req.session); // Log full session
  if (req.session.user_id) {
    res.json({
      user: {
        id: req.session.user_id,
        email: req.session.email,
        firstName: req.session.firstName,
        lastName: req.session.lastName,
      },
    });
  } else {
    res.status(401).send('Not logged in');
  }
});

export default router;