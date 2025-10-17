const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// REGISTER
const register = async (req, res) => {
  try {
    const { username, usn, password, branch, section, email, phone } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', normalizedEmail).get();

    if (!snapshot.empty) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRef = usersRef.doc(); // Generate new document
    await newUserRef.set({
      username,
      usn,
      branch,
      section,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      user: { id: newUserRef.id, username, usn, branch, section, email: normalizedEmail, phone },
      token: generateToken(newUserRef.id),
    });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', normalizedEmail).get();

    if (snapshot.empty) return res.status(400).json({ message: 'Invalid credentials' });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const valid = await bcrypt.compare(password, userData.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      user: {
        id: userDoc.id,
        username: userData.username,
        usn: userData.usn,
        branch: userData.branch,
        section: userData.section,
        email: userData.email,
        phone: userData.phone,
      },
      token: generateToken(userDoc.id),
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { register, login };
