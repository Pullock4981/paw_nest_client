import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

const EditCampaign = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        petName: '',
        maxDonation: '',
        lastDate: '',
        shortDescription: '',
        longDescription: ''
    });

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/campaigns/${id}`);
                const data = res.data;
                setFormData({
                    petName: data.petName,
                    maxDonation: data.maxDonation,
                    lastDate: data.lastDate.split("T")[0], // Format date
                    shortDescription: data.shortDescription,
                    longDescription: data.longDescription
                });
            } catch (err) {
                console.error("Error fetching campaign", err);
                Swal.fire('Error', 'Could not load campaign', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCampaign();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            maxDonation: parseFloat(formData.maxDonation),
        };

        try {
            const res = await axios.put(`http://localhost:5000/campaigns/${id}`, payload);
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Donation campaign updated successfully.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/userDashboard/myCampaigns');
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to update campaign', 'error');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
            <h2 className="text-2xl font-bold mb-4">Edit Donation Campaign</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Pet Name</label>
                    <input
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        className="mt-2 block w-full border p-2 rounded"
                        required
                    />
                </div>
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
