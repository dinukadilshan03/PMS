'use client'

import React, { useState } from 'react'

const AddForm = () => {
    const [staff, setStaff] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Photographer',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setStaff({ ...staff, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        fetch('http://localhost:8080/api/staff', {  // Adjust URL if necessary
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staff),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('Staff added successfully!')
                setStaff({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'Photographer',
                })
            })
            .catch((error) => {
                console.error('Error:', error)
                alert('Error adding staff')
            })
    }

    return (
        <div style={{ width: '80%', margin: '20px auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px', boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Add New Staff Member</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="name" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', color: '#333' }}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={staff.name}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="email" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', color: '#333' }}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={staff.email}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="phone" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', color: '#333' }}>Phone Number:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={staff.phone}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="role" style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px', color: '#333' }}>Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={staff.role}
                        onChange={handleInputChange}
                        required
                        style={{ padding: '10px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}
                    >
                        <option value="Photographer">Photographer</option>
                        <option value="Admin">Admin</option>
                        <option value="Coordinator">Coordinator</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: '12px', fontSize: '16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Add Staff
                </button>
            </form>
        </div>
    )
}

export default AddForm
