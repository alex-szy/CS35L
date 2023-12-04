<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const supabaseServer = require('./supabaseServer');
const supabase = supabaseServer.supabase;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const PORT = 3001;

app.use(express.json());

// Use cors middleware to enable CORS
app.use(cors());

// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    console.log('Unauthorized - Token not provided');
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Forbidden - Invalid token');
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    // console.log(decoded)
    req.user = decoded.sub;
    next();
  });
};

// Apply the authentication middleware to the route
app.post('/add-to-wishlist', authenticateToken, async (req, res) => {
  try {
    // Check if user exists in the user table
    const { data: userData, error: userError } = await supabase.auth.getUser(req.header('Authorization'))
    if (userError || !userData) {
      console.error('User not found:', userError);
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if user 'aud' is 'authenticated'
    if (userData.user.aud !== 'authenticated') {
      console.error('User is not authenticated');
      return res.status(401).json({ error: 'User is not authenticated' });
    }
    // Perform Supabase insert in wishlist table
    const userId = req.user;
    const { item } = req.body; 
    console.log('im here');
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ userId: userId, item }]);

    if (error) {
      console.error('Error updating Supabase data:', error);
      return res.status(500).json({ error: 'Error updating Supabase data' });
    }

    console.log('Wishlist item added successfully:', data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
=======
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { supabase, verifyUser } = require('./modules/supabaseServer');
const token = require('./modules/token');

// Middleware
app.use(express.json());
app.use(cors());

// Routers
app.use('/items', require('./routes/items'));
app.use('/userList', require('./routes/userList'));
app.use('/userFavouriteItems', require('./routes/userFavouriteItems'));

const PORT = 3001;

app.use(token.authenticate);
app.use(verifyUser);

// Apply the authentication middleware to the route
app.post('/add-to-wishlist', async (req, res) => {
  try {
    const userId = req.user;
    const { item } = req.body;

    // Perform Supabase insert in wishlist table
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ userId, item }]);

    if (error) {
      console.error('Error updating Supabase data:', error);
      return res.status(500).json({ error: 'Error updating Supabase data' });
    }

    console.log('Wishlist item added successfully:', data);
    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
>>>>>>> origin/backend-crud
