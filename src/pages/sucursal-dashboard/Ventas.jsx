import React, { useState } from 'react';

// material-ui
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

// project imports
import MainCard from '../../components/MainCard';
import usePageTitle from '../../hooks/usePageTitle';

// ==============================|| VENTAS PAGE ||============================== //

const Ventas = () => {
  usePageTitle('Ventas');
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ventas
      </Typography>
    </Box>
  );
};

export default Ventas;