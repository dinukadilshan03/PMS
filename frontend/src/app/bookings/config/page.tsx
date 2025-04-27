"use client";

import React from 'react';
import BookingConfigForm from '../components/BookingConfigForm';
import { Container, Typography, Box, Paper } from '@mui/material';

const BookingConfigPage: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
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
                    Booking Configuration
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
                    Manage your booking system settings and policies
                </Typography>
            </Box>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4,
                    borderRadius: 0,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <BookingConfigForm />
            </Paper>
        </Container>
    );
};

export default BookingConfigPage; 