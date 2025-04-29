"use client";

import React, { useState, useEffect } from 'react';
import { 
    Button, 
    TextField, 
    Typography, 
    Box,
    Snackbar,
    Alert,
    Grid,
    Divider,
    Paper,
    Stack
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import UpdateIcon from '@mui/icons-material/Update';

interface BookingConfig {
    maxBookingsPerDay: number;
    minAdvanceBookingDays: number;
    maxAdvanceBookingDays: number;
    cancellationWindowHours: number;
    rescheduleWindowHours: number;
}

const defaultConfig: BookingConfig = {
    maxBookingsPerDay: 3,
    minAdvanceBookingDays: 1,
    maxAdvanceBookingDays: 30,
    cancellationWindowHours: 24,
    rescheduleWindowHours: 24
};

const BookingConfigForm: React.FC = () => {
    const [formData, setFormData] = useState<BookingConfig>(defaultConfig);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/bookings/config');
            if (!response.ok) {
                throw new Error('Failed to fetch booking configuration');
            }
            const data = await response.json();
            setFormData({
                maxBookingsPerDay: data.maxBookingsPerDay ?? defaultConfig.maxBookingsPerDay,
                minAdvanceBookingDays: data.minAdvanceBookingDays ?? defaultConfig.minAdvanceBookingDays,
                maxAdvanceBookingDays: data.maxAdvanceBookingDays ?? defaultConfig.maxAdvanceBookingDays,
                cancellationWindowHours: data.cancellationWindowHours ?? defaultConfig.cancellationWindowHours,
                rescheduleWindowHours: data.rescheduleWindowHours ?? defaultConfig.rescheduleWindowHours
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error fetching booking configuration',
                severity: 'error'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/bookings/config', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update booking configuration');
            }

            setSnackbar({
                open: true,
                message: 'Booking configuration updated successfully',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error updating booking configuration',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            setFormData(prev => ({
                ...prev,
                [name]: numValue
            }));
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 500,
                            color: 'success.main',
                            letterSpacing: '-0.5px',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <EventIcon color="success" />
                        Booking Limits
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Maximum Bookings Per Day"
                                name="maxBookingsPerDay"
                                type="number"
                                value={formData.maxBookingsPerDay}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                helperText="Maximum number of bookings allowed per day"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'success.light',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'success.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'success.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Minimum Advance Booking Days"
                                name="minAdvanceBookingDays"
                                type="number"
                                value={formData.minAdvanceBookingDays}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                helperText="Minimum days in advance for booking"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'success.light',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'success.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'success.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Maximum Advance Booking Days"
                                name="maxAdvanceBookingDays"
                                type="number"
                                value={formData.maxAdvanceBookingDays}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                helperText="Maximum days in advance for booking"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'success.light',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'success.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'success.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 500,
                            color: 'error.main',
                            letterSpacing: '-0.5px',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <CancelIcon color="error" />
                        Cancellation & Rescheduling
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cancellation Window (Hours)"
                                name="cancellationWindowHours"
                                type="number"
                                value={formData.cancellationWindowHours}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                helperText="Hours before booking when cancellation is allowed"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'error.light',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'error.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'error.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'error.main',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reschedule Window (Hours)"
                                name="rescheduleWindowHours"
                                type="number"
                                value={formData.rescheduleWindowHours}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                helperText="Hours before booking when rescheduling is allowed"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'error.light',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'error.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'error.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'error.main',
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={<UpdateIcon />}
                        color="success"
                        sx={{ 
                            minWidth: 200,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
                                transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </Box>
            </Stack>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BookingConfigForm; 