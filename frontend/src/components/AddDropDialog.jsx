import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { dropAPI } from '../services/api';

export const AddDropDialog = ({ open, onClose, onDropAdded }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    totalStock: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        totalStock: parseInt(formData.totalStock, 10),
        imageUrl: formData.imageUrl || undefined,
        startTime: new Date().toISOString(),
      };

      const response = await dropAPI.createDrop(payload);
      enqueueSnackbar('Drop created successfully!', { variant: 'success' });

      setFormData({
        name: '',
        description: '',
        price: '',
        totalStock: '',
        imageUrl: '',
      });

      if (onDropAdded) {
        onDropAdded(response.data);
      }

      onClose();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to create drop',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Drop</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Total Stock"
              name="totalStock"
              type="number"
              value={formData.totalStock}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Image URL (optional)"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              fullWidth
              placeholder="https://example.com/image.jpg"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
          >
            {loading ? 'Creating...' : 'Create Drop'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
