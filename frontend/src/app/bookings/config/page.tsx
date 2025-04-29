"use client";

import React from 'react';
import BookingConfigForm from '../components/BookingConfigForm';
import { Typography, Box, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const BookingConfigPage: React.FC = () => {
    const router = useRouter();

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            py: 8,
            px: 6
        }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/admin')}
                    sx={{
                        mb: 6,
                        color: 'text.secondary',
                        fontSize: '1.1rem',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    Back to Dashboard
                </Button>
                <Box sx={{ mb: 8 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            textAlign: 'center',
                            letterSpacing: '-0.5px',
                            mb: 2
                        }}
                    >
                        Booking Configuration
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            textAlign: 'center',
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: '800px',
                            mx: 'auto'
                        }}
                    >
                        Manage your booking system settings and policies
                    </Typography>
                </Box>
                <Paper 
                    elevation={2} 
                    sx={{ 
                        p: 6,
                        borderRadius: 3,
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
                    <BookingConfigForm />
                </Paper>
            </Box>
        </Box>
    );
};

export default BookingConfigPage; 