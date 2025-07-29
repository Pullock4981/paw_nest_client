import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

const CreateCampaign = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        petName: '',
        maxDonation: '',
        lastDate: '',
        shortDescription: '',
        longDescription: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.email) {
            Swal.fire("Error", "You must be logged in to create a campaign.", "error");
            return;
        }

        if (!imageFile) {
            Swal.fire("Error", "Please select a campaign image.", "error");
            return;
        }

        try {
            setIsLoading(true);

            const imgForm = new FormData();
            imgForm.append("image", imageFile);

            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=145f5aeaf6a15c67199ff6c3ef4dbd4e`,
                imgForm
            );

            const imageUrl = imgRes?.data?.data?.url;
            if (!imageUrl) throw new Error("Image upload failed");

            const payload = {
                ...formData,
                userEmail: user.email,
                maxDonation: parseFloat(formData.maxDonation),
                image: imageUrl,
            };

            const res = await axios.post("https://pet-adoption-server-wheat.vercel.app/campaigns", payload);

            if (res.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Campaign Created",
                    text: "Your campaign has been successfully created.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/userDashboard/myCampaigns");
                });
            }
        } catch (err) {
            console.error("Error:", err);
            Swal.fire("Error", "Failed to create campaign. Try again later.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 shadow rounded mt-6">
            <h2 className="text-2xl font-bold mb-6 text-[var(--heading-color)] text-center">Create Donation Campaign</h2>

            <form onSubmit={handleSubmit} className="space-y-3">

                {/* Image Upload */}
                <div>
                    <label className="block font-semibold mb-1">Campaign Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full border p-2 rounded"
                        required
                    />
                </div>

                {/* 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Pet Name</label>
                        <input
                            type="text"
                            name="petName"
                            value={formData.petName}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Max Donation Amount</label>
                        <input
                            type="number"
                            name="maxDonation"
                            value={formData.maxDonation}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Short Description</label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                </div>

                {/* Long Description */}
                <div>
                    <label className="block font-semibold mb-1">Long Description</label>
                    <textarea
                        name="longDescription"
                        rows="4"
                        value={formData.longDescription}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="More details about the pet or campaign..."
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block font-semibold mb-1">Last Date of Donation</label>
                    <input
                        type="date"
                        name="lastDate"
                        value={formData.lastDate}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-6 py-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-[#865B97] hover:bg-purple-700'}`}
                    >
                        {isLoading ? 'Creating...' : 'Create Campaign'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCampaign;
