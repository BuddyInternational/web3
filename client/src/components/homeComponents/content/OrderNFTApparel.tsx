import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { BsArrowDownCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const OrderNFTApparel = () => {
  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" component="h3" gutterBottom>
        How to Participate and Earn Rewards:
      </Typography>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {[
            {
              title: 'Order Your Apparel:',
              description:
                'Select and purchase an apparel item from our collection. By placing an order, your wallet will be automatically linked to your purchase.',
            },
            {
              title: 'Receive Your Apparel:',
              description: 'Wait for your apparel to arrive in the mail.',
            },
            {
              title: 'Show Off Your Style:',
              description: 'Wear your new clothing and let others see your Gully Buddy gear!',
            },
            {
              title: 'Earn Rewards Through QR Scanning:',
              description:
                'Your apparel will feature a unique QR code. When others scan your QR code, they can send cryptocurrency directly to your account.',
            },
            {
              title: 'Enjoy Membership Benefits:',
              description:
                'With just one purchase, you will gain membership in our program. This membership entitles you to substantial rewards, exclusive opportunities, and monthly payouts based on a pool from all monthly QR scans.',
            },
            {
              title: 'Receive Additional Perks:',
              description:
                'As a member, you will also receive an original "Retail Ambassador" passport, signifying your role in our community.',
            },
          ].map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2">{item.description}</Typography>
                }
              />
              {index < 5 && <Divider />}
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ marginTop: 2 }}>
        Note:
      </Typography>
      <Typography variant="body2">
        Payouts are distributed as lifetime dividends, exclusively in cryptocurrency!
      </Typography>

      <Typography variant="h6" component="h3" gutterBottom sx={{ marginTop: 2 }}>
        Join today and start reaping the rewards of being a Gully Buddy Retail Ambassador!
      </Typography>

      <BsArrowDownCircleFill className="text-4xl text-gray-400 m-auto my-6 animate-bounce" />

      <Box sx={{ marginTop: 3, textAlign: 'center' }}>
        <Link to={"/order/NFTApparel"}>
        <Button variant="contained" color="primary">
          Apply Now
        </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default OrderNFTApparel;
