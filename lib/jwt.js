import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'doctor_help_super_secret_key_12345';

export const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day as requested
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
