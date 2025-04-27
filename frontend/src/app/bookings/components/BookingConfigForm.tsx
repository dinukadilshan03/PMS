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
    Divider
} from '@mui/material';

interface BookingConfig {
    maxBookingsPerDay: number;
    minAdvanceBookingDays: number;
    maxAdvanceBookingDays: number;
    cancellationDeadlineHours: number;
    reschedulingDeadlineHours: number;
}

const defaultConfig: BookingConfig = {
    maxBookingsPerDay: 3,
    minAdvanceBookingDays: 1,
    maxAdvanceBookingDays: 30,
    cancellationDeadlineHours: 24,
    reschedulingDeadlineHours: 24
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
                cancellationDeadlineHours: data.cancellationDeadlineHours ?? defaultConfig.cancellationDeadlineHours,
                reschedulingDeadlineHours: data.reschedulingDeadlineHours ?? defaultConfig.reschedulingDeadlineHours
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
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Booking Limits
                    </Typography>
                </Grid>
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
                                    borderColor: 'divider',
                                },
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
                                    borderColor: 'divider',
                                },
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
                                    borderColor: 'divider',
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 6, borderColor: 'divider' }} />

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Cancellation & Rescheduling
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Cancellation Deadline (Hours)"
                        name="cancellationDeadlineHours"
                        type="number"
                        value={formData.cancellationDeadlineHours}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        helperText="Hours before booking when cancellation is allowed"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'divider',
                                },
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Rescheduling Deadline (Hours)"
                        name="reschedulingDeadlineHours"
                        type="number"
                        value={formData.reschedulingDeadlineHours}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                        helperText="Hours before booking when rescheduling is allowed"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'divider',
                                },
                            },
                        }}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                        minWidth: 200,
                        borderRadius: 0,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        }
                    }}
                >
                    {loading ? 'Saving...' : 'Save Configuration'}
                </Button>
            </Box>
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
                        borderRadius: 0,
                        boxShadow: 'none'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BookingConfigForm; 