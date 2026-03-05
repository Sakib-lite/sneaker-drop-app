import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingBag,
  Schedule,
  CheckCircle,
  Inventory,
} from '@mui/icons-material';
import { useApp } from '../store/AppContext';

export const DropCard = ({ drop }) => {
  const { user, reservations, createReservation, completePurchase } = useApp();
  const [reserving, setReserving] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const myReservation = reservations.find((r) => r.drop && drop && r.drop.name === drop.name);

  useEffect(() => {
    if (myReservation) {
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.floor((new Date(myReservation.expiresAt) - new Date()) / 1000));
        setCountdown(remaining);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [myReservation]);

  const handleReserve = async () => {
    setReserving(true);
    try {
      await createReservation(drop.id);
    } finally {
      setReserving(false);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await completePurchase(drop.id);
    } finally {
      setPurchasing(false);
    }
  };

  const stockPercentage = (drop.availableStock / drop.totalStock) * 100;
  const isLowStock = stockPercentage < 20;
  const isOutOfStock = drop.availableStock === 0;

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '66.67%',
          overflow: 'hidden',
          backgroundColor: 'grey.100'
        }}
      >
        <CardMedia
          component="img"
          image={drop.imageUrl || 'https://picsum.photos/id/237/200/300'}
          alt={drop.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom fontWeight={700}>
          {drop.name}
        </Typography>

        {drop.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {drop.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              ${parseFloat(drop.price).toFixed(2)}
            </Typography>
            <Chip
              icon={<Inventory />}
              label={`${drop.availableStock} / ${drop.totalStock} left`}
              color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
              size="small"
            />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={stockPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: isOutOfStock ? 'error.main' : isLowStock ? 'warning.main' : 'success.main',
              },
            }}
          />
        </Box>

        {drop.recentPurchasers && drop.recentPurchasers.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Recent Buyers:
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 14 } }}>
                {drop.recentPurchasers.map((purchaser, idx) => (
                  <Avatar key={idx} sx={{ bgcolor: 'primary.main' }}>
                    {purchaser.username[0].toUpperCase()}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Typography variant="caption" color="text.secondary">
                {drop.recentPurchasers.map((p) => p.username).join(', ')}
              </Typography>
            </Stack>
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          {myReservation ? (
            <Box>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: 'success.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'success.main',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    Reserved
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="h6" fontWeight={700} color="error">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    remaining
                  </Typography>
                </Stack>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={purchasing ? <CircularProgress size={20} color="inherit" /> : <ShoppingBag />}
                onClick={handlePurchase}
                disabled={purchasing || countdown === 0}
                sx={{ fontWeight: 600 }}
              >
                {purchasing ? 'Processing...' : 'Complete Purchase'}
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={reserving ? <CircularProgress size={20} color="inherit" /> : <Schedule />}
              onClick={handleReserve}
              disabled={!user || reserving || isOutOfStock}
              sx={{ fontWeight: 600 }}
            >
              {reserving ? 'Reserving...' : isOutOfStock ? 'Out of Stock' : 'Reserve Now'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
