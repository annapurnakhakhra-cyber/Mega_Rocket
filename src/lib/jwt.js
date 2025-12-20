



import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

// Generate a token
export function signToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify a token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
  