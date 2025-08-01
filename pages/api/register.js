import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password, interests, skills, goals, availability } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // For demo purposes, just return success
  // In a real app, you would save to a database
  return res.status(201).json({ 
    message: 'User created successfully', 
    userId: `user_${Date.now()}` 
  });
}
