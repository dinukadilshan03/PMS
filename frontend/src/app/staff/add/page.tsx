import React from 'react'
import AddForm from './addform'  // Import the AddForm component

const AdminPage = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <AddForm />  {/* Render the AddForm component */}
        </div>
    )
}

export default AdminPage
