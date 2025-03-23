// components/BookingForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface BookingFormProps {
    onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [packageId, setPackageId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !time || !packageId || !phoneNumber || !email) {
            setError('Please fill all fields.');
            return;
        }

        const formattedDateTime = `${date}T${time}`;


        try {
            await axios.post('http://localhost:8080/api/bookings', {
                dateTime: formattedDateTime,
                packageId,
                phoneNumber,
                email,
                location,

            });

            onSuccess(); // Call success callback
        } catch (err) {
            setError('Booking failed. Please try again.');
            console.log(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="booking-form">
            <div>
                <label>
                    Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </label>
            </div>

            <div>
                <label>
                    Time:
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </label>
            </div>

            <div>
                <label>
                    Package:
                    <select value={packageId} onChange={(e) => setPackageId(e.target.value)} required>
                        <option value="">Select a package</option>
                        <option value="basic">Basic Package</option>
                        <option value="premium">Premium Package</option>
                        <option value="deluxe">Deluxe Package</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Phone Number:
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </label>
            </div>

            <div>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
            </div>

            <div>
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}  // Update location
                        required
                    />
                </label>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit">Create Booking</button>
        </form>
    );
};

export default BookingForm;
