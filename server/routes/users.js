import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { hashPassword, comparePassword } from '../lib/utility.js'


const router = express.Router();

const prisma = new PrismaClient();

router.post('/signup', async (req,res) => {
  // get user inputs
  const { email, password, first_name, last_name } = req.body;
 
  // validate the inputs (to-do: validate email, enforce password policy)
  if(!email || !password || !first_name || !last_name) {
    return res.status(400).send('Missing required fields');
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

    // get user inputs
  const {email, password} = req.body;

  // validate the inputs
  if (!email || !password) {
    return res.status(400).send('missing required fields');
  }

  // find user in database
  const existingUser = await prisma.customer.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(401).send('User not found');
  }

  // compare/verify the password entered
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }

  // setup user session data

  res.send('Login successful for ' + email);
});

router.post('/logout', (req, res) => {
    res.send('logout page');
});

router.get('/getSession', (req, res) => {
    res.send('get session page');
});

export default router;