import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useApp } from '../store/AppContext';

export const LoginDialog = ({ open, onClose }) => {
  const [username, setUsername] = useState('');
  const { loginUser, loading } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      await loginUser(username.trim());
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Enter to Sneaker Drop
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              required
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !username.trim()}
          >
            {loading ? 'Entering...' : 'Enter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
