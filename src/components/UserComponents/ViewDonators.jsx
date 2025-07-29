import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewDonators = () => {
    const { campaignId } = useParams();
    const [donators, setDonators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonators = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/campaigns/${campaignId}/donators`);
                setDonators(res.data || []);
            } catch (err) {
                console.error("Error fetching donators:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonators();
    }, [campaignId]);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h2 className="text-2xl font-semibold mb-4">Campaign Donators</h2>
            {loading ? (
                <p>Loading...</p>
            ) : donators.length === 0 ? (
                <p>No donations yet.</p>
            ) : (
                <ul className="space-y-2">
                    {donators.map((donator, idx) => (
                        <li key={idx} className="p-3 border rounded shadow">
                            <p><strong>Name:</strong> {donator.name || 'Anonymous'}</p>
                            <p><strong>Email:</strong> {donator.email}</p>
                            <p><strong>Amount:</strong> ${donator.amount}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewDonators;
