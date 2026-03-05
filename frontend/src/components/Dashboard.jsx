import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Avatar,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Refresh, Person, Logout, Add } from '@mui/icons-material';
import { useApp } from '../store/AppContext';
import { DropCard } from './DropCard';
import { LoginDialog } from './LoginDialog';
import { AddDropDialog } from './AddDropDialog';

export const Dashboard = () => {
  const { user, setUser, drops, reservations, loading, fetchDrops, fetchReservations } = useApp();
  const [loginOpen, setLoginOpen] = useState(false);
  const [addDropOpen, setAddDropOpen] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedUsername = localStorage.getItem('username');
    if (savedUserId && savedUsername) {
      setUser({ id: savedUserId, username: savedUsername });
    } else {
      setLoginOpen(true);
    }
  }, [setUser]);

  useEffect(() => {
    fetchDrops();
    const interval = setInterval(fetchDrops, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchReservations(user.id);
      const interval = setInterval(() => fetchReservations(user.id), 5000);
      return () => clearInterval(interval);
    }
        console.log('user=>',user)

  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setLoginOpen(true);
  };

  const handleDropAdded = () => {
    fetchDrops();
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
            Sneaker Drop
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              color="inherit"
              startIcon={<Add />}
              onClick={() => setAddDropOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              Add Drop
            </Button>

            <IconButton color="inherit" onClick={fetchDrops} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
            </IconButton>

            {user && (
              <>
                <Chip
                  icon={<Person />}
                  label={`User: ${user.username}`}
                  color="secondary"
                  sx={{ color: 'white' }}
                />
                <Button
                  color="inherit"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{ textTransform: 'none' }}
                >
                  Logout
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Limited Edition Drops
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Reserve your favorite sneakers now! Stock updates in real-time.
          </Typography>

          {reservations.length > 0 && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'info.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'info.main',
              }}
            >
              <Typography variant="body2" fontWeight={600} color="info.main">
                You have {reservations.length} active reservation{reservations.length > 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Box>

        {loading && drops.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : drops.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No drops available at the moment
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {drops.map((drop) => (
              <DropCard key={drop.id} drop={drop} />
            ))}
          </Box>
        )}
      </Container>

      <LoginDialog open={loginOpen && !user} onClose={() => setLoginOpen(false)} />
      <AddDropDialog
        open={addDropOpen}
        onClose={() => setAddDropOpen(false)}
        onDropAdded={handleDropAdded}
      />
    </Box>
  );
};
