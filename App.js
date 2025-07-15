import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Expenses from './components/Expenses';
import Recipes from './components/Recipes';
import Team from './components/Team';
import Customers from './components/Customers';
import Login from './components/Login';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d81b60',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/team" element={<Team />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
