import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Typography, Box, IconButton
} from '@mui/material';
import { Add, Edit, CheckCircle, Schedule } from '@mui/icons-material';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    customerName: '',
    items: '',
    totalPrice: '',
    deliveryDate: '',
    status: 'pending'
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    };
    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    try {
      if (currentOrder.id) {
        await updateDoc(doc(db, 'orders', currentOrder.id), currentOrder);
      } else {
        await addDoc(collection(db, 'orders'), currentOrder);
      }
      // Refresh orders
      const querySnapshot = await getDocs(collection(db, 'orders'));
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error saving order: ", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>إدارة الطلبات</Typography>
      
      <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
        طلب جديد
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>العميل</TableCell>
              <TableCell>الطلبات</TableCell>
              <TableCell>السعر</TableCell>
              <TableCell>موعد التسليم</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.totalPrice} درهم</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>
                  <Box sx={{ 
                    p: 1,
                    backgroundColor: 
                      order.status === 'completed' ? '#e8f5e9' :
                      order.status === 'in_progress' ? '#fff8e1' : '#ffebee',
                    color: 
                      order.status === 'completed' ? '#2e7d32' :
                      order.status === 'in_progress' ? '#ff8f00' : '#c62828'
                  }}>
                    {order.status === 'completed' ? 'مكتمل' : 
                     order.status === 'in_progress' ? 'قيد التنفيذ' : 'معلق'}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setCurrentOrder(order);
                    setOpen(true);
                  }}>
                    <Edit color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{currentOrder.id ? 'تعديل الطلب' : 'طلب جديد'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="اسم العميل"
            fullWidth
            value={currentOrder.customerName}
            onChange={(e) => setCurrentOrder({...currentOrder, customerName: e.target.value})}
          />
          <TextField
            margin="dense"
            label="الطلبات (مفصولة بفاصلة)"
            fullWidth
            value={currentOrder.items}
            onChange={(e) => setCurrentOrder({...currentOrder, items: e.target.value})}
          />
          <TextField
            margin="dense"
            label="السعر"
            type="number"
            fullWidth
            value={currentOrder.totalPrice}
            onChange={(e) => setCurrentOrder({...currentOrder, totalPrice: e.target.value})}
          />
          <TextField
            margin="dense"
            label="موعد التسليم"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentOrder.deliveryDate}
            onChange={(e) => setCurrentOrder({...currentOrder, deliveryDate: e.target.value})}
          />
          <TextField
            margin="dense"
            label="الحالة"
            select
            fullWidth
            value={currentOrder.status}
            onChange={(e) => setCurrentOrder({...currentOrder, status: e.target.value})}
          >
            <MenuItem value="pending">معلق</MenuItem>
            <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
            <MenuItem value="completed">مكتمل</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained">حفظ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
