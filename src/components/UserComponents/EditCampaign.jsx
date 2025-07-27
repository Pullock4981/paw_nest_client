// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useParams, useNavigate } from 'react-router-dom';

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

const EditCampaign = () => {
    const { id } = useParams(); // campaign ID from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        maxDonation: '',
        lastDate: '',
        shortDescription: '',
        longDescription: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/campaigns/${id}`)
            .then(res => {
                const { maxDonation, lastDate, shortDescription, longDescription } = res.data;
                setFormData({ maxDonation, lastDate, shortDescription, longDescription });
            })
            .catch(err => {
                console.error(err);
                Swal.fire('Error', 'Could not load campaign data', 'error');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(`http://localhost:5000/campaigns/${id}`, formData);
            if (res.status === 200) {
                Swal.fire('Success', 'Campaign updated!', 'success');
                navigate('/my-donations');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
            <h2 className="text-2xl font-bold mb-4">Edit Donation Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Max Donation Amount</label>
                    <input
                        type="number"
                        name="maxDonation"
                        value={formData.maxDonation}
                        onChange={handleChange}
                        className="mt-2 block w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Last Date of Donation</label>
                    <input
                        type="date"
                        name="lastDate"
                        value={formData.lastDate}
                        onChange={handleChange}
                        className="mt-2 block w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Short Description</label>
                    <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        className="mt-2 block w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold">Long Description</label>
                    <textarea
                        name="longDescription"
                        rows="4"
                        value={formData.longDescription}
                        onChange={handleChange}
                        className="mt-2 block w-full border p-2 rounded"
                        required
                    />
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
                    >
                        Update Campaign
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCampaign;
