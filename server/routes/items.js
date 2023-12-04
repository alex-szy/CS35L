const express = require('express');
const router = express.Router();

const { supabase } = require('../modules/supabaseServer');
// middleware

router.get('/:itemID', async (req, res) => {

  const itemID = req.params.itemID;
  const { data, error } = await supabase.from('Items').select().eq('id',itemID);
  
  if (error) {
    console.error('Error reading Supabase data:', error);
    return res.status(500).json({ error: 'Error reading Supabase data' });
  }
  else {
    res.status(200).json({
      data
    });
  }
});


router.get('/search/:query', async (req, res) => {

  const search_query = req.params.query;
  

    
  const{ data, error } = await supabase.from('Items').select().textSearch('name',search_query, {
    type: 'websearch',
    config: 'english'
  });

  if (error) {
    console.error('Error searching Supabase data:', error);
    
    
    return res.status(501).json({ error: 'Error searching Supabase data' });
    
  }
  else {
    res.status(200).json({
      data
    });
  }

  

  
});

module.exports = router;