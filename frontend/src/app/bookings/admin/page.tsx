"use client";

import React from "react";
import BookingTable from "@/app/bookings/admin/components/BookingTable";
import { Container, Typography, Box, Paper } from '@mui/material';

const AdminBookingsPage = () => {
    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            py: 6
        }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6 }}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            textAlign: 'center',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Admin Booking Management
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            textAlign: 'center',
                            color: 'text.secondary',
                            mb: 4,
                            fontWeight: 400
                        }}
                    >
                        Oversee and manage all photography bookings
                    </Typography>
                </Box>
                <Paper 
                    elevation={2} 
                    sx={{ 
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    <BookingTable />
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminBookingsPage;