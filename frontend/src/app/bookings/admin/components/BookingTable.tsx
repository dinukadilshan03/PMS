"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Stack,
    Container,
    Checkbox,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

interface Booking {
    id: string;
    dateTime: string;
    location: string;
    packageName: string;
    bookingStatus: string;
    paymentStatus: string;
    assignedStaffId?: string;
    assignedStaffName?: string;
}

const BookingTable = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        bookingIds: string[];
        bookingDetails: string;
    }>({
        open: false,
        bookingIds: [],
        bookingDetails: ''
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("http://localhost:8080/admin/bookings");
                setBookings(response.data);
            } catch (error) {
                setError("Failed to fetch bookings. Please try again later.");
                console.error("Error fetching bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = useMemo(() => {
        if (!searchTerm) return bookings;
        const term = searchTerm.toLowerCase();
        return bookings.filter(booking => {
            return (
                booking.id?.toLowerCase().includes(term) ||
                booking.dateTime?.toLowerCase().includes(term) ||
                booking.location?.toLowerCase().includes(term) ||
                booking.packageName?.toLowerCase().includes(term) ||
                booking.bookingStatus?.toLowerCase().includes(term) ||
                booking.paymentStatus?.toLowerCase().includes(term)
            );
        });
    }, [bookings, searchTerm]);

    const getStatusColor = (status: string) => {
        const lowerStatus = status?.toLowerCase() || '';
        switch (lowerStatus) {
            case 'upcoming':
                return 'success';
            case 'completed':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        const lowerStatus = status?.toLowerCase() || '';
        switch (lowerStatus) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'refunded':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleDelete = async (bookingIds: string[]) => {
        setIsDeleting(true);
        setError(null);

        try {
            const successfulDeletions: string[] = [];
            const failedDeletions: string[] = [];

            for (const id of bookingIds) {
                try {
                    const response = await axios.delete(`http://localhost:8080/admin/bookings/${id}`);
                    if (response.data === "Booking deleted successfully") {
                        successfulDeletions.push(id);
                    } else {
                        console.error(`Unexpected response for booking ${id}:`, response.data);
                        failedDeletions.push(id);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error(`Failed to delete booking ${id}:`, {
                            status: error.response?.status,
                            data: error.response?.data,
                            message: error.message
                        });
                    } else {
                        console.error(`Failed to delete booking ${id}:`, error);
                    }
                    failedDeletions.push(id);
                }
            }

            // Update the bookings list with successful deletions
            if (successfulDeletions.length > 0) {
                setBookings(prevBookings => 
                    prevBookings.filter(booking => !successfulDeletions.includes(booking.id))
                );
            }

            setSelectedBookings([]);
            setDeleteDialog({
                open: false,
                bookingIds: [],
                bookingDetails: ''
            });

            // Show error message if any deletions failed
            if (failedDeletions.length > 0) {
                setError(`Failed to delete ${failedDeletions.length} ${failedDeletions.length === 1 ? 'booking' : 'bookings'}. Please try again later.`);
            }
        } catch (error) {
            console.error("Error in delete operation:", error);
            setError("An unexpected error occurred while deleting bookings. Please try again later.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSelectBooking = (bookingId: string) => {
        setSelectedBookings(prev => 
            prev.includes(bookingId) 
                ? prev.filter(id => id !== bookingId)
                : [...prev, bookingId]
        );
    };

    const handleSelectAll = () => {
        setSelectedBookings(prev => 
            prev.length === filteredBookings.length 
                ? [] 
                : filteredBookings.map(booking => booking.id)
        );
    };

    return (
        <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
            <Stack spacing={4}>
            {error && (
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'error.light' }}>
                        <Typography color="error">{error}</Typography>
                    </Paper>
                )}

                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                            All Bookings
                        </Typography>
                        <Chip 
                            label={`${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`}
                            color="primary"
                            size="small"
                        />
                    </Box>
                    <TextField
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{ width: { xs: '100%', sm: 300 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

            {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <Typography>Loading...</Typography>
                    </Box>
            ) : filteredBookings.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <EventIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No bookings found
                        </Typography>
                        <Typography color="text.secondary">
                        {bookings.length === 0 ? 'There are no bookings in the system yet.' : 'No bookings match your search criteria.'}
                        </Typography>
                    </Paper>
                ) : (
                    <TableContainer 
                        component={Paper} 
                        elevation={0} 
                        sx={{ 
                            border: 1, 
                            borderColor: 'divider',
                            maxWidth: '100%',
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': {
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: '#555',
                                },
                            },
                        }}
                    >
                        <Table sx={{ minWidth: 1000 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedBookings.length === filteredBookings.length}
                                            indeterminate={selectedBookings.length > 0 && selectedBookings.length < filteredBookings.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EventIcon fontSize="small" />
                                            Date & Time
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon fontSize="small" />
                                            Location
                                        </Box>
                                    </TableCell>
                                    <TableCell>Package</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon fontSize="small" />
                                            Assigned Staff
                                        </Box>
                                    </TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Payment</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {filteredBookings.map((booking) => (
                                    <TableRow 
                                        key={booking.id} 
                                        hover 
                                        selected={selectedBookings.includes(booking.id)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedBookings.includes(booking.id)}
                                                onChange={() => handleSelectBooking(booking.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{booking.id || '-'}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {booking.dateTime ? new Date(booking.dateTime).toLocaleDateString() : '-'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {booking.dateTime ? new Date(booking.dateTime).toLocaleTimeString() : '-'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                        {booking.location || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={booking.packageName || '-'}
                                                size="small"
                                                sx={{ bgcolor: 'purple.50', color: 'purple.700' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                        {booking.assignedStaffName || 'Not assigned'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={booking.bookingStatus || '-'}
                                                size="small"
                                                color={getStatusColor(booking.bookingStatus)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={booking.paymentStatus || '-'}
                                                size="small"
                                                color={getPaymentStatusColor(booking.paymentStatus)}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton
                                                    component={Link}
                                            href={`/bookings/admin/${booking.id}`}
                                                    size="small"
                                                    color="primary"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => setDeleteDialog({
                                                        open: true,
                                                        bookingIds: [booking.id],
                                                        bookingDetails: `Booking #${booking.id} for ${booking.packageName} on ${new Date(booking.dateTime).toLocaleString()}`
                                                    })}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {selectedBookings.length > 0 && (
                    <Box sx={{ 
                        position: 'fixed', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        bgcolor: 'background.paper',
                        p: 2,
                        boxShadow: 1,
                        zIndex: 1000
                    }}>
                        <Container maxWidth={false}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                <Typography>
                                    {selectedBookings.length} {selectedBookings.length === 1 ? 'booking' : 'bookings'} selected
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => setDeleteDialog({
                                        open: true,
                                        bookingIds: selectedBookings,
                                        bookingDetails: `${selectedBookings.length} ${selectedBookings.length === 1 ? 'booking' : 'bookings'}`
                                    })}
                                >
                                    Delete Selected
                                </Button>
                            </Stack>
                        </Container>
                    </Box>
                )}
            </Stack>

            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: 400,
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontWeight: 600,
                    color: 'error.main',
                    textAlign: 'center',
                    py: 2
                }}>
                    Delete {deleteDialog.bookingIds.length === 1 ? 'Booking' : 'Bookings'}
                </DialogTitle>
                <DialogContent sx={{ py: 2, px: 3 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Are you sure you want to delete {deleteDialog.bookingDetails}?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, justifyContent: 'center', gap: 2 }}>
                    <Button 
                        onClick={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => handleDelete(deleteDialog.bookingIds)}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2 }}
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookingTable;