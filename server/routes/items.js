const express = require('express');
const router = express.Router();
const sb = require('../modules/supabase');


// Searches for items in db, returns a list of item objects
router.get('/search/:query?', async (req, res) => {
  const search_query = req.params.query;
  const{ data, error } = await sb.client
    .from('Items')
    .select('id, name, shop, curr_price, price_type, img, query')
    .textSearch('search',search_query, {
      type: 'websearch',
      config: 'english'
    });

  if (error) {
    console.error('Error searching Supabase data:', error);
    return res.status(501).json({ error: 'Error searching Supabase data' });
  } else {
    res.status(200).json(data);
  };
});

// Gets single item from db, returns a single item object
router.get('/:itemID?', async (req, res) => {
  const itemID = req.params.itemID;

  // Test if the incoming parameter is a number
  if (/^[0-9]*$/.test(itemID) === false) {
    return res.status(400).json({
      Error: 'Bad request, item ID must be a number'
    });
  };

  // Get item from database
  const { data, error } = await sb.client
    .from('Items')
    .select()
    .eq('id',itemID);
  if (error) {
    console.error('Error reading Supabase data:', error);
    return res.status(500).json({ error: 'Error reading Supabase data' });
  };

  // Item exists in database
  if (data.length !== 0) {
    return res.status(200).json(data[0]);
  };

  // Item does not exist
  res.status(404).json({
    Error: 'Item does not exist'
  });
});


// All other routes
router.all('*', (req, res) => {
  res.status(404).json({
    Error: 'Not Found'
  });
});


module.exports = router;