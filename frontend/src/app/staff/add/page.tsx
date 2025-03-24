"use client";
import React from "react";
import AddStaffForm from "./addform"; // Correct relative path
// Import the form component

const AddStaffPage: React.FC = () => {
    return (
        <div>
            <h1>Add New Staff Member</h1>
            <AddStaffForm />
        </div>
    );
};

export default AddStaffPage;
