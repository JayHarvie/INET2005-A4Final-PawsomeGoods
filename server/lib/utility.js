import bcrypt from 'bcrypt';
import passwordValidator from 'password-validator';

// Hash the password
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
  }
   
  // Validate the password
  async function comparePassword(plaintextPassword, hash) {
    return await bcrypt.compare(plaintextPassword, hash);
  }

  // Create a schema
  const schema = new passwordValidator();

  // Add properties to it
  schema
    .is().min(8)         // Minimum length 8
    .has().uppercase()   // Must have uppercase letters
    .has().lowercase()   // Must have lowercase letters
    .has().digits(1)     // Must have at least 1 digits

  export { hashPassword, comparePassword, schema }