import React from 'react';
import {Card, CardContent, CardMedia, Typography, IconButton} from '@mui/material';
import { Favorite, Delete } from '@mui/icons-material';

const GroceryItem = ({ item }) => (
    <Button sx={{ width: '25%' }} component={Link} to="/item">
      <Card>
        <CardMedia
          component="img"
          height="140"
          image={item.imageUrl}
          alt={item.name}
        />
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body1">Price: {item.price}</Typography>
          <Typography variant="body2">Store: {item.store}</Typography>
          <IconButton color="black"><Favorite /></IconButton>
          <IconButton color="black"><Delete /></IconButton>
        </CardContent>
      </Card>
    </Button>
  );

export default GroceryItem;